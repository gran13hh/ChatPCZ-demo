/**
 * 年终总结配置文件
 * 在这里修改所有展示的内容
 * 
 * 幻灯片类型说明：
 * - intro: 开场页面，显示年份和团队名称
 * - stat: 统计数据，显示数字和描述
 * - photo: 照片展示，显示图片和说明
 * - text: 纯文字，显示大段文字内容
 * - outro: 结尾页面，显示感谢语
 */

const CONFIG = {
    // 基本信息
    teamName: "河海大学计算机与软件学院崔晗老师课题小组",
    year: "2025",

    // 加载动画显示时间（毫秒）
    loadingDuration: 1500,

    // 自动播放间隔（毫秒），设为0禁用自动播放
    autoPlayInterval: 0,

    // 幻灯片内容
    slides: [
        // 开场页
        {
            type: "intro",
            title: "年度总结",
            subtitle: "回顾这一年的点点滴滴"
        },

        // 统计数据 - 文献阅读
        {
            type: "stat",
            icon: "📚",
            label: "这一年，我们一共阅读了大约",
            value: "23,000,000",
            unit: "万词文献",
            comment: "相当于《红楼梦》的100倍！"
        },

        // 统计数据 - 咖啡
        {
            type: "stat",
            icon: "☕",
            label: "为了科研，我们喝掉了大约",
            value: "1,024",
            unit: "杯咖啡",
            comment: "咖啡因是第一生产力"
        },

        // 统计数据 - 代码
        {
            type: "stat",
            icon: "💻",
            label: "我们敲下了大约",
            value: "128,512",
            unit: "行代码",
            comment: "每一个bug都是成长的足迹"
        },

        // 统计数据 - 熬夜
        {
            type: "stat",
            icon: "🌙",
            label: "实验室的灯光陪伴了我们",
            value: "310",
            unit: "个夜晚",
            comment: "头发还在，梦想也在"
        },

        // 文字卡片
        {
            type: "text",
            content: "这一年，我们不仅收获了<span class='text-highlight'>知识</span>，更收获了<span class='text-highlight'>很多人文自然</span>"
        },

        // 照片展示1
        {
            type: "photo",
            src: "images/沙河.jpg",
            caption: "密云项目经常在地图上看到的北京密云区沙河早市"
        },
        {
            type: "photo",
            src: "images/密云供电局.jpg",
            caption: "密云项目的甲方"
        },


        // 照片展示2
        {
            type: "photo",
            src: "images/2cd08a365de5a4979b17adb9a16918b1.jpg",
            caption: "武汉略影"
        },

        {
            type: "photo",
            src: "images/af17e0a1557ef0b4aa34de8b961ce738.jpg",
            caption: "武汉略影"
        },

        {
            type: "photo",
            src: "images/2cd08a365de5a4979b17adb9a16918b1.jpg",
            caption: "武汉略影"
        },
        
        {
            type: "photo",
            src: "images/b8e62001d3438a5fa0b1f2e34cf474e4.jpg",
            caption: "金坛略影"
        },
        {
            type: "photo",
            src: "images/2d88168e4f100ddcd300ba9486ef7086.jpg",
            caption: "满眼绿色"
        },

        // 结尾页
        {
            type: "outro",
            thanks: "感谢每一位的付出",
            message: "2026，我们继续乘风破浪！"
        }
    ]
};

// 导出配置（如果使用模块化）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
