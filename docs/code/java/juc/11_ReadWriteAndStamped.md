# 读写锁和邮戳锁

## ReentrantReadWriteLock

### 读写锁说明

一个 `ReentrantReadWriteLock` 同时只能存在一个写锁但是可以存在多个读锁，但是不能同时存在写锁和读锁，也即资源可以被多个读操作访问，或一个写操作访问，但两者不能同时进行。**只有在读多写少情景之下，读写锁才具有较高的性能体现**。

锁的演变

- 无锁->独占锁->读写锁->邮戳锁

### 特点

- 可重入
- 支持公平性选择（公平锁和非公平锁，公平优先或吞吐量优先）
- 读写、写写互斥，读读共享
- 读没有完成的时候其他线程写锁无法获得
- 锁降级

### 锁降级

将写入所降级为读锁。（按照锁的严苛程度，变强为升级，反之为降级）

写锁的降级，降级成为了读锁

1. 如果同一个线程持有了写锁，在没有释放写锁的情况下，它还可以继续获得读锁。这就是写锁的降级，降级成为了读锁。
2. 规则惯例，先获取写锁，然后获取读锁，再释放写锁的次序。
3. 如果释放了写锁，那么就完全转换为读锁。
4. 锁降级是为了让当前线程感知到数据的变化，目的是保证数据可见性。
5. 如果有线程在读，那么写线程是无法获取写锁的，是悲观锁的策略

`StampedLock` 的改进之处在于：读的过程中也允许获取写锁介入，这样会导致我们读的数据就可能不一致，所以需要额外的方法来判断读的过程中是否有写入，这是一种乐观的读锁。显然乐观锁的并发效率更高，但一旦有小概率的写入导致读取的数据不一致，需要能检测出来，再读一遍就行。

锁降级其实就是锁的切换，在写**锁释放前由写锁切换成了读锁**。为什么要在写锁释放前就加上读锁呢？

- 防止释放写锁的瞬间被其他线程拿到写锁然后修改了数据，然后本线程在拿到读锁后读取数据就发生了错乱。
- 如果把锁的范围加大（在写锁的范围里面完成读锁里面要干的事），就延长了写锁的占用时长，导致性能下降。

总结一句话就是：同一个线程，自己持有写锁时，再去获取读锁，其本质相当于重入。

### 锁饥饿

`ReentrantReadWriteLock` 实现了读写分离，但是一旦读操作比较多的时候，想要获取写锁就变得比较困难了，假如当前1000个线程，999个读，1个写，有可能999个读取线程长时间抢到了锁，那1个写线程就悲剧了因为当前有可能会一直存在读锁，而无法获得写锁，根本没机会写。

使用"公平"策略可以一定程度上缓解这个问题，但是"公平"策略是以牺牲系统吞吐量为代价的

## StampedLock

`StampedLock`（也叫票据锁）是 JDK8 中新增的一个读写锁，也是对 JDK5 中的读写锁 `ReentrantReadWriteLock` 的优化。

`stamp` 代表了锁的状态。当 `stamp` 返回零时，表示线程获取锁失败，并且当释放锁或者转换锁的时候，都要传入最初获取的 `stamp` 值。

### 锁饥饿问题引出

锁饥饿问题：

- `ReentrantReadWriteLock` 实现了读写分离，但是一旦读操作比较多的时候，想要获取写锁就变得比较困难了，因此当前有可能会一直存在读锁，而无法获得写锁。

如何解决锁饥饿问题：

- 使用”公平“策略可以一定程度上缓解这个问题，但是使用”公平“策略是以牺牲系统吞吐量为代价。

- `StampedLock` 类的乐观读锁方式。采取乐观获取锁，其他线程尝试获取写锁时不会被阻塞，在获取乐观读锁后，还需要对结果进行校验。

### StampedLock 的特点

- 所有获取锁的方法，都返回一个邮戳，`stamp` 为零表示失败，其余都表示成功
- 所有释放锁的方法，都需要一个邮戳，这个 `stamp` 必须是和成功获取锁时得到的 `stamp` 一致
- `StampedLock` 是不可重入的，危险（如果一个线程已经持有了写锁，在去获取写锁的话会造成死锁）

### StampedLock 访问模式

- `Reading`（读模式悲观）：功能和 `ReentrantReadWriteLock` 的读锁类似
- `Writing`（写模式）：功能和 `ReentrantReadWriteLock` 的写锁类似
- `Optimistic reading`（乐观读模式）：无锁机制，类似与数据库中的乐观锁，支持读写并发，很乐观认为读时没人修改，假如被修改在实现升级为悲观读模式

### 主要API

`tryOptimisticRead()` : 加乐观读锁

`validate(long stamp)` : 校验乐观读锁执行过程中有无写锁搅局

### 读模式演示

传统的读写锁模式（悲观读）：读的时候写锁不能获取

乐观读模式：读的过程中也允许写锁介入

示例：

```java
int number = 42;
StampedLock stampedLock = new StampedLock();

public void write() {
  long stamp = stampedLock.writeLock();
  System.out.println(STR."\{Thread.currentThread().getName()}: 写线程准备修改");
  try {
    number = number + 13;
  } finally {
    stampedLock.unlockWrite(stamp);
  }
  System.out.println(STR."\{Thread.currentThread().getName()}: 写线程结束修改, number 为 \{number}");
}

/**
 * 悲观读
 */
public void read() {
  long stamp = stampedLock.readLock();
  System.out.println(STR."\{Thread.currentThread().getName()}: 进入读线程");
  for (int i = 0; i < 4; i++) {
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println(STR."\{Thread.currentThread().getName()}: 正在读取中");
  }
  try {
    System.out.println(STR."\{Thread.currentThread().getName()}: 获得成员变量值 number 为 \{number}");
    System.out.println("写线程没有修改成功，读锁时候写锁无法介入，传统的读写互斥");
  } finally {
    stampedLock.unlockRead(stamp);
  }
}

/**
 * 乐观读
 * stampedLock.validate 方法值（true 无修改 false有修改）
 * 乐观锁实际上不需要显式释放。乐观锁通过锁升级和降级来管理锁定状态，而不是通过获取和释放锁。
 * 在示例中，如果数据满足条件，乐观读锁状态会一直保持；如果数据不满足条件，则会升级到悲观读锁，并在操作完成后释放该锁。
 * 这样，锁管理是自动进行的，无需手动释放乐观锁。
 */
public void readOptimistic() {
  long stamp = stampedLock.tryOptimisticRead();
  System.out.println(STR."\{Thread.currentThread().getName()} 开始 stampedLock.validate 方法值为: \{stampedLock.validate(stamp)}");
  for (int i = 0; i < 4; i++) {
    try {
      Thread.sleep(1000);
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    System.out.println(STR."\{Thread.currentThread().getName()}\t 正在读取 \{i}秒后 stampedLock.validate 方法值为: \{stampedLock.validate(stamp)}");
  }
  if (!stampedLock.validate(stamp)) {
    System.out.println("有人修改----------有写操作");
    stamp = stampedLock.readLock();
    try {
      System.out.println(STR."从乐观读升级为悲观读, 重新悲观读后 number 为: \{number}");
    } finally {
      stampedLock.unlockRead(stamp);
    }
  }
  System.out.println(STR."\{Thread.currentThread().getName()} 最终读取 number 为: \{number}");

}

@Test
public void test() throws InterruptedException {
  CountDownLatch count = new CountDownLatch(2);
  new Thread(() -> {
    try {
      //                readPessimistic();
      readOptimistic();
    } finally {
      count.countDown();
    }
  }, "readThread").start();

  try {
    Thread.sleep(1000);
  } catch (InterruptedException e) {
    e.printStackTrace();
  }

  new Thread(() -> {
    try {
      write();
    } finally {
      count.countDown();
    }
  }, "writeThread").start();

  count.await();
}
```

### StampedLock 的缺点

- `StampedLock` 不支持重入，没有Re开头
- `StampedLock` 的悲观读锁和写锁都不支持条件变量(Condition)
- 使用 `StampedLock` 一定不要调用中断操作，即不要调用 `interrupt()` 方法

## 性能比较

`ReentrantLock`、`ReentrantReadWriteLock`、`StampedLock` 性能比较

示例：

```java
public class PerformanceComparisonTest {
  Lock lock = new ReentrantLock();
  ReentrantReadWriteLock readWriteLock = new ReentrantReadWriteLock();
  StampedLock stampedLock = new StampedLock();
  int read = 1000;
  int write = 3;
  long mills = 10;

  @Test
  public void test() {
    testReentrantLock();
    testReentrantReadWriteLock();
    testStampedLock();
  }

  public void testReentrantLock() {
    ExecutorService executorService = Executors.newFixedThreadPool(100);
    ExecutorService executorServiceWrite = Executors.newFixedThreadPool(3);
    CountDownLatch latch = new CountDownLatch(read + write);
    long l = System.currentTimeMillis();
    for (int i = 0; i < read; i++) {
      executorService.execute(() -> {
        try {
          read();
        } finally {
          latch.countDown();
        }
      });
    }
    for (int i = 0; i < write; i++) {
      executorServiceWrite.execute(() -> {
        try {
          write();
        } finally {
          latch.countDown();
        }
      });
    }
    try {
      latch.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    executorService.shutdown();
    executorServiceWrite.shutdown();
    System.out.println(STR."testReentrantLock 执行耗时：\{System.currentTimeMillis() - l}");
  }

  public void read() {
    lock.lock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }
  }

  public void write() {
    lock.lock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      lock.unlock();
    }
  }

  public void testReentrantReadWriteLock() {
    ExecutorService executorService = Executors.newFixedThreadPool(100);
    ExecutorService executorServiceWrite = Executors.newFixedThreadPool(3);
    CountDownLatch latch = new CountDownLatch(read + write);
    long l = System.currentTimeMillis();
    for (int i = 0; i < read; i++) {
      executorService.execute(() -> {
        try {
          readLock();
        } finally {
          latch.countDown();
        }
      });
    }
    for (int i = 0; i < write; i++) {
      executorServiceWrite.execute(() -> {
        try {
          writeLock();
        } finally {
          latch.countDown();
        }
      });
    }
    try {
      latch.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    executorService.shutdown();
    executorServiceWrite.shutdown();
    System.out.println(STR."testReentrantReadWriteLock 执行耗时：\{System.currentTimeMillis() - l}");
  }

  public void readLock() {
    readWriteLock.readLock().lock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      readWriteLock.readLock().unlock();
    }
  }

  public void writeLock() {
    readWriteLock.writeLock().lock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      readWriteLock.writeLock().unlock();
    }
  }

  public void testStampedLock() {
    ExecutorService executorService = Executors.newFixedThreadPool(100);
    ExecutorService executorServiceWrite = Executors.newFixedThreadPool(3);
    CountDownLatch latch = new CountDownLatch(read + write);
    long l = System.currentTimeMillis();
    for (int i = 0; i < read; i++) {
      executorService.execute(() -> {
        try {
          tryOptimisticRead();
          //                    readStampedLock();
        } finally {
          latch.countDown();
        }
      });
    }
    for (int i = 0; i < write; i++) {
      executorServiceWrite.execute(() -> {
        try {
          writeStampedLock();
        } finally {
          latch.countDown();
        }
      });
    }
    try {
      latch.await();
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
    executorService.shutdown();
    executorServiceWrite.shutdown();
    System.out.println(STR."testStampedLock 执行耗时：\{System.currentTimeMillis() - l}");
  }

  public void tryOptimisticRead() {
    long stamp = stampedLock.tryOptimisticRead();
    try {
      Thread.sleep(mills);
      if (!stampedLock.validate(stamp)) {
        long readLock = stampedLock.readLock();
        try {
          Thread.sleep(mills);
        } finally {
          stampedLock.unlock(readLock);
        }
      }
    } catch (InterruptedException e) {
      e.printStackTrace();
    }
  }

  public void readStampedLock() {
    long stamp = stampedLock.readLock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      stampedLock.unlock(stamp);
    }
  }

  public void writeStampedLock() {
    long stamp = stampedLock.writeLock();
    try {
      Thread.sleep(mills);
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      stampedLock.unlock(stamp);
    }
  }
}
```

```java
testReentrantLock 执行耗时：11381
testReentrantReadWriteLock 执行耗时：193
testStampedLock 执行耗时：179
```

根据执行结果可以明显看出在读多写少的情况下，`ReentrantLock` 的性能是比较差的，而 `ReentrantReadWriteLock` 和 `StampedLock` 性能差不多相同，而 `StampedLock` 主要是为了解决 `ReentrantReadWriteLock` 可能出现的锁饥饿问题。
