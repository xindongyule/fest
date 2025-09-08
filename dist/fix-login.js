// 紧急修复脚本 - 解决登录页面无限刷新问题
// 在浏览器控制台运行此脚本

(function() {
    'use strict';
    
    console.log('🔧 开始修复登录循环问题...');
    
    // 1. 清理所有可能冲突的认证数据
    const keysToRemove = [
        'adminLoginTime',
        'adminToken', 
        'lastActivity',
        'sessionTimeout',
        'admin_session',
        'login_attempts',
        'lockout_time',
        'admin_credentials',
        'adminSessionId'
    ];
    
    keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
    });
    
    // 2. 清理任何可能的定时器
    for (let i = 0; i < 1000; i++) {
        clearTimeout(i);
        clearInterval(i);
    }
    
    // 3. 强制停止任何重定向
    if (window.location.href.includes('login.html')) {
        console.log('✅ 当前在登录页面，已清理数据');
        
        // 重新初始化默认凭据
        const defaultCredentials = {
            username: 'admin',
            password: btoa('admin123')
        };
        localStorage.setItem('admin_credentials', JSON.stringify(defaultCredentials));
        
        // 重置登录尝试次数
        localStorage.setItem('login_attempts', '0');
        
        console.log('🔑 已重置为默认凭据: admin / admin123');
        console.log('🔄 请刷新页面重新登录');
        
    } else if (window.location.href.includes('admin.html')) {
        console.log('⚠️  当前在管理页面但无有效认证，即将跳转到登录页');
        window.location.replace('login.html');
    }
    
    console.log('✅ 修复完成！');
    
})(); 