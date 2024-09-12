---
title: 字符串和字节数组
description: Java 字符串和字节数组的转换
date: 2023-07-29
tags:
  - java string byte[]

---

## Java 字符串和字节数组的转换

在Java中，将一个`byte[]`数组转换为字符串，有多种方法。`new String()`和`Arrays.toString()`是两种常见的方法，但它们在功能和用途上有所不同。以下是这两种方法的区别：

### `new String(byte[] bytes)`

- **用途**：将字节数组直接转换为字符串。
- **功能**：这种方法会根据字节数组的内容创建一个字符串。它支持Unicode字符集，可以正确地处理UTF-8编码的字节数组。
- **适用场景**：当您知道字节数组包含有效的字符串数据时，使用`new String(byte[] bytes)`来创建字符串。
- **注意**：这种方法在处理非UTF-8编码的字节数组时可能不安全，因为它会尝试将其解码为字符串。

### `Arrays.toString(byte[] bytes)`

- **用途**：将字节数组转换为字符串表示形式，通常用于调试和日志记录。
- **功能**：`Arrays.toString()`方法返回一个表示数组内容的字符串，它不会尝试解码字节数组为字符串。
- **适用场景**：当您需要将字节数组转换为一个可读的字符串表示，但不打算将它们解码为实际的字符串时，使用`Arrays.toString()`。
- **注意**：`Arrays.toString()`返回的字符串可能不是可打印的字符，因为它将字节数组中的每个字节转换为十六进制字符串。

### 示例

```
public class Main {
    public static void main(String[] args) {
        byte[] bytes = {97, 98, 99}; // 对应字符串 "abc"

        String str1 = new String(bytes); // 创建字符串 "abc"
        String str2 = Arrays.toString(bytes); // 创建字符串 "[97, 98, 99]"

        System.out.println(str1);
        System.out.println(str2);
    }
}
```

### 结论

`new String(byte[] bytes)`适合将字节数组转换为实际的字符串，而`Arrays.toString(byte[] bytes)`适合将字节数组转换为可读的字符串表示，通常用于调试和日志记录。根据您的具体需求选择合适的方法。