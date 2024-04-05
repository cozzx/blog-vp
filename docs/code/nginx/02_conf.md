# nginx 配置文件

```nginx
## main全局块：配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。

user  nginx;                                # 配置用户或者组，默认为nobody nobody

worker_processes  1;                        # 允许生成的进程数，默认为1

error_log  /var/log/nginx/error.log warn;   # 制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
pid       /var/run/nginx.pid;               # 指定nginx进程运行文件存放地址



## events块：配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

events {
    worker_connections  1024;               # 最大连接数，默认为512

    accept_mutex on;                        # 设置网路连接序列化，防止惊群现象发生，默认为on
    
    multi_accept on;                        # 设置一个进程是否同时接受多个网络连接，默认为off
    
    use epoll;                              # 事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
}


## http块：可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。

http {
    include      /etc/nginx/mime.types;         # 文件扩展名与文件类型映射表
    
    default_type  application/octet-stream;     # 默认文件类型，默认为text/plain

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';
                      
    access_log off;                             # 关闭服务访问日志

    access_log   /var/log/nginx/access.log  main;

    sendfile        on;                         # 允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    
    sendfile_max_chunk 100k;                    # 每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。

    tcp_nopush      on;

    keepalive_timeout  65;                      # 连接超时时间，默认为75s，可以在http，server，location块。

    gzip  on;                                   # gzip加速

    server_tokens off;                          # 隐藏nginx版本号，不再浏览显示


    # 设定实际的服务器列表
    upstream serv1 {   
       server 127.0.0.1:7878;
       server 192.168.10.121:8800 down;         # 当前的server暂时不参与负载均衡
       server 192.168.10.121:8801 backup;       # 热备(其它所有的非backup机器down或者忙的时候，请求backup机器))
    }
    
    upstream serv2 {
       server 192.168.1.11:80 weight=5;         # weigth参数表示权值，权值越高被分配到的几率越大
       server 192.168.1.12:80 weight=1 max_fails=3 fail_timeout=60; # 允许请求失败的次数和失败后暂停服务的时间
       server 192.168.1.13:80 weight=6;
    }
    
    upstream serv3 {
       ip_hash;                                 # 每个请求按访问ip的hash结果分配，这样每个访客固定访问一个后端服务器可以解决session的问题
       server 192.168.1.11:90;
       server 192.168.1.12:90;
    }
    
    upstream serv4 {
       server 192.168.1.11:90;
       server 192.168.1.12:90;
       fair;                                    # 按后端服务器的响应时间来分配请求，响应时间端的优先分配
    }
    
    
    # server块：配置虚拟主机的相关参数，一个http中可以有多个server
    server {
    
       listen 80;                               # 监听HTTP端口
       
       server_name 127.0.0.1;                   # 监听地址  
       
       index index.php index.html index.htm;    # 定义首页索引文件的名称
       
       set $doc_root_dir "/var/www/html";       # 设置server里全局变量
       root $doc_root_dir;
       
       keepalive_requests 120;                  # 单连接请求上限次数
       
       
       location / {                         # 通用匹配
          try_files $uri $uri/ /index.php$is_args$args;
          autoindex on;
       }
       
       location ~ /\.ht {                   # 禁止访问 .htxxx 文件
           deny all;
       }
       
       location = /a/ {                     # 字符串与url精确匹配，匹配成功使用此location，不再进行匹配
          deny 127.0.0.1;                   # 拒绝的ip
          allow 172.18.5.54;                # 允许的ip           
       }
       
       location ^~ /a/b {                   # ^~ 开头对URL路径进行前缀匹配，并且在正则之前，匹配成功使用此location，不再进行匹配
          rewrite ^/(.*)$ https://$host/$1 permanent;
       }
       
       location ~ \.php$ {                  # 正则匹配，区分大小写
          fastcgi_pass   127.0.0.1:9000;
          fastcgi_index  index.php;
          fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
          include        fastcgi_params;
       }
       
       location ~* ^/a/b {                  # 正则匹配，不区分大小写
          error_page 404 /404.html;
          error_page 500 502 503 504 /50x.html;
       }
       
       location ~* \.(gif|jpg|swf)$ {       # 防盗链
          valid_referers none blocked start.igrow.cn sta.igrow.cn;
          if ($invalid_referer) {
              rewrite ^/ http://$host/logo.png;
          }
       }
       
       location ~* \.(js|css|jpg|jpeg|gif|png|swf)$ { # 文件类型设置过期时间
           if (-f $request_filename) {
               expires 1h;
               break;
           }
       }
     
       location /a/b/c {                    # 不带任何修饰符，也表示前缀匹配，但是在正则匹配之后
          proxy_pass  http:\/\/load_balance_server;         # 请求转向load_balance_server 定义的服务器列表
          proxy_redirect   off;
          proxy_next_upstream error timeout http_500 http_502 http_503 http_504;    # 容灾设置
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;          # 记录真实发出请求的客户端IP
          proxy_set_header X-Forwarded-For $remote_addr;    # 记录代理信息的，每经过一级代理(匿名代理除外)，代理服务器都会把这次请求的来源IP追加在X-Forwarded-For中
          proxy_connect_timeout 90;                         # nginx跟后端服务器连接超时时间(代理连接超时)
          proxy_send_timeout 90;                            # 后端服务器数据回传时间(代理发送超时)
          proxy_read_timeout 90;                            # 连接成功后，后端服务器响应时间(代理接收超时)
          proxy_buffer_size 4k;                             # 设置代理服务器（nginx）保存用户头信息的缓冲区大小
          proxy_buffers 4 32k;                              # proxy_buffers缓冲区，网页平均在32k以下的话，这样设置
          proxy_busy_buffers_size 64k;                      # 高负荷下缓冲大小（proxy_buffers*2）
          proxy_temp_file_write_size 64k;                   # 设定缓存文件夹大小，大于这个值，将从upstream服务器传
          client_max_body_size 10m;                         # 允许客户端请求的最大单文件字节数
          client_body_buffer_size 128k;                     # 缓冲区代理缓冲用户端请求的最大字节数
          proxy_hide_header X-Frame-Options;
          add_header X-Frame-Options SAMEORIGIN always;
       }
       
   }

   include /etc/nginx/conf.d/*.conf;
}
```

超时时间

```nginx
http {
   keepalive_timeout 1800s; #指定 KeepAlive 的超时时间（timeout）。指定每个 TCP 连接最多可以保持多长时间。Nginx 的默认值是 75 秒，有些浏览器最多只保持 60 秒，所以可以设定为 60 秒。若将它设置为 0，就禁止了 keepalive 连接。
   proxy_connect_timeout 1800s; #nginx跟后端服务器连接超时时间(代理连接超时)
   proxy_send_timeout 1800s; #后端服务器数据回传时间(代理发送超时)
   proxy_read_timeout 1800s; #连接成功后，后端服务器响应时间(代理接收超时)
   fastcgi_connect_timeout 1800s; #指定nginx与后端fastcgi server连接超时时间
   fastcgi_send_timeout 1800s; #指定nginx向后端传送请求超时时间（指已完成两次握手后向fastcgi传送请求超时时间）
   fastcgi_read_timeout 1800s; #指定nginx向后端传送响应超时时间（指已完成两次握手后向fastcgi传送响应超时时间）
}
```
