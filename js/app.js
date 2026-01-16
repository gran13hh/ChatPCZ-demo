/**
 * 年终总结主逻辑 - Gemini风格
 * 支持模拟LLM对话和流式输出
 */

(function () {
    'use strict';

    // DOM元素
    const elements = {
        mainInterface: document.getElementById('main-interface'),
        summaryPlayer: document.getElementById('summary-player'),
        promptInput: document.getElementById('prompt-input'),
        submitBtn: document.getElementById('submit-btn'),
        closeBtn: document.getElementById('close-btn'),
        slidesContainer: document.getElementById('slides-container'),
        progressFill: document.getElementById('progress-fill'),
        loadingOverlay: document.getElementById('loading-overlay'),
        suggestionCards: document.querySelectorAll('.suggestion-card'),
        chatArea: document.getElementById('chat-area'),
        welcomeSection: document.querySelector('.welcome-section')
    };

    // 状态
    let currentSlideIndex = 0;
    let totalSlides = 0;
    let slides = [];
    let isTyping = false; // 是否正在打字输出

    // ========================================
    // 预设的对话回复规则
    // ========================================
    const chatResponses = {
        // 关键词匹配规则：包含所有关键词才触发
        rules: [
            {
                keywords: ['介绍', '崔晗老师'],
                response: `崔晗老师是河海大学计算机与软件学院的优秀教师，主要从事水利工程与人工智能交叉领域的研究工作。


崔晗老师课题组的同学们研究方向涵盖：
• 机器学习与水文模型耦合
• 智能监测与预警系统
• 水资源优化调度算法
• 遥感数据处理与分析`
            },
            {
                keywords: ['研究', '方向'],
                response: `崔晗老师课题组的主要研究方向包括：

🔬 **人工智能与电力系统交叉研究**
基于深度学习的电网稳定性评估
基于深度强化学习的电网调度策略生成

📊 **社交推荐**
基于无监督学习的用户画像与用户聚类

🌊 **计算机视觉**
工业制造，缺陷检测，图像识别

🛰️ **遥感技术应用**
卫星遥感数据在水资源监测中的创新应用`
            },
            {
                keywords: ['成员', '同学'],
                response: `崔晗老师课题小组现有成员构成：

👨‍🏫 **导师团队**
• 崔晗老师（认真负责，治学严谨）

👨‍🎓 **研究生**
• 研三：杨旭、郭迅
• 研二：李明璐、高峥然、许佳彤
• 研一：张扬子、马孙成、刘嘉玲、赵威
• 研零：李天宇、李香

🎓 **毕业生去向**
• 高校科研院所
• 知名互联网企业
• 政府水利部门`
            },
            {
                keywords: ['年终', '总结'],
                response: `点击下方的快捷卡片，即可开启2025年度总结演示！

✨ 我们为您准备了：
• 全年工作数据回顾
• 精彩瞬间照片集锦
• 成就与里程碑展示

点击「为我生成一份小组2025总结」开始吧！`
            }
        ],
        // 默认回复
        default: `感谢您的提问！

您可以尝试询问：
• "请介绍一下崔晗老师"
• "课题组的研究方向有哪些"  
• "课题组有哪些成员"

或者点击下方快捷卡片开启年终总结演示 🎉`
    };

    /**
     * 初始化应用
     */
    function init() {
        bindEvents();
        generateSlides();
    }

    /**
     * 绑定事件
     */
    function bindEvents() {
        // 输入框回车提交
        if (elements.promptInput) {
            elements.promptInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !isTyping) {
                    handleSubmit();
                }
            });
        }

        // 提交按钮点击
        if (elements.submitBtn) {
            elements.submitBtn.addEventListener('click', () => {
                if (!isTyping) {
                    handleSubmit();
                }
            });
        }

        // 快捷卡片点击
        elements.suggestionCards.forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.getAttribute('data-prompt');
                // 检查是否是年终总结相关的卡片
                if (prompt.includes('总结') || prompt.includes('精彩瞬间') ||
                    prompt.includes('成就数据') || prompt.includes('相册')) {
                    if (elements.promptInput) {
                        elements.promptInput.value = prompt;
                    }
                    startSummary();
                } else {
                    // 其他卡片触发对话
                    if (elements.promptInput) {
                        elements.promptInput.value = prompt;
                    }
                    handleSubmit();
                }
            });
        });

        // 关闭按钮
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closeSummary);
        }

        // 键盘导航
        document.addEventListener('keydown', handleKeyboard);

        // 点击导航
        if (elements.summaryPlayer) {
            elements.summaryPlayer.addEventListener('click', (e) => {
                if (e.target === elements.summaryPlayer ||
                    e.target.closest('.slides-container')) {
                    const rect = elements.summaryPlayer.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    if (x > rect.width / 2) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                }
            });
        }
    }

    /**
     * 处理用户输入提交
     */
    function handleSubmit() {
        const userInput = elements.promptInput.value.trim();
        if (!userInput) return;

        // 隐藏欢迎区域（首次对话时）
        if (elements.welcomeSection) {
            elements.welcomeSection.style.display = 'none';
        }

        // 添加用户消息
        addChatMessage(userInput, 'user');

        // 清空输入框
        elements.promptInput.value = '';

        // 获取回复并流式输出
        const response = getResponse(userInput);
        streamResponse(response);
    }

    /**
     * 根据用户输入获取回复
     */
    function getResponse(input) {
        const lowerInput = input.toLowerCase();

        // 检查每条规则
        for (const rule of chatResponses.rules) {
            const allKeywordsMatch = rule.keywords.every(keyword =>
                lowerInput.includes(keyword.toLowerCase())
            );
            if (allKeywordsMatch) {
                return rule.response;
            }
        }

        // 返回默认回复
        return chatResponses.default;
    }

    /**
     * 添加聊天消息
     */
    function addChatMessage(content, role) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${role}`;

        const avatarContent = role === 'user' ? '👤' : '✨';

        messageDiv.innerHTML = `
            <div class="chat-avatar">${avatarContent}</div>
            <div class="chat-bubble">${role === 'user' ? escapeHtml(content) : ''}</div>
        `;

        elements.chatArea.appendChild(messageDiv);
        elements.chatArea.scrollTop = elements.chatArea.scrollHeight;

        return messageDiv;
    }

    /**
     * 流式输出回复
     */
    function streamResponse(text) {
        isTyping = true;
        elements.submitBtn.disabled = true;
        elements.submitBtn.style.opacity = '0.5';

        // 创建AI消息气泡
        const messageDiv = addChatMessage('', 'assistant');
        const bubble = messageDiv.querySelector('.chat-bubble');

        // 添加打字光标
        bubble.innerHTML = '<span class="typing-cursor"></span>';

        let currentIndex = 0;
        const typingSpeed = 30; // 每个字符的打字速度（毫秒）

        function typeNextChar() {
            if (currentIndex < text.length) {
                const char = text[currentIndex];

                // 处理换行
                let displayChar = char;
                if (char === '\n') {
                    displayChar = '<br>';
                }

                // 移除光标，添加字符，再添加光标
                const currentText = bubble.innerHTML.replace('<span class="typing-cursor"></span>', '');
                bubble.innerHTML = currentText + displayChar + '<span class="typing-cursor"></span>';

                currentIndex++;
                elements.chatArea.scrollTop = elements.chatArea.scrollHeight;

                // 换行时稍微停顿
                const delay = char === '\n' ? typingSpeed * 3 : typingSpeed;
                setTimeout(typeNextChar, delay);
            } else {
                // 打字完成，移除光标
                bubble.innerHTML = bubble.innerHTML.replace('<span class="typing-cursor"></span>', '');
                isTyping = false;
                elements.submitBtn.disabled = false;
                elements.submitBtn.style.opacity = '1';
            }
        }

        // 稍微延迟后开始打字（模拟思考）
        setTimeout(typeNextChar, 500);
    }

    /**
     * HTML转义
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 生成幻灯片
     */
    function generateSlides() {
        slides = CONFIG.slides;
        totalSlides = slides.length;
    }

    /**
     * 开始年终总结
     */
    function startSummary() {
        // 显示加载动画
        elements.loadingOverlay.classList.remove('hidden');

        setTimeout(() => {
            // 隐藏加载动画
            elements.loadingOverlay.classList.add('hidden');

            // 渲染幻灯片
            renderSlides();

            // 显示播放器
            elements.mainInterface.style.display = 'none';
            elements.summaryPlayer.classList.remove('hidden');

            // 重置到第一张
            currentSlideIndex = 0;
            showSlide(0);
        }, CONFIG.loadingDuration);
    }

    /**
     * 渲染所有幻灯片
     */
    function renderSlides() {
        elements.slidesContainer.innerHTML = slides.map((slide, index) => {
            return createSlideHTML(slide, index);
        }).join('');
    }

    /**
     * 创建单个幻灯片HTML
     */
    function createSlideHTML(slide, index) {
        const classList = ['slide', `slide-${slide.type}`];
        if (index === 0) classList.push('active');

        let content = '';

        switch (slide.type) {
            case 'intro':
                content = `
                    <div class="year">${CONFIG.year}</div>
                    <div class="team-name">${CONFIG.teamName}</div>
                    <div class="subtitle">${slide.subtitle || slide.title}</div>
                `;
                break;

            case 'stat':
                content = `
                    <div class="stat-icon">${slide.icon}</div>
                    <div class="stat-label">${slide.label}</div>
                    <div class="stat-value" data-value="${slide.value}">${slide.value}</div>
                    <div class="stat-unit">${slide.unit}</div>
                    ${slide.comment ? `<div class="stat-comment">${slide.comment}</div>` : ''}
                `;
                break;

            case 'photo':
                content = `
                    <div class="photo-container">
                        <img src="${slide.src}" alt="${slide.caption}" loading="lazy">
                    </div>
                    <div class="photo-caption">${slide.caption}</div>
                `;
                break;

            case 'text':
                content = `
                    <div class="text-content">${slide.content}</div>
                `;
                break;

            case 'outro':
                content = `
                    <div class="thanks-text">${slide.thanks}</div>
                    <div class="outro-message">${slide.message}</div>
                    <button class="replay-btn" onclick="window.replaySummary()">再看一遍</button>
                `;
                break;
        }

        return `<div class="${classList.join(' ')}" data-index="${index}">${content}</div>`;
    }

    /**
     * 显示指定幻灯片
     */
    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;

        const allSlides = elements.slidesContainer.querySelectorAll('.slide');

        allSlides.forEach((slide, i) => {
            slide.classList.remove('active', 'prev', 'next');
            if (i === index) {
                slide.classList.add('active');
                animateNumbers(slide);
            } else if (i < index) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });

        currentSlideIndex = index;
        updateProgress();
    }

    /**
     * 数字滚动动画
     */
    function animateNumbers(slide) {
        const statValue = slide.querySelector('.stat-value');
        if (!statValue) return;

        const targetValue = statValue.getAttribute('data-value');
        const cleanValue = targetValue.replace(/,/g, '');
        const numValue = parseInt(cleanValue, 10);

        if (isNaN(numValue)) {
            statValue.textContent = targetValue;
            return;
        }

        const duration = 1500;
        const startTime = performance.now();

        function updateNumber(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(numValue * easeOut);

            statValue.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                statValue.textContent = targetValue;
            }
        }

        requestAnimationFrame(updateNumber);
    }

    /**
     * 更新进度条
     */
    function updateProgress() {
        const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
        elements.progressFill.style.width = `${progress}%`;
    }

    /**
     * 下一张幻灯片
     */
    function nextSlide() {
        if (currentSlideIndex < totalSlides - 1) {
            showSlide(currentSlideIndex + 1);
        }
    }

    /**
     * 上一张幻灯片
     */
    function prevSlide() {
        if (currentSlideIndex > 0) {
            showSlide(currentSlideIndex - 1);
        }
    }

    /**
     * 键盘处理
     */
    function handleKeyboard(e) {
        if (elements.summaryPlayer.classList.contains('hidden')) return;

        switch (e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'Escape':
                closeSummary();
                break;
        }
    }

    /**
     * 关闭年终总结
     */
    function closeSummary() {
        elements.summaryPlayer.classList.add('hidden');
        elements.mainInterface.style.display = 'flex';
        if (elements.promptInput) {
            elements.promptInput.value = '';
        }
    }

    /**
     * 重新播放
     */
    window.replaySummary = function () {
        currentSlideIndex = 0;
        showSlide(0);
    };

    // 启动应用
    document.addEventListener('DOMContentLoaded', init);
})();
