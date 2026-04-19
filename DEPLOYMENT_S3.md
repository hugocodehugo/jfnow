# AWS S3 部署指南

## 📦 项目已打包完成

构建输出位置：`dist/` 目录

**构建信息：**
- 主 HTML: `index.html` (4.19 kB)
- CSS: `assets/index-BXbtzCOB.css` (106.76 kB)
- JavaScript: `assets/index-ClUEElLw.js` (674.36 kB)
- 图标文件：favicon.ico, android-chrome-*.png, apple-touch-icon.png 等

---

## 🚀 AWS S3 部署步骤

### 方法一：通过 AWS 控制台部署（推荐新手）

#### 第 1 步：创建 S3 存储桶

1. 登录 [AWS 管理控制台](https://console.aws.amazon.com/)
2. 搜索并打开 **S3** 服务
3. 点击 **"创建存储桶"** (Create bucket)
4. 配置存储桶：
   ```
   存储桶名称: your-webapp-name (必须全局唯一)
   AWS 区域: 选择离用户最近的区域（如 ap-northeast-1 东京）

   对象所有权: ACL 已禁用（推荐）

   阻止公共访问设置:
   ☐ 取消勾选 "阻止所有公共访问"
   ☑️ 确认警告（了解存储桶将公开）

   其他设置: 保持默认
   ```
5. 点击 **"创建存储桶"**

#### 第 2 步：启用静态网站托管

1. 进入刚创建的存储桶
2. 点击 **"属性"** (Properties) 标签页
3. 滚动到底部，找到 **"静态网站托管"** (Static website hosting)
4. 点击 **"编辑"**
5. 配置：
   ```
   静态网站托管: 启用
   托管类型: 托管静态网站
   索引文档: index.html
   错误文档: index.html  (用于 SPA 路由支持)
   ```
6. 点击 **"保存更改"**
7. **记录下网站终端节点 URL**（如：http://your-bucket.s3-website-ap-northeast-1.amazonaws.com）

#### 第 3 步：配置存储桶策略（允许公共访问）

1. 点击 **"权限"** (Permissions) 标签页
2. 滚动到 **"存储桶策略"** (Bucket policy)
3. 点击 **"编辑"**
4. 粘贴以下策略（**替换 `your-bucket-name` 为实际存储桶名称**）：

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

5. 点击 **"保存更改"**

#### 第 4 步：上传文件

1. 点击 **"对象"** (Objects) 标签页
2. 点击 **"上传"**
3. 点击 **"添加文件"** 和 **"添加文件夹"**
4. 选择 `dist/` 目录下的所有文件和文件夹：
   - `index.html`
   - `assets/` 文件夹
   - 所有图标文件（favicon.ico, *.png, *.svg）
5. 点击 **"上传"**
6. 等待上传完成

#### 第 5 步：测试部署

1. 使用步骤 2 中记录的网站终端节点 URL 访问网站
2. 测试路由是否正常工作（刷新页面不会 404）
3. 测试登录、支付等功能

---

### 方法二：通过 AWS CLI 部署（推荐熟练用户）

#### 前提条件

1. 安装 AWS CLI：
   ```bash
   # macOS
   brew install awscli

   # Windows
   # 下载安装包：https://aws.amazon.com/cli/

   # Linux
   curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
   unzip awscliv2.zip
   sudo ./aws/install
   ```

2. 配置 AWS 凭证：
   ```bash
   aws configure
   # 输入 AWS Access Key ID
   # 输入 AWS Secret Access Key
   # 输入默认区域（如 ap-northeast-1）
   # 输入默认输出格式（json）
   ```

#### 部署命令

```bash
# 1. 设置存储桶名称（替换为你的存储桶名称）
export BUCKET_NAME="your-webapp-name"

# 2. 创建 S3 存储桶
aws s3 mb s3://$BUCKET_NAME --region ap-northeast-1

# 3. 上传文件到 S3
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# 4. 配置静态网站托管
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# 5. 设置存储桶策略（允许公共读取）
cat > bucket-policy.json <<EOF
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

aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://bucket-policy.json

# 6. 移除公共访问阻止
aws s3api delete-public-access-block --bucket $BUCKET_NAME

# 7. 获取网站 URL
echo "Website URL: http://$BUCKET_NAME.s3-website-ap-northeast-1.amazonaws.com"
```

---

## 🔄 更新部署

当你修改代码后，重新部署：

```bash
# 1. 重新构建
npm run build

# 2. 同步到 S3（会自动删除旧文件，上传新文件）
aws s3 sync dist/ s3://$BUCKET_NAME --delete

# 3. 清空 CloudFront 缓存（如果使用了 CDN）
# aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

---

## 🌐 配置自定义域名（可选）

### 使用 AWS Route 53 + CloudFront

#### 第 1 步：创建 CloudFront 分发

1. 打开 CloudFront 控制台
2. 创建分发：
   ```
   源域名: your-bucket-name.s3.amazonaws.com
   源访问: 公共
   查看器协议策略: Redirect HTTP to HTTPS
   默认根对象: index.html
   ```

#### 第 2 步：配置自定义错误响应（SPA 路由支持）

1. 在分发详情页，进入 **"错误页面"**
2. 创建自定义错误响应：
   ```
   HTTP 错误代码: 403 Forbidden
   自定义错误响应: 是
   响应页面路径: /index.html
   HTTP 响应代码: 200 OK

   HTTP 错误代码: 404 Not Found
   自定义错���响应: 是
   响应页面路径: /index.html
   HTTP 响应代码: 200 OK
   ```

#### 第 3 步：配置 SSL 证书

1. 在 **AWS Certificate Manager (ACM)** 申请证书（必须在 us-east-1 区域）
2. 验证域名所有权
3. 在 CloudFront 分发中关联证书

#### 第 4 步：配置 Route 53

1. 创建 A 记录（别名记录）
2. 指向 CloudFront 分发

---

## ⚙️ 环境变量检查

部署前请确认 `.env` 文件配置正确：

```bash
# Stripe（生产环境必须使用 Live key）
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # ⚠️ 确保是 Live key

# API 端点
VITE_API_BASE_URL=https://l05mmy1reg.execute-api.ap-northeast-1.amazonaws.com

# Firebase 配置
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
# ... 其他配置
```

**重要提示：**
- 修改 `.env` 后，必须重新运行 `npm run build`
- Stripe Live key 需要 HTTPS 环境（S3 静态网站托管是 HTTP，建议使用 CloudFront）

---

## 🔒 安全性建议

### 1. HTTPS 支持（强烈推荐）

由于使用了 Stripe Live key，**必须**通过 CloudFront 提供 HTTPS 访问。

### 2. CORS 配置

如果 API 需要 CORS，在 S3 存储桶上配置：

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": []
  }
]
```

### 3. 内容安全策略 (CSP)

在 CloudFront 中添加响应头：
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; connect-src 'self' https://api.stripe.com https://*.execute-api.ap-northeast-1.amazonaws.com
```

---

## 📊 成本估算

- **S3 存储**：约 $0.023/GB/月（前 50TB）
- **S3 请求**：GET 请求 $0.0004/1000 次
- **数据传输**：前 10TB $0.114/GB（如果使用 CloudFront 可降低）
- **CloudFront**：前 10TB $0.085/GB

**预估月成本**（假设 1000 次访问）：
- 仅 S3：约 $1-2
- S3 + CloudFront：约 $3-5

---

## 🐛 常见问题

### Q1: 刷新页面出现 404 错误
**A:** 确保错误文档设置为 `index.html`

### Q2: 无法访问网站（403 Forbidden）
**A:** 检查存储桶策略和公共访问设置

### Q3: Stripe 支付失败
**A:** 确保使用 HTTPS（通过 CloudFront），且使用 Live key

### Q4: 修改后网站没有更新
**A:** 清空浏览器缓存，或清空 CloudFront 缓存

### Q5: 图片/CSS 无法加载
**A:** 检查文件是否正确上传到 `assets/` 文件夹

---

## 📝 部署检查清单

- [ ] 构建生产版本：`npm run build`
- [ ] 检查 `.env` 配置（Stripe Live key）
- [ ] 创建 S3 存储桶
- [ ] 启用静态网站托管
- [ ] 配置存储桶策略（公共访问）
- [ ] 上传 `dist/` 目录所有文件
- [ ] 测试网站访问
- [ ] （可选）配置 CloudFront CDN
- [ ] （可选）配置自定义域名
- [ ] （可选）配置 SSL 证书

---

## 🔗 相关资源

- [AWS S3 静态网站托管文档](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront 文档](https://docs.aws.amazon.com/cloudfront/)
- [Vue SPA 部署指南](https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations)
- [Stripe 生产环境检查清单](https://stripe.com/docs/development/checklist)

---

**部署完成时间**: 2026-03-02
**文档版本**: 1.0
