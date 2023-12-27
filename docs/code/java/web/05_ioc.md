# ioc

## 服务层

MVC : Model（模型）、View（视图）、Controller（控制器）

1) 视图层：用于做数据展示以及和用户交互的一个界面
2) 控制层：能够接受客户端的请求，具体的业务功能还是需要借助于模型组件来完成
3) 模型层：模型分为很多种，有业务模型组件，有数据访问层组件
          1) pojo/vo : 值对象
          2) DAO ： 数据访问对象
          3) BO ： 业务对象

区分业务对象和数据访问对象：

1. DAO中的方法都是单精度方法或者称之为细粒度方法。什么叫单精度？一个方法只考虑一个操作，比如添加，那就是insert操作、查询那就是select操作....

2. BO中的方法属于业务方法，也实际的业务是比较复杂的，因此业务方法的粒度是比较粗的

     注册这个功能属于业务功能，也就是说注册这个方法属于业务方法。那么这个业务方法中包含了多个DAO方法。也就是说注册这个业务功能需要通过多个DAO方法的组合调用，从而完成注册功能的开发。

     注册：
            1. 检查用户名是否已经被注册 - DAO中的select操作
            2. 向用户表新增一条新用户记录 - DAO中的insert操作
            3. 向用户积分表新增一条记录（新用户默认初始化积分100分） - DAO中的insert操作
            4. 向系统消息表新增一条记录（某某某新用户注册了，需要根据通讯录信息向他的联系人推送消息） - DAO中的insert操作
            5. 向系统日志表新增一条记录（某用户在某IP在某年某月某日某时某分某秒某毫秒注册） - DAO中的insert操作
                  ....

## IOC/DI

### IOC - 控制反转

之前在Servlet中，我们创建 service 对象， FruitService fruitService = new FruitServiceImpl();

这句话如果出现在 servlet 中的某个方法内部，那么这个 fruitService 的作用域（生命周期）应该就是这个方法级别；

如果这句话出现在 servlet 的类中，也就是说 fruitService 是一个成员变量，那么这个 fruitService 的作用域（生命周期）应该就是这个 servlet 实例级别。

之后我们在 applicationContext.xml 中定义了这个 fruitService。然后通过解析 XML，产生 fruitService 实例，存放在 beanMap 中，这个 beanMap 在一个 BeanFactory 中。

因此，我们转移（改变）了之前的 service 实例、dao 实例等等他们的生命周期。控制权从程序员转移到 BeanFactory。这个现象我们称之为控制反转。

### DI - 依赖注入

之前我们在控制层出现代码：FruitService fruitService = new FruitServiceImpl()；那么，控制层和service层存在耦合。

之后，我们将代码修改成FruitService fruitService = null; 然后，在配置文件中配置:

```java
<bean id="fruit" class="FruitController">
     <property name="fruitService" ref="fruitService"/>
</bean>
```
