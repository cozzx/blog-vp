# 文件和异常

在Python中实现文件的读写操作其实非常简单，通过Python内置的`open`函数，我们可以指定文件名、操作模式、编码信息等来获得操作文件的对象，接下来就可以对文件进行读写操作了。这里所说的操作模式是指要打开什么样的文件（字符文件还是二进制文件）以及做什么样的操作（读、写还是追加），具体的如下表所示：

| 操作模式 | 具体含义                         |
| -------- | -------------------------------- |
| `'r'`    | 读取 （默认）                    |
| `'w'`    | 写入（覆写），文件不存在创建     |
| `'x'`    | 写入，文件存在报错               |
| `'a'`    | 写入（追加），文件不存在创建     |
| `'b'`    | 二进制模式                       |
| `'t'`    | 文本模式（默认）                 |
| `'r+'`   | 可读可写（覆写），文件不存在报错 |
| `'w+'`   | 可读可写（覆写），文件不存在创建 |
| `'r+'`   | 可读可写（追加），文件不存在创建 |

## 读写文本文件

使用`try except`来捕获可能出现的异常状况

使用`finally`代码块来关闭打开的文件，释放掉程序中获取的外部资源，由于`finally`块的代码不论程序正常还是异常都会执行到（甚至是调用了`sys`模块的`exit`函数退出Python环境，`finally`块都会被执行，因为`exit`函数实质上是引发了`SystemExit`异常），因此我们通常把`finally`块称为“总是执行代码块”。

如果不愿意在`finally`代码块中关闭文件对象释放资源，也可以使用上下文语法，通过`with`关键字指定文件对象的上下文环境并在离开上下文环境时自动释放文件资源。

```python
def main():
    f = None
    try:
        f = open('test.txt', 'r', encoding='utf-8')
        print(f.read())
    except FileNotFoundError:
        print('无法打开指定的文件!')
    except LookupError:
        print('指定了未知的编码!')
    except UnicodeDecodeError:
        print('读取文件时解码错误!')
    finally:
        if f:
            f.close()
            
    try:
        with open('test.txt', 'a', encoding='utf-8') as f:
           f.write('aaa')
    except FileNotFoundError:
        print('无法打开指定的文件!')
    except LookupError:
        print('指定了未知的编码!')
    except UnicodeDecodeError:
        print('读取文件时解码错误!')

if __name__ == '__main__':
    main()
```

## 读写二进制文件

```python
def main():
    try:
        with open('guido.jpg', 'rb') as fs1:
            data = fs1.read()
            print(type(data))  # <class 'bytes'>
        with open('吉多.jpg', 'wb') as fs2:
            fs2.write(data)
    except FileNotFoundError as e:
        print('指定的文件无法打开.')
    except IOError as e:
        print('读写文件时出现错误.')
    print('程序执行结束.')


if __name__ == '__main__':
    main()
```

## 读写JSON文件

把一个列表或者一个字典中的数据保存到文件中使用json格式

json模块主要有四个比较重要的函数，分别是：

- `dump` - 将Python对象按照JSON格式序列化到文件中
- `dumps` - 将Python对象处理成JSON格式的字符串
- `load` - 将文件中的JSON数据反序列化成对象
- `loads` - 将字符串的内容反序列化成Python对象

```python
import json

def main():
    mydict = {
        'name': 'cozz',
        'age': 35,
        'marred': True,
        'friends': ['tom', 'lily'],
        'cars': [
            {'brand': 'BYD', 'max_speed': 180},
            {'brand': 'Audi', 'max_speed': 280},
            {'brand': 'Benz', 'max_speed': 320}
        ]
    }
    print(json.dumps(mydict))
    try:
        with open('data.json', 'w', encoding='utf-8') as fs:
            json.dump(mydict, fs)
    except IOError as e:
        print(e)
    print('保存数据完成!')


if __name__ == '__main__':
    main()
```

```python
import json

def main():
    
    print(json.loads('data.json'))
    try:
        with open('data.json', 'r', encoding='utf-8') as fs:
            print(json.loads(fs.read()))
            print(json.load(fs)
    except IOError as e:
        print(e)
    print('读取数据完成!')


if __name__ == '__main__':
    main()
```

## 异常

### try except

1. `except`语句不是必须的，`finally`语句也不是必须的，但是二者必须要有一个，否则就没有`try`的意义了。
2. `except`语句可以有多个，Python会按`except`语句的顺序依次匹配你指定的异常，如果异常已经处理就不会再进入后面的`except`语句。
3. `except`语句可以以元组形式同时指定多个异常，参见实例代码。
4. `except`语句后面如果不指定异常类型，则默认捕获所有异常，你可以通过logging或者sys模块获取当前异常。
5. 如果要捕获异常后要重复抛出，请使用`raise`，后面不要带任何参数或信息。
6. 不建议捕获并抛出同一个异常，请考虑重构你的代码。
7. 不建议在不清楚逻辑的情况下捕获所有异常，有可能你隐藏了很严重的问题。
8. 尽量使用内置的异常处理语句来替换`try/except`语句，比如`with`语句，`getattr()`方法。

### 抛出异常 raise

如果你需要自主抛出异常一个异常，可以使用`raise`关键字，等同于C#和Java中的`throw`，其语法规则如下。

```python
raise NameError("bad name!")
```

`raise`关键字后面可以指定你要抛出的异常实例，一般来说抛出的异常越详细越好，Python在`exceptions`模块内建了很多的异常类型，通过使用`dir()`函数来查看`exceptions`中的异常类型，如下：

```python
import exceptions

print dir(exceptions)
# ['ArithmeticError', 'AssertionError'...]
```

### 自定义异常类型

Python中自定义自己的异常类型非常简单，只需要要从`Exception`类继承即可(直接或间接)：

```python
class SomeCustomException(Exception):
    pass

class AnotherException(SomeCustomException):
    pass
```

一般你在自定义异常类型时，需要考虑的问题应该是这个异常所应用的场景。如果内置异常已经包括了你需要的异常，建议考虑使用内置的异常类型。比如你希望在函数参数错误时抛出一个异常，你可能并不需要定义一个`InvalidArgumentError`，使用内置的`ValueError`即可。

### 传递异常

捕捉到了异常，但是又想重新抛出它（传递异常），使用不带参数的`raise`语句即可：

```python
def f1():
    print(1/0)

def f2():
    try:
        f1()
    except Exception as e:
        raise  # don't raise e !!!

f2()
```

### Exception 和 BaseException

当我们要捕获一个通用异常时，应该用`Exception`还是`BaseException`？请看它们之间的继承关系。

```ada
BaseException
 +-- SystemExit
 +-- KeyboardInterrupt
 +-- GeneratorExit
 +-- Exception
      +-- StopIteration...
      +-- StandardError...
      +-- Warning...
```

从`Exception`的层级结构来看，`BaseException`是最基础的异常类，`Exception`继承了它。`BaseException`除了包含所有的`Exception`外还包含了`SystemExit`，`KeyboardInterrupt`和`GeneratorExit`三个异常。

由此看来你的程序在捕获所有异常时更应该使用`Exception`而不是`BaseException`，因为被排除的三个异常属于更高级别的异常，合理的做法应该是交给Python的解释器处理。

### 使用内置的语法范式代替try/except

Python 本身提供了很多的语法范式简化了异常的处理，比如`for`语句就处理了的`StopIteration`异常，让你很流畅地写出一个循环。

`with`语句在打开文件后会自动调用`finally`并关闭文件。我们在写 Python 代码时应该尽量避免在遇到这种情况时还使用try/except/finally的思维来处理。

```python
# should not
try:
    f = open(a_file)
    do_something(f)
finally:
    f.close()

# should 
with open(a_file) as f:
    do_something(f)
```

再比如，当我们需要访问一个不确定的属性时，有可能你会写出这样的代码：

```python
try:
    test = Test()
    name = test.name  # not sure if we can get its name
except AttributeError:
    name = 'default'
```

其实你可以使用更简单的`getattr()`来达到你的目的。

```python
name = getattr(test, 'name', 'default')
```
