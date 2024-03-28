# Modules 命令

| 命令            | 作用                                           |
| --------------- | ---------------------------------------------- |
| go mod init     | 初始化当前文件夹，创建 go.mod 文件             |
| go mod why      | 解释为什么需要依赖                             |
| go mod edit     | 编辑 go.mod 文件                               |
| go mod vendor   | 将依赖复制到 vendor 目录下                     |
| go mod verify   | 校验依赖                                       |
| go mod graph    | 打印模块依赖图                                 |
| go mod tidy     | 增加缺少的包，删除无用的包                     |
| go mod download | 下载依赖包到本地（默认为 GOPATH/pkg/mod 目录） |

受影响的命令：

- go get
- go list
- go clean —modcache
- go build

（打开命令行）首先我们来看下 go mod 都有哪些命令，命令行输入：

```
go help mod
```

Go 的所有工具都可以使用 go help 来查看使用方法。

可以看到这里罗列了八个命令：

```
download    download modules to local cache (下载依赖到本地缓存))
edit        edit go.mod from tools or scripts (编辑 go.mod 文件)
graph       print module requirement graph (打印模块依赖图))
init        initialize new module in current directory (初始化 go modules 项目))
tidy        add missing and remove unused modules (整理 go.mod 文件)
vendor      make vendored copy of dependencies (将依赖复制到vendor下)
verify      verify dependencies have expected content (校验依赖)
why         explain why packages or modules are needed (解释为什么需要依赖)
```

接下来我们会一个个演示这些命令的使用场景。

## go mod init

这个命令是创建新项目的时候使用的。

在 Go 的工作空间里创建了一个项目目录 (myapi)，使用

```
$ pwd
/Users/summer/Code/go/src/github.com/summerblue/myapi
```

打印当前的目录，我们再看下 GOPATH 目录：

```
$ echo $GOPATH
/Users/summer/Code/go
```

可以看到我们的项目目录是位于 GOPATH 的工作目录中，（运行 ls -l）且目前此目录下只有一个目录。

运行

```
go mod init 
```

命令初始化项目。`ls -l` 可以看到为我们生成了一个 go.mod 文件。

（`cat go.mod`）使用 cat 命令来打印 go.mod 里的内容。

```
module github.com/summerblue/myapi

go 1.17
```

文件中有两行代码，第一行是设置 模块名称，最后一行是设置最低要求的 go 版本。

因为我们是在 go 工作目录下运行初始化命令的，所有它根据 Go 开发的惯例，自动地为我们加上了 module 项目名称。

接下来我们试着在非 Go 的工作目录（任意目录）下运行此命令，切换到我的下载目录，再次运行命令：

```
$ go mod init

go: cannot determine module path for source directory /Users/summer/Downloads (outside GOPATH, module path must be specified)

Example usage:
    'go mod init example.com/m' to initialize a v0 or v1 module
    'go mod init example.com/m/v2' to initialize a v2 module

Run 'go help mod init' for more information.
```

会提示无法初始化项目，module 路径无法自动设定，后面还跟着说明 —— 在 GOPATH 外需要指定 module 路径。

我们来查看 init 命令的帮助信息：

```
go help mod init
```

可以看到是有一个可选的模块路径。

在 Go 工作目录外的项目，可以在后面加项目名称作为参数：

```
go mod init github.com/summerblue/myapi
```

创建成功，（`cat go.mod`）使用 cat 命令来打印 go.mod 里的内容：

```
module github.com/summerblue/myapi

go 1.17
```

模型名称已经设置上了。

一般推荐在 Go 的工作目录下创建项目，这样方便我们的日常管理。

## 下载模块

回到项目目录，接下来开始写代码，假如我们需要 go gin 来写 myapi 项目，使用 code . 打开 VSCode 编辑器，打开 go.mod 文件，可以看到目前只有两行代码。

因为要用到 gin 我们先使用 go get 下载依赖模块，右上角打开 vscode 内置命令行：

首先我们来看下 gin 模块都有哪些版本：

```
$go list -m -versions -json github.com/gin-gonic/gin

{
    "Path": "github.com/gin-gonic/gin",
    "Version": "v1.7.4",
    "Versions": [
        "v1.1.1",
        "v1.1.2",
        "v1.1.3",
        "v1.1.4",
        "v1.3.0",
        "v1.4.0",
        "v1.5.0",
        "v1.6.0",
        "v1.6.1",
        "v1.6.2",
        "v1.6.3",
        "v1.7.0",
        "v1.7.1",
        "v1.7.2",
        "v1.7.3",
        "v1.7.4"
    ],
    "Time": "2021-08-03T02:40:44Z",
    "Dir": "/Users/summer/Code/go/pkg/mod/github.com/gin-gonic/gin@v1.7.4",
    "GoMod": "/Users/summer/Code/go/pkg/mod/cache/download/github.com/gin-gonic/gin/@v/v1.7.4.mod",
    "GoVersion": "1.13"
}
```

如果要下载最新版本 gin 的话，可以使用 go get 命令：

```
go get github.com/gin-gonic/gin
```

这会下载最新版本，可以看到我们下载了 v1.7.4，打开 go.mod 文件，也可以看到变更。

如果想下载之前的版本，可以使用以下命令：

```
go get github.com/gin-gonic/gin@v1.7.0
```

可以看到 go.mod 文件的变更。

go get 命令会判断当前项目会通过 go.mod 文件来是否使用了 go module ，如果是的话会更新 go.mod 文件，写入依赖。

Go.sum 文件是下载依赖模块时候，请求 go sum 服务器获得的模块的哈希值，这是 go mudules 的一个安全机制，以保证下载模块不会被不怀好意的中间人串改代码。

## 模块缓存

下载的模块会被放置于 GOPATH 中，具体位置我们打开：

```
cd $GOPATH/pkg/mod/github.com/gin-gonic
```

目录的名称是项目加版本号，这个版本号跟我们的 go.mod 文件对应。

进入 gin 项目中，可以看到 go gin 的源码。

Go get 命令第一次下载模块时，会进行缓存，后面再次 go get 这个模块，刚好版本也是一样的话，就会直接从本地缓存读取。

我们先来看 go mod 存放的目录：

```
cd $GOPATH/pkg
```

这里面的 mod 就是第三方模块的缓存目录。

接下来我们来清空缓存，使用

```
go clean --modcache
```

再次 ls -l ，可以看到 mod 目录以及被清空。

再次进入项目目录，使用 go get 命令：

```
go get github.com/gin-gonic/gin
```

可以看到输出：

```
go: downloading github.com/gin-gonic/gin v1.7.4
go: downloading github.com/gin-contrib/sse v0.1.0
go: downloading github.com/mattn/go-isatty v0.0.12
go: downloading github.com/json-iterator/go v1.1.9
go: downloading github.com/golang/protobuf v1.3.3
go: downloading github.com/ugorji/go/codec v1.1.7
go: downloading gopkg.in/yaml.v2 v2.2.8
go: downloading github.com/go-playground/validator/v10 v10.4.1
go: downloading golang.org/x/sys v0.0.0-20200116001909-b77594299b42
go: downloading github.com/modern-go/concurrent v0.0.0-20180228061459-e0a39a4cb421
go: downloading github.com/modern-go/reflect2 v0.0.0-20180701023420-4b7aa43c6742
go: downloading golang.org/x/crypto v0.0.0-20200622213623-75b288015ac9
go: downloading github.com/go-playground/universal-translator v0.17.0
go: downloading github.com/leodido/go-urn v1.2.0
go: downloading github.com/go-playground/locales v0.13.0
```

进入 go.mod 文件，把 require 部分的代码删除并保存，再次下载 gin 模块：

```
go get github.com/gin-gonic/gin
```

输出：

```
go: downloading github.com/ugorji/go v1.1.7
go get: added github.com/gin-contrib/sse v0.1.0
go get: added github.com/gin-gonic/gin v1.7.4
go get: added github.com/go-playground/locales v0.13.0
go get: added github.com/go-playground/universal-translator v0.17.0
go get: added github.com/go-playground/validator/v10 v10.4.1
go get: added github.com/golang/protobuf v1.3.3
go get: added github.com/json-iterator/go v1.1.9
go get: added github.com/leodido/go-urn v1.2.0
go get: added github.com/mattn/go-isatty v0.0.12
go get: added github.com/modern-go/concurrent v0.0.0-20180228061459-e0a39a4cb421
go get: added github.com/modern-go/reflect2 v0.0.0-20180701023420-4b7aa43c6742
go get: added github.com/ugorji/go/codec v1.1.7
go get: added golang.org/x/crypto v0.0.0-20200622213623-75b288015ac9
go get: added golang.org/x/sys v0.0.0-20200116001909-b77594299b42
go get: added gopkg.in/yaml.v2 v2.2.8
```

可以看到变成 go added 而不是 go downloading ，意味着从缓存读取。

重新进入缓存目录也可以看到下载下来的源码。

```
cd $GOPATH/pkg/mod/github.com/gin-gonic
```

## hello world

接下来我们开始写代码。

创建 main.go ，书写我们的第一个 API :

```go
package main

import (
    "log"
    "net/http"

    "github.com/gin-gonic/gin"
)

func main() {

    router := gin.Default()

    router.GET("/hello", func(c *gin.Context) {
        c.JSON(http.StatusOK, gin.H{
            "message": "Hello World!",
        })
    })

    if err := router.Run(":3000"); err != nil {
        log.Fatal("Server Run Failed.: ", err)
    }
}
```

运行代码：

```
go run main.go
```

打开 ThunderClient ，创建新请求，请求链接 `http://localhost:3000/hello`

发送请求，可以看到成功返回：

```php
{
  "message": "hello world"
}
```

## Mod tidy

再次打开 go.mod 文件，可以看到文件比较混乱，我们看不出来哪些模块是项目依赖，哪些是第二层的依赖，也就是依赖的依赖。

此时可以使用：

```
go mod tidy
```

可以看到 require 被分被分为两个区块，第一个区块就是我们的项目依赖，第二个是第二层依赖。

假如我们引入另一个模块（打开网站 [github.com/uber-go/zap](https://github.com/uber-go/zap) ，根据 reademe）：

```
go get -u go.uber.org/zap
```

Go get 的 -u 参数，u 是 update 的简写，会更新现有模块到最新版（1.17 默认的 get 是会下载最新的功能）。

我们下载了，但是没有使用，假如我们项目中不需要用到某些模块了，不需要手动在 go.mod 中去删除他们，只需要：

```
go mod tidy
```

即可看到 zap 被清除。

## go mod download

下面来看 download 命令，此命令会根据 go.mod 文件下载模块，并放置于缓存里。

首先我们清空模块缓存：

```
go clean --modcache
```

运行命令：

```
go mod download -x
```

可以看到下载信息。

注意这里我们使用了 -x 参数，默认不使用参数是不会打印出来内容，除非遇到错误。

我们来看下还有哪些参数：

```
go help mod download
```

这里比较实用的有一个 -json 参数，我们来试一试：

```
go mod download -json
```

-json 可以用来查看到模块下载的 zip 存放位置，以及解压后的位置

## go mod why

下一个命令是 Go mod why ，why 命令可以用来查看为何需要用到一个或多个模块。

例如打开我们的 go.mod 文件，可以的看最下面 yaml 模块我们使用到了 v2 和 v3 ，使用以下命令看下

```
go mod why gopkg.in/yaml.v2
```

这是依赖自上而下的结构，我们项目依赖于 gin ，gin 使用 binding 模块，而 binding 模块依赖于 yaml.v2 。

那我们再来看下

```
go mod why gopkg.in/yaml.v3
```

最后来看下帮助信息：

```
go help mod why
```

注意到这里面有个 vendor 参数，会跳过测试依赖，只查看业务逻辑中的依赖。

并且我们发现 why 命令可以接受多个参数，接下来

```
go mod why gopkg.in/yaml.v2 gopkg.in/yaml.v3
```

可以看到 v3 是 `stretchr/testif` 模块的 `assert` 模块里中依赖的，我们知道这是一个很知名测试框架。

添加 vonder 参数

```
go mod why -vendor gopkg.in/yaml.v2 gopkg.in/yaml.v3
```

可以看到在业务逻辑中我们不需要用到 yaml 的 v3 版本。

## go mod edit

下面来讲 Go mod edit，edit 命令是用来修改 go.mod 文件的。

先来查看帮助信息：

```
go help mod edit
```

基本上 go.mod 里的指令都可以被修改，我们来看下 go.mod 里面的内容，这些前面的第一个单词我们称之为 go 指令。

Go 指令是限制 go 的最低版本要求，假如我们要修改 go 版本使用：

```
go mod edit -go=1.16
```

即可改为 1.16 ，修改为 1.17 也可以使用：

```
go mod edit -go=1.17
```

Go mod edit 允许我们通过代码或者脚本对 go.mod 文件进行编辑。例如说 go get 的时候，会自动写入到 require 里，和 go mod tidy 命令用来整理 go.mod 文件。

这个命令是 go 命令，例如 go get 或者 go mod download 内部使用的命令，一般不需要用到。

## go mod vendor

接下来讲解 go mod vendor 命令。

这个命令会在目录下生成 vendor 目录，执行命令：

```
go mod vendor
```

当 vendor 目录存在时，go build 和 go run 命令都会优先使用这个目录下的代码进行编译。

这个可能在调试代码的时候比较好用，方便修改下依赖库的源码代码。

但是需要注意的是在下一次 go get 后基本上这些代码就得作废。

例如我们新增加一个依赖模块：

```
go get go.uber.org/zap
```

当再次执行的时候，go build 的时候：

```
go build
```

会出现报错。go 命令运行时会比对 go.mod 和 vendor/modules.txt ，发现我们 vendor 里的代码已经过期了。

这个使用只能重新运行：

```
go mod vendor
```

而这个命令，会直接删除 vendor 目录，再重建 vendor。

那么这个命令的作用是什么呢？

根据 Russ Cox 在 [research.swtch.com/vgo-module*#end...](https://research.swtch.com/vgo-module*#end_of_vendoring) 解释，这只是一个过渡方案。

Go Modules 这套官方的模块管理机制，是在 2018 年发布的 go 1.11 版本才出现的，在这之前，有很多第三方的包管理工具，如 dep ，godep，glide，这些工具统一都使用 vendor 目录。

之前的第三方工具，都是直接从代码仓库例如说 GitHub 上直接下载模块代码，但这些仓库可以被删掉，这会导致原本依赖这个项目的代码无法工作，有了 vendor 目录，代码存放在本地，就可以保证项目永远是可运行的。

但是在 go module 现有的机制下，我们有 goproxy ，所有的代码都是存放在 proxy 服务器上，proxy 服务器上面做了缓存，所以无需再担心代码仓库被删除的因素。

这里我们来简单讲下 go module 的机制，命令行：

```
go env
```

GOPROXY 是配置 zip 文件的下载服务器，而 GOSUMDB 是指定 zip 文件哈希值的服务器。

Go mod verify 命令就是用来校验从 GOPROXY 服务器上下载的 zip 文件与 GOSUMDB 服务器下载下来的哈希值，是否匹配。

## go mod verify

下面讲解下 verify.

运行下这个命令：

```shell
go mod verify
```

提示我们所有模块验证通过。

接下来我们尝试修改哈希值，使其不匹配。

首先看下文件存放在哪里：

```
go mod download -json | grep gin
```

进入下载目录：

```
cd /Users/summer/Code/go/pkg/mod/cache/download/github.com/gin-gonic/gin/@v
```

修改 zip 文件的哈希文件：

```
v1.7.4.ziphash
```

这个时候再次执行命令，即可看到提示有修改：

```
go mod verify
```

这个命令是 go 命令，例如 go get 或者 go mod download 内部使用的命令，一般不需要用到。

（切到 go env 界面）由此可见，goproxy 我们可以随意更改，而 gosumdb 服务器的值修改需要比较慎重。

因为 gosumdb 可以有效防止下载的 zip 模块被篡改，确保了模块下载的安全性。

## go mod graph

Go mod 的最后一个命令：

```
go mod graph
```

打印模块依赖图。

这个命令也是 go 工具链的内部使用。一般不需要用到。
