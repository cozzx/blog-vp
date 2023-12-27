# transaction

## ThreadLocal

ThreadLocal 的作用，它可以解决多线程的数据安全问题。

ThreadLocal 它可以给当前线程关联一个数据（可以是普通变量，可以是对象，也可以是数组，集合）。

ThreadLocal 的特点：

1. ThreadLocal 可以为当前线程关联一个数据。（它可以像 Map 一样存取数据，key 为当前线程）。
2. 每一个 ThreadLocal 对象，只能为当前线程关联一个数据，如果要为当前线程关联多个数据，就需要使用多个 ThreadLocal 对象实例。
3. 每个 ThreadLocal 对象实例定义的时候，一般都是 static 类型。
4. ThreadLocal 中保存数据，在线程销毁后。会由 JVM 虚拟自动释放。

## 使用 Filter 和 ThreadLocal 组合管理事务

1. 使用 ThreadLocal 来确保所有 dao 操作都在同一个 Connection 连接对象中完成
2. 使用 Filter 过滤器统一给所有的 Service 方法都加上 try-catch。来进行实现的管理
3. 将所有异常都统一交给 Tomcat，让 Tomcat 展示友好的错误信息页面。

## 使用 listener 实现容器创建

1. 实现 ServletContextListener 接口，监听ServletContext对象的创建。
2. 读取 applicationContext.xml 中的配置，使用 Document 和 Node 类对象解析 xml;
3. 创建实例，给类中的属性赋值，实现IOC。
