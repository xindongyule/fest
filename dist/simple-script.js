// ========================================
// 🚀 简化版本脚本 - 无需配置文件
// ========================================

// ========================================
// ⚙️ 动态配置系统 - 支持后台管理
// ========================================

// 默认设置（备用配置）
const defaultSettings = {
    // 📊 统计数据设置
    stats: {
        followers: '1.2K',
        clicks: 856,
        links: 3,
        enableAnimation: true
    },
    
    // 📱 二维码设置
    qrCode: {
        content: "http://weixin.qq.com/r/mp/3BZheWbEczsMrSIa90PO",
        size: 150,
        color: '#2563eb',
        background: '#ffffff'
    }
};

// 从后台管理系统加载配置
function loadConfigFromAdmin() {
    try {
        const adminConfig = localStorage.getItem('main_page_config');
        if (adminConfig) {
            const config = JSON.parse(adminConfig);
            console.log('🎉 从后台管理系统加载配置成功', config);
            return config;
        }
    } catch (error) {
        console.error('❌ 后台配置加载失败:', error);
    }
    return null;
}

// 应用配置到页面
function applyConfigToPage(config) {
    if (!config) return;
    
    try {
        // 更新个人信息
        if (config.profile) {
            const nameElement = document.getElementById('profileName');
            const bioElement = document.getElementById('profileBio');
            
            if (nameElement && config.profile.name) {
                nameElement.textContent = config.profile.name;
            }
            if (bioElement && config.profile.bio) {
                bioElement.textContent = config.profile.bio;
            }
        }
        
        // 更新统计数据
        if (config.stats) {
            updateStatsFromConfig(config.stats);
        }
        
        // 更新链接
        if (config.links && Array.isArray(config.links)) {
            updateLinksFromConfig(config.links);
        }
        
        // 更新二维码文本
        if (config.qrCode) {
            const qrTextElement = document.querySelector('.qr-text');
            const qrDescElement = document.querySelector('.qr-description');
            
            if (qrTextElement && config.qrCode.description) {
                qrTextElement.textContent = config.qrCode.description;
            }
            if (qrDescElement && config.qrCode.subDescription) {
                qrDescElement.textContent = config.qrCode.subDescription;
            }
        }
        
        // 更新外观设置
        if (config.appearance) {
            applyAppearanceSettings(config.appearance);
        }
        
        // 更新头像
        if (config.profile && config.profile.avatar) {
            const avatarElement = document.getElementById('avatarImg');
            if (avatarElement) {
                avatarElement.src = config.profile.avatar;
                console.log('✅ 头像已更新:', config.profile.avatar);
            }
        }
        
        console.log('✅ 配置应用成功');
    } catch (error) {
        console.error('❌ 配置应用失败:', error);
    }
}

// 更新统计数据
function updateStatsFromConfig(stats) {
    const followers = document.querySelector('.stat-item:nth-child(1) .stat-number');
    const clicks = document.querySelector('.stat-item:nth-child(2) .stat-number');
    const links = document.querySelector('.stat-item:nth-child(3) .stat-number');
    
    if (followers && stats.followers) {
        followers.textContent = stats.followers;
    }
    if (clicks && typeof stats.clicks === 'number') {
        clicks.textContent = stats.clicks;
        clickCount = stats.clicks; // 更新全局点击计数
    }
    if (links && typeof stats.links === 'number') {
        links.textContent = stats.links;
    }
    
    // 更新动画设置
    if (typeof stats.enableAnimation === 'boolean') {
        customSettings.stats.enableAnimation = stats.enableAnimation;
        console.log(`✅ 数字动画效果配置已更新: ${stats.enableAnimation ? '启用' : '禁用'}`);
    }
}

// 更新链接
function updateLinksFromConfig(links) {
    const mainLinksContainer = document.querySelector('.main-links');
    if (!mainLinksContainer) return;
    
    // 清空现有链接
    mainLinksContainer.innerHTML = '';
    
    // 按顺序排序并添加链接
    const sortedLinks = [...links].sort((a, b) => a.order - b.order);
    
    sortedLinks.forEach(link => {
        const linkElement = createLinkElement(link);
        mainLinksContainer.appendChild(linkElement);
    });
}

// 应用外观设置
function applyAppearanceSettings(appearance) {
    console.log('🎨 应用外观设置:', appearance);
    
    // 更新背景图片
    if (appearance.backgroundImage) {
        // 创建或更新背景图片样式
        let backgroundStyle = document.getElementById('custom-background-style');
        if (!backgroundStyle) {
            backgroundStyle = document.createElement('style');
            backgroundStyle.id = 'custom-background-style';
            document.head.appendChild(backgroundStyle);
        }
        
        // 应用背景图片到profile-container
        backgroundStyle.textContent = `
            .profile-container::before {
                background: 
                    url(${appearance.backgroundImage}) center/cover no-repeat,
                    linear-gradient(45deg, #ff6b6b, #4ecdc4) !important;
            }
        `;
        
        console.log('✅ 背景图片已更新:', appearance.backgroundImage);
    }
    
    // 更新背景透明度
    if (typeof appearance.backgroundOpacity === 'number') {
        // 创建或更新背景遮罩样式
        let overlayStyle = document.getElementById('background-overlay-style');
        if (!overlayStyle) {
            overlayStyle = document.createElement('style');
            overlayStyle.id = 'background-overlay-style';
            document.head.appendChild(overlayStyle);
        }
        
        // 应用背景透明度到profile-container
        overlayStyle.textContent = `
            .profile-container::after {
                background: rgba(255, 255, 255, ${appearance.backgroundOpacity}) !important;
            }
        `;
        
        console.log('✅ 背景透明度已更新:', Math.round(appearance.backgroundOpacity * 100) + '%');
    }
    
    // 应用默认主题
    if (appearance.defaultTheme) {
        if (appearance.defaultTheme !== currentTheme) {
            currentTheme = appearance.defaultTheme;
            document.body.className = `theme-${currentTheme}`;
            updateThemeButton();
            console.log('✅ 默认主题已更新:', appearance.defaultTheme);
        }
    }
}

// 创建链接元素
function createLinkElement(link) {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = `main-link ${link.style}`;
    a.setAttribute('data-analytics', link.title);
    a.target = '_blank';
    
    let iconHTML;
    if (link.iconType === 'emoji') {
        iconHTML = `<span class="watermelon-icon">${link.icon}</span>`;
    } else {
        iconHTML = `<i class="${link.icon}"></i>`;
    }
    
    a.innerHTML = `
        ${iconHTML}
        <span>${link.title}</span>
        <i class="fas fa-arrow-right arrow"></i>
    `;
    
    return a;
}

// 获取最终配置（优先使用后台配置，否则使用默认配置）
const adminConfig = loadConfigFromAdmin();
const customSettings = adminConfig ? {
    stats: adminConfig.stats || defaultSettings.stats,
    qrCode: adminConfig.qrCode || defaultSettings.qrCode
} : defaultSettings;

// 全局变量
let currentTheme = 'light';
let clickCount = 856; // 点击统计

// DOM 元素
const elements = {
    shareModal: document.getElementById('shareModal'),
    closeShareModal: document.getElementById('closeShareModal'),
    shareBtn: document.getElementById('shareBtn'),
    themeBtn: document.getElementById('themeBtn'),
    analyticsBtn: document.getElementById('analyticsBtn'),
    shareUrl: document.getElementById('shareUrl'),
    copyUrlBtn: document.getElementById('copyUrlBtn'),
    qrCanvas: document.getElementById('qrCanvas')
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 页面加载完成');
    
    // 优先应用后台管理系统的配置
    const config = loadConfigFromAdmin();
    if (config) {
        applyConfigToPage(config);
    }
    
    initializeApp();
    setupEventListeners();
    generateQRCode();
    setupLinkTracking();
    initMouseEffects(); // 初始化鼠标特效
    
    // 延迟初始化统计区域特效
    setTimeout(() => {
        setupStatsHoverEffects();
        // 确保所有数据加载完成后再执行动画（此时配置已更新）
        animateStatNumbers();
        // 初始化个人简介特效
        initProfileBioEffects();
    }, 500);
});

// 初始化应用
function initializeApp() {
    console.log('🚀 应用初始化中...');
    
    // 初始化统计数据基础值
    initializeStatsData();
    
    // 设置分享URL
    if (elements.shareUrl) {
        elements.shareUrl.value = window.location.href;
    }
    
    // 添加主题切换动画
    document.body.classList.add('theme-transition');
    
    // 从本地存储加载主题
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'dark') {
            document.body.classList.add('dark-theme');
            updateThemeButton();
        }
    }
    
    // 加载统计数据（包括实际点击数）
    loadFromStorage();
}

// 设置事件监听器
function setupEventListeners() {
    // 隐蔽的管理后台入口
    const adminSecretEntry = document.getElementById('adminSecretEntry');
    if (adminSecretEntry) {
        let clickCount = 0;
        let clickTimer = null;
        
        adminSecretEntry.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            clickCount++;
            
            // 清除之前的定时器
            if (clickTimer) {
                clearTimeout(clickTimer);
            }
            
            // 设置3秒内重置点击计数
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 3000);
            
            // 需要连续点击3次才能进入管理后台
            if (clickCount === 1) {
                showNotification('🔐 管理入口已激活', 'info', 1500);
            } else if (clickCount === 2) {
                showNotification('🔑 再次点击进入管理后台', 'warning', 2000);
            } else if (clickCount >= 3) {
                showNotification('🚀 正在跳转到管理后台...', 'success', 1500);
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 500);
                clickCount = 0;
            }
        });
        
        console.log('🔐 管理后台隐蔽入口已初始化');
    }
    
    // 分享相关
    if (elements.shareBtn) {
        elements.shareBtn.addEventListener('click', openShareModal);
    }
    if (elements.closeShareModal) {
        elements.closeShareModal.addEventListener('click', closeShareModal);
    }
    if (elements.copyUrlBtn) {
        elements.copyUrlBtn.addEventListener('click', copyShareUrl);
    }
    
    // 工具栏按钮
    if (elements.themeBtn) {
        elements.themeBtn.addEventListener('click', toggleTheme);
    }
    if (elements.analyticsBtn) {
        elements.analyticsBtn.addEventListener('click', showAnalytics);
    }
    
    // 点击模态框背景关闭
    if (elements.shareModal) {
        elements.shareModal.addEventListener('click', function(e) {
            if (e.target === this) closeShareModal();
        });
    }
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && elements.shareModal.classList.contains('active')) {
            closeShareModal();
        }
    });
}

// 打开分享模态框
function openShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        elements.shareUrl.value = window.location.href;
        elements.shareUrl.select(); // 自动选中链接
    }
}

// 关闭分享模态框
function closeShareModal() {
    if (elements.shareModal) {
        elements.shareModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 复制分享链接
function copyShareUrl() {
    if (elements.shareUrl && elements.copyUrlBtn) {
        elements.shareUrl.select();
        
        try {
            // 使用现代剪贴板API
            if (navigator.clipboard) {
                navigator.clipboard.writeText(elements.shareUrl.value).then(() => {
                    showCopySuccess();
                });
            } else {
                // 兼容旧浏览器
                document.execCommand('copy');
                showCopySuccess();
            }
        } catch (err) {
            console.error('复制失败:', err);
            showNotification('复制失败，请手动复制', 'error');
        }
    }
}

// 显示复制成功效果
function showCopySuccess() {
    const originalText = elements.copyUrlBtn.innerHTML;
    elements.copyUrlBtn.innerHTML = '<i class="fas fa-check"></i>';
    elements.copyUrlBtn.style.background = '#28a745';
    
    setTimeout(() => {
        elements.copyUrlBtn.innerHTML = originalText;
        elements.copyUrlBtn.style.background = '';
    }, 2000);
    
    showNotification('链接已复制到剪贴板！', 'success');
}

// 切换主题
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark-theme');
    
    // 保存到本地存储
    localStorage.setItem('theme', currentTheme);
    
    updateThemeButton();
    showNotification(`已切换到${currentTheme === 'dark' ? '深色' : '浅色'}主题`, 'success');
}

// 更新主题按钮文字
function updateThemeButton() {
    if (elements.themeBtn) {
        const themeText = currentTheme === 'dark' ? '浅色' : '深色';
        const icon = currentTheme === 'dark' ? 'fa-sun' : 'fa-palette';
        elements.themeBtn.innerHTML = `<i class="fas ${icon}"></i><span>${themeText}</span>`;
    }
}

// 显示统计信息
function showAnalytics() {
    // 获取当前统计数据
    const followersElement = document.querySelector('.stat-number');
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    const linksElement = document.querySelectorAll('.stat-number')[2];
    
    const followers = followersElement ? followersElement.textContent : '1.2K';
    const clicks = clicksElement ? clicksElement.textContent : clickCount;
    const links = linksElement ? linksElement.textContent : '3';
    
    const message = `📊 数据统计\n👥 关注者：${followers}\n👆 总点击：${clicks}\n🔗 链接数：${links}`;
    showNotification(message, 'info', 5000);
}

// 生成二维码
function generateQRCode() {
    if (elements.qrCanvas) {
        if (typeof QRious !== 'undefined') {
            try {
                const qr = new QRious({
                    element: elements.qrCanvas,
                    value: customSettings.qrCode.content,        // 使用自定义内容
                    size: customSettings.qrCode.size,            // 使用自定义尺寸
                    background: customSettings.qrCode.background, // 使用自定义背景色
                    foreground: customSettings.qrCode.color,     // 使用自定义前景色
                    level: 'M'
                });
                console.log('✅ 二维码生成成功，内容:', customSettings.qrCode.content);
            } catch (error) {
                console.error('二维码生成失败:', error);
                drawPlaceholderQR();
            }
        } else {
            console.warn('QRious 库未加载，使用占位符');
            drawPlaceholderQR();
        }
    }
}

// 绘制占位符二维码
function drawPlaceholderQR() {
    if (elements.qrCanvas) {
        elements.qrCanvas.width = customSettings.qrCode.size;
        elements.qrCanvas.height = customSettings.qrCode.size;
        const ctx = elements.qrCanvas.getContext('2d');
        
        const size = customSettings.qrCode.size;
        
        // 绘制背景
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);
        
        // 绘制边框
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, size-2, size-2);
        
        // 绘制文字
        ctx.fillStyle = '#666';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('二维码', size/2, size/2-10);
        ctx.font = '12px Arial';
        ctx.fillText('点击刷新', size/2, size/2+10);
        
        // 添加点击事件重新生成
        elements.qrCanvas.style.cursor = 'pointer';
        elements.qrCanvas.onclick = generateQRCode;
    }
}

// 链接点击追踪
function setupLinkTracking() {
    document.querySelectorAll('[data-analytics]').forEach(link => {
        link.addEventListener('click', function(e) {
            const linkName = this.getAttribute('data-analytics');
            const linkUrl = this.href || '';
            trackLinkClick(linkName, linkUrl);
        });
    });
}

function trackLinkClick(linkName, linkUrl) {
    clickCount++;
    console.log(`📈 点击追踪: ${linkName}, 总点击数: ${clickCount}`);
    
    // 更新页面显示
    updateClickDisplay();
    
    // 保存总点击数
    localStorage.setItem('clickCount', clickCount);
    
    // 记录详细的点击数据
    recordLinkClick(linkName, linkUrl);
}

// 记录链接点击详情
function recordLinkClick(linkName, linkUrl) {
    try {
        const now = new Date();
        const today = now.toISOString().split('T')[0]; // YYYY-MM-DD格式
        const timestamp = now.getTime();
        const hour = now.getHours();
        
        // 获取现有的点击记录
        const clickRecords = JSON.parse(localStorage.getItem('link_click_records') || '{}');
        
        // 初始化日期记录
        if (!clickRecords[today]) {
            clickRecords[today] = {};
        }
        
        // 初始化链接记录
        if (!clickRecords[today][linkName]) {
            clickRecords[today][linkName] = {
                name: linkName,
                url: linkUrl,
                clicks: 0,
                timestamps: [],
                hourlyStats: new Array(24).fill(0) // 24小时统计
            };
        }
        
        // 增加点击数并记录时间戳和小时统计
        clickRecords[today][linkName].clicks++;
        clickRecords[today][linkName].timestamps.push(timestamp);
        clickRecords[today][linkName].hourlyStats[hour]++;
        
        // 保存更新后的记录
        localStorage.setItem('link_click_records', JSON.stringify(clickRecords));
        
        // 更新每日统计
        updateDailyStats(today);
        
        console.log(`📊 点击记录已保存: ${linkName} (${today} ${hour}:00)`);
    } catch (error) {
        console.error('❌ 点击记录保存失败:', error);
    }
}

// 更新每日统计
function updateDailyStats(date) {
    try {
        const dailyStats = JSON.parse(localStorage.getItem('daily_stats') || '{}');
        const clickRecords = JSON.parse(localStorage.getItem('link_click_records') || '{}');
        
        if (clickRecords[date]) {
            let totalClicks = 0;
            let uniqueLinks = 0;
            const linkStats = {};
            
            Object.values(clickRecords[date]).forEach(linkData => {
                totalClicks += linkData.clicks;
                uniqueLinks++;
                linkStats[linkData.name] = linkData.clicks;
            });
            
            dailyStats[date] = {
                totalClicks,
                uniqueLinks,
                linkStats,
                lastUpdate: Date.now()
            };
            
            localStorage.setItem('daily_stats', JSON.stringify(dailyStats));
        }
    } catch (error) {
        console.error('❌ 每日统计更新失败:', error);
    }
}

// 显示通知
function showNotification(message, type = 'info', duration = 3000) {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        max-width: 300px;
        word-wrap: break-word;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // 设置颜色
    const colors = {
        success: '#28a745',
        error: '#dc3545', 
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // 设置内容
    notification.innerHTML = message.replace(/\n/g, '<br>');
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动消失
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, duration);
}

// 从本地存储加载数据
function loadFromStorage() {
    const savedClickCount = localStorage.getItem('clickCount');
    if (savedClickCount) {
        clickCount = parseInt(savedClickCount);
        // 更新页面显示的点击数（不使用动画避免重置）
        updateClickDisplayDirect();
    } else {
        // 如果没有保存的点击数，使用配置的基础值
        clickCount = statsConfig.clicks;
    }
}

// 直接更新点击数显示（无动画）
function updateClickDisplayDirect() {
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    if (clicksElement) {
        clicksElement.textContent = clickCount;
    }
}

// 更新页面上的点击数显示
function updateClickDisplay() {
    const clicksElement = document.querySelectorAll('.stat-number')[1];
    if (clicksElement) {
        // 添加更新动画效果
        clicksElement.classList.add('updating');
        setTimeout(() => {
            clicksElement.textContent = clickCount;
            clicksElement.classList.remove('updating');
        }, 300);
    }
}

// 添加统计区域的动态粒子效果
function addStatsParticles() {
    const statsContainer = document.querySelector('.profile-stats');
    if (!statsContainer) return;
    
    // 创建粒子元素
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            
            statsContainer.appendChild(particle);
            
            // 3秒后移除粒子
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 4000);
        }, i * 500);
    }
}

// 统计区域基础数据配置（使用自定义设置）
const statsConfig = {
    followers: customSettings.stats.followers,  // 关注者基础值
    clicks: customSettings.stats.clicks,        // 点击量基础值
    links: customSettings.stats.links           // 链接数基础值
};

// 初始化统计数据
function initializeStatsData() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3) {
        statNumbers[0].textContent = statsConfig.followers;  // 关注者
        statNumbers[1].textContent = statsConfig.clicks;     // 点击量（会被实际点击数覆盖）
        statNumbers[2].textContent = statsConfig.links;      // 链接数
    }
}

// 统计数据的数字滚动动画（修复版）
function animateStatNumbers() {
    // 检查是否启用动画
    if (!customSettings.stats.enableAnimation) {
        console.log('📊 统计数字动画已禁用');
        return;
    }
    
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((element, index) => {
        const targetValue = element.textContent.trim();
        let finalValue = 0;
        let isKFormat = false;
        
        // 解析数值
        if (targetValue.includes('K')) {
            isKFormat = true;
            finalValue = parseFloat(targetValue.replace('K', '')) * 1000;
        } else if (!isNaN(parseFloat(targetValue))) {
            finalValue = parseFloat(targetValue);
        } else {
            return; // 跳过非数字内容
        }
        
        // 开始动画
        let currentValue = 0;
        const increment = finalValue / 50;
        const duration = 1200;
        const stepTime = duration / 50;
        
        element.textContent = '0';
        
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
                
                // 恢复最终格式
                if (isKFormat) {
                    element.textContent = (currentValue / 1000).toFixed(1) + 'K';
                } else {
                    element.textContent = Math.floor(currentValue);
                }
                return;
            }
            
            // 动画过程中的显示格式
            if (isKFormat) {
                const kValue = currentValue / 1000;
                element.textContent = kValue.toFixed(1) + 'K';
            } else {
                element.textContent = Math.floor(currentValue);
            }
        }, stepTime);
    });
}

// 统计区域鼠标悬停特效
function setupStatsHoverEffects() {
    const statsContainer = document.querySelector('.profile-stats');
    if (!statsContainer) return;
    
    statsContainer.addEventListener('mouseenter', () => {
        addStatsParticles();
    });
    
    // 统计项点击特效
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('click', () => {
            // 创建点击波纹
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: statsRipple 0.6s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            item.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    });
}

// 添加统计波纹动画样式
const statsAnimationStyles = document.createElement('style');
statsAnimationStyles.textContent = `
    @keyframes statsRipple {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(statsAnimationStyles);

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，刷新二维码
        generateQRCode();
    }
});

console.log('🎉 简化版脚本加载完成！');

// ========================= 🖱️ 高级鼠标特效系统 =========================

// 鼠标特效变量
let mouseX = 0;
let mouseY = 0;
let customCursor = null;
let mouseGlow = null;
let trailElements = [];
let isMouseDown = false;

// 初始化鼠标特效
function initMouseEffects() {
    // 检测是否为移动设备
    if (window.innerWidth <= 768) {
        console.log('📱 移动设备，跳过鼠标特效');
        return;
    }

    console.log('🖱️ 初始化鼠标特效');
    createCustomCursor();
    createMouseGlow();
    setupMouseListeners();
    addMagneticEffect();
    initAvatarEffects();
}

// 创建自定义光标
function createCustomCursor() {
    customCursor = document.createElement('div');
    customCursor.className = 'custom-cursor';
    document.body.appendChild(customCursor);
    console.log('✅ 自定义光标已创建');
}

// 创建鼠标光晕
function createMouseGlow() {
    mouseGlow = document.createElement('div');
    mouseGlow.className = 'mouse-glow';
    document.body.appendChild(mouseGlow);
}

// 设置鼠标事件监听
function setupMouseListeners() {
    // 鼠标移动
    document.addEventListener('mousemove', handleMouseMove);
    
    // 鼠标按下
    document.addEventListener('mousedown', handleMouseDown);
    
    // 鼠标松开
    document.addEventListener('mouseup', handleMouseUp);
    
    // 鼠标进入页面
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // 鼠标离开页面
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // 为可交互元素添加悬停效果
    const interactiveElements = document.querySelectorAll('a, button, .tool-btn, .main-link, .stat-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            if (customCursor) {
                customCursor.classList.add('hover');
                createHoverParticles();
            }
        });
        
        element.addEventListener('mouseleave', () => {
            if (customCursor) {
                customCursor.classList.remove('hover');
            }
        });
        
        // 为链接添加鼠标跟踪效果
        if (element.classList.contains('main-link')) {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                element.style.setProperty('--mouse-x', x + '%');
                element.style.setProperty('--mouse-y', y + '%');
            });
        }
    });
}

// 增强鼠标移动处理
function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // 即时更新光标位置（居中显示）
    if (customCursor) {
        // 根据光标大小动态调整偏移
        const cursorSize = customCursor.classList.contains('hover') ? 15 : 
                          customCursor.classList.contains('click') ? 9 : 12;
        const offset = cursorSize / 2;
        customCursor.style.transform = `translate(${mouseX - offset}px, ${mouseY - offset}px)`;
    }
    
    // 即时更新彩虹光晕位置（居中显示）
    if (mouseGlow) {
        mouseGlow.style.transform = `translate(${mouseX - 100}px, ${mouseY - 100}px)`;
    }
    
    // 增加轨迹生成频率，创造更丰富的效果
    if (Math.random() < 0.05) {
        createRainbowTrail();
    }
    
    // 添加随机魔法粒子
    if (Math.random() < 0.01) {
        createMagicParticle();
    }
}

// 处理鼠标按下
function handleMouseDown(e) {
    isMouseDown = true;
    
    if (customCursor) {
        customCursor.classList.add('click');
    }
    
    // 创建点击涟漪效果
    createClickRipple(e.clientX, e.clientY);
}

// 处理鼠标松开
function handleMouseUp() {
    isMouseDown = false;
    
    if (customCursor) {
        customCursor.classList.remove('click');
    }
}

// 鼠标进入页面
function handleMouseEnter() {
    if (mouseGlow) {
        mouseGlow.classList.add('active');
    }
}

// 鼠标离开页面
function handleMouseLeave() {
    if (mouseGlow) {
        mouseGlow.classList.remove('active');
    }
}

// 彩虹轨迹效果
function createRainbowTrail() {
    const trail = document.createElement('div');
    trail.className = 'mouse-trail';
    trail.style.transform = `translate(${mouseX - 2}px, ${mouseY - 2}px)`;
    
    document.body.appendChild(trail);
    
    // 与CSS动画同步清理
    setTimeout(() => {
        if (trail.parentNode) {
            trail.parentNode.removeChild(trail);
        }
    }, 400);
}

// 随机魔法粒子
function createMagicParticle() {
    const particle = document.createElement('div');
    particle.className = 'hover-particle';
    
    // 添加随机星星效果
    if (Math.random() < 0.3) {
        particle.classList.add('star');
    }
    
    // 随机偏移位置
    const offsetX = (Math.random() - 0.5) * 40;
    const offsetY = (Math.random() - 0.5) * 40;
    
    particle.style.transform = `translate(${mouseX + offsetX - 1.5}px, ${mouseY + offsetY - 1.5}px)`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 800);
}

// 炫彩涟漪效果
function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.transform = `translate(${x}px, ${y}px)`;
    
    document.body.appendChild(ripple);
    
    // 创建额外的爆炸粒子
    createClickBurstParticles(x, y);
    
    // 与CSS动画同步清理
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// 点击爆炸粒子效果
function createClickBurstParticles(x, y) {
    const colors = ['#667eea', '#f093fb', '#ffecd2', '#a8edea'];
    
    // 创建8个方向的爆炸粒子
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            
            // 随机选择颜色和形状
            if (Math.random() < 0.4) {
                particle.classList.add('star');
            }
            
            // 计算8个方向的位置
            const angle = (i * 45) * Math.PI / 180;
            const distance = 30 + Math.random() * 20;
            const offsetX = Math.cos(angle) * distance;
            const offsetY = Math.sin(angle) * distance;
            
            particle.style.transform = `translate(${x + offsetX - 1.5}px, ${y + offsetY - 1.5}px)`;
            particle.style.color = colors[i % colors.length];
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }, i * 20); // 交错产生效果
    }
}

// 增强悬停粒子效果
function createHoverParticles() {
    const colors = ['#667eea', '#f093fb', '#ffecd2', '#a8edea'];
    
    // 生成多个魔法粒子
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            
            // 30%概率生成星星形状
            if (Math.random() < 0.3) {
                particle.classList.add('star');
            }
            
            // 随机颜色
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // 更大的随机范围，创造更丰富的效果
            const offsetX = (Math.random() - 0.5) * 25;
            const offsetY = (Math.random() - 0.5) * 25;
            
            particle.style.transform = `translate(${mouseX + offsetX - 1.5}px, ${mouseY + offsetY - 1.5}px)`;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 800);
        }, i * 100); // 交错产生
    }
}

// 添加磁性效果
function addMagneticEffect() {
    const magneticElements = document.querySelectorAll('.main-link, .tool-btn, .avatar-container');
    
    magneticElements.forEach(element => {
        element.classList.add('magnetic-hover');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) * 0.1;
            const deltaY = (e.clientY - centerY) * 0.1;
            
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = '';
        });
    });
}

// 清理所有鼠标特效
function cleanupMouseEffects() {
    // 清理轨迹元素
    const trails = document.querySelectorAll('.mouse-trail');
    trails.forEach(trail => trail.remove());
    
    // 清理涟漪元素
    const ripples = document.querySelectorAll('.click-ripple');
    ripples.forEach(ripple => ripple.remove());
    
    // 清理粒子元素
    const particles = document.querySelectorAll('.hover-particle');
    particles.forEach(particle => particle.remove());
}

// 窗口大小改变时重新初始化
window.addEventListener('resize', () => {
    // 如果从桌面切换到移动端，清理特效
    if (window.innerWidth <= 768) {
        cleanupMouseEffects();
        if (customCursor) {
            customCursor.remove();
            customCursor = null;
        }
        if (mouseGlow) {
            mouseGlow.remove();
            mouseGlow = null;
        }
    } else if (!customCursor) {
        // 如果从移动端切换到桌面，重新初始化
        initMouseEffects();
    }
});

// 页面隐藏时清理资源
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cleanupMouseEffects();
    }
});

// ========================= 🖼️ 头像特效增强系统 =========================

// 初始化头像特效
function initAvatarEffects() {
    console.log('🖼️ 初始化头像特效');
    const avatarContainer = document.querySelector('.avatar-container');
    const avatar = document.querySelector('.avatar');
    
    if (!avatarContainer || !avatar) {
        console.warn('头像元素未找到');
        return;
    }
    
    // 添加头像点击效果
    setupAvatarClickEffect(avatar);
    
    // 添加头像跟随视差效果
    setupAvatarParallax(avatarContainer);
    
    // 添加头像呼吸效果
    setupAvatarBreathing(avatarContainer);
    
    // 添加头像加载动画
    setupAvatarLoadAnimation(avatar);
    
    // 强制确保头像居中
    forceAvatarCenter(avatar, avatarContainer);
}

// 头像点击特效
function setupAvatarClickEffect(avatar) {
    avatar.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 创建点击波纹
        createAvatarRipple(e);
        
        // 头像震动效果
        avatar.style.animation = 'none';
        setTimeout(() => {
            avatar.style.animation = 'avatarShake 0.5s ease-in-out';
        }, 10);
        
        // 显示特殊通知
        showNotification('✨ 头像被点击了！你真有眼光~', 'success', 2000);
        
        console.log('🖼️ 头像被点击');
    });
}

// 创建头像点击波纹
function createAvatarRipple(e) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10;
        transform: translate(-50%, -50%) scale(0);
        animation: avatarRippleExpand 0.8s ease-out forwards;
    `;
    
    const rect = e.target.getBoundingClientRect();
    ripple.style.left = (e.clientX - rect.left) + 'px';
    ripple.style.top = (e.clientY - rect.top) + 'px';
    
    e.target.parentNode.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

// 头像视差效果
function setupAvatarParallax(avatarContainer) {
    document.addEventListener('mousemove', function(e) {
        if (window.innerWidth <= 768) return; // 移动端跳过
        
        const rect = avatarContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / window.innerWidth;
        const deltaY = (e.clientY - centerY) / window.innerHeight;
        
        // 轻微的头像跟随效果
        const moveX = deltaX * 3; // 减小移动幅度
        const moveY = deltaY * 3;
        
        // 只对容器应用轻微偏移，不影响内部元素的居中
        avatarContainer.style.transform = `translate(${moveX}px, ${moveY}px)`;
        
        // 确保头像本身保持居中
        const avatar = avatarContainer.querySelector('.avatar');
        if (avatar) {
            avatar.style.transform = 'translate(-50%, -50%)';
        }
    });
}

// 头像呼吸效果
function setupAvatarBreathing(avatarContainer) {
    let breathingActive = true;
    
    function breathe() {
        if (!breathingActive) return;
        
        avatarContainer.style.transition = 'filter 2s ease-in-out';
        avatarContainer.style.filter = `
            drop-shadow(0 0 40px rgba(102, 126, 234, 0.4))
            brightness(1.05)
        `;
        
        setTimeout(() => {
            if (!breathingActive) return;
            avatarContainer.style.filter = `
                drop-shadow(0 0 30px rgba(102, 126, 234, 0.3))
                brightness(1)
            `;
        }, 2000);
        
        setTimeout(breathe, 4000);
    }
    
    // 鼠标悬停时停止呼吸效果
    avatarContainer.addEventListener('mouseenter', () => {
        breathingActive = false;
    });
    
    avatarContainer.addEventListener('mouseleave', () => {
        breathingActive = true;
        setTimeout(breathe, 1000);
    });
    
    // 开始呼吸效果
    breathe();
}

// 头像加载动画
function setupAvatarLoadAnimation(avatar) {
    // 检查图片是否已加载
    if (avatar.complete) {
        triggerLoadAnimation();
    } else {
        avatar.addEventListener('load', triggerLoadAnimation);
        avatar.addEventListener('error', () => {
            console.warn('头像加载失败');
            triggerLoadAnimation(); // 即使失败也显示动画
        });
    }
    
    function triggerLoadAnimation() {
        avatar.style.opacity = '0';
        avatar.style.transform = 'scale(0.8)';
        avatar.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        
        setTimeout(() => {
            avatar.style.opacity = '1';
            avatar.style.transform = 'scale(1)';
        }, 100);
        
        // 延迟显示欢迎效果
        setTimeout(() => {
            showNotification('🎉 欢迎来到小南资源库！', 'info', 3000);
        }, 1000);
    }
}

// 添加头像动画样式
const avatarAnimationStyles = document.createElement('style');
avatarAnimationStyles.textContent = `
    @keyframes avatarShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-3px) rotate(-1deg); }
        75% { transform: translateX(3px) rotate(1deg); }
    }
    
    @keyframes avatarRippleExpand {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
        }
    }
    
    .avatar-glow-pulse {
        animation: avatarGlowPulse 1.5s ease-in-out;
    }
    
    @keyframes avatarGlowPulse {
        0%, 100% {
            filter: drop-shadow(0 0 30px rgba(102, 126, 234, 0.3));
        }
        50% {
            filter: drop-shadow(0 0 60px rgba(102, 126, 234, 0.8));
        }
    }
`;

document.head.appendChild(avatarAnimationStyles);

// 强制头像居中函数
function forceAvatarCenter(avatar, avatarContainer) {
    console.log('🎯 强制设置头像居中');
    
    // 强制设置头像居中
    if (avatar) {
        avatar.style.position = 'absolute';
        avatar.style.top = '50%';
        avatar.style.left = '50%';
        avatar.style.transform = 'translate(-50%, -50%)';
        avatar.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    }
    
    // 强制设置边框居中
    const avatarBorder = avatarContainer.querySelector('.avatar-border');
    if (avatarBorder) {
        avatarBorder.style.position = 'absolute';
        avatarBorder.style.top = '50%';
        avatarBorder.style.left = '50%';
        avatarBorder.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
    }
    
    // 定期检查并修正位置
    setInterval(() => {
        if (avatar && avatar.style.transform !== 'translate(-50%, -50%)') {
            avatar.style.setProperty('transform', 'translate(-50%, -50%)', 'important');
        }
    }, 1000);
    
    console.log('✅ 头像居中设置完成');
}

// ========================= 🎨 个人简介特效系统 =========================

// 初始化个人简介特效
function initProfileBioEffects() {
    console.log('🎨 初始化个人简介特效');
    const profileBio = document.querySelector('.profile-bio');
    
    if (!profileBio) {
        console.warn('个人简介元素未找到');
        return;
    }
    
    // 添加鼠标悬停粒子效果
    setupBioHoverEffects(profileBio);
    
    // 添加点击特效
    setupBioClickEffects(profileBio);
    
    // 添加文字闪烁特效
    setupBioGlowEffect(profileBio);
}

// 个人简介悬停粒子效果
function setupBioHoverEffects(bioElement) {
    bioElement.addEventListener('mouseenter', () => {
        createBioParticles(bioElement);
    });
    
    bioElement.addEventListener('mousemove', (e) => {
        // 随机创建小粒子
        if (Math.random() < 0.1) {
            createFloatingText(e.clientX, e.clientY);
        }
    });
}

// 创建个人简介粒子
function createBioParticles(container) {
    const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'bio-particle';
            
            // 随机位置和颜色
            const rect = container.getBoundingClientRect();
            const x = rect.left + Math.random() * rect.width;
            const y = rect.top + Math.random() * rect.height;
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: bioParticleFloat 2s ease-out forwards;
                box-shadow: 0 0 10px ${color};
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }, i * 100);
    }
}

// 创建浮动文字
function createFloatingText(x, y) {
    const texts = ['✨', '🌟', '💫', '⭐', '🎨', '🚀'];
    const text = texts[Math.floor(Math.random() * texts.length)];
    
    const floatingText = document.createElement('div');
    floatingText.textContent = text;
    floatingText.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 16px;
        pointer-events: none;
        z-index: 1000;
        animation: floatUpFade 1.5s ease-out forwards;
        color: #667eea;
        text-shadow: 0 0 10px #667eea;
    `;
    
    document.body.appendChild(floatingText);
    
    setTimeout(() => {
        if (floatingText.parentNode) {
            floatingText.parentNode.removeChild(floatingText);
        }
    }, 1500);
}

// 个人简介点击特效
function setupBioClickEffects(bioElement) {
    let clickCount = 0;
    const originalText = bioElement.textContent;
    const alternateTexts = [
        '[ 欢迎来到小南的数字世界 ]',
        '[ 探索·发现·分享 ]',
        '[ 科技改变生活 ]',
        '[ 创意无限·梦想启航 ]'
    ];
    
    bioElement.addEventListener('click', () => {
        clickCount++;
        
        // 创建点击波纹
        createBioRipple(bioElement);
        
        // 文字闪烁变化
        bioElement.style.animation = 'none';
        bioElement.style.opacity = '0';
        
        setTimeout(() => {
            if (clickCount % 5 === 0) {
                // 每5次点击显示特殊文字
                bioElement.textContent = alternateTexts[Math.floor(Math.random() * alternateTexts.length)];
                setTimeout(() => {
                    bioElement.textContent = originalText;
                }, 2000);
            }
            
            bioElement.style.opacity = '1';
            bioElement.style.animation = 'gradientShift 4s ease-in-out infinite alternate';
        }, 200);
        
        // 显示特殊通知
        if (clickCount === 1) {
            showNotification('🎨 个人简介被激活了！', 'success', 2000);
        } else if (clickCount % 10 === 0) {
            showNotification(`🌟 你已经点击了${clickCount}次简介！`, 'info', 2000);
        }
    });
}

// 创建简介点击波纹
function createBioRipple(element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    
    ripple.style.cssText = `
        position: absolute;
        left: 50%;
        top: 50%;
        width: 0;
        height: 0;
        background: radial-gradient(circle, rgba(102, 126, 234, 0.4) 0%, transparent 70%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: bioRippleExpand 1s ease-out forwards;
        pointer-events: none;
        z-index: 5;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 1000);
}

// 个人简介发光效果
function setupBioGlowEffect(bioElement) {
    let glowIntensity = 0;
    let glowDirection = 1;
    
    setInterval(() => {
        glowIntensity += glowDirection * 0.02;
        
        if (glowIntensity >= 1) {
            glowDirection = -1;
        } else if (glowIntensity <= 0) {
            glowDirection = 1;
        }
        
        const alpha = 0.2 + (glowIntensity * 0.3);
        bioElement.style.textShadow = `
            0 0 20px rgba(102, 126, 234, ${alpha}),
            0 0 40px rgba(102, 126, 234, ${alpha * 0.5}),
            0 0 60px rgba(102, 126, 234, ${alpha * 0.3})
        `;
    }, 100);
}

// 添加个人简介特效样式
const bioEffectStyles = document.createElement('style');
bioEffectStyles.textContent = `
    @keyframes bioParticleFloat {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.3);
        }
    }
    
    @keyframes floatUpFade {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-40px) scale(1.2);
        }
    }
    
    @keyframes bioRippleExpand {
        0% {
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            width: 200px;
            height: 200px;
            opacity: 0;
        }
    }
    
    .bio-particle {
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(bioEffectStyles);

console.log('�� 个人简介特效系统加载完成！'); 