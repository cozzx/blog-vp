# Java 变量

## 1 关键字

- 定义：**被Java语言赋予了特殊含义，用做专门用途的字符串（或单词）**
  - HelloWorld 案例中，出现的关键字有 `class`、`public`、`static`、`void` 等，这些单词已经被 Java 定义好了。
- 特点：全部关键字都是 **小写字母**。
- 官方地址： <https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html>

<img src="./images/overview_2.1_1.png" alt="overview_2.1_1" style="zoom:50%;" />

> 说明：
>
>  1. 关键字一共 50个，其中 `const` 和 `goto` 是保留字 (reserved word)。
>  2. `true`，`false`，`null` 不在其中，它们看起来像关键字，其实是字面量，表示特殊的布尔值和空值。

<img src="./images/overview_2.1_2.png" alt="overview_2.1_2" style="zoom:50%;" />

<img src="./images/overview_2.1_3.png" alt="overview_2.1_3" style="zoom:50%;" />

## 2 标识符

Java 中变量、方法、类等要素命名时使用的字符序列，称为标识符。

技巧：凡是自己可以起名字的地方都叫标识符。

标识符的命名规则（必须遵守的 **硬性规定**）：

- 由26个英文字母大小写，0-9 ，_或 $ 组成
- 数字不可以开头
- 不可以使用关键字和保留字，但能包含关键字和保留字
- Java中严格区分大小写，长度无限制
- 标识符不能包含空格

标识符的命名规范（建议遵守的 **软性要求**，否则工作时容易被鄙视）:

- 包名：多单词组成时所有字母都小写：xxxyyyzzz。
  例如：java.lang、com.hg.bean

- 类名、接口名：多单词组成时，所有单词的首字母大写：XxxYyyZzz
  例如：HelloWorld，String，System 等

- 变量名、方法名：多单词组成时，第一个单词首字母小写，第二个单词开始每个单词首字母大写：xxxYyyZzz
  例如：age, name, bookName, main, binarySearch, getName

- 常量名：所有字母都大写。多单词时每个单词用下划线连接：XXX_YYY_ZZZ
  例如：MAX_VALUE, PI,DEFAULT_CAPACITY

注意：在起名字时，为了提高阅读性，要尽量有意义，“见名知意”。

## 3 变量

- 内存中的一个存储区域，该区域的数据可以在同一类型范围内不断变化

- 变量的构成包含三个要素：**数据类型**、**变量名**、**存储的值**

- Java中 变量声明的格式：数据类型 变量名 = 变量值

- 变量的作用：用于在内存中保存数据。

- 使用变量注意：

  - Java中每个变量必须先声明，后使用。
  - 使用变量名来访问这块区域的数据。
  - 变量的作用域：其定义所在的一对{ }内。
  - 变量只有在其**作用域**内才有效。出了作用域，变量不可以再被调用。
  - 同一个作用域内，不能定义重名的变量。

## 4 数据类型

Java 中变量的数据类型分为两大类：

- **基本数据类型**：包括 整数类型、浮点数类型、字符类型、布尔类型。

- **引用数据类型**：包括 数组、类、接口、枚举、注解、记录。

  <img src="./images/overview_2.4_1.png" alt="overview_2.4_1" style="zoom:50%;" />

### 4.1 整数类型

byte、short、int、long

- Java 各整数类型有固定的表数范围和字段长度，不受具体操作系统的影响，以保证 Java 程序的可移植性。

<img src="./images/overview_2.4_2.png" alt="overview_2.4_2" style="zoom: 50%;" />

- 定义 long 类型的变量，赋值时需要以"`l`"或"`L`"作为后缀。

- Java 程序中变量通常声明为 int 型，除非不足以表示较大的数，才使用 long。

- Java 的整型常量默认为 int 型。

### 4.2 浮点类型

float、double

- 与整数类型类似，Java 浮点类型也有固定的表数范围和字段长度，不受具体操作系统的影响。

<img src="./images/overview_2.4_3.png" alt="overview_2.4_3" style="zoom: 50%;" />

- 浮点型常量有两种表示形式：
  - 十进制数形式。如：5.12       512.0f        .512   (必须有小数点）
  - 科学计数法形式。如：5.12e2      512E2     100E-2
- float：单精度，尾数可以精确到 7 位有效数字。很多情况下，精度很难满足需求。
- double：双精度，精度是 float 的两倍。通常采用此类型。
- 定义 float 类型的变量，赋值时需要以"`f`"或"`F`"作为后缀。
- Java 的浮点型常量默认为 double 型。

**关于浮点型精度的说明：**

- 并不是所有的小数都能可以精确的用二进制浮点数表示。二进制浮点数不能精确的表示0.1、0.01、0.001这样10的负次幂。
- 浮点类型 float、double 的数据不适合在 **不容许舍入误差** 的金融计算领域。如果需要**精确**数字计算或保留指定位数的精度，需要使用 `BigDecimal类`。

### 4.3 字符类型

char

- char 型数据用来表示通常意义上“字符”（占2字节）

- Java 中的所有字符都使用 Unicode 编码，故一个字符可以存储一个字母，一个汉字，或其他书面语的一个字符。

- 字符型变量的三种表现形式：

  - **形式1：**使用单引号(' ')括起来的单个字符。

    例如：char c1 = 'a';   char c2 = '中'; char c3 =  '9';

  - **形式2：**直接使用 Unicode值 来表示字符型常量：‘`\uXXXX`’。其中，XXXX代表一个十六进制整数。

    例如：\u0023 表示 '#'。

  - **形式3：**Java中还允许使用转义字符‘\’来将其后的字符转变为特殊字符型常量。

    例如：char c3 = '\n';  // '\n'表示换行符

  | 转义字符 |  说明  | Unicode表示方式 |
  | :------: | :----: | :-------------: |
  |   `\n`   | 换行符 |     \u000a      |
  |   `\t`   | 制表符 |     \u0009      |
  |   `\"`   | 双引号 |     \u0022      |
  |   `\'`   | 单引号 |     \u0027      |
  |   `\\`   | 反斜线 |     \u005c      |
  |   `\b`   | 退格符 |     \u0008      |
  |   `\r`   | 回车符 |     \u000d      |

- char 类型是可以进行运算的。因为它都对应有 Unicode 码，可以看做是一个数值。

### 4.4 布尔类型

boolean

- boolean 类型用来判断逻辑条件，一般用于流程控制语句中：
  - if 条件控制语句；
  - while 循环控制语句；
  - for 循环控制语句；
  - do-while 循环控制语句；
- **boolean 类型数据只有两个值：true、false，无其它。**
  - 不可以使用 0 或非 0 的整数替代 false 和 true，这点和 C 语言不同。
  - 拓展：Java 虚拟机中没有任何供 boolean 值专用的字节码指令，Java 语言表达所操作的 boolean 值，在编译之后都使用 java 虚拟机中的 int 数据类型来代替：true 用 1 表示，false 用 0 表示。——《java虚拟机规范 8版》

## 5 基本数据类型变量间运算规则

在 Java 程序中，不同的基本数据类型（只有7种，不包含 boolean 类型）变量的值经常需要进行相互转换。

转换的方式有两种：自动类型提升 和 强制类型转换。

### 5.1 自动类型提升

**规则：将取值范围小（或容量小）的类型自动提升为取值范围大（或容量大）的类型 。**

<img src="./images/overview_2.5_1.png" alt="overview_2.5_1" style="zoom:50%;" />

1. 当把存储范围小的值（常量值、变量的值、表达式计算的结果值）赋值给了存储范围大的变量时

```java
int i = 'A'; // char 自动升级为 int，其实就是把字符的编码值赋值给i变量了
double d = 10; // int 自动升级为 double
long num = 1234567; // 右边的整数常量值如果在 int 范围呢，编译和运行都可以通过，这里涉及到数据类型转换

// byte bigB = 130; // 错误，右边的整数常量值超过 byte 范围
long bigNum = 12345678912L; // 右边的整数常量值如果超过 int 范围，必须加 L，显式表示 long 类型。否则编译不通过
```

2. 当存储范围小的数据类型与存储范围大的数据类型变量一起混合运算时，会按照其中最大的类型运算。

```java
int i = 1;
byte b = 1;
double d = 1.0;

double sum = i + b + d; // 混合运算，升级为double
```

3. 当 byte, short, char 数据类型的变量进行算术运算时，按照int类型处理。

```java
byte b1 = 1;
byte b2 = 2;
byte b3 = b1 + b2; // 编译报错，b1 + b2 自动升级为 int

char c1 = '0';
char c2 = 'A';
int i = c1 + c2; // 至少需要使用int类型来接收
System.out.println(c1 + c2); // 113 
```

### 5.2 强制类型转换

将 `3.14` 赋值到 `int` 类型变量会发生什么？产生编译失败，肯定无法赋值。

```java
int i = 3.14; // 编译报错
```

想要赋值成功，只有通过强制类型转换，将`double` 类型强制转换成`int` 类型才能赋值。

**规则：将取值范围大（或容量大）的类型强制转换成取值范围小（或容量小）的类型。**

> 自动类型提升是 Java 自动执行的，而强制类型转换是自动类型提升的逆运算，需要我们自己手动执行。

**转换格式：**

```java
数据类型1 变量名 = (数据类型1)被强转数据值;  // ()中的数据类型必须 <= 变量值的数据类型
```

1. 当把存储范围大的值（常量值、变量的值、表达式计算的结果值）强制转换为存储范围小的变量时，可能会 **损失精度** 或 **溢出**。

```java
int i = (int)3.14; //损失精度

double d = 1.2;
int num = (int)d; //损失精度

int i = 200;
byte b = (byte)i; //溢出
```

2. 当某个值想要提升数据类型时，也可以使用强制类型转换。这种情况的强制类型转换是 **没有风险** 的，通常省略。

```java
int i = 1;
int j = 2;
double bigger = (double)(i/j);
```

（3）声明 long 类型变量时，可以出现省略后缀的情况。float 则不同。

```java
long l1 = 123L;
long l2 = 123; // 此时可以看做是 int 类型的 123 自动类型提升为 long 类型

//long l3 = 123123123123; // 报错，因为 123123123123 超出了 int 的范围。
long l4 = 123123123123L;

//float f1 = 12.3; // 报错，因为 12.3 看做是 double，不能自动转换为 float 类型
float f2 = 12.3F;
float f3 = (float)12.3;
```

### 5.3 基本数据类型与 String 的运算

**String 类型：**

- String 不是基本数据类型，属于引用数据类型
- 使用一对`""`来表示一个字符串，内部可以包含0个、1个或多个字符。
- 声明方式与基本数据类型类似。例如：String str = “Hello Java”;

**运算规则：**

1. 任意八种基本数据类型的数据与 String 类型只能进行连接“+”运算，且结果一定也是 String 类型

```java
System.out.println("" + 1 + 2); // 12

int num = 10;
boolean b1 = true;
String s1 = "abc";

String s2 = s1 + num + b1;
System.out.println(s2); // abc10true

//String s3 = num + b1 + s1; // 编译不通过，因为int类型不能与boolean运算
String s4 = num + (b1 + s1); // 编译通过
```

2. String 类型不能通过强制类型()转换，转为其他的类型

```java
String str = "123";
int num = (int)str; // 错误的
int num = Integer.parseInt(str); // 正确的，借助包装类的方法才能转
```

**练习：**

```java
//String str1 = 4; // 错误
String str2 = 3.5f + "";
System.out.println(str2);
System.out.println(3 + 4 + "Hello!");
System.out.println("Hello!" + 3 + 4);
System.out.println('a' + 1 + "Hello!");
System.out.println("Hello" + 'a' + 1);
// 3.5
// 7Hello!
// Hello!34
// 98Hello!
// Helloa1
```
