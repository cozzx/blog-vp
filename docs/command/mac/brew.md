# brew

## 组成

| 名称             | 说明                        |
| ---------------- | --------------------------- |
| brew             | Homebrew 源代码仓库         |
| homebrew-core    | Homebrew 核心软件仓库       |
| homebrew-bottles | Homebrew 预编译二进制软件包 |
| homebrew-cask    | MacOS 客户端应用            |

## 常用命令

brew 安装 更新 删除

> /bin/bash -c "$(curl -fsSL <https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh>)"
>
> brew update
>
> cd \`brew --prefix\` && rm -rf Cellar && brew prune && rm \`git ls-files\`  
>
> ​ && rm -rf ~/Library/Caches/Homebrew

包 列表 过期列表 清理

> brew list
>
> brew outdated
>
> brew cleanup PKG

包 搜索 安装 更新 卸载

> brew search PKG
>
> brew install PKG
>
> brew upgrade PKG
>
> brew uninstall PKG

包 信息 依赖 依赖树

> brew info PKG
>
> brew deps PKG
>
> brew deps --installed --tree

## 镜像源

官方

> <https://github.com/Homebrew/brew.git>
>
> <https://github.com/Homebrew/homebrew-core.git>
>
> <https://github.com/Homebrew/homebrew-cask>

中科大

> <https://mirrors.ustc.edu.cn/brew.git>
>
> <https://mirrors.ustc.edu.cn/homebrew-core.git>
>
> <https://mirrors.ustc.edu.cn/homebrew-cask.git>
>
> <https://mirrors.ustc.edu.cn/homebrew-bottles>

清华

> <https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git>
>
> <https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git>
>
> <https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git>
>
> <https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-bottles>

阿里

> <https://mirrors.aliyun.com/homebrew/brew.git>
>
> <https://mirrors.aliyun.com/homebrew/homebrew-core.git>
>
> <https://mirrors.aliyun.com/homebrew/homebrew-cask.git>
>
> <https://mirrors.aliyun.com/homebrew/homebrew-bottles>

设置清华镜像源

```shell
cd /usr/local/Homebrew

# 
git -C "$(brew --repo)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/brew.git

git -C "$(brew --repo homebrew/core)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-core.git

git -C "$(brew --repo homebrew/cask)" remote set-url origin https://mirrors.tuna.tsinghua.edu.cn/git/homebrew/homebrew-cask.git

brew update
```

还原镜像源

```shell
cd /usr/local/Homebrew

git -C "$(brew --repo)" remote set-url origin https://github.com/Homebrew/brew.git

git -C "$(brew --repo homebrew/core)" remote set-url origin https://github.com/Homebrew/homebrew-core.git

git -C "$(brew --repo homebrew/cask)" remote set-url origin https://github.com/Homebrew/homebrew-cask.git

brew update
```
