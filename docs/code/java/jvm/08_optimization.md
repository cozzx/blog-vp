# 性能调优

## 概述

### 生产环境中的问题

- 生产环境发生了内存溢出改如何处理
- 生产环境 CPU 负载飙高如何处理
- 生产环境应该给服务器分配多少内存合适
- 生产环境应该给应用分配多少线程合适
- 如何对垃圾回收器的性能进行调优
- 不加 log 如何确定请求是否执行了某一行代码
- 不加 log 如何实时查看某个方法的入参与返回值

### 调优基本问题

#### 为什么要调优

1. 防止出现 OOM，进行 JVM 规划和预调优
2. 解决程序运行中各种 OOM
3. 减少 Full GC 出现的频率，解决运行慢、卡顿的问题

#### 调优的大方向

1. 合理编写代码
2. 充分合理的使用硬件资源
3. 合理地进行调优

#### 不同阶段的考虑

1. 上线前
2. 项目运行阶段
3. 线上出现 OOM

> 调优要从业务场景分析，结合监控分析调优。

### 调优监控的依据

1. 运行日志
2. 异常堆栈
3. GC 日志
4. 线程快照
5. 堆转储快照

### 性能优化的步骤

1. 熟悉业务场景

2. 发现问题（性能监控）

   - 一种以非强行或者入侵方式收集或查看应用运营性能数据的活动。

   - 监控通常是指一种在生产、质量评估或者开发环境下实施的带有预防或主动性的活动。

   - 当应用相关干系人提出性能问题却 没有提供足够多的线索 时，首先我们需要进行性能监控，随后是性能分析。

   - 监控前，设置好回收器组合，选定CPU（主频越高越好），设置年代比例，设置日志参数（生产环境中通常不会只设置一个日志文件）。

     > 比如：
     > `-Xloggc:/opt/xxx/logs/xxx-xxx-gc-%t.log -XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=20M -XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCCause`

   - 常见的问题有：GC 频繁、CPU load 过高、OOM、内存泄露、死锁、程序响应时间长 等。

3. 排查问题（性能分析）

   - 一种以 侵入方式 收集运行性能数据的活动，它会影响应用的呑吐量或响应性。

   - 性能分析是针对性能问题的答复结果，关注的范围通常比性能监控更加集中。

   - 性能分析很少在生产环境下进行，通常是在质量评估、系统测试或者开发环境下进行，是性能监控之后的步骤。
   - 常用的排查方法有：
     - 打印GC日志，通过 GCviewer 或者 [gceasy](http://gceasy.io) 来分析日志信息。
     - 灵活运用 命令行工具，jstack，jmap，jinfo 等。
     - dump 出堆文件，使用内存分析工具 (jconsole / jvisualvm / jprofiler / MAT) 分析文件。
     - 使用阿里 Arthas，或 jconsole，JVisualVM 来实时查看 JVM 状态。
     - jstack 查看堆栈信息。

4. 解决问题（性能调优）

   - 一种为改善应用响应性或呑吐量而更改参数、源代码、属性配置的活动，性能调优是在性能监控、性能分析之后的活动。
   - 常用的解决方法有：
     - 适当增加内存，根据业务背景选择垃圾回收器。
     - 优化代码，控制内存使用。
     - 增加机器，分散节点压力。
     - 合理设置线程池线程数量。
     - 使用中间件提高程序效率，比如缓存，消息队列等。

### 性能评价测试指标

1. 响应时间

2. 吞吐量

   对单位时间内完成的工作量的量度

   在GC中，运行用户代码的时间占总运行时间的比例（总运行时间：程序的运行时间＋内存回收的时间），吞吐量为 1-1/(1+n)。-XX:GCTimeRatio=n

3. 并发数

   同一时刻，对服务器有实际交互的请求数。1000个人同时在线，估计并发数在5% -15%之间，也就是同时并发量：50 - 150之间。

4. 内存占用

   Java 堆区所占的内存大小

## OOM 案例

### OOM 案例一：堆溢出

#### 报错信息

java.lang.OutOfMemoryError: Java heap space

#### 案例模拟

示例代码：

```java
@RequestMapping("/add") 
public void addObject(){ 
ArrayList<People> people = new ArrayList<>(); 
    while (true){ 
        people.add(new People());   
    } 
} 
 
@Data 
public class People { 
    private String name; 
    private Integer age; 
    private String job; 
    private String sex; 
} 
```

参数配置：

```java
-Xms30M  
-Xmx30M
-XX:+PrintGCDetails
-XX:MetaspaceSize=64m
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=heap/heapdump.hprof
-XX:+PrintGCDateStamps 
-Xloggc:log/gc-oomHeap.log
  
//-Xms200M  
//-Xmx200M
```

运行结果：

出现 `java.lang.OutOfMemoryError: Java heap space`

运行程序得到 heapdump.hprof 文件和 log 日志。

#### 原因和解决方案

原因：

1. 代码中可能存在大对象分配

2. 可能存在内存泄漏，导致在多次 GC 之后，还是无法找到一块足够大的内存容纳当前对象。

分析：

1. dump 文件分析（visual VM 分析、MAT 分析）
2. GC 日志分析

解决方案：

1. 检查是否存在大对象的分配，最有可能的是大数组分配
2. 通过 jmap 命令，把堆内存 dump 下来，使用 MAT 等工具分析一下，检查是否存在内存泄漏的问题
3. 如果没有找到明显的内存泄漏，使用 -Xmx 加大堆内存
4. 还有一点容易被忽略，检查是否有大量的自定义的 Finalizable 对象，也有可能是框架内部提供的，考虑其存在的必要性

### OOM 案例二：元空间溢出

#### 元空间储存的数据类型

方法区（Method Area）与 Java 堆一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的类信息、常量、即时编译器编译后的代码等数据。虽然Java 虚拟机规范把方法区描述为堆的一个逻辑部分，但是它却有一个别名叫做 Non-Heap（非堆），目的应该是与 Java 堆区分开来。

Java 虚拟机规范对方法区的限制非常宽松，除了和 Java 堆一样不需要连续的内存和可以选择固定大小或者可扩展外，还可以选择不实现垃圾收集。垃圾收集行为在这个区域是比较少出现的，其 **内存回收目标主要是针对常量池的回收和对类型的卸载**。 当方法区无法满足内存分配需求时，将抛出 OutOfMemoryError 异常。

#### 报错信息

java.lang.OutOfMemoryError: Metaspace

#### 案例模拟

示例代码：

```java
@RequestMapping("/metaSpaceOom")
public void metaSpaceOom() {
    ClassLoadingMXBean classLoadingMXBean = ManagementFactory.getClassLoadingMXBean ();
    while (true) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(People.class );
        enhancer.setUseCache( false );
        enhancer.setCallback((MethodInterceptor) (o, method, objects, methodProxy) -> {
            System.out.println("我是加强类哦，输出 print 之前的加强方法");
            return methodProxy.invokeSuper(o,objects);
        });
        People people = (People) enhancer.create();
        people.print();
        System.out.println(people.getClass());
        System.out.println("totalClass:" + classLoadingMXBean.getTotalLoadedClassCount());
        System.out.println("activeClass:" + classLoadingMXBean.getLoadedClassCount());
        System.out.println("unloadedClass:" + classLoadingMXBean.getUnloadedClassCount());
    }
}
public class People { 
    public void print() {
        System.out.println("我是 print 本人");
    } 
} 
```

参数配置：

```java
-XX:+PrintGCDetails 
-XX:MetaspaceSize=60m 
-XX:MaxMetaspaceSize=60m 
-Xss512K 
-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=heap/heapdumpMeta.hprof  
-XX:SurvivorRatio=8 
-XX:+TraceClassLoading 
-XX:+TraceClassUnloading 
-XX:+PrintGCDateStamps  
-Xms60M  
-Xmx60M 
-Xloggc:log/gc-oomMeta.log 

```

运行结果：

 `Caused by: java.lang.OutOfMemoryError: Metaspace`

#### 原因和解决方案

原因：

1. 运行期间生成了大量的代理类，导致方法区被撑爆，无法卸载

2. 应用长时间运行，没有重启
3. 元空间内存设置过小

分析：

1. 查看监控
2. 查看 GC 状态（jstat -gc PID 1000 10）及日志
3. dump 文件分析（visual VM 分析、MAT 分析）

解决方案：

代码中每次只加载一个代理类即可， 因为我们的需求其实是没有必要如此加载的，当然如果业务上确实需要加载很多类的话，那么我们就要考虑增大方法区大小了 ，所以我们这里修改代码如下：

```java
enhancer.setUseCache(true); 
```

选择为 true 的话，使用和更新一类具有相同属性生成的类的静态缓存，而不会在同一个类文件还继续被动态加载并视为不同的类，这个其实跟类的 equals() 和 hashCode() 有关，它们是与 cglib 内部的 class cache 的 key 相关的。

其他类似问题解决：

1. 检查是否永久代空间或者元空间设置的过小
2. 检查代码中是否存在大量的反射操作
3. dump之后通过mat检查是否存在大量由于反射生成的代理类

### OOM 案例三：GC overhead

#### 案例模拟

示例一：

代码：

```java
public class OOMTest { 
    public static void main(String[] args) { 
        int i = 0 ;
        List<String> list = new ArrayList<>();
        try {
            while (true) {
                list.add(UUID.randomUUID().toString().intern());
                i++;
            }
        } catch(Throwable e) {
            System.out.println("************i: " + i);
            e.printStackTrace();
            throw e;
        } 
    }
} 
```

配置：

```java
-XX:+PrintGCDetails 
-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=heap/dumpExceeded.hprof 
-XX:+PrintGCDateStamps 
-Xms10M 
-Xmx10M 
-Xloggc:log/gc-oomExceeded.log 
```

报错：

```java
[Full GC (Ergonomics) [PSYoungGen: 2047K->2047K(2560K)] [ParOldGen: 7110K->7095K(7168K)] 9158K->9143K(9728K), [Metaspace: 3177K->3177K(1056768K)], 0.0479640 secs] [Times: user=0.23 sys=0.01, real=0.05 secs]  
java.lang.OutOfMemoryError: GC overhead limit exceeded 
[Full GC (Ergonomics) [PSYoungGen: 2047K->2047K(2560K)] [ParOldGen: 7114K->7096K(7168K)] 9162K->9144K(9728K), [Metaspace: 3198K->3198K(1056768K)], 0.0408506 secs] [Times: user=0.22 sys=0.01, real=0.04 secs]  
```

通过查看GC日志可以发现，系统在频繁性的做 FULL GC，但是却没有回收掉多少空间，那么引起的原因可能是因为内存不足，也可能是存在内存泄漏的情况，我们要根据堆 dump 文件来具体分析。

示例二：

代码：

```java
 public static void main(String[] args) { 
    String str = ""; 
    Integer i = 1; 
    try { 
        while (true) { 
            i++; 
            str += UUID.randomUUID(); 
        }
    } catch(Throwable e) { 
        System.out.println("************i: " + i); 
        e.printStackTrace(); 
        throw e; 
    } 
} 
```

配置：

```java
-XX:+PrintGCDetails 
-XX:+HeapDumpOnOutOfMemoryError 
-XX:HeapDumpPath=heap/dumpHeap1.hprof 
-XX:+PrintGCDateStamps 
-Xms10M 
-Xmx10M 
-Xloggc:log/gc-oomHeap1.log
```

报错：

```java
[Full GC (Ergonomics) [PSYoungGen: 2047K->2047K(2560K)] [ParOldGen: 7110K->7095K(7168K)] 9158K->9143K(9728K), [Metaspace: 3177K->3177K(1056768K)], 0.0479640 secs] [Times: user=0.23 sys=0.01, real=0.05 secs] 
java.lang.OutOfMemoryError: GC overhead limit exceeded 
[Full GC (Ergonomics) [PSYoungGen: 2047K->2047K(2560K)] [ParOldGen: 7114K->7096K(7168K)] 9162K->9144K(9728K), [Metaspace: 3198K->3198K(1056768K)], 0.0408506 secs] [Times: user=0.22 sys=0.01, real=0.04 secs] 
```

#### 代码解析

第一段代码：运行期间将内容放入常量池的典型案例

intern() 方法

- 如果字符串常量池里面已经包含了等于字符串X的字符串，那么就返回常量池中这个字符串的引用
- 如果常量池中不存在，那么就会把当前字符串添加到常量池并返回这个字符串的引用

第二段代码：不停的追加字符串 str

看似两段代码差别不大，为什么第二个没有报 `GC overhead limit exceeded` 呢？以上两个 demo 的区别在于：

- Java heap space 的 demo 每次都能回收大部分的对象（中间产生的UUID），只不过有一个对象是无法回收的，慢慢长大，直到内存溢出
- GC overhead limit exceeded 的 demo 由于每个字符串都在被 list 引用，所以无法回收，很快就用完内存，触发不断回收的机制。  

通过查看GC日志可以发现，系统在频繁性的做FULL GC，但是却没有回收掉多少空间，那么引起的原因可能是因为内存不足，也可能是存在内存泄漏的情况，我们要根据堆 DUMP 文件来具体分析。

#### 分析及解决

这个是 JDK6 新加的错误类型，一般都是堆太小导致的。 Sun 官方对此的定义：**超过 98% 的时间用来做 GC 并且回收了不到 2% 的堆内存时会抛出此异常**。

本质是一个**预判性的异常**，抛出该异常时系统没有真正的内存溢出。

解决方法：

1. 检查项目中是否有大量的死循环或有使用大内存的代码，优化代码。

2. 添加参数 `-XX:-UseGCOverheadLimit` 禁用这个检查，其实这个参数解决不了内存问题，只是把错误的信息延后，最终出现 `java.lang.OutOfMemoryError: Java heap space`。

3. dump 内存，检查是否存在内存泄漏，如果没有，加大内存。

### OOM 案例四：线程溢出

#### 报错信息

`java.lang.OutOfMemoryError : unable to create new native Thread`

#### 案例模拟

说明：操作系统会崩溃，linux 无法再进行任何命令，mac/windows 可能直接关机重启。鉴于以上原因，我们在虚拟机进行测试。

示例代码：

```java
import java.util.concurrent.CountDownLatch;
public class TestNativeOutOfMemoryError {
 public static void main(String[] args) {
  for (int i = 0 ;; i++) {
   System. out .println( "i = " + i);
   new Thread( new HoldThread()).start();
  }
 }
}
class HoldThread extends Thread {
 CountDownLatch cdl = new CountDownLatch(1);
 @Override
 public void run() {
  try {
   cdl .await();
  } catch (InterruptedException e) {
  }
 }
} 
```

结果：

```java
Exception in thread "main" java.lang.OutOfMemoryError: unable to create new native thread 
  at java.lang.Thread.start0(Native Method) 
  at java.lang.Thread.start(Thread.java:717) 
  at TestNativeOutOfMemoryError.main(TestNativeOutOfMemoryError.java:9) 
```

#### 分析及解决

分析

- 通过 -Xss 设置每个线程栈大小的容量，JDK5.0 以后每个线程堆栈大小为 1M, 以前每个线程堆栈大小为 256K。

- 正常情况下，在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的,不能无限生成,经验值在3000~5000左右。

- 能创建的线程数的具体计算公式如下：

  `(MaxProcessMemory - JVMMemory - ReservedOsMemory) / (ThreadStackSize) = Number of threads`

  MaxProcessMemory 指的是进程可寻址的最大空间

  JVMMemory   JVM内存

  ReservedOsMemory 保留的操作系统内存

  ThreadStackSize  线程栈的大小

- 在 Java 语言里， 当你创建一个线程的时候，虚拟机会在JVM内存创建一个 Thread 对象同时创建一个操作系统线程，而这个系统线程的内存用的不是 JVM Memory，而是系统中剩下的内存 (MaxProcessMemory - JVMMemory - ReservedOsMemory)。

- 由公式得出结论：你给 JVM 内存越多，那么你能创建的线程越少，越容易发生 `java.lang.OutOfMemoryError: unable to create new native thread`

解决

- 如果程序中有 bug，导致创建大量不需要的线程或者线程没有及时回收，那么必须解决这个 bug，修改参数是不能解决问题的。
- 如果程序确实需要大量的线程，现有的设置不能达到要求，那么可以通过修改 MaxProcessMemory，JVMMemory，ThreadStackSize 这三个因素，来增加能创建的线程数。
- MaxProcessMemory 使用64位操作系统。
- JVM Memory 减少 JVMMemory 的分配。
- ThreadStackSize 减小单个线程的栈大小。

xss 值与线程数量

在 32位 windows 系统下较为严格遵守上述线程数计算公式，64位 操作系统下调整 Xss 的大小并没有对产生线程的总数产生影响。

线程总数也受到系统空闲内存和操作系统的限制，检查是否该系统下有此限制：

- /proc/sys/kernel/pid_max : 系统最大pid值，在大型系统里可适当调大
- /proc/sys/kernel/threads-max : 系统允许的最大线程数
- maxuserprocess（ulimit -u） : 系统限制某用户下最多可以运行多少进程或线程
- /proc/sys/vm/max_map_count : 包含限制一个进程可以拥有的VMA(虚拟内存区域)的数量。

## 性能优化案例

### 一、调整堆大小提高服务的吞吐量

#### 修改 Tomcat 配置

生产环境下，Tomcat 并不建议直接在 catalina.sh 里配置变量，而是写在与 catalina 同级目录（bin目录）下的 setenv.sh 里。

#### 初始配置

setenv.sh 文件中写入内容如下：

```java
export CATALINA_OPTS="$CATALINA_OPTS -Xms30m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:SurvivorRatio=8"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx30m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+UseParallelGC"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+PrintGCDetails"
export CATALINA_OPTS="$CATALINA_OPTS -XX:MetaspaceSize=64m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+PrintGCDateStamps"
export CATALINA_OPTS="$CATALINA_OPTS -Xloggc:/opt/tomcat8.5/logs/gc.log"
```

查看日志：

#### ￼￼优化配置

```java
export CATALINA_OPTS="$CATALINA_OPTS -Xms120m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:SurvivorRatio=8"
export CATALINA_OPTS="$CATALINA_OPTS -Xmx120m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+UseParallelGC"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+PrintGCDetails"
export CATALINA_OPTS="$CATALINA_OPTS -XX:MetaspaceSize=64m"
export CATALINA_OPTS="$CATALINA_OPTS -XX:+PrintGCDateStamps"
export CATALINA_OPTS="$CATALINA_OPTS -Xloggc:/opt/tomcat8.5/logs/gc.log"
```

查看日志：

### 二、JVM优化之JIT优化

#### 堆，是分配对象的唯一选择吗

在《深入理解Java虚拟机中》关于 Java 堆内存有这样一段描述：

随着 JIT 编译期的发展与逃逸分析技术逐渐成熟，栈上分配、标量替换优化技术将会导致一些微妙的变化，所有的对象都分配到堆上也渐渐变得不那么“绝对”了。

在 Java 虚拟机中，对象是在 Java 堆中分配内存的，这是一个普遍的常识。但是，有一种特殊情况，那就是如果经过 逃逸分析(Escape Analysis) 后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成 栈上分配 。这样就无需在堆上分配内存，也无须进行垃圾回收了。这也是最常见的堆外存储技术。 

此外，前面提到的基于 OpenJDK 深度定制的 TaoBao VM，其中创新的 GCIH（GC invisible heap）技术实现 off-heap，将生命周期较长的 Java 对象从 heap 中移至 heap 外，并且 GC 不能管理 GCIH 内部的 Java 对象，以此达到降低 GC 的回收频率和提升 GC 的回收效率的目的。

#### 编译的开销

时间开销：

说 JIT 比解释快，其实说的是“执行编译后的代码”比“解释器解释执行”要快，只有对频繁执行的代码（热点代码），JIT编译才能保证有正面的收益。

空间开销：

对一般的 Java 方法而言，编译后代码的大小相对于字节码的大小，膨胀比达到 10+ 是很正常的。同上面说的时间开销一样，这里的空间开销也是，只有对执行频繁的代码才值得编译。这也就解释了为什么有些JVM会选择不总是做JIT编译，而是选择用 解释器+JIT编译器 的混合执行引擎。 

#### 即时编译对代码的优化

##### 逃逸分析：

如何将堆上的对象分配到栈，需要使用逃逸分析手段。

逃逸分析 (Escape Analysis) 是目前 Java 虚拟机中比较前沿的优化技术。这是一种可以有效减少 Java 程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。

通过逃逸分析，Java Hotspot 编译器能够分析出一个新的对象的引用的使用范围，从而决定是否要将这个对象分配到堆上。 

逃逸分析的基本行为就是分析对象动态作用域，当一个对象在方法中被定义后，对象只在方法内部使用，则认为没有发生逃逸。当一个对象在方法中被定义后，它被外部方法所引用，则认为发生逃逸。例如作为调用参数传递到其他地方中。

逃逸方式：

- 全局变量赋值逃逸
- 方法返回值逃逸
- 实例引用发生逃逸
- 线程逃逸，赋值给类变量或可以在其他线程中访问的实例变量

举例：

```java
public static StringBuffer createStringBuffer(String s1, String s2) { 
    StringBuffer sb = new StringBuffer(); 
    sb.append(s1); 
    sb.append(s2); 
    return sb; 
} 
// 上述代码如果想要StringBuffer sb不逃出方法，可以这样写： 
public static String createStringBuffer(String s1, String s2) { 
    StringBuffer sb = new StringBuffer(); 
    sb.append(s1); 
    sb.append(s2); 
    return sb.toString(); 
} 
```

```java
public class EscapeAnalysis { 
    public EscapeAnalysis obj ; 
    /* 方法返回 EscapeAnalysis 对象，发生逃逸  */ 
    public EscapeAnalysis getInstance() { 
        return obj == null ? new EscapeAnalysis() : obj ; 
    } 
    /* 为成员属性赋值，发生逃逸  */ 
    public void setObj() { 
        this.obj = new EscapeAnalysis(); 
    } 
     /* 对象的作用域仅在当前方法中有效，没有发生逃逸  */ 
    public void useEscapeAnalysis() { 
        EscapeAnalysis e = new EscapeAnalysis(); 
    } 
    /* 引用成员变量的值，发生逃逸  */ 
    public void useEscapeAnalysis1() { 
        EscapeAnalysis e = getInstance();  
    }
} 
```

参数设置：

- 在 JDK 6u23 版本之后，HotSpot 中默认就已经开启了逃逸分析。 
- 通过选项“-XX:+DoEscapeAnalysis”显式开启逃逸分析 
- 通过选项“-XX+PrintEscapeAnalysis”查看逃逸分析的筛选结果。 

结论：**开发中能使用局部变量的，就不要使用在方法外定义。** 

##### 代码优化 - 栈上分配

栈上分配：将堆分配转化为栈分配。如果经过逃逸分析后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。这样就无需在堆上分配内存，也无须进行垃圾回收了。可以减少垃圾回收时间和次数。

##### 代码优化 - 同步消除

同步消除（省略）：如果一个对象被发现只能从一个线程被访问到，那么对于这个对象的操作可以不考虑同步。 

- 线程同步的代价是相当高的，同步的后果是降低并发性和性能。 

- 在动态编译同步块的时候，JIT编译器可以借助逃逸分析来 **判断同步块所使用的锁对象是否只能够被一个线程访问而没有被发布到其他线程** 。如果没有，那么JIT编译器在编译这个同步块的时候就会取消对这部分代码的同步。这样就能大大提高并发性和性能。这个取消同步的过程就叫同步省略，也叫 **锁消除** 。

举例：

```java
public void f() { 
    Object hollis = new Object(); 
    synchronized(hollis) { 
        System.out.println(hollis); 
    } 
} 
// 代码中对hollis这个对象进行加锁，但是hollis对象的生命周期只在f()方法中，并不会被其他线程所访问到，所以在JIT编译阶段就会被优化掉。优化成： 
public void f() { 
    Object hollis = new Object(); 
    System.out.println(hollis); 
} 
```

##### 代码优化 - 标量替换

标量（Scalar） 是指一个无法再分解成更小的数据的数据。Java 中的原始数据类型就是标量。 

相对的，那些还可以分解的数据叫做 聚合量（Aggregate），Java 中的对象就是聚合量，因为他可以分解成其他聚合量和标量。  

在 JIT 阶段，如果经过逃逸分析，发现一个对象不会被外界访问的话，那么经过 JIT 优化，就会把这个对象拆解成若干个其中包含的若干个成员变量来代替。这个过程就是标量替换。

举例：

```java
public static void main(String[] args) { 
    alloc(); 
} 
private static void alloc() { 
    Point point = new Point(1,2); 
    System.out.println("point.x="+point.x+"; point.y="+point.y); 
} 
class Point{ 
    private int x; 
    private int y; 
} 

//以上代码，经过标量替换后，就会变成 ： 
private static void alloc() { 
    int x = 1; 
    int y = 2; 
    System.out.println("point.x="+x+"; point.y="+y); 
} 
```

可以看到，Point这个聚合量经过逃逸分析后，发现他并没有逃逸，就被替换成两个标量了。标量替换可以大大减少堆内存的占用。因为一旦不需要创建对象了，那么就不再需要分配堆内存了。 

标量替换为栈上分配提供了很好的基础。

参数设置：

参数 `-XX:+EliminateAllocations`：开启了标量替换(默认打开)，允许将对象打散分配在栈上。

举例二：

```java
public class ScalarReplace { 
    public static class User { 
        public int id ; 
        public String name ; 
    } 
    public static void alloc() { 
        User u = new User(); 
        u.id = 5;
        u.name = "www.atguigu.com"; 
    } 
    public static void main(String[] args) { 
        long start = System.currentTimeMillis(); 
        for ( int i = 0 ; i < 10000000 ; i++) { 
            alloc(); 
        } 
        long end = System.currentTimeMillis(); 
        System.out .println(end - start); 
    }
}
```

上述代码在主函数中进行了 1 亿次 alloc。调用进行对象创建，由于 User 对象实例需要占据约16字节的空间，因此累计分配空间达到将近 1.5GB。如果堆空间小于这个值，就必然会发生 GC。使用如下参数运行上述代码： 

```java
-server
-Xmx100m 
-Xms100m 
-XX:+DoEscapeAnalysis 
-XX:+PrintGC 
-XX:+EliminateAllocations  
```

这里使用参数如下： 

- 参数 -server：启动Server模式，因为在Server模式下，才可以启用逃逸分析。 
- 参数 -XX:+DoEscapeAnalysis：启用逃逸分析 
- 参数 -Xmx100m：指定了堆空间最大为100MB 
- 参数 -XX:+PrintGC：将打印 GC 日志。 
- 参数 -XX:+EliminateAllocations：开启了标量替换(默认打开)，允许将对象打散分配在栈上， 比如对象拥有id和name两个字段，那么这两个字段将会被视为两个独立的局部变量进行分配。 

##### 逃逸分析小结

逃逸分析小结：逃逸分析并不成熟 

- 关于逃逸分析的论文在1999年就已经发表了，但直到 JDK 1.6 才有实现，而且这项技术到如今也并不是十分成熟的。 
- 其根本原因就是 **无法保证非逃逸分析的性能消耗一定能高于他的消耗**。虽然经过逃逸分析可以做标量替换、栈上分配、和锁消除。但是逃逸分析自身也是需要进行一系列复杂的分析的，这其实也是一个相对耗时的过程。 
- 一个极端的例子，就是经过逃逸分析之后，发现没有一个对象是不逃逸的。那这个逃逸分析的过程就白白浪费掉了。 
- 虽然这项技术并不十分成熟，但是它也**是即时编译器优化技术中一个十分重要的手段**。 
- 注意到有一些观点，认为通过逃逸分析，JVM 会在栈上分配那些不会逃逸的对象，这在理论上是可行的，但是取决于 JVM 设计者的选择。 
- 目前很多书籍还是基于 JDK7 以前的版本，JD K已经发生了很大变化，intern 字符串的缓存和静态变量曾经都被分配在永久代上，而永久代已经被元数据区取代。但是，intern 字符串缓存和静态变量并不是被转移到元数据区，而是直接在堆上分配，所以这一点同样符合前面一点的结论： 对象实例都是分配在堆上。 

### 三、合理配置堆内存

#### 推荐配置

在案例1中我们讲到了增加内存可以提高系统的性能而且效果显著，那么随之带来的一个问题就是，我们增加多少内存比较合适？**如果内存过大，那么如果产生 FullGC 的时候，GC 时间会相对比较长，如果内存较小，那么就会频繁的触发 GC**。

依据的原则是根据 Java Performance 里面的推荐公式来进行设置

> Java整个堆大小设置，Xmx 和 Xms 设置为老年代存活对象的 3-4 倍，即 FullGC 之后的老年代内存占用的 3-4 倍。
>
> 方法区（永久代 PermSize 和 MaxPermSize 或 元空间 MetaspaceSize 和 MaxMetaspaceSize）设置为老年代存活对象的 1.2-1.5 倍。 
>
> 年轻代 Xmn 的设置为老年代存活对象的 1-1.5 倍。 
>
> 老年代的内存大小设置为老年代存活对象的 2-3 倍。 

但是，上面的说法也不是绝对的，也就是说这给的是一个参考值，根据多种调优之后得出的一个结论，大家可以根据这个值来设置一下我们的初始化内存，在保证程序正常运行的情况下，我们还要去查看GC的回收率，GC停顿耗时，内存里的实际数据来判断，Full GC 是基本上不能有的，如果有就要做内存Dump分析，然后再去做一个合理的内存分配。 

#### 老年代存活对象计算

1. 查看日志（推荐）

   VM 参数中添加 GC 日志，GC 日志中会记录每次 Full GC 之后各代的内存大小，观察老年代 GC 之后的空间大小。可观察一段时间内（比如2天）的 Full GC 之后的内存情况，根据多次的 Full GC 之后的老年代的空间大小数据来预估 Full GC 之后老年代的存活对象大小 （可根据多次 Full GC 之后的内存大小取平均值） 。

2. 强制触发 Full GC

   方式1的方式比较可行，但需要更改 JVM 参数，并分析日志。同时，在使用CMS回收器的时候，有可能不能触发 Full GC，所以日志中并没有记录 Full GC 的日志。在分析的时候就比较难处理。 所以，有时候需要强制触发一次 Full GC，来观察 Full GC 之后的老年代存活对象大小。

   > 注：强制触发 Full GC，会造成线上服务停顿（STW），要谨慎！建议的操作方式为，在强制 Full GC 前先把服务节点摘除，Full GC 之后再将服务挂回可用节点，对外提供服务，在不同时间段触发 Full GC， 根据多次 Full GC 之后的老年代内存情况来预估 Full GC 之后的老年代存活对象大小 

   触发方式：

   1. `jmap -dump:live,format=b,file=heap.bin <pid>` 将当前的存活对象 dump 到文件，此时会触发 Full GC
   2. `jmap -histo:live <pid>` 打印每个 class 的实例数目, 内存占用, 类全名信息.live子参数加上后, 只统计活的对象数量, 此时会触发 Full GC
   3. 在性能测试环境，可以通过 Java 监控工具来触发 Full GC，比如使用 Visual VM 和 JConsole，Visual VM 集成了 JConsole，Visual VM 或者 JConsole 上面有一个触发GC的按钮。

#### 案例演示

配置参数

现在我们通过 idea 启动 springboot 工程，我们将内存初始化为 1024M。我们这里就从 1024M 的内存开始分析我们的 GC 日志，根据我们上面的一些知识来进行一个合理的内存设置。

```java
-XX:+PrintGCDetails 
-XX:MetaspaceSize=64m 
-Xss512K 
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=heap/heapdump3.hprof  
-XX:SurvivorRatio=8  
-XX:+PrintGCDateStamps  
-Xms1024M  
-Xmx1024M 
-Xloggc:log/gc-oom3.log 
```

代码示例

```java
// controller
@RequestMapping("/getData")
public List<People> getProduct(){ 
  List<People> peopleList = peopleSevice.getPeopleList(); 
  return peopleList; 
}
// service
@Service
public class PeopleSevice { 
  @Autowired 
  PeopleMapper peopleMapper; 
  public List<People> getPeopleList(){ 
    return peopleMapper.getPeopleList(); 
  } 
} 
// mapper
@Repository
public interface PeopleMapper { 
  List<People> getPeopleList(); 
}
// bean
@Data
public class People { 
  private Integer id; 
  private String name; 
  private Integer age; 
  private String job; 
  private String sex; 
}
//xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd"> 
<mapper namespace="com.atguiigu.jvmdemo.mapper.PeopleMapper"> 
  <resultMap id="baseResultMap" type="com.atguiigu.jvmdemo.bean.People"> 
  <result column="id" jdbcType="INTEGER" property="id" /> 
  <result column="name" jdbcType="VARCHAR" property="name" /> 
  <result column="age" jdbcType="VARCHAR" property="age" /> 
  <result column="job" jdbcType="INTEGER" property="job" /> 
  <result column="sex" jdbcType="VARCHAR" property="sex" /> 
  </resultMap> 
  <select id="getPeopleList" resultMap="baseResultMap"> 
  	select id,name,job,age,sex from people 
  </select> 
</mapper> 
```



### 四、CPU占用很高排查方案

### 五、G1并发执行的线程数对性能的影响

### 六、调整垃圾回收器提高服务的吞吐量

### 七、日均百万级订单交易系统如何设置JVM参数
