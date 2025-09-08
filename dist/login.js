// 登录系统 JavaScript

// 安全配置
const SECURITY_CONFIG = {
    // 默认管理员凭据（生产环境中应该加密存储或从服务器获取）
    defaultCredentials: {
        username: 'admin',
        password: 'admin123' // 建议用户修改默认密码
    },
    
    // 会话配置
    sessionTimeout: 30 * 60 * 1000, // 30分钟
    rememberMeDuration: 7 * 24 * 60 * 60 * 1000, // 7天
    
    // 安全配置
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15分钟锁定
    
    // 存储键
    storageKeys: {
        session: 'admin_session',
        loginAttempts: 'login_attempts',
        lockoutTime: 'lockout_time',
        credentials: 'admin_credentials'
    }
};

// 全局变量
let loginAttempts = 0;
let isLocked = false;
let captchaAnswer = 0;

// DOM 元素
const elements = {
    loginForm: document.getElementById('loginForm'),
    username: document.getElementById('username'),
    password: document.getElementById('password'),
    rememberMe: document.getElementById('rememberMe'),
    loginBtn: document.getElementById('loginBtn'),
    togglePassword: document.getElementById('togglePassword'),
    toastContainer: document.getElementById('toastContainer'),
    securityModal: document.getElementById('securityModal'),
    captchaQuestion: document.getElementById('captchaQuestion'),
    captchaAnswer: document.getElementById('captchaAnswer'),
    cancelCaptcha: document.getElementById('cancelCaptcha'),
    submitCaptcha: document.getElementById('submitCaptcha')
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 登录系统初始化中...');
    initializeLoginSystem();
});

// 初始化登录系统
function initializeLoginSystem() {
    // 检查是否已有有效会话
    if (checkExistingSession()) {
        redirectToAdmin();
        return;
    }
    
    // 检查是否被锁定
    checkLockoutStatus();
    
    // 加载登录尝试次数
    loadLoginAttempts();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化用户凭据（如果不存在）
    initializeCredentials();
    
    // 检查是否有登录消息需要显示
    const loginMessage = sessionStorage.getItem('loginMessage');
    if (loginMessage) {
        sessionStorage.removeItem('loginMessage');
        
        if (loginMessage.includes('强制退出') || loginMessage.includes('退出所有设备')) {
            showToast('warning', '凭据失效', '登录凭据已失效，请重新输入用户名和密码');
        } else if (loginMessage.includes('密码已修改')) {
            showToast('success', '密码修改成功', '请使用新密码登录');
        } else if (loginMessage.includes('会话已过期')) {
            showToast('warning', '会话过期', loginMessage);
        } else if (loginMessage.includes('未登录')) {
            showToast('info', '需要登录', '请输入您的管理员凭据');
        } else {
            showToast('info', '提示', loginMessage);
        }
    } else {
        // 显示默认欢迎消息
        showToast('info', '欢迎', '请输入您的管理员凭据');
    }
    
    console.log('✅ 登录系统初始化完成');
}

// 检查现有会话
function checkExistingSession() {
    try {
        // 检查新的认证系统
        const loginTime = localStorage.getItem('adminLoginTime');
        const loginToken = localStorage.getItem('adminToken');
        const lastActivity = localStorage.getItem('lastActivity');
        
        if (!loginTime || !loginToken) {
            // 清理旧的会话数据
            clearAllSessionData();
            return false;
        }
        
        // 验证token格式
        if (!isValidTokenFormat(loginToken)) {
            clearAllSessionData();
            return false;
        }
        
        // 检查会话超时
        const sessionTimeout = parseInt(localStorage.getItem('sessionTimeout') || '3600') * 1000;
        const currentTime = Date.now();
        const sessionAge = currentTime - parseInt(loginTime);
        const activityAge = lastActivity ? currentTime - parseInt(lastActivity) : 0;
        
        if (sessionAge > sessionTimeout || activityAge > sessionTimeout) {
            clearAllSessionData();
            return false;
        }
        
        console.log('✅ 发现有效的安全会话');
        return true;
    } catch (error) {
        console.error('❌ 会话检查失败:', error);
        clearAllSessionData();
        return false;
    }
}

// 验证Token格式
function isValidTokenFormat(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return false;
        
        const payload = JSON.parse(atob(parts[1]));
        return payload.user === 'admin' && payload.timestamp && payload.exp;
    } catch (e) {
        return false;
    }
}

// 清理所有会话数据
function clearAllSessionData() {
    // 清理新系统的数据
    localStorage.removeItem('adminLoginTime');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('lastActivity');
    
    // 清理旧系统的数据
    localStorage.removeItem(SECURITY_CONFIG.storageKeys.session);
    sessionStorage.removeItem('adminSessionId');
    
    console.log('🧹 已清理所有会话数据');
}

// 检查锁定状态
function checkLockoutStatus() {
    try {
        const lockoutTime = localStorage.getItem(SECURITY_CONFIG.storageKeys.lockoutTime);
        if (!lockoutTime) return;
        
        const lockoutEnd = parseInt(lockoutTime);
        const now = Date.now();
        
        if (now < lockoutEnd) {
            isLocked = true;
            const remainingTime = Math.ceil((lockoutEnd - now) / 1000 / 60);
            showLockoutMessage(remainingTime);
        } else {
            // 锁定期已过，清理数据
            localStorage.removeItem(SECURITY_CONFIG.storageKeys.lockoutTime);
            localStorage.removeItem(SECURITY_CONFIG.storageKeys.loginAttempts);
            loginAttempts = 0;
        }
    } catch (error) {
        console.error('❌ 锁定状态检查失败:', error);
    }
}

// 加载登录尝试次数
function loadLoginAttempts() {
    try {
        const attempts = localStorage.getItem(SECURITY_CONFIG.storageKeys.loginAttempts);
        loginAttempts = attempts ? parseInt(attempts) : 0;
    } catch (error) {
        console.error('❌ 登录尝试次数加载失败:', error);
        loginAttempts = 0;
    }
}

// 初始化用户凭据
function initializeCredentials() {
    try {
        const existingCredentials = localStorage.getItem(SECURITY_CONFIG.storageKeys.credentials);
        if (!existingCredentials) {
            // 首次使用，设置默认凭据
            const hashedCredentials = {
                username: SECURITY_CONFIG.defaultCredentials.username,
                password: btoa(SECURITY_CONFIG.defaultCredentials.password) // 简单编码（生产环境应使用更安全的方法）
            };
            localStorage.setItem(SECURITY_CONFIG.storageKeys.credentials, JSON.stringify(hashedCredentials));
            
            // 检查是否是强制退出或密码修改后的访问
            const loginMessage = sessionStorage.getItem('loginMessage');
            if (loginMessage && (loginMessage.includes('强制退出') || loginMessage.includes('退出所有设备') || loginMessage.includes('密码已修改'))) {
                // 如果是强制退出或密码修改，不显示默认凭据提示
                return;
            }
            
            showToast('warning', '默认凭据', '请使用默认用户名: admin, 密码: admin123');
        }
    } catch (error) {
        console.error('❌ 凭据初始化失败:', error);
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 登录表单提交
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }
    
    // 密码可见性切换
    if (elements.togglePassword) {
        elements.togglePassword.addEventListener('click', togglePasswordVisibility);
    }
    
    // 验证码相关
    if (elements.cancelCaptcha) {
        elements.cancelCaptcha.addEventListener('click', closeCaptchaModal);
    }
    
    if (elements.submitCaptcha) {
        elements.submitCaptcha.addEventListener('click', verifyCaptcha);
    }
    
    // 回车键提交验证码
    if (elements.captchaAnswer) {
        elements.captchaAnswer.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                verifyCaptcha();
            }
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.securityModal.classList.contains('active')) {
            closeCaptchaModal();
        }
    });
    
    // 输入框焦点效果
    ['username', 'password'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('focus', () => {
                element.parentNode.classList.add('focused');
            });
            element.addEventListener('blur', () => {
                element.parentNode.classList.remove('focused');
            });
        }
    });
}

// 处理登录
async function handleLogin(e) {
    e.preventDefault();
    
    // 检查是否被锁定
    if (isLocked) {
        showToast('error', '账户锁定', '登录失败次数过多，请稍后再试');
        return;
    }
    
    const username = elements.username.value.trim();
    const password = elements.password.value;
    const rememberMe = elements.rememberMe.checked;
    
    // 基本验证
    if (!username || !password) {
        showToast('error', '输入错误', '请填写完整的登录信息');
        return;
    }
    
    // 检查是否需要验证码
    if (loginAttempts >= 3) {
        showCaptchaModal();
        return;
    }
    
    // 显示加载状态
    setLoginButtonLoading(true);
    
    // 模拟网络延迟（增加真实感）
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 验证凭据
    const isValid = await validateCredentials(username, password);
    
    if (isValid) {
        // 登录成功
        handleLoginSuccess(rememberMe);
    } else {
        // 登录失败
        handleLoginFailure();
    }
    
    setLoginButtonLoading(false);
}

// 验证凭据
async function validateCredentials(username, password) {
    try {
        const storedCredentials = localStorage.getItem(SECURITY_CONFIG.storageKeys.credentials);
        if (!storedCredentials) {
            console.error('❌ 未找到存储的凭据');
            return false;
        }
        
        const credentials = JSON.parse(storedCredentials);
        const decodedPassword = atob(credentials.password);
        
        return username === credentials.username && password === decodedPassword;
    } catch (error) {
        console.error('❌ 凭据验证失败:', error);
        return false;
    }
}

// 处理登录成功
function handleLoginSuccess(rememberMe) {
    console.log('✅ 登录成功');
    
    // 清理失败记录
    loginAttempts = 0;
    localStorage.removeItem(SECURITY_CONFIG.storageKeys.loginAttempts);
    localStorage.removeItem(SECURITY_CONFIG.storageKeys.lockoutTime);
    
    // 创建会话
    createSession(rememberMe);
    
    // 显示成功消息
    showToast('success', '登录成功', '正在跳转到管理后台...');
    
    // 延迟跳转
    setTimeout(() => {
        redirectToAdmin();
    }, 1500);
}

// 处理登录失败
function handleLoginFailure() {
    loginAttempts++;
    localStorage.setItem(SECURITY_CONFIG.storageKeys.loginAttempts, loginAttempts.toString());
    
    const remainingAttempts = SECURITY_CONFIG.maxLoginAttempts - loginAttempts;
    
    if (loginAttempts >= SECURITY_CONFIG.maxLoginAttempts) {
        // 触发锁定
        const lockoutEnd = Date.now() + SECURITY_CONFIG.lockoutDuration;
        localStorage.setItem(SECURITY_CONFIG.storageKeys.lockoutTime, lockoutEnd.toString());
        isLocked = true;
        
        const lockoutMinutes = Math.ceil(SECURITY_CONFIG.lockoutDuration / 1000 / 60);
        showToast('error', '账户锁定', `登录失败次数过多，账户已锁定 ${lockoutMinutes} 分钟`);
        showLockoutMessage(lockoutMinutes);
    } else if (remainingAttempts === 2) {
        showToast('warning', '登录失败', `用户名或密码错误，还有 ${remainingAttempts} 次尝试机会`);
    } else if (remainingAttempts === 1) {
        showToast('error', '登录失败', `用户名或密码错误，还有 ${remainingAttempts} 次尝试机会，下次失败将被锁定`);
    } else {
        showToast('error', '登录失败', `用户名或密码错误，还有 ${remainingAttempts} 次尝试机会`);
    }
    
    // 清空密码输入框
    elements.password.value = '';
    elements.password.focus();
}

// 生成安全Token
function generateSecureToken(expiresAt) {
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    
    const payload = {
        user: 'admin',
        timestamp: Date.now(),
        exp: expiresAt,
        sessionId: generateSessionId(),
        userAgent: btoa(navigator.userAgent)
    };
    
    const signature = btoa(JSON.stringify({timestamp: payload.timestamp, exp: expiresAt}));
    return btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload)) + '.' + signature;
}

// 创建会话
function createSession(rememberMe) {
    const now = Date.now();
    const expiresAt = now + (rememberMe ? SECURITY_CONFIG.rememberMeDuration : SECURITY_CONFIG.sessionTimeout);
    
    // 生成安全令牌
    const token = generateSecureToken(expiresAt);
    
    // 存储认证信息（兼容admin.html的验证）
    localStorage.setItem('adminLoginTime', now.toString());
    localStorage.setItem('adminToken', token);
    localStorage.setItem('lastActivity', now.toString());
    
    // 存储会话超时设置
    const sessionTimeoutSeconds = rememberMe ? 
        SECURITY_CONFIG.rememberMeDuration / 1000 : 
        SECURITY_CONFIG.sessionTimeout / 1000;
    localStorage.setItem('sessionTimeout', sessionTimeoutSeconds.toString());
    
    // 传统会话数据（向后兼容）
    const sessionData = {
        createdAt: now,
        expiresAt: expiresAt,
        rememberMe: rememberMe,
        userAgent: navigator.userAgent,
        ip: 'localhost'
    };
    
    localStorage.setItem(SECURITY_CONFIG.storageKeys.session, JSON.stringify(sessionData));
    
    // 记录登录日志
    addLoginLog('登录成功', '成功', `会话将于 ${new Date(expiresAt).toLocaleString()} 过期`);
    
    console.log('✅ 安全会话和Token已创建');
}

// 生成会话ID
function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

// 添加登录日志
function addLoginLog(action, status, details) {
    try {
        const logs = JSON.parse(localStorage.getItem('loginLogs') || '[]');
        const logEntry = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            action: action,
            status: status,
            details: details,
            userAgent: navigator.userAgent,
            ip: 'localhost'
        };
        
        logs.unshift(logEntry);
        
        // 只保留最近100条日志
        if (logs.length > 100) {
            logs.splice(100);
        }
        
        localStorage.setItem('loginLogs', JSON.stringify(logs));
    } catch (error) {
        console.error('添加登录日志失败:', error);
    }
}

// 显示验证码模态框
function showCaptchaModal() {
    generateCaptcha();
    elements.securityModal.classList.add('active');
    elements.captchaAnswer.focus();
}

// 关闭验证码模态框
function closeCaptchaModal() {
    elements.securityModal.classList.remove('active');
    elements.captchaAnswer.value = '';
}

// 生成验证码
function generateCaptcha() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;
    
    switch (operation) {
        case '+':
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 50) + 1;
            answer = num1 + num2;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 50) + 25;
            num2 = Math.floor(Math.random() * 25) + 1;
            answer = num1 - num2;
            break;
        case '*':
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
            answer = num1 * num2;
            break;
    }
    
    captchaAnswer = answer;
    elements.captchaQuestion.textContent = `${num1} ${operation} ${num2} = ?`;
}

// 验证验证码
function verifyCaptcha() {
    const userAnswer = parseInt(elements.captchaAnswer.value);
    
    if (userAnswer === captchaAnswer) {
        closeCaptchaModal();
        showToast('success', '验证通过', '请继续登录');
        // 重置部分登录尝试次数
        loginAttempts = Math.max(0, loginAttempts - 2);
        localStorage.setItem(SECURITY_CONFIG.storageKeys.loginAttempts, loginAttempts.toString());
    } else {
        showToast('error', '验证失败', '答案不正确，请重试');
        generateCaptcha();
        elements.captchaAnswer.value = '';
        elements.captchaAnswer.focus();
    }
}

// 切换密码可见性
function togglePasswordVisibility() {
    const password = elements.password;
    const icon = elements.togglePassword.querySelector('i');
    
    if (password.type === 'password') {
        password.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        password.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// 设置登录按钮加载状态
function setLoginButtonLoading(loading) {
    const btn = elements.loginBtn;
    if (loading) {
        btn.classList.add('loading');
        btn.disabled = true;
    } else {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

// 显示锁定消息
function showLockoutMessage(minutes) {
    elements.loginForm.style.opacity = '0.5';
    elements.loginForm.style.pointerEvents = 'none';
    
    const lockoutNotice = document.createElement('div');
    lockoutNotice.className = 'lockout-notice';
    lockoutNotice.innerHTML = `
        <div style="text-align: center; padding: 20px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; margin-top: 20px;">
            <i class="fas fa-lock" style="font-size: 24px; color: #ef4444; margin-bottom: 12px;"></i>
            <h3 style="color: #ef4444; margin-bottom: 8px;">账户已锁定</h3>
            <p style="color: #64748b;">由于多次登录失败，账户已被锁定 ${minutes} 分钟</p>
        </div>
    `;
    
    const existingNotice = document.querySelector('.lockout-notice');
    if (existingNotice) {
        existingNotice.remove();
    }
    
    elements.loginForm.parentNode.appendChild(lockoutNotice);
}

// 跳转到管理后台
function redirectToAdmin() {
    showToast('info', '跳转中', '正在进入管理后台...');
    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 1000);
}

// 显示提示消息
function showToast(type, title, message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="${icons[type]}"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // 自动移除
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// 导出安全配置（供其他页面使用）
window.SECURITY_CONFIG = SECURITY_CONFIG; 