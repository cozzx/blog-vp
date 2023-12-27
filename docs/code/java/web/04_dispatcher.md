# dispatcher

## servlet 进一步优化

问题：

- 上一个版本中我们使用了反射技术，但是其实还是存在一定的问题：每一个servlet中都有类似的反射技术的代码。

优化：

- 继续做抽取，设计中央控制器类：DispatcherServlet

DispatcherServlet 类

1. 根据url定位到能够处理这个请求的 controller 组件

   1. 从url中提取 servletPath : /fruit.do -> fruit
   2. 根据 fruit 找到对应的组件：FruitController，这个对应的依据我们存储在 applicationContext.xml 中 `<bean id="fruit" class="com.atguigu.fruit.controllers.FruitController/>`,通过DOM技术我们去解析XML文件，在中央控制器中形成一个 beanMap 容器，用来存放所有的 Controller 组件
   3. 根据获取到的 operate 的值定位到我们 FruitController 中需要调用的方法

2. 调用Controller组件中的方法：

   1) 获取参数

         获取即将要调用的方法的参数签名信息: `Parameter[] parameters = method.getParameters();`

         通过 `parameter.getName()` 获取参数的名称

         准备 `Object[] parameterValues` 这个数组用来存放对应参数的参数值

         另外，我们需要考虑参数的类型问题，需要做类型转化的工作。通过 `parameter.getType()` 获取参数的类型

   2) 执行方法
     `Object returnObj = method.invoke(controllerBean , parameterValues);`

   3) 视图处理
