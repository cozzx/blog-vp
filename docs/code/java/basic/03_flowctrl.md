# Java 流程控制

## 1 结构

流程控制语句是用来控制程序中各**语句执行顺序**的语句，可以把语句组合成能**完成一定功能**的小逻辑模块。

程序设计中规定的**三种**流程结构，即：

- **顺序结构**
  - 程序从上到下逐行地执行，中间没有任何判断和跳转。
- **分支结构**
  - 根据条件，选择性地执行某段代码。
  - 有`if…else`和`switch-case`两种分支语句。
- **循环结构**
  - 根据循环条件，重复性的执行某段代码。
  - 有`for`、`while`、`do-while`三种循环语句。
  - 补充：JDK5.0 提供了`foreach`循环，方便的遍历集合、数组元素。

## 2 分支语句

### 2.1 if-else

**基本语法：**

```
格式：
if (条件表达式)｛
   语句块;
}

if (条件表达式) { 
   语句块1;
} else {
   语句块2;
}

if (条件表达式1) {
   语句块1;
} else if (条件表达式2) {
   语句块2;
} else if (条件表达式n) {
   语句块n;
} else {
   语句块n+1;
}
```

![overview_3.2_1](images/overview_3.2_1.png)

> 当条件表达式之间是“互斥”关系时（即彼此没有交集），条件判断语句及执行语句间顺序无所谓。
>
> 当条件表达式之间是“包含”关系时，“小上大下 / 子上父下”，否则范围小的条件表达式将不可能被执行。

### 2.2 switch-case

**基本语法:**

```
switch(表达式){
    case 常量值1:
        语句块1;
        //break;
    case 常量值2:
        语句块2;
        //break; 
    // ...
   [default:
        语句块n+1;
        break;
   ]
}
```

![overview_3.2_2](images/overview_3.2_2.png)

**执行过程：**

第1步：根据 switch 中表达式的值，依次匹配各个 case。如果表达式的值等于某个 case 中的常量值，则执行对应 case 中的执行语句。

第2步：执行完此 case 的执行语句以后，如果遇到 break，则执行break并跳出当前的 switch-case 结构；如果没有遇到 break，则会继续执行当前 case 之后的其它 case 中的执行语句（case穿透）直到遇到 break 关键字或执行完所有的 case 及 default 的执行语句，跳出当前的switch-case结构

**使用注意点：**

- switch(表达式)中表达式的值必须是下述几种类型之一：byte，short，char，int，枚举 (jdk 5.0)，String (jdk 7.0)；

- case子句中的值必须是常量，不能是变量名或不确定的表达式值或范围；

- 同一个switch语句，所有case子句中的常量值互不相同；

- break语句用来在执行完一个case分支后使程序跳出switch语句块；

  如果没有break，程序会顺序执行到switch结尾；

- default子句是可选的。同时，位置也是灵活的。当没有匹配的case时，执行default语句。

### 2.3 if-else与switch-case比较

- 结论：凡是使用 switch-case 的结构都可以转换为 if-else 结构。反之，不成立。
- 开发经验：如果既可以使用 switch-case，又可以使用 if-else，建议使用 switch-case。因为效率稍高。
- 细节对比：
  - if-else 语句优势
    - if语句的条件是一个布尔类型值，if条件表达式为true则进入分支，可以用于范围的判断，也可以用于等值的判断，**使用范围更广**。
    - switch语句的条件是一个常量值（byte,short,int,char,枚举,String），只能判断某个变量或表达式的结果是否等于某个常量值，**使用场景较狭窄**。
  - switch语句优势
    - 当条件是判断某个变量或表达式是否等于某个固定的常量值时，使用if和switch都可以，习惯上使用switch更多。因为**效率稍高**。当条件是区间范围的判断时，只能使用if语句。
    - 使用switch可以利用**穿透性**，同时执行多个分支，而if...else没有穿透性。

## 3 循环语句

### 3.1 for

**基本语法：**

```
for (①初始化部分; ②循环条件部分; ④迭代部分)｛
    ③循环体部分;
｝
```

**执行过程：**

①-②-③-④-②-③-④-②-③-④-.....-②

![overview_3.3_1](images/overview_3.3_1.png)

**说明：**

- for(;;)中的两个；不能多也不能少
- ①初始化部分可以声明多个变量，但必须是同一个类型，用逗号分隔
- ②循环条件部分为boolean类型表达式，当值为false时，退出循环
- ④可以有多个变量更新，用逗号分隔

### 3.2 while

**基本语法：**

```
①初始化部分
while(②循环条件部分)｛
    ③循环体部分;
    ④迭代部分;
}
```

**执行过程：**①-②-③-④-②-③-④-②-③-④-...-②

![overview_3.3_2](images/overview_3.3_2.png)

**说明：**

- while(循环条件)中循环条件必须是boolean类型。
- 注意不要忘记声明④迭代部分。否则，循环将不能结束，变成死循环。
- for循环和while循环可以相互转换。二者没有性能上的差别。实际开发中，根据具体结构的情况，选择哪个格式更合适、美观。
- for循环与while循环的区别：初始化条件部分的作用域不同。

### 3.3 do-while

**基本语法：**

```
①初始化部分;
do{
 ③循环体部分
 ④迭代部分
}while(②循环条件部分); 
```

**执行过程：**

①-③-④-②-③-④-②-③-④-...-②

![overview_3.3_3](images/overview_3.3_3.png)

**说明：**

- 结尾while(循环条件)中循环条件必须是boolean类型
- do{}while();最后有一个分号
- do-while结构的循环体语句是至少会执行一次，这个和for和while是不一样的
- 循环的三个结构for、while、do-while三者是可以相互转换的。

### 3.4 对比三种循环结构

**三种循环结构都具有四个要素：**

- 循环变量的初始化条件
- 循环条件
- 循环体语句块
- 循环变量的修改的迭代表达式

**从循环次数角度分析**

- do-while 循环至少执行一次循环体语句。
- for 和 while 循环先判断循环条件语句是否成立，然后决定是否执行循环体。

**如何选择**

- 遍历有明显的循环次数（范围）的需求，选择for循环
- 遍历没有明显的循环次数（范围）的需求，选择while循环
- 如果循环体语句块至少执行一次，可以考虑使用do-while循环
- 本质上：三种循环之间完全可以互相转换，都能实现循环的功能

### 3.5 无限循环

**基本语法：**

- 最简单"无限"循环格式：`while(true)` , `for(;;)`

**适用场景：**

- 开发中，有时并不确定需要循环多少次，需要根据循环体内部某些条件，来控制循环的结束（使用break）。
- 如果此循环结构不能终止，则构成了死循环！开发中要避免出现死循环。

### 3.6 嵌套循环（或多重循环）

**使用说明：**

- 嵌套循环是指一个循环结构A的循环体是另一个循环结构B。比如，for循环里面还有一个for循环，就是嵌套循环。其中，for ,while ,do-while均可以作为外层循环或内层循环。
  - 外层循环：循环结构A
  - 内层循环：循环结构B
- 实质上，嵌套循环就是把内层循环当成外层循环的循环体。只有当内层循环的循环条件为false时，才会完全跳出内层循环，才可结束外层的当次循环，开始下一次的外层循环。
- 设外层循环次数为`m`次，内层为`n`次，则内层循环体实际上需要执行`m*n`次。
- 从二维图形的角度看，外层循环控制**行数**，内层循环控制**列数**。
- 实际开发中，我们最多见到的嵌套循环是两层。一般不会出现超过三层的嵌套循环。如果将要出现，一定要停下来重新梳理业务逻辑，重新思考算法的实现，控制在三层以内。否则，可读性会很差。

例如：两个for嵌套循环格式

```
for(初始化语句①; 循环条件语句②; 迭代语句⑦) {
    for(初始化语句③; 循环条件语句④; 迭代语句⑥) {
       循环体语句⑤;
    }
}

//执行过程：①-②-③-④-⑤-⑥-④-⑤-⑥-...-④-⑦-②-③-④-⑤-⑥-④...
```

**执行特点：**

外层循环执行一次，内层循环执行一轮。

## 4. break和continue

**说明：**

|          | 适用范围              | 不同点                               | 相同点                     |
| -------- | --------------------- | ------------------------------------ | -------------------------- |
| break    | switch-case、循环结构 | 一旦执行，就结束(或跳出)当前循环结构 | 此关键字的后面不能声明语句 |
| continue | 循环结构              | 一旦执行，就结束(或跳出)当次循环结构 | 此关键字的后面不能声明语句 |

此外，很多语言都有goto语句，goto语句可以随意将控制转移到程序中的任意一条语句上，然后执行它，但使程序容易出错。Java中的break和continue是不同于goto的。

**带标签的使用：**

```
break语句用于终止某个语句块的执行
{    ……  
 break;
  ……
}

break语句出现在多层嵌套的语句块中时，可以通过标签指明要终止的是哪一层语句块 
label1: {   ……        
    label2: {   ……
        label3: {   ……
            break label2;
        }
    }
} 
```

- continue语句出现在多层嵌套的循环语句体中时，也可以通过标签指明要跳过的是哪一层循环。
- 标号语句必须紧接在循环的头部。标号语句不能用在非循环语句的前面。
- 举例：

```java
class BreakContinueTest2 {
    public static void main(String[] args) {
        l:for (int i = 1;i <= 4;i++) {
            for (int j = 1;j <= 10;j++) {
                if (j % 4 == 0) {
                    // break l;
                    continue l;
                }
                System.out.print(j);
            }
        System.out.println();
        }
    }
}
```

## 5 Scanner

使用Scanner类从键盘获取不同类型（基本数据类型、String类型）的变量。

键盘输入代码的四个步骤：

1. 导包：`import java.util.Scanner;`
2. 创建Scanner类型的对象：`Scanner scan = new Scanner(System.in);`
3. 调用Scanner类的相关方法（`next() / nextXxx()`），来获取指定类型的变量
4. 释放资源：`scan.close();`

注意：需要根据相应的方法，来输入指定类型的值。如果输入的数据类型与要求的类型不匹配时，会报异常 导致程序终止。

## 6 如何获取一个随机数

如何产生一个指定范围的随机整数？

1. Math 类的 random() 的调用，会返回一个 `[0,1)` 范围的一个 double 型值
2. 例子
    - `Math.random() * 100`  --->  [0,100)
    - `(int)(Math.random()* 100)` ---> [0,99]
    - `(int)(Math.random() * 100) + 5`  ----> [5,104]
3. 如何获取`[a,b]`范围内的随机整数呢？`(int)(Math.random() * (b - a + 1)) + a`
