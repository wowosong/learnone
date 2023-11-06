![Redisson分布式锁原理](https://learnone.oss-cn-beijing.aliyuncs.com/pic/202311061738833.png)

锁续命

```java
RFuture<Boolean> future = commandExecutor.evalWriteAsync(getName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
        "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
            "redis.call('pexpire', KEYS[1], ARGV[1]); " +
            "return 1; " +
        "end; " +
        "return 0;",
          Collections.<Object>singletonList(getName()), internalLockLeaseTime, getLockName(threadId));
```

锁自旋

```java
while (true) {
    ttl = tryAcquire(leaseTime, unit, threadId);
    // lock acquired
    if (ttl == null) {
        break;
    }

    // waiting for message
    if (ttl >= 0) {
        getEntry(threadId).getLatch().tryAcquire(ttl, TimeUnit.MILLISECONDS);
    } else {
        getEntry(threadId).getLatch().acquire();
    }
}
```
解锁

