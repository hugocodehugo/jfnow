// API配置
const API_BASE_URL = 'https://vd-api.intimate.video';
let authToken = localStorage.getItem('authToken');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
let templates = [];
let uploadedImages = [];
let currentTaskId = null;
let statusCheckInterval = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadTemplates();
    checkAuthStatus();
});

// 初始化应用
function initializeApp() {
    // 设置文件上传事件
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', handleFileSelect);
    
    // 设置拖拽上传
    const uploadArea = document.getElementById('uploadArea');
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // 设置表单提交事件
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
}

// 设置事件监听器
function setupEventListeners() {
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('authModal');
        if (event.target === modal) {
            closeModal();
        }
    });
}

// 检查认证状态
function checkAuthStatus() {
    if (authToken && currentUser) {
        showUserInfo();
        getUserProfile();
    } else {
        showAuthButtons();
    }
}

// 显示用户信息
function showUserInfo() {
    document.getElementById('userInfo').classList.add('show');
    document.getElementById('authButtons').style.display = 'none';
    if (currentUser) {
        document.getElementById('userCredits').textContent = `积分: ${currentUser.credits || 0}`;
    }
}

// 显示认证按钮
function showAuthButtons() {
    document.getElementById('userInfo').classList.remove('show');
    document.getElementById('authButtons').style.display = 'flex';
}

// 获取用户资料
async function getUserProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            document.getElementById('userCredits').textContent = `积分: ${currentUser.credits || 0}`;
        }
    } catch (error) {
        console.error('获取用户资料失败:', error);
    }
}

// 加载模板列表
async function loadTemplates() {
    try {
        const response = await fetch(`${API_BASE_URL}/video/list-templates`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: 'getTemplates' })
        });
        
        if (response.ok) {
            const data = await response.json();
            templates = data.templates || [];
            renderTemplates();
            populateTemplateSelect();
        } else {
            console.error('加载模板失败');
        }
    } catch (error) {
        console.error('加载模板出错:', error);
    }
}

// 渲染模板网格
function renderTemplates() {
    const grid = document.getElementById('templatesGrid');
    grid.innerHTML = '';
    
    templates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card';
        card.onclick = () => selectTemplate(template.id);
        
        card.innerHTML = `
            <video class="template-video" autoplay muted loop>
                <source src="${template.show_video_url}" type="video/mp4">
            </video>
            <div class="template-info">
                <div class="template-name">${template.name_cn}</div>
                <div class="template-description">${template.description_cn}</div>
                <div class="template-price">${template.base_price} 积分</div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// 填充模板选择下拉框
function populateTemplateSelect() {
    const select = document.getElementById('templateSelect');
    select.innerHTML = '<option value="">请选择模板</option>';
    
    templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = `${template.name_cn} (${template.base_price}积分)`;
        select.appendChild(option);
    });
}

// 选择模板
function selectTemplate(templateId) {
    document.getElementById('templateSelect').value = templateId;
    showGeneratePage();
}

// 显示视频生成页面
function showGeneratePage() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('generatePage').style.display = 'block';
    
    // 添加返回按钮
    if (!document.querySelector('.back-button')) {
        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary back-button';
        backButton.textContent = '← 返回首页';
        backButton.onclick = showHomePage;
        backButton.style.marginBottom = '20px';
        document.querySelector('.generate-container').insertBefore(backButton, document.querySelector('.generate-container').firstChild);
    }
}

// 显示首页
function showHomePage() {
    document.getElementById('homePage').style.display = 'block';
    document.getElementById('generatePage').style.display = 'none';
}

// 处理文件选择
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    processFiles(files);
}

// 处理拖拽
function handleDragOver(event) {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    const files = Array.from(event.dataTransfer.files);
    processFiles(files);
}

// 处理文件
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
        alert('请选择图片文件');
        return;
    }
    
    if (uploadedImages.length + imageFiles.length > 2) {
        alert('最多只能上传2张图片');
        return;
    }
    
    imageFiles.forEach(file => {
        if (file.size > 10 * 1024 * 1024) { // 10MB限制
            alert(`文件 ${file.name} 太大，请选择小于10MB的图片`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedImages.push({
                file: file,
                dataUrl: e.target.result,
                base64: e.target.result.split(',')[1]
            });
            updateImagePreview();
        };
        reader.readAsDataURL(file);
    });
}

// 更新图片预览
function updateImagePreview() {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    uploadedImages.forEach((image, index) => {
        const item = document.createElement('div');
        item.className = 'preview-item';
        
        item.innerHTML = `
            <img src="${image.dataUrl}" alt="预览" class="preview-image">
            <button class="remove-image" onclick="removeImage(${index})">&times;</button>
        `;
        
        preview.appendChild(item);
    });
}

// 移除图片
function removeImage(index) {
    uploadedImages.splice(index, 1);
    updateImagePreview();
}

// 生成视频
async function generateVideo() {
    if (!authToken) {
        alert('请先登录');
        openModal('login');
        return;
    }
    
    if (uploadedImages.length === 0) {
        alert('请至少上传一张图片');
        return;
    }
    
    const templateId = document.getElementById('templateSelect').value;
    if (!templateId) {
        alert('请选择模板');
        return;
    }
    
    const template = templates.find(t => t.id === templateId);
    if (template && template.need_images > uploadedImages.length) {
        alert(`该模板需要${template.need_images}张图片`);
        return;
    }
    
    const generateButton = document.getElementById('generateButton');
    const loadingDiv = document.getElementById('loadingDiv');
    
    generateButton.disabled = true;
    loadingDiv.style.display = 'block';
    
    try {
        const requestData = {
            action: 'generateVideo',
            template_id: templateId,
            images: uploadedImages.map(img => img.dataUrl),
            prompt: document.getElementById('promptInput').value,
            duration: parseInt(document.getElementById('durationSelect').value),
            resolution: document.getElementById('resolutionSelect').value
        };
        
        const response = await fetch(`${API_BASE_URL}/video/gen-video`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        
        if (response.ok) {
            const data = await response.json();
            currentTaskId = data.taskId;
            startStatusCheck();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.message || '视频生成失败');
        }
    } catch (error) {
        console.error('生成视频出错:', error);
        alert('生成视频失败: ' + error.message);
        generateButton.disabled = false;
        loadingDiv.style.display = 'none';
    }
}

// 开始状态检查
function startStatusCheck() {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    
    statusCheckInterval = setInterval(checkVideoStatus, 3000);
}

// 检查视频状态
async function checkVideoStatus() {
    if (!currentTaskId || !authToken) {
        return;
    }
    
    try {
        const templateId = document.getElementById('templateSelect').value;
        const duration = parseInt(document.getElementById('durationSelect').value);
        const resolution = document.getElementById('resolutionSelect').value;
        
        const response = await fetch(`${API_BASE_URL}/video/gen-video-status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'getVideoStatus',
                task_id: currentTaskId,
                template_id: templateId,
                duration: duration,
                resolution: resolution
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.status === 'succeeded') {
                clearInterval(statusCheckInterval);
                showVideoResult(data.videoUrl);
                getUserProfile(); // 更新积分
            } else if (data.status === 'failed') {
                clearInterval(statusCheckInterval);
                alert('视频生成失败: ' + (data.error || '未知错误'));
                resetGenerateForm();
            }
            // processing状态继续等待
        } else {
            console.error('检查状态失败');
        }
    } catch (error) {
        console.error('检查视频状态出错:', error);
    }
}

// 显示视频结果
function showVideoResult(videoUrl) {
    const loadingDiv = document.getElementById('loadingDiv');
    loadingDiv.innerHTML = `
        <h3 style="color: #10b981; margin-bottom: 20px;">🎉 视频生成成功！</h3>
        <video controls style="width: 100%; max-width: 500px; border-radius: 10px; margin-bottom: 20px;">
            <source src="${videoUrl}" type="video/mp4">
        </video>
        <div>
            <a href="${videoUrl}" download class="btn btn-primary" style="margin-right: 10px;">下载视频</a>
            <button class="btn btn-secondary" onclick="resetGenerateForm()">生成新视频</button>
        </div>
    `;
}

// 重置生成表单
function resetGenerateForm() {
    document.getElementById('generateButton').disabled = false;
    document.getElementById('loadingDiv').style.display = 'none';
    document.getElementById('loadingDiv').innerHTML = `
        <div class="spinner"></div>
        <p>正在生成视频，请稍候...</p>
    `;
    currentTaskId = null;
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
}

// 模态框操作
function openModal(type) {
    document.getElementById('authModal').style.display = 'block';
    switchTab(type);
}

function closeModal() {
    document.getElementById('authModal').style.display = 'none';
}

function switchTab(type) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    forms.forEach(form => form.classList.remove('active'));
    
    if (type === 'login') {
        tabs[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('modalTitle').textContent = '用户登录';
    } else {
        tabs[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
        document.getElementById('modalTitle').textContent = '用户注册';
    }
}

// 处理登录
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token;
            currentUser = data.user;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showUserInfo();
            closeModal();
            alert('登录成功！');
        } else {
            const errorData = await response.json();
            alert('登录失败: ' + (errorData.message || '未知错误'));
        }
    } catch (error) {
        console.error('登录出错:', error);
        alert('登录失败，请检查网络连接');
    }
}

// 处理注册
async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (response.ok) {
            alert('注册成功！请登录');
            switchTab('login');
            // 清空注册表单
            document.getElementById('registerForm').reset();
        } else {
            const errorData = await response.json();
            alert('注册失败: ' + (errorData.message || '未知错误'));
        }
    } catch (error) {
        console.error('注册出错:', error);
        alert('注册失败，请检查网络连接');
    }
}

// 退出登录
function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    showAuthButtons();
    showHomePage();
    alert('已退出登录');
}

// 充值相关功能
let selectedRechargeAmount = 0;
let selectedRechargePrice = 0;

// 打开充值模态框
function openRechargeModal() {
    if (!authToken) {
        alert('请先登录');
        openModal('login');
        return;
    }
    document.getElementById('rechargeModal').style.display = 'block';
}

// 关闭充值模态框
function closeRechargeModal() {
    document.getElementById('rechargeModal').style.display = 'none';
    // 重置选择
    document.querySelectorAll('.recharge-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('selectedRecharge').style.display = 'none';
    selectedRechargeAmount = 0;
    selectedRechargePrice = 0;
}

// 选择充值金额
function selectRechargeAmount(amount, price) {
    selectedRechargeAmount = amount;
    selectedRechargePrice = price;
    
    // 更新UI
    document.querySelectorAll('.recharge-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 显示选择的充值信息
    document.getElementById('selectedAmount').textContent = amount;
    document.getElementById('selectedPrice').textContent = price;
    document.getElementById('selectedRecharge').style.display = 'block';
}

// 处理充值
async function processRecharge() {
    if (!selectedRechargeAmount || !selectedRechargePrice) {
        alert('请选择充值金额');
        return;
    }
    
    try {
        // 创建支付订单
        const response = await fetch(`${API_BASE_URL}/payment/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: selectedRechargePrice * 100, // 转换为分
                currency: 'cny',
                credits: selectedRechargeAmount
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // 模拟支付成功（实际应用中应该集成真实的支付系统）
            const confirmPayment = confirm(`确认支付 ¥${selectedRechargePrice} 购买 ${selectedRechargeAmount} 积分？\n\n注意：这是演示版本，实际不会扣费。`);
            
            if (confirmPayment) {
                // 模拟支付成功，直接验证支付
                await verifyPayment(data.paymentIntentId);
            }
        } else {
            const errorData = await response.json();
            alert('创建支付订单失败: ' + (errorData.message || '未知错误'));
        }
    } catch (error) {
        console.error('充值出错:', error);
        alert('充值失败，请检查网络连接');
    }
}

// 验证支付
async function verifyPayment(paymentIntentId) {
    try {
        const response = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentIntentId: paymentIntentId,
                credits: selectedRechargeAmount
            })
        });
        
        if (response.ok) {
            alert(`充值成功！获得 ${selectedRechargeAmount} 积分`);
            closeRechargeModal();
            getUserProfile(); // 更新用户积分显示
        } else {
            const errorData = await response.json();
            alert('支付验证失败: ' + (errorData.message || '未知错误'));
        }
    } catch (error) {
        console.error('支付验证出错:', error);
        alert('支付验证失败，请联系客服');
    }
}

// 工具函数：格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 工具函数：防抖
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 错误处理
window.addEventListener('error', function(event) {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', function(event) {
    console.error('未处理的Promise拒绝:', event.reason);
});