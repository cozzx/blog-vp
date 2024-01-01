---
title: 字符串处理
description: 常用语言的字符串处理方法。
date: 2023-07-29
tags:
  - 编程语言
  - 字符串
---

### 字符串拼接

#### Python

1. 使用 `+` 运算符拼接字符串 示例：

```python
name = 'A'
robot_name ='B'
print('你好，'+name+'，我是'+robot_name)
```

2. 可以通过{}表示变量，然后通过format函数传入要填入的变量，多个用逗号隔开

```python
name = 'A'
robot_name ='B'
print('你好，{}，我是{}'.format(name,robot_name))
```

3. 可以在字符串前加f，然后再字符串中用{变量名}自动拼接内容

```python
name = 'A'
robot_name ='B'
print(f'你好，{name}，我是{robot_name}')
```

4. 使用%s，然后%（变量名）的方式获取，多个用逗号隔开

```python
name = 'A'
robot_name ='B'
print('你好，%s，我是%s'%(name,robot_name))
```

#### Go

1. 使用 `+` 运算符拼接字符串 示例：

```go
str1 := "Hello"
str2 := "World"
result := str1 + ", " + str2 + "!"
```

2. 使用`fmt.Sprintf()`函数拼接字符串 示例：

```go
str1 := "Hello"
str2 := "World"
result := fmt.Sprintf("%s, %s!", str1, str2)
```

3. 使用`strings.Join()`函数拼接字符串数组 示例：

```go
strArr := []string{"Hello", "World", "!"}
result := strings.Join(strArr, ", ")
```

4. 使用`strings.builder`函数拼接字符串 示例：

```go
var builder strings.Builder
builder.WriteString("asong")
builder.String()
```

4. 使用`bytes.Buffer`函数拼接字符串 示例：

```go
buf := new(bytes.Buffer)
buf.WriteString("asong")
buf.String()
```

#### Rust

1. 使用 `+` 运算符拼接字符串 示例：

```rust
let str1 = "Hello";
let str2 = "World";
let result = str1.to_owned() + ", " + str2 + "!";
```

2. 使用 `format!` 宏拼接字符串 示例：

```rust
let str1 = "Hello";
let str2 = "World";
let result = format!("{}, {}!", str1, str2);
```

3. 使用 `String::push_str` 方法拼接字符串 示例：

```rust
let str1 = "Hello";
let str2 = "World";
let mut result = String::new();
result.push_str(str1);
result.push_str(", ");
result.push_str(str2);
result.push('!');
```

4. 使用 `String::push` 方法逐个字符地拼接字符串 示例：

```rust
let str1 = "Hello";
let str2 = "World";
let mut result = String::new();
result.push_str(str1);
result.push(',');
result.push(' ');
result.push_str(str2);
result.push('!');
```

#### Java

1. 使用 `+` 运算符拼接字符串 示例：

```java
String str1 = "Hello";
String str2 = "World";
String result = str1 + ", " + str2 + "!";
```

2. 使用 `String.format()` 方法拼接字符串 示例：

```java
String str1 = "Hello";
String str2 = "World";
String result = String.format("%s, %s!", str1, str2);
```

3. 使用 `StringBuilder` 或 `StringBuffer` 类拼接字符串 示例：

```java
String str1 = "Hello";
String str2 = "World";
StringBuilder builder = new StringBuilder();
builder.append(str1);
builder.append(", ");
builder.append(str2);
builder.append("!");
String result = builder.toString();
```

4. 使用 `String.join()` 方法拼接字符串数组 示例：

```java
String[] strArr = {"Hello", "World", "!"};
String result = String.join(", ", strArr);
```

#### PHP

1. 使用`.`运算符拼接字符串 示例：

```php
$str1 = "Hello";
$str2 = "World";
$result = $str1 . ", " . $str2 . "!";
```

2. 使用字符串模板拼接 示例：

```php
$str1 = "Hello";
$str2 = "World";
$result = "$str1, $str2!";
```

3. 使用sprintf()函数拼接字符串 示例：

```php
$str1 = "Hello";
$str2 = "World";
$result = sprintf("%s, %s!", $str1, $str2);
```

4. 使用join()函数拼接字符串数组 示例：

```php
$strArr = array("Hello", "World", "!");
$result = join(", ", $strArr);
```

#### JS

1. 使用 `+` 运算符拼接字符串 示例：

```js
const str1 = "Hello";
const str2 = "World";
const result = str1 + ", " + str2 + "!";
```

2. 使用模板字符串拼接 示例：

```js
const str1 = "Hello";
const str2 = "World";
const result = `${str1}, ${str2}!`;
```

3. 使用 `Array.join()` 方法拼接字符串数组 示例：

```js
const strArr = ["Hello", "World", "!"];
const result = strArr.join(", ");
```

4. 使用 `String.concat()` 方法拼接字符串 示例：

```js
const str1 = "Hello";
const str2 = "World";
const result = str1.concat(", ", str2, "!");
```

#### TS

1. 使用 `+` 运算符拼接字符串 示例：

```typescript
const str1: string = "Hello";
const str2: string = "World";
const result: string = str1 + ", " + str2 + "!";
```

2. 使用模板字符串拼接 示例：

```typescript
const str1: string = "Hello";
const str2: string = "World";
const result: string = `${str1}, ${str2}!`;
```

3. 使用 `Array.join()` 方法拼接字符串数组 示例：

```typescript
const strArr: string[] = ["Hello", "World", "!"];
const result: string = strArr.join(", ");
```

4. 使用 `String.concat()` 方法拼接字符串 示例：

```typescript
const str1: string = "Hello";
const str2: string = "World";
const result: string = str1.concat(", ", str2, "!");
```

###
