#!/bin/bash

# AWS S3 快速部署脚本
# 用法: ./deploy-to-s3.sh [bucket-name]

set -e  # 遇到错误时退出

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否提供了存储桶名称
if [ -z "$1" ]; then
    echo -e "${RED}❌ 错误：请提供 S3 存储桶名称${NC}"
    echo "用法: ./deploy-to-s3.sh your-bucket-name"
    exit 1
fi

BUCKET_NAME=$1
REGION="ap-northeast-1"  # 可根据需要修改区域

echo -e "${GREEN}🚀 开始部署到 AWS S3...${NC}"
echo -e "存储桶名称: ${YELLOW}$BUCKET_NAME${NC}"
echo -e "区域: ${YELLOW}$REGION${NC}"
echo ""

# 步骤 1: 检查 AWS CLI
echo -e "${GREEN}[1/6]${NC} 检查 AWS CLI..."
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI 未安装${NC}"
    echo "请先安装 AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi
echo -e "${GREEN}✅ AWS CLI 已安装${NC}"
echo ""

# 步骤 2: 检查 AWS 凭证
echo -e "${GREEN}[2/6]${NC} 检查 AWS 凭证..."
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS 凭证未配置${NC}"
    echo "请运行: aws configure"
    exit 1
fi
echo -e "${GREEN}✅ AWS 凭证有效${NC}"
echo ""

# 步骤 3: 构建项目
echo -e "${GREEN}[3/6]${NC} 构建生产版本..."
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo ""

# 步骤 4: 检查/创建存储桶
echo -e "${GREEN}[4/6]${NC} 检查 S3 存储桶..."
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo "存储桶不存在，正在创建..."
    aws s3 mb "s3://$BUCKET_NAME" --region $REGION
    echo -e "${GREEN}✅ 存储桶已创建${NC}"
else
    echo -e "${YELLOW}ℹ️  存储桶已存在${NC}"
fi
echo ""

# 步骤 5: 上传文件
echo -e "${GREEN}[5/6]${NC} 上传文件到 S3..."
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete \
    --exclude ".DS_Store" \
    --exclude "*.map"  # 排除 source maps
echo -e "${GREEN}✅ 文件上传成功${NC}"
echo ""

# 步骤 6: 配置静态网站托管
echo -e "${GREEN}[6/6]${NC} 配置静态网站托管..."

# 启用静态网站托管
aws s3 website "s3://$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

# 移除公共访问阻止
echo "移除公共访问阻止..."
aws s3api delete-public-access-block --bucket "$BUCKET_NAME" 2>/dev/null || true

# 设置存储桶策略
echo "设置存储桶策略..."
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy --bucket "$BUCKET_NAME" --policy file:///tmp/bucket-policy.json
rm /tmp/bucket-policy.json

echo -e "${GREEN}✅ 配置完成${NC}"
echo ""

# 获取网站 URL
WEBSITE_URL="http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 部署成功！${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "🌐 网站 URL: ${YELLOW}$WEBSITE_URL${NC}"
echo ""
echo -e "${YELLOW}⚠️  重要提示：${NC}"
echo "1. 当前使用 HTTP 访问，Stripe Live key 需要 HTTPS"
echo "2. 建议配置 CloudFront CDN 以支持 HTTPS"
echo "3. 详细步骤请查看 DEPLOYMENT_S3.md"
echo ""
echo -e "📖 查看完整文档: ${YELLOW}cat DEPLOYMENT_S3.md${NC}"
echo ""
