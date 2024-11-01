#!/bin/bash

# 检查必要参数
if [ "$#" -lt 4 ]; then
    echo "Usage: $0 APP_NAME SOURCE_DIR DOMAIN DEPLOY_PORT"
    echo "Example: $0 my-next-app /path/to/build example.com 8080"
    exit 1
fi

# 通过参数接收配置
APP_NAME="$1"
SOURCE_DIR="$2"
DOMAIN="$3"
PORT="$4"

# 固定配置
NGINX_USER="nginx"
DEPLOY_PATH="/usr/share/nginx/html/$APP_NAME"
NGINX_CONF="/etc/nginx/conf.d/${APP_NAME}.conf"

echo "开始部署..."
echo "应用名称: $APP_NAME"
echo "源目录: $SOURCE_DIR"
echo "部署域名: $DOMAIN"
echo "部署端口: $PORT"

# 1. 检查源目录是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "错误: 源目录 $SOURCE_DIR 不存在"
    exit 1
fi

# 2. 准备部署目录
echo "2. 准备部署目录..."
sudo rm -rf $DEPLOY_PATH
sudo mkdir -p $DEPLOY_PATH

# 3. 复制文件
echo "3. 复制构建文件..."
sudo cp -r $SOURCE_DIR/* $DEPLOY_PATH/

# 4. 设置权限
echo "4. 设置权限..."
sudo chown -R $NGINX_USER:$NGINX_USER $DEPLOY_PATH
sudo chmod -R 755 $DEPLOY_PATH

# 5. 创建nginx配置
echo "5. 配置Nginx..."
sudo cat > /tmp/nginx.conf << EOL
server {
    listen $PORT;
    server_name $DOMAIN;

    root $DEPLOY_PATH;

    location / {
        try_files \$uri \$uri.html \$uri/index.html /index.html;
    }

    location /_next/ {
        expires 1y;
        add_header Cache-Control "public, no-transform";
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
EOL

sudo mv /tmp/nginx.conf $NGINX_CONF

# 6. 测试nginx配置
echo "6. 测试Nginx配置..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # 7. 重启nginx
    echo "7. 重新加载Nginx配置..."
    sudo systemctl reload nginx
    echo "部署完成！"
    echo "应用可通过 http://$DOMAIN:$PORT 访问"
else
    echo "Nginx配置测试失败，请检查配置"
    exit 1
fi 