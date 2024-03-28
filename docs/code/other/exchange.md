# 交换机命令

## 华三

### 用户视图

登录交换机后进入用户视图

有密码时需要输入`super`

### 系统视图

用户视图下输入`system-view`或`sys`进入系统视图

* 全部/分屏显示

  ```sh
  # vty就是用telnet/ssh远程进入交换机的界面(虚拟界面)
  user-interface vty 0 15
  # 指定要在屏幕上显示行数，0默认是没有分页（全部显示）
  screen-length 0
  ```
  
* 查看当前配置

  ```sh
  dis cur
  ```
  
* ARP查看和设置

  ```sh
  # 查看
  dis arp
  # 编辑
  arp static <ip> <mac> # mac 格式为 m[0]m[1]-m[2]m[3]-m[4]m[5]
  # 删除
  undo arp <ip>
  ```
  
* acl查看和设置

  ```sh
  # 查看
  display acl <acl_id>
  # 进入
  acl number <acl_id>
  # 放行IP
  rule permit source <ip> 0
  # 阻止网段
  rule deny source <ip> <mask>
  # 删除规则
  undo rule <rule_id>
  ```
  
* acl关联/取消关联vlan

  ```sh
  # 进入vlan
  interface vlan-interface <vlan_id>
  # 关联acl
  packet-filter <acl_id> inbound
  # 取消关联acl
  undo packet-filter <acl_id> inbound
  ```

## 华为

### 用户模式

登录交换机后进入用户模式

### 视图模式

用户视图下输入`system-view`或`sys`进入视图模式

* 全部/分屏显示

  ```sh
  # vty就是用telnet/ssh远程进入交换机的界面(虚拟界面)
  user-interface vty 0 15
  # 指定要在屏幕上显示行数，0默认是没有分页（全部显示）
  screen-length 0
  ```

* 查看当前配置

  ```sh
  dis cur
  ```

* ARP查看和设置

  ```sh
  # 查看
  dis arp
  # 编辑
  arp static <ip> <mac> # mac 格式为 m[0]m[1]-m[2]m[3]-m[4]m[5]
  # 删除
  undo arp <ip>
  ```

* acl查看和设置

  ```sh
  # 查看
  display acl <acl_id>
  # 进入
  acl number <acl_id>
  # 放行IP
  rule permit source <ip> 0
  # 阻止网段
  rule deny source <ip> <mask>
  # 删除规则
  undo rule <rule_id>
  ```

* acl关联/取消关联vlan

  ```sh
  # 在Tunnel接口的入方向上配置基于ACL对报文进行过滤
  # 关联acl
  traffic-filter vlan <vlan_id> inbound acl <acl_id>
  # 取消关联acl
  undo traffic-filter vlan <vlan_id> inbound acl <acl_id>
  ```

## 思科

### 用户模式

登录交换机后进入用户模式

### 特权模式

用户模式下输入`enable`进入特权模式

特权模式下输入`write`保存配置

* 分页显示

  ```sh
  terminal length 0
  ```

* 查看当前配置

  ```sh
  show running-config
  ```

* ARP查看

  ```sh
  # 查看
  show ip arp
  ```

* acl查看

  ```sh
  # 查看
  show ip access-lists <acl_id>
  ```

### 配置模式

特权模式下输入`config terminal`进入配置模式

配置模式下输入`exit`回退到特权模式

* ARP配置

  ```sh
  # 编辑
  arp <ip> <mac> ARPA # mac 格式为 m[0]m[1].m[2]m[3].m[4]m[5]
  # 删除
  no arp <ip>
  ```

* acl配置

  ```sh
  # 放行IP
  access-list <acl_id> permit ip host <ip> any
  # 阻止网段
  access-list <acl_id> deny ip <ip> <mask> any
  # 删除规则
  ip access-list extended <acl_id>
  undo <rule_id>
  ```

* acl关联/取消关联vlan

  ```sh
  # 进入vlan
  interface vlan <vlan_id>
  # 关联acl
  ip access-group <acl_id> in
  # 取消关联acl
  no ip access-group <acl_id> in
  ```

## 迈普

### 用户模式

登录交换机后进入用户模式

### 特权模式

用户模式下输入`enable`进入特权模式

特权模式下输入`write`保存配置

* 分页显示

  ```sh
  more on|off
  ```

* 查看当前配置

  ```sh
  show running-config
  ```

* ARP查看

  ```sh
  # 查看
  show ip arp
  ```

* acl查看

  ```sh
  # 查看
  show ip access-list <acl_id>
  ```

### 配置模式

特权模式下输入`config terminal`进入配置模式

配置模式下输入`commit`提交配置

配置模式下输入`exit`回退到特权模式

* ARP配置

  ```sh
  # 编辑
  arp <ip> <mac> # mac 格式为 m[0]m[1].m[2]m[3].m[4]m[5]
  # 删除
  no arp <ip>
  ```

* acl配置

  ```sh
  # 放行IP
  access-list <acl_id> permit ip host <ip> any
  # 阻止网段
  access-list <acl_id> deny ip <ip> <mask> any
  # 删除规则
  ip access-list extended <acl_id>
  undo <rule_id>
  ```

* acl关联/取消关联vlan

  ```sh
  # 进入vlan
  interface vlan <vlan_id>
  # 关联acl
  ip access-group <acl_id> in
  # 取消关联acl
  no ip access-group <acl_id> in
  ```

## 锐捷

### 用户模式

登录交换机后进入用户模式

### 特权模式

用户模式下输入`enable`进入特权模式

特权模式下输入`write`保存配置

* 分屏

  ```sh
  terminal length 0
  ```

* 查看当前配置

  ```sh
  show running-config
  ```

* ARP查看

  ```sh
  # 查看
  show ip arp
  ```

* acl查看

  ```sh
  # 查看
  show ip access-lists <acl_id>
  ```

### 配置模式

特权模式下输入`config terminal`进入配置模式

配置模式下输入`exit`回退到特权模式

* ARP配置

  ```sh
  # 编辑
  arp <ip> <mac> ARPA # mac 格式为 m[0]m[1].m[2]m[3].m[4]m[5]
  # 删除
  no arp <ip>
  ```

* acl配置

  ```sh
  # 放行IP
  access-list <acl_id> permit ip host <ip> any
  # 阻止网段
  access-list <acl_id> deny ip <ip> <mask> any
  # 删除规则
  ip access-list extended <acl_id>
  undo <rule_id>
  ```

* acl关联/取消关联vlan

  ```sh
  # 进入vlan
  interface vlan <vlan_id>
  # 关联acl
  ip access-group <acl_id> in
  # 取消关联acl
  no ip access-group <acl_id> in
  ```

## zte
