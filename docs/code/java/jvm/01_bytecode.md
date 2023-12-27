# 字节码文件

## 概述

字节码文件是源代码经过编译器编译之后的文件。

它是一种二进制文件。

它的内容是JVM指令，不是像c、c++那样由编译器直接生成机器码。

### 编译器

前端编译器：将符合java语法规范的代码转换为符合JVM规范的字节码文件。

javac编译器：全量式编译，idea默认。

ECJ编译器：增量式编译器，eclipse内置。

编译步骤：词法解析，语法解析，语义解析，生成字节码。

```flow
  src=>start: 源代码
  lexical=>operation: 词法解析
  stream=>start: Token stream
  grammar=>operation: 语法解析
  grammarTree=>start: 语法树
  semantic=>operation: 语义解析
  annoGrammarTree=>start: 注解抽象语法树
  genByteCode=>operation: 生成字节码
  dst=>end: JVM字节码
  src(right)->lexical(right)->stream(right)->grammar(right)->grammarTree(right)->semantic(right)->annoGrammarTree(right)->genByteCode(right)->dst
```

局限性：只是编译成JVM虚拟机识别的字节码文件，非机器直接识别的机器码，编译为机器码的操作交由HotSpot的JIT编译器处理，因此会感觉Java程序第一次运行慢。

AOT编译器：jdk9引入了静态提前编译器，将所输入的Java类文件转换为机器码，并存放在生成的动态共享库中。

    优点：JVM直接加载已经编译好的机器码，不用等待JIT编译器的预热，减少Java应用第一次运行慢的体验。
    缺点：必须为不同硬件和操作系统进行对应的编译，和Java的"一次编译到处运行"相违背；降低了Java链接过程的动态性，加载的代码在编译器就必须全部已知。

### Class对象

哪些类型对应有Class对象

1. class：外部类，成员内部类，静态内部类，局部内部类，匿名内部类
2. interface：接口
3. array：数组
4. enum：枚举
5. annotation：注解
6. primitive type：基本数据类型
7. void

## 结构

字节码文件的基本结构：

- 魔数（Magic Number）：四个字节，用于识别是否为合法的字节码文件。
- 版本信息：两个字节，用于确定字节码文件所使用的 JVM 版本。
- 常量池（Constant Pool）：用于存储字节码文件中使用的符号引用、字面常量等信息，起到索引和共享常量的作用，提供了高效访问和管理常量的机制。
- 访问标志（Access Flags）：用于描述类或接口的访问级别（如 public、final、abstract 等）以及一些特征（如是否是接口、是否被修饰为枚举等）。
- 类相关信息：包括该类的名称、父类的名称、该类实现的接口等。
- 字段表集合（Fields）：描述类中定义的字段（成员变量），包括字段的访问标志、名称、类型等。
- 方法表集合（Methods）：描述类中定义的方法（成员函数），包括方法的访问标志、名称、参数列表、返回值等。
- 属性表集合（Attributes）：用于存储字节码文件中的附加信息，如源文件名、行号表、注解等。

![class_structure.png](./images/class_structure.png)

### 魔数

魔数是 class 文件的标识符，每个 class 文件开头 4 个字节的无符号整数称为魔数，魔数值固定为 0xCAFEBABE。

作用是确定当前文件是否是 JVM 虚拟机可加载的合法 class 文件。

### 文件版本

模数之后的 4 个字节代表文件版本。

前 2 个字节的无符号整数代表副版本号，称为 minor_version；后 2 个字节代表主版本号，称为 mejor_version。

主版本：1.8 => 52 11 => 55 17 => 61 21 => 65

### 常量池

常量池分为常量池计数器和常量池表。

#### 常量池计数器

版本号之后的 2 个字节代表常量池容量计数值（constant_pool_count），表示常量池中有多少项常量。

容量计数是从 1 开始的，即 constant_pool_count=1 表示常量池中有 0 个常量项。

> 加入计数器值为 0x0016，十进制为 22，实际上只有 21 项常量。索引为范围是 1-21。
>
> 把第 0 项常量空出来，是为了满足后面某些指向常量池的索引值的数据在特定情况下需要表达“不引用任何一个常量池项目”的含义，这种情况可用索引值
> 0 来表示。

#### 常量池表

常量池表（constant_pool）是一种表结构，以 1 ~ (constant_pool_count - 1) 为索引，包含了 class
文件结构及其子结构中引用的所有字符串常量、类或接口名、字段名和其他常量。

常量池表项中，用于存放编译时期生成的各种**字面量（Literal）**和**符号引用（Symbolic References）**
，这部分内容将在类加载后进入方法区的**运行时常量池**中存放。

字面量：

- 文本字符串
- final 修饰的常量

符号引用：

- 类和接口的全限定名
- 属性的名称和修饰符
- 方法的名称和修饰符

当虚拟机运行时，需要从常量池中获取对应的符号引用，在类加载过程的解析阶段，将符号引用转换为对应的直接引用，并翻译到具体的内存地址。

![constant_item](./images/constant_item.png)

**总结 1：**

- 这 14 种表（或者常量项结构）的共同点是：表开始的第一位是一个 u1 类型的标志位（tag），代表当前这个常量项使用的是哪种表结构，即哪种常量类型。
- 在常量池列表中，CONSTANT_Utf8_info 常量项是一种使用改进过的 UTF-8 编码格式来存储诸如文字字符串、类或者接口的全限定名、字段或者方法的简单名称以及描述符等常量字符串信息。
- 这 14 种常量项结构还有一个特点是，其中 13 个常量项占用的字节固定，只有 CONSTANT_Utf8_info 占用字节不固定，其大小由 length
  决定。为什么呢？**
  因为从常量池存放的内容可知，其存放的是字面量和符号引用，最终这些内容都会是一个字符串，这些字符串的大小是在编写程序时才确定**
  ，比如你定义一个类，类名可以取长取短，所以在没编译前，大小不固定，编译后，通过 utf-8 编码，就可以知道其长度。

**总结 2：**

- 常量池：可以理解为 Class 文件之中的资源仓库，它是 Class 文件结构中与其他项目关联最多的数据类型（后面的很多数据类型都会指向此处），也是占用
  Class 文件空间最大的数据项目之一。
- 常量池中为什么要包含这些内容？Java 代码在进行 Javac 编译的时候，并不像 C 和 C++那样有“连接”这一步骤，而是在虚拟机加载
  C1ass 文件的时候进行动态链接。也就是说，**在 Class
  文件中不会保存各个方法、字段的最终内存布局信息，因此这些字段、方法的符号引用不经过运行期转换的话无法得到真正的内存入口地址，也就无法直接被虚拟机使用**
  。当虚拟机运行时，需要从常量池获得对应的符号引用，再在类创建时或运行时解析、翻译到具体的内存地址之中。

### 访问标识

**访问标识（access_flag、访问标志、访问标记）**

在常量池后，紧跟着访问标记。该标记使用两个字节表示，用于识别一些类或者接口层次的访问信息，包括：这个 Class 是类还是接口；是否定义为
public 类型；是否定义为 abstract 类型；如果是类的话，是否被声明为 final 等。各种访问标记如下所示：

| 标志名称           | 标志值    | 含义                                                                        |
|:---------------|--------|:--------------------------------------------------------------------------|
| ACC_PUBLIC     | 0x0001 | 标志为 public 类型                                                             |
| ACC_FINAL      | 0x0010 | 标志被声明为 final，只有类可以设置                                                      |
| ACC_SUPER      | 0x0020 | 标志允许使用 invokespecial 字节码指令的新语义，JDK1.0.2 之后编译出来的类的这个标志默认为真。（使用增强的方法调用父类方法） |
| ACC_INTERFACE  | 0x0200 | 标志这是一个接口                                                                  |
| ACC_ABSTRACT   | 0x0400 | 是否为 abstract 类型，对于接口或者抽象类来说，次标志值为真，其他类型为假                                 |
| ACC_SYNTHETIC  | 0x1000 | 标志此类并非由用户代码产生（即：由编译器产生的类，没有源码对应）                                          |
| ACC_ANNOTATION | 0x2000 | 标志这是一个注解                                                                  |
| ACC_ENUM       | 0x4000 | 标志这是一个枚举                                                                  |

类的访问权限通常为 ACC\_开头的常量。

每一种类型的表示都是通过设置访问标记的 32 位中的特定位来实现的。比如，若是 public final 的类，则该标记为 ACC_PUBLIC |
ACC_FINAL。

使用 ACC_SUPER 可以让类更准确地定位到父类的方法 super.method()，现代编译器都会设置并且使用这个标记。

**补充说明：**

1. 带有 ACC_INTERFACE 标志的 class 文件表示的是接口而不是类，反之则表示的是类而不是接口。
    - 如果一个 class 文件被设置了 ACC_INTERFACE 标志，那么同时也得设置 ACC_ABSTRACT 标志。同时它不能再设置
      ACC_FINAL、ACC_SUPER 或 ACC_ENUM 标志。
    - 如果没有设置 ACC_INTERFACE 标志，那么这个 class 文件可以具有上表中除 ACC_ANNOTATION 外的其他所有标志。当然，ACC_FINAL
      和 ACC_ABSTRACT 这类互斥的标志除外。这两个标志不得同时设置。
2. ACC_SUPER 标志用于确定类或接口里面的 invokespecial 指令使用的是哪一种执行语义。**针对 Java
   虚拟机指令集的编译器都应当设置这个标志**。对于 Java SE 8 及后续版本来说，无论 class 文件中这个标志的实际值是什么，也不管
   class 文件的版本号是多少，Java 虚拟机都认为每个 class 文件均设置了 ACC_SUPER 标志。

    - ACC_SUPER 标志是为了向后兼容由旧 Java 编译器所编译的代码而设计的。目前的 ACC_SUPER 标志在由 JDK1.0.2 之前的编译器所生成的
      access_flags 中是没有确定含义的，如果设置了该标志，那么 0racle 的 Java 虚拟机实现会将其忽略。

3. ACC_SYNTHETIC 标志意味着该类或接口是由编译器生成的，而不是由源代码生成的。

4. 注解类型必须设置 ACC_ANNOTATION 标志。如果设置了 ACC_ANNOTATION 标志，那么也必须设置 ACC_INTERFACE 标志。

5. ACC_ENUM 标志表明该类或其父类为枚举类型。

### 类、父类、接口的索引

在访问标记后，会指定该类的类别、父类类别以及实现的接口，格式如下：

| 长度 | 含义                           | 说明                                             |
|----|:-----------------------------|------------------------------------------------|
| u2 | this_class                   | 提供类的全限定名，比如 com/zt/ar/Demo。                    |
| u2 | super_class                  | 提供当前类的父类的全限定名，默认继承的是 java/lang/object 类。       |
| u2 | interfaces_count             | 表示当前类或接口的直接超接口数量。                              |
| u2 | interfaces[interfaces_count] | 指向常量池索引集合，提供接口的全限定名，所表示的接口顺序和对应的源代码中给定的接口顺序一致。 |

这三项数据来确定这个类的继承关系：

- 类索引用于确定这个类的全限定名
- 父类索引用于确定这个类的父类的全限定名。由于 Java 语言不允许多重继承，所以父类索引只有一个，除了 java.1ang.Object 之外，所有的
  Java 类都有父类，因此除了 java.lang.Object 外，所有 Java 类的父类索引都不为 e。
- 接口索引集合就用来描述这个类实现了哪些接口，这些被实现的接口将按 implements 语句（如果这个类本身是一个接口，则应当是
  extends 语句）后的接口顺序从左到右排列在接口索引集合中。

### 字段表集合

**Fields**

用于描述接口或类中声明的变量。字段（field）包括类级变量以及实例级变量，不包括方法内部、代码块内部声明的局部变量。

指向常量池索引集合，描述了每个字段的完整信息。比如**字段的标识符、访问修饰符（public、private 或
protected）、是类变量还是实例变量（static 修饰符）、是否是常量（final 修饰符）**等。

**注意事项：**

- 字段表集合中不会列出从父类或者实现的接口中继承而来的字段，但有可能列出原本 Java
  代码之中不存在的字段。譬如在内部类中为了保持对外部类的访问性，会自动添加指向外部类实例的字段。
- 在 Java 语言中字段是无法重载的，两个字段的数据类型、修饰符不管是否相同，都必须使用不一样的名称，但是对于字节码来讲，如果两个字段的描述符不一致，那字段重名就是合法的。

#### 字段计数器

**fields_count（字段计数器）**

fields_count 的值表示当前 class 文件 fields 表的成员个数。使用两个字节来表示。

#### 字段表

**fields[]（字段表）**

fields 表中每个成员都是一个 field_info 结构，用于表示该类或接口所声明的所有类字段或者实例字段，不包括方法内部声明的变量，也不包括从父类或父接口继承的那些字段。

| 标志名称           | 标志值              | 含义    | 数量               |
|:---------------|:-----------------|:------|:-----------------|
| u2             | access_flags     | 访问标志  | 1                |
| u2             | name_index       | 字段名索引 | 1                |
| u2             | descriptor_index | 描述符索引 | 1                |
| u2             | attributes_count | 属性计数器 | 1                |
| attribute_info | attributes       | 属性集合  | attributes_count |

**访问标识**

作用域修饰符（public、private、protected）、static 修饰符、final 修饰符、volatile 修饰符等。

| 标志名称          | 标志值    | 含义              |
|:--------------|:-------|:----------------|
| ACC_PUBLIC    | 0x0001 | 字段是否为 public    |
| ACC_PRIVATE   | 0x0002 | 字段是否为 private   |
| ACC_PROTECTED | 0x0004 | 字段是否为 protected |
| ACC_STATIC    | 0x0008 | 字段是否为 static    |
| ACC_FINAL     | 0x0010 | 字段是否为 final     |
| ACC_VOLATILE  | 0x0040 | 字段是否为 volatile  |
| ACC_TRANSTENT | 0x0080 | 字段是否为 transient |
| ACC_SYNCHETIC | 0x1000 | 字段是否为由编译器自动产生   |
| ACC_ENUM      | 0x4000 | 字段是否为 enum      |

**描述符索引**

用来描述字段的数据类型、方法的参数列表（包括数量、类型以及顺序）和返回值。

| 标志符 | 含义                                   |
|:----|:-------------------------------------|
| B   | 基本数据类型 byte                          |
| C   | 基本数据类型 char                          |
| D   | 基本数据类型 double                        |
| F   | 基本数据类型 float                         |
| I   | 基本数据类型 int                           |
| J   | 基本数据类型 long                          |
| S   | 基本数据类型 short                         |
| Z   | 基本数据类型 boolean                       |
| V   | 代表 void 类型                           |
| L   | 对象类型，比如：`Ljava/lang/Object;`         |
| [   | 数组类型，代表一维数组。比如：`double[][][] is [[[D |

**属性表集合**

一个字段还可能拥有一些属性，用于存储更多的额外信息。比如初始化值、一些注释信息等。属性个数存放在 attribute_count 中，属性具体内容存放在
attributes 数组中。

```
// 以常量属性为例，结构为：
ConstantValue_attribute{
   u2 attribute_name_index;
   u4 attribute_length;
   u2 constantvalue_index;
   }
```

说明：对于常量属性而言，attribute_length 值恒为 2。

### 方法表集合

**Methods**

用于描述接口或类中声明的方法的签名。

- 在字节码文件中，每一个 method_info 项都对应着一个类或者接口中的方法信息。比如方法的访问修饰符（public、private 或
  protected），方法的返回值类型以及方法的参数信息等。
- 如果这个方法不是抽象的或者不是 native 的，那么字节码中会体现出来。
- 一方面，methods 表只描述当前类或接口中声明的方法，不包括从父类或父接口继承的方法。另一方面，methods
  表有可能会出现由编译器自动添加的方法，最典型的便是编译器产生的方法信息（比如：类（接口）初始化方法`<clinit>()`
  和实例初始化方法`<init>(）`。

**注意事项：**

在 Java 语言中，要重载（Overload）一个方法，除了要与原方法具有相同的简单名称之外，还要求必须拥有一个与原方法不同的特征签名，
特征签名就是一个方法中各个参数在常量池中的字段符号引用的集合，也就是因为返回值不会包含在特征签名之中，
因此 Java 语言里无法仅仅依靠返回值的不同来对一个已有方法进行重载。但在 Class 文件格式中，特征签名的范围更大一些，
只要描述符不是完全一致的两个方法就可以共存。也就是说，如果两个方法有相同的名称和特征签名，但返回值不同，那么也是可以合法共存于同一个
class 文件中。

#### 方法计数器

**methods_count（方法计数器）**

methods_count 的值表示当前 class 文件 methods 表的成员个数。使用两个字节来表示。

methods 表中每个成员都是一个 method_info 结构。

#### 方法表

**methods[]（方法表）**

methods 表中的每个成员都必须是一个 method_info 结构，用于表示当前类或接口中某个方法的完整描述。如果某个 method_info 结构的
access_flags 项既没有设置 ACC_NATIVE 标志也没有设置 ACC_ABSTRACT 标志，那么该结构中也应包含实现这个方法所用的 Java 虚拟机指令。

method_info 结构可以表示类和接口中定义的所有方法，包括实例方法、类方法、实例初始化方法和类或接口初始化方法

方法表的结构实际跟字段表是一样的，方法表结构如下：

| 标志名称           | 标志值              | 含义    | 数量               |
|:---------------|:-----------------|:------|:-----------------|
| u2             | access_flags     | 访问标志  | 1                |
| u2             | name_index       | 方法名索引 | 1                |
| u2             | descriptor_index | 描述符索引 | 1                |
| u2             | attributes_count | 属性计数器 | 1                |
| attribute_info | attributes       | 属性集合  | attributes_count |

**方法表访问标志**

跟字段表一样，方法表也有访问标志，而且他们的标志有部分相同，部分则不同，方法表的具体访问标志如下：

| 标志名称          | 标志值    | 含义                     |
|:--------------|:-------|:-----------------------|
| ACC_PUBLIC    | 0x0001 | public，方法可以从包外访问       |
| ACC_PRIVATE   | 0x0002 | private，方法只能本类访问       |
| ACC_PROTECTED | 0x0004 | protected，方法在自身和子类可以访问 |
| ACC_STATIC    | 0x0008 | static，静态方法            |

### 属性表集合

**Attributes**

指的是 class 文件所携带的辅助信息，用于描述接口或类中声明的方法的签名。比如该 class 文件的源文件的名称。以及任何带有
RetentionPolicy.CLASS 或者 RetentionPolicy.RUNTIME 的注解。

#### 属性计数器

**attributes_count（属性计数器）**

attributes_count 的值表示当前 class 文件属性表的成员个数。属性表中每一项都是一个 attribute_info 结构。

#### 属性表

**attributes[]（属性表）**

属性表的每个项的值必须是 attribute_info 结构。属性表的结构比较灵活，各种不同的属性只要满足以下结构即可。

**属性的通用格式**

| 类型 | 名称                   | 数量               | 含义    |
|:---|:---------------------|:-----------------|:------|
| u2 | attribute_name_index | 1                | 属性名索引 |
| u4 | attribute_length     | 1                | 属性长度  |
| u1 | info                 | attribute_length | 属性表   |

**属性类型**

属性表实际上可以有很多类型，上面看到的 Code 属性只是其中一种，Java8 里面定义了 23 种属性。下面这些是虚拟机中预定义的属性：

| 属性名称                                | 使用位置      | 含义                                                 |
|:------------------------------------|:----------|:---------------------------------------------------|
| Code                                | 方法表       | Java 代码编译成的字节码指令                                   |
| ConstantValue                       | 字段表       | final 关键字定义的常量池                                    |
| Deprecated                          | 类，方法，字段表  | 被声明为 deprecated 的方法和字段                             |
| Exceptions                          | 方法表       | 方法抛出的异常                                            |
| EnclosingMethod                     | 类文件       | 仅当一个类为局部类或者匿名类时才能拥有这个属性，这个属性用于标识这个类所在的外围方法         |
| InnerClass                          | 类文件       | 内部类列表                                              |
| LineNumberTable                     | Code 属性   | Java 源码的行号与字节码指令的对应关系                              |
| LocalVariableTable                  | Code 属性   | 方法的局部变量描述                                          |
| StackMapTable                       | Code 属性   | JDK1.6 中新增的属性，供新的类型检查检验器和处理目标方法的局部变量和操作数有所需要的类是否匹配 |
| Signature                           | 类，方法表，字段表 | 用于支持泛型情况下的方法签名                                     |
| SourceFile                          | 类文件       | 记录源文件名称                                            |
| SourceDebugExtension                | 类文件       | 用于存储额外的调试信息                                        |
| Synthetic                           | 类，方法表，字段表 | 标志方法或字段为编译器自动生成的                                   |
| LocalVariableTypeTable              | 类         | 是哟很难过特征签名代替描述符，是为了引入泛型语法之后能描述泛型参数化类型而添加            |
| RuntimeVisibleAnnotations           | 类，方法表，字段表 | 为动态注解提供支持                                          |
| RuntimeInvisibleAnnotations         | 类，方法表，字段表 | 用于指明哪些注解是运行时不可见的                                   |
| RuntimeVisibleParameterAnnotation   | 方法表       | 作用与 RuntimeVisibleAnnotations 属性类似，只不过作用对象或方法      |
| RuntimeInvisibleParameterAnnotation | 方法表       | 作用与 RuntimeInvisibleAnnotations 属性类似，只不过作用对象或方法    |
| AnnotationDefault                   | 方法表       | 用于记录注解类元素的默认值                                      |
| BootstrapMethods                    | 类文件       | 用于保存 invokeddynamic 指令引用的引导方法限定符                   |

## 指令

### 加载与储存指令

### 算数指令

### 类型转换指令

### 对象的创建与访问指令

### 方法调用与返回指令

### 操作数栈管理指令

### 控制转移指令

### 异常处理指令

### 同步控制指令
