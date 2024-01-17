# IntelliJ IDEA 问题

## 不能启动

问题描述:

点击图标后, 图标跳一下停止, 程序未能启动.

解决办法:

找到目录 `~/Library/Application Support/JetBrains/IntelliJIdea2023.1` 中的 `idea.vmoptions` 文件, 删掉后重新启动程序, 启动成功.
