# thymelead

## thymelead的使用

添加thymeleaf的jar包

新建一个Servlet类ViewBaseServlet

在web.xml文件中添加配置

- 配置前缀 view-prefix
- 配置后缀 view-suffix

使得我们的Servlet继承ViewBaseServlet

根据逻辑视图名称 得到 物理视图名称

- 此处的视图名称是 index
- 那么thymeleaf会将这个 逻辑视图名称 对应到 物理视图 名称上去
- 逻辑视图名称 ：   index
- 物理视图名称 ：   view-prefix + 逻辑视图名称 + view-suffix
- 所以真实的视图名称是：      /       index       .html
  super.processTemplate("index",request,response);

使用thymeleaf的标签

- th:if
- th:unless
- th:each
- th:text

## servlet 优化

问题：

- 一个请求对应一个Servlet，这样存在的问题是servlet太多了

优化：

- 把一系列的请求都对应一个Servlet, IndexServlet/AddServlet/EditServlet/DelServlet/UpdateServlet -> FruitServlet
- 通过一个operate的值来决定调用FruitServlet中的哪一个方法，使用switch-case或反射
  - 使用 switch-case：随着我们的项目的业务规模扩大，servlet 中会充斥着大量的 switch-case，代码冗余
  - 使用了反射技术：规定operate的值和方法名一致，接收到operate的值是什么就表明我们需要调用对应的方法进行响应，如果找不到对应的方法，则抛异常
