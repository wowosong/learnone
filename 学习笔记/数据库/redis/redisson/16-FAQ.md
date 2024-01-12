## Q: What is the cause of RedisTimeoutException?

**A** : 

There are **four** main reasons: 

1) All netty threads are busy, leading to delays in both Redis response decoding and sending commands to Redis
2) All connections are busy
3) Redis server takes too long to respond the request.
4) Sync methods invocation in async/reactive/rx listeners.

First try to set follow values for `nettyThreads` setting: 32, 64, 128, 256 this allow Redisson to get free netty thread to decode response or send command. Next, try to increase `retryInterval` and/or `timeout` to a reasonable value so that a command can still gracefully fail without having the end user wait forever. At the last step, try to increase `connection pool` setting so that Redisson can stand a better chance in getting a free connection. 

Complex commands such as `keys`, `hmget` and big loops in Lua scripts are more likely to see it than other commands. It is important to understand an operation can still timeout despite the absence of it from the Redis slowlog. Slowlogs only record the time a command is been processed by the Redis event loop and not anything before or after. Network issue may also cause this exception when a response is still in-flight. 

<!--
There are a few different situations where you would see one of these exceptions. It happens not because of there is something wrong with Redisson itself, but rather because Redisson is reporting to you, that it has tried all it can but failed to execute the command, for one reason or another.

The following chart has illustrated the difference between the two timeouts:
![Redisson Timeout Explained](https://user-images.githubusercontent.com/2514975/37971869-eeb42b60-31ce-11e8-8cf7-d4dd912abed9.png)
As you can see, primarily, there are **two** main reasons: 

1) Redisson has waited too long for the command to be dispatched; 
2) Redis server takes too long to respond the request.

The first case scenario is more likely to happen under load where Redisson is unable to locate a free connection in a pool for the operation, during a given time after exhausting the limited retries. The total timeout can be understood as `TotalTimeout = retryAttempts X retryInterval`. It can happen to any command including pub/sub commands. 

This case is also likely to happen in an high CPU load and/or unstable network environment, where network fluctuation and/or spiking can cause a connection to be marked as frozen by the connection watchdog. This error could also appear after Redis failover case.

To avoid this exception, first try to increase the `connection pool` and `nettyThreads` setting so that Redisson can stand a better chance in getting a free connection and get free netty thread to decode big response. Also, it is recommended to adjust the `retryAttempts` and `retryInterval` to a reasonable value so that a command can still gracefully fail without having the end user wait forever.

The second case scenario is mostly out of Redisson’s hands. The timeout timer starts as soon as a command is dispatched, and it stops when the whole of the response is decoded. 

Complex commands such as `keys` and big loops in Lua scripts are more likely to see it than other commands. It is important to understand an operation can still timeout despite the absence of it from the Redis slowlog. Slowlogs only record the time a command is been processed by the Redis event loop and not anything before or after. Network issue may also cause this exception when a response is still in-flight. 
-->

<br/><br/><br/><br/><br/>

## Q: When do I need to shut down a Redisson instance, at the end of each request or the end of the life of a thread?

**A** : Redisson instance requires manual shutdown only if you want to stop using all of its features. It is a common pattern that Redisson starts and stops along with the application. Since it is completely thread safe, you may treat a Redisson instance as a singleton. The shutdown sequence will disconnect all the active connections held in each connection pool, and it will clean up certain types of Redisson objects require a manual destroy action upon disposal, it will then stop the event loops. Please be advised, the entire shutdown process is not instant.
<br/><br/><br/><br/><br/>

## Q: In MapCache/SetCache/SpringCache/JCache, I have set an expiry time to an entry, why is it still in Redis when it should be disappeared?

**A** : The first and foremost thing you need to understand is entry expiry feature is not supported by Redis. This is one of Redisson’s own creation. Which means it requires Redisson to work. You can’t expect a correct behaviour using other clients such as redis-cli or even jedis.

Redisson employs both active approach and passive approach, just like Redis server, to ensure an element is evicted when its time is due. There is are scheduled eviction tasks that runs periodically to remove the expired elements from the collection, Redisson also checks the expiry information when an element is accessed: if it has expired, it will be removed and a null value will be returned.

So if you saw the stale value in redis-cli, please do not panic, it will be removed when the scheduled task catches up or when you next request it through Redisson.
<br/><br/><br/><br/><br/>

## Q: How can I perform Pipelining/Transaction through Redisson?

**A** : The fact is pipelining and transaction are dealt with virtually in the same way by the `RBatch` object in Redisson. This is the design decision we took based on the analysis of the characteristics of both techniques. From the client side point of view, through both techniques, you are expected to issue a series of commands consecutively, and more importantly you will only expect to see the results after the last command is executed.

There are only subtle differences between the two techniques lies within the `RBatch` API. There is an `atomic()` method you should use before issuing batch commands if you want to execute a series of commands in a single transaction. There is no other usage difference.

And yes, if this answers your other question, transactional commands are always dispatched in a single pipeline.
<br/><br/><br/><br/><br/>

## Q: Is Redisson thread safe? Can I share an instance of it between different threads?

**A** : The Redisson instance itself and all the objects it provides are thread safe. APIs exposed by those objects are just operation handles. None of the these objects keep any states that would break the thread safety local to the instance. Most of those objects that do not “contain” any data local to the JVM with exception to LocalCached instances for obvious reasons. And here is a piece of pro advice: You can even share a RObject to multiple machines by publish it over a RTopic.
<br/><br/><br/><br/><br/>

## Q: Can I use different encoder/decoders for different tasks?

**A** : A different codec to the default one can be supplied when creating a `RObject` instance:
```java
RMap<String, String> map = redisson.getMap("myMap", new MyCodec());
```
