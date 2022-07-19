![Redisson分布式锁原理](./04-%E5%A4%A7%E5%8E%82%E7%94%9F%E4%BA%A7%E7%BA%A7Redis%E9%AB%98%E5%B9%B6%E5%8F%91%E5%88%86%E5%B8%83%E5%BC%8F%E9%94%81%E5%AE%9E%E6%88%98.assets/202203071127689.png)

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

