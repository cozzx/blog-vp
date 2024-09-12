## 软件设计原则

### 1、开闭原则

### 2、里氏代换原则

### 3、依赖倒转原则

### 4、接口隔离原则

### 5、迪米特法则

### 6、合成复用原则

## 创建型模式

创建型模式分为5种：单例模式、工厂模式、抽象工厂模式、原型模式、建造者模式

### 1、单例模式

类负责创建自身对象，同时确保只有单个对象被创建。

类提供了一种访问其唯一对象的方式，使用者不需要实例化类对象即可直接访问。

#### 饿汉式

```java
class Singleton {
  // 创建自身对象
  private final static instance = new Singleton();
  // 私有化构造器
  private Singleton() {}
  // 提供访问方法
  public getInstance() {
    return instance;
  }
}
```

枚举单例：

使用枚举实现单例是简单高效的方法，枚举实例在类加载时创建，比类实例的创建和访问要快很多。

```java
enum Singleton {
  INSTANCE;
}
```

#### 懒汉式

方式一：方法锁，在获取实例的方法上加 `synchronized` 保证线程安全。

- 缺点：每次调用方法都加锁，方法执行效率低。

```java
class Singleton {
  private static instance;
  private Signleton() {}
  public static synchronized Singleton getInstance() {
    if (instance != null) {
      instance = new Singleton();
    }
    return instance
  }
}
```

方式二：双重检查锁，调整加锁的时机，在操作更为频繁的读时不需要加锁。

- 缺点：JVM 在实例化对象时会进行优化和指令重排操作，可能会造成空指针异常.
- 解决双重检查锁中的空指针异常问题，需要给类变量 `instance` 添加 `volatile` 关键字，保证其**可见性**和**有序性**。

```java
class Singleton {
  // private static instance;
  private static volatile instance;
  private Signleton() {}
  public static Singleton getInstance() {
    if (instance != null) {
      synchronized (instance) {
        if (instance != null) {
          instance = new Singleton();
        }
      }
    }
    return instance
  }
}
```

方式三：静态内部类，实例由内部类创建，由于 JVM 在加载外部类时不会加载静态内部类，只有内部类的属性或方法被调用时才会加载，并初始化其静态属性。静态属性由于有 static 修饰，保证只被实例化一次，并严格保证实例化顺序。

```java
class Singleton {
  private Singleton() {}
  private static class SingletonHolder {
    private static final instance = new Singleton();
  }
  public Singleton getInstance() {
    return SingletonHolder.instalce;
  }
}
```

### 2、工厂模式



## 结构型模式

## 行为型模式