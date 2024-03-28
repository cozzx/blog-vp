# Git

## ssh秘钥

生成：`ssh-keygen -t rsa -C "your_email@example.com"`

拷贝：`pbcopy < ~/.ssh/id_rsa.pub`

设置：<https://github.com/settings/keys>

## 常用命令

- 拉取代码 `git clone xxx.git`
- 创建分支 `git branch dev` 或者 `git checkout -b dev` 或者 `git switch -c dev`
- 切换本地分支 `git checkout dev` 或者 `git switch dev`
- 切换分支并关联远程分支 `git checkout -b dev origin/dev` 或者 `git checkout --track origin/dev`
- 查看本地所有分支 `git branch`，查看远程所有分支 `git branch -r`
- 删除本地分支 `git branch -d dev`，删除远程分支 `git push origin -d dev`
- 将代码从工作区添加暂存区 `git add .`
- 查看尚未暂存的更新 `git diff`
- 添加提交信息 `git commit -m 'xxxx'`，修改commit注释 `git commit --amend`
- 推送代码到远程分支 `git push origin dev`，强制推送 `git push -f origin dev`（常在git rebase后使用）
- 拉取远程分支代码 `git pull origin dev`
- 合并分支 `git merge dev`
- 查看git状态 `git status`
- 查看提交历史 `git log`
- 查看命令历史 `git reflog`
- 把本地未push的分叉提交历史整理成直线 `git rebase origin/dev`，回到rebase执行之前的状态 `git rebase --abort`
- 回退版本 `git reset --hard commitID`，回退上一个版本 `git reset --soft HEAD^` 等于 `git reset --soft HEAD~1`
- 撤销代码 `git revert commitID`
- 修改分支名 `git branch -m oldBranchName newBranchName`，`git push origin :oldBranchName`，`git push --set-upstream origin newBranchName`

- 查看git配置 `git config --global --list`、`git config --global user.name`

- 配置Git用户名和邮箱
  - `git config --global user.name "Your Name"`
  - `git config --global user.email "email@example.com"`
  - `git config --global --add user.name newName`（增）
  - `git config --global --unset user.name`（删）

- 统计代码行数 `git ls-files | xargs wc -l`

## 提交规范

为了方便使用，我们避免了过于复杂的规定，格式较为简单且不限制中英文：

`<type>(<scope>): <subject>`

例：`feat(miniprogram)`: 增加了小程序模板消息相关功能

**scope**: 选填，表示commit的作用范围，如数据层、视图层，也可以是目录名称

**subject**：必填，用于对commit进行简短的描述

**type**：必填，表示提交类型，值有以下几种：

- `feat` - 新功能 feature
- `fix` - 修复 bug
- `docs` - 文档注释
- `style` - 代码格式(不影响代码运行的变动)
- `refactor` - 重构、优化(既不增加新功能，也不是修复bug)
- `perf` - 性能优化
- `test` - 增加测试
- `chore` - 构建过程或辅助工具的变动
- `revert` - 回退
- `build` - 打包

## CodeReview 常用缩写

`PR`: Pull Request. 拉取请求，给其他项目提交代码

`LGTM`: Looks Good To Me. 朕知道了 代码已经过 review，可以合并

`SGTM`: Sounds Good To Me. 和上面那句意思差不多，也是已经通过了 review 的意思

`WIP`: Work In Progress. 传说中提 PR 的最佳实践是，如果你有个改动很大的 PR，可以在写了一部分的情况下先提交，但是在标题里写上 WIP，以告诉项目维护者这个功能还未完成，方便维护者提前 review 部分提交的代码。

`PTAL`: Please Take A Look. 你来瞅瞅？用来提示别人来看一下

`TBR`: To Be Reviewed. 提示维护者进行 review

`TL;DR`: Too Long; Didn't Read. 太长懒得看。也有很多文档在做简略描述之前会写这么一句

`TBD`: To Be Done(or Defined/Discussed/Decided/Determined). 根据语境不同意义有所区别，但一般都是还没搞定的意思

## 个人访问令牌

https://github.com/settings/tokens
