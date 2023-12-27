# filter

## Filter 过滤器

Filter概念：

Filter 过滤器是 JavaWeb 的三大组件之一。三大组件分别是：Servlet 程序、Listener 监听器、Filter 过滤器。

Filter 过滤器它是 JavaEE 的规范。

Filter 过滤器它的作用是：**拦截请求**，过滤响应。

拦截请求常见的应用场景有：权限检查、日记操作、事务管理等。

Filter生命周期

1. 构造器方法
2. init 初始化方法，在 web 工程启动的时候执行（在 web 工程启动的时候执行（Filter 已经创建）。
3. doFilter 过滤方法，每次拦截到请求，就会执行。
4. destroy 销毁，停止 web 工程的时候，就会执行（停止 web 工程，也会销毁 Filter 过滤器）。

Filter开发步骤：

1) 新建类实现 Filter 接口
2) 实现其中的三个方法：init、doFilter、destroy
3) 配置Filter，可以用注解 @WebFilter，也可以使用xml文件 `<filter> <filter-mapping>`，注解可以配置通配符，例如 @WebFilter("*.do") 表示拦截所有以 .do 结尾的请求

Filter过滤器链

1) 如果采取的是注解的方式进行配置，那么过滤器链的拦截顺序是按照全类名的先后顺序排序的
2) 如果采取的是xml的方式进行配置，那么按照配置的先后顺序进行排序

## listener 监听器

ServletContextListener - 监听ServletContext对象的创建和销毁的过程

HttpSessionListener - 监听HttpSession对象的创建和销毁的过程

ServletRequestListener - 监听ServletRequest对象的创建和销毁的过程

ServletContextAttributeListener - 监听ServletContext的保存作用域的改动(add,remove,replace)

HttpSessionAttributeListener - 监听HttpSession的保存作用域的改动(add,remove,replace)

ServletRequestAttributeListener - 监听ServletRequest的保存作用域的改动(add,remove,replace)

HttpSessionBindingListener - 监听某个对象在Session域中的创建与移除

HttpSessionActivationListener - 监听某个对象在Session域中的序列化和反序列化
