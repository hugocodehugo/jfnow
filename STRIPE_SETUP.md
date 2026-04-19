# Stripe 支付配置指南

## 问题说明

如果你遇到"Stripe 配置错误"或支付功能无法使用，这是因为需要配置有效的 Stripe API 密钥。

## 快速配置步骤

### 1️⃣ 注册/登录 Stripe 账户

访问 [Stripe Dashboard](https://dashboard.stripe.com/)

### 2️⃣ 获取测试密钥（推荐用于本地开发）

1. 访问 [Stripe 测试密钥页面](https://dashboard.stripe.com/test/apikeys)
2. 确保页面右上角显示"测试模式"（Test mode）
3. 找到 **Publishable key**（以 `pk_test_` 开头）
4. 点击"显示"或"复制"按钮

### 3️⃣ 更新 .env 文件

打开项目根目录的 `.env` 文件，找到这一行：

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxx
```

将其替换为你的测试密钥：

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 4️⃣ 重启开发服务器

在终端中按 `Ctrl+C` 停止服务器，然后重新运行：

```bash
npm run dev
```

## 测试 vs 生产环境

### 测试环境（本地开发）
- 使用 `pk_test_` 开头的密钥
- 可以在 HTTP 环境下使用
- 使用测试卡号进行测试（见下方）

### 生产环境（部署后）
- 使用 `pk_live_` 开头的密钥
- **必须在 HTTPS 环境下使用**
- 处理真实交易

## Stripe 测试卡号

使用测试密钥时，可以使用以下测试卡号：

### 成功支付测试卡
```
卡号: 4242 4242 4242 4242
有效期: 任意未来日期 (如 12/34)
CVC: 任意3位数字 (如 123)
邮编: 任意5位数字 (如 12345)
```

### 其他测试场景
- **需要 3D 验证**: 4000 0027 6000 3184
- **支付失败**: 4000 0000 0000 0002
- **卡被拒绝**: 4000 0000 0000 9995

更多测试卡号参见：[Stripe 测试卡文档](https://stripe.com/docs/testing#cards)

## 验证配置是否成功

1. 访问 http://localhost:5173/profile
2. 打开浏览器控制台（F12）
3. 查看控制台输出：
   - ✅ 如果看到 "Stripe instance: ✅ 初始化成功"，说明配置正确
   - ❌ 如果看到错误提示，请检查密钥是否正确复制

## 常见问题

### Q: 为什么本地开发不能使用 Live key？
A: Live key 需要 HTTPS 环境才能工作，而本地开发通常是 HTTP。使用测试密钥可以避免这个限制。

### Q: 测试密钥会产生真实交易吗？
A: 不会。测试密钥只能处理模拟交易，不会真正扣款。

### Q: 如何切换到生产环境？
A: 在部署前，将 `.env` 中的密钥替换为生产密钥（`pk_live_`），并确保网站使用 HTTPS。

### Q: 密钥泄露怎么办？
A: Publishable key（pk_开头）可以安全地暴露在前端代码中。但**永远不要**将 Secret key（sk_开头）提交到代码仓库！

## 支付流程说明

完整的支付流程包括：

1. **前端初始化** - 加载 Stripe.js 和创建 Card Element
2. **创建支付意图** - 调用后端 API 创建 PaymentIntent
3. **确认支付** - 使用 Stripe.js 确认卡片支付
4. **验证支付** - 后端验证支付状态并添加积分
5. **更新余额** - 刷新用户积分显示

## 需要帮助？

- [Stripe 官方文档](https://stripe.com/docs)
- [Stripe 支持中心](https://support.stripe.com/)
- [项目 Issue](https://github.com/your-repo/issues)

---

**更新时间**: 2026-03-02
