# nginx 变量

## 常见变量

| 变量名           | 作用                                                         |
| ---------------- | ------------------------------------------------------------ |
| arg_参数名       | URL 中某个具体参数的值                                       |
| query_string     | 与args变量完全相同                                           |
| args             | 全部的URL参数                                                |
| is_args          | 如果URL中有参数即返回，无返回空                              |
| content_length   | HTTP 请求中，标识包体长度的Content-Length头部的值，头部没有这个则为空 |
| content_type     | HTTP 请求中，标识包体类型的Content-Type头部的值，头部没有这个则为空 |
| document_uri     | 与uri变量相同                                                |
| uri              | 请求的URI，不包含?后面的值                                   |
| request_uri      | 请求的URI，包含?后面的值                                     |
| scheme           | 请求使用的协议，HTTP或HTTPS                                  |
| request_method   | 请求的方法                                                   |
| request_filename | 当前请求的文件路径，由root或alias指令与URI请求生成           |
| request_length   | 所有请求内容的大小，包括请求行，头部，包体等                 |
| request          | 原始的URL请求，含有方法和协议版本                            |

## TCP相关的变量

| 变量名              | 作用                                                         |
| ------------------- | ------------------------------------------------------------ |
| binary_remote_addr  | 客户端地址的整型格式，对于IPv4是4字节                        |
| remote_user         | 已经经过Auth Basic Module验证的用户名                        |
| remote_addr         | 客户端IP地址                                                 |
| remote_port         | 客户端端口号                                                 |
| connection          | 递增的连接序号                                               |
| connection_requests | 当前连接上执行过的请求数，对 keepalive 有意义                 |
| proxy_protocol_addr | 若使用了proxy_protocol 协议则返回协议中的地址                |
| proxy_protocol_port | 若使用了proxy_protocol 协议则返回协议中的端口                |
| server_addr         | 服务器端地址（本端地址）                                     |
| server_port         | 服务器端端口                                                 |
| TCP_INFO            | tcp内核层参数（\$tcpinfo_rtt, \$tcpinfo_rttvar, \$tcpinfo_snd_cwnd, \$tcpinfo_rcv_space） |

## 处理请求过程中产生的变量

| 变量名             | 作用                                           |
| ------------------ | ---------------------------------------------- |
| host               | 请求主机头字段，否则为服务器名称               |
| http_user_agent    | 客户端agent信息                                |
| http_cookie        | 客户端cookie信息                               |
| limit_rate         | 这个变量可以限制连接速率                       |
| request_time       | 请求处理到现在的耗时                           |
| server_name        | 服务器名称                                     |
| server_port        | 请求到达服务器的端口号                         |
| server_addr        | 服务器地址，在完成一次系统调用后可以确定这个值 |
| server_protocol    | 请求使用的协议，通常是HTTP/1.0或HTTP/1.1       |
| request_completion | 若请求处理完则返回OK，否则为空                 |
| request_id         | 以16进制输出的请求标识id，随机生成             |

### 系统变量

| 变量名     | 作用                     |
| ---------- | ------------------------ |
| time_local | 以本地时间的标准输出     |
| pid        | 所属 worker 进程的id        |
| hostname   | 与系统上输出hostname一致 |
