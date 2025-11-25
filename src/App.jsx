<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>關西 8天7夜旅程</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            /* 莫蘭迪色系 (Morandi Palette) */
            --bg-color: #F7F4EF; /* 米白底色 */
            --card-bg: #FFFFFF;
            --primary: #7C9082; /* 莫蘭迪綠 (主要按鈕/標題) */
            --secondary: #92A8D1; /* 莫蘭迪藍 (天氣/交通) */
            --accent: #D3B8AA; /* 莫蘭迪粉 (必吃/必買) */
            --text-main: #4A4A4A;
            --text-sub: #8C8C8C;
            --danger: #E07A5F;
            --shadow: 0 4px 12px rgba(0,0,0,0.05);
            --radius: 16px;
        }

        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", "Microsoft JhengHei", sans-serif;
            background-color: var(--bg-color);
            color: var(--text-main);
            margin: 0;
            padding: 0;
            padding-bottom: 80px; /* 預留底部導航空間 */
            overflow-x: hidden;
        }

        /* 頂部導航 */
        header {
            background: var(--card-bg);
            padding: 15px 20px;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        h1 { margin: 0; font-size: 18px; font-weight: 600; color: var(--text-main); }
        .settings-btn { color: var(--primary); font-size: 20px; cursor: pointer; }

        /* 日期選擇器 */
        .date-scroller {
            display: flex;
            overflow-x: auto;
            padding: 15px 20px;
            gap: 12px;
            scrollbar-width: none; /* Firefox */
        }
        .date-scroller::-webkit-scrollbar { display: none; }
        .date-chip {
            background: #EAE8E3;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            white-space: nowrap;
            color: var(--text-sub);
            transition: all 0.3s;
            cursor: pointer;
        }
        .date-chip.active {
            background: var(--primary);
            color: white;
            box-shadow: 0 4px 8px rgba(124, 144, 130, 0.3);
        }

        /* 主要內容區 */
        .container { padding: 0 20px; }

        /* 天氣卡片 */
        .weather-widget {
            background: linear-gradient(135deg, #A7BFE8 0%, #92A8D1 100%);
            color: white;
            border-radius: var(--radius);
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: var(--shadow);
            position: relative;
            overflow: hidden;
        }
        .weather-header { display: flex; justify-content: space-between; align-items: center; }
        .temp-big { font-size: 36px; font-weight: bold; }
        .weather-loc { font-size: 14px; opacity: 0.9; }
        .hourly-forecast {
            display: flex;
            margin-top: 15px;
            gap: 15px;
            overflow-x: auto;
            padding-bottom: 5px;
        }
        .hour-item { text-align: center; font-size: 12px; min-width: 40px; }

        /* 行程卡片 */
        .card {
            background: var(--card-bg);
            border-radius: var(--radius);
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: var(--shadow);
            position: relative;
            transition: transform 0.2s;
            border-left: 5px solid transparent;
        }
        .card.dragging { opacity: 0.5; transform: scale(0.95); }
        
        /* 卡片分類顏色 */
        .card.type-spot { border-left-color: var(--primary); }
        .card.type-food { border-left-color: var(--accent); }
        .card.type-transport { border-left-color: var(--secondary); }

        .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px; }
        .card-time { font-size: 12px; color: var(--primary); font-weight: bold; background: #F0F4F2; padding: 4px 8px; border-radius: 8px; }
        .card-actions { font-size: 14px; color: #ccc; }
        .card-actions i { margin-left: 10px; cursor: pointer; }
        .card-actions .fa-trash { color: #ffccc7; }
        
        .card-title { font-size: 16px; font-weight: bold; margin: 5px 0; display: flex; align-items: center; gap: 8px; }
        .card-desc { font-size: 13px; color: var(--text-sub); line-height: 1.5; margin-bottom: 10px; }
        
        /* 必買/必吃標籤 */
        .tags { display: flex; gap: 5px; flex-wrap: wrap; margin-bottom: 10px; }
        .tag { font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: bold; }
        .tag.must-eat { background: #FFF0E6; color: #D4886A; border: 1px solid #D4886A; }
        .tag.must-buy { background: #E6F7FF; color: #6A9BD4; border: 1px solid #6A9BD4; }
        .guide-tip { background: #F9F9F9; padding: 8px; border-radius: 8px; font-size: 12px; color: #666; border-left: 3px solid #DDD; margin-top: 5px; font-style: italic;}

        /* 記帳功能 */
        .expense-box {
            background: #FAFAFA;
            padding: 8px 12px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            margin-top: 10px;
        }
        .expense-input {
            border: none;
            background: transparent;
            font-size: 14px;
            width: 80px;
            border-bottom: 1px solid #ddd;
            text-align: right;
            outline: none;
        }
        .expense-result { font-size: 12px; color: var(--primary); font-weight: bold; margin-left: auto; }

        /* 連結按鈕 */
        .map-link {
            display: inline-block;
            margin-top: 8px;
            font-size: 12px;
            color: var(--secondary);
            text-decoration: none;
            border: 1px solid var(--secondary);
            padding: 4px 10px;
            border-radius: 12px;
        }

        /* 資訊頁面 (Info Tab) */
        .info-section { display: none; padding: 20px; }
        .info-card { background: white; padding: 20px; border-radius: var(--radius); box-shadow: var(--shadow); margin-bottom: 20px; }
        .info-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; color: var(--primary); border-bottom: 1px solid #eee; padding-bottom: 10px; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
        .info-label { color: var(--text-sub); }

        /* 底部導航 */
        .bottom-nav {
            position: fixed;
            bottom: 0;
            width: 100%;
            background: white;
            display: flex;
            justify-content: space-around;
            padding: 12px 0;
            box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
            z-index: 200;
        }
        .nav-item { text-align: center; color: #C4C4C4; cursor: pointer; }
        .nav-item.active { color: var(--primary); }
        .nav-item i { font-size: 20px; margin-bottom: 4px; display: block; }
        .nav-item span { font-size: 10px; }

        /* 功能選單 (Modal) */
        .modal {
            display: none;
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 300;
            align-items: center;
            justify-content: center;
        }
        .modal-content {
            background: white;
            padding: 20px;
            border-radius: var(--radius);
            width: 80%;
            text-align: center;
        }
        .btn { padding: 10px 20px; border-radius: 8px; border: none; font-size: 14px; margin: 5px; cursor: pointer; }
        .btn-confirm { background: var(--primary); color: white; }
        .btn-cancel { background: #eee; color: #666; }

    </style>
</head>
<body>

    <header>
        <h1><i class="fas fa-torii-gate" style="margin-right: 8px;"></i>關西之旅</h1>
        <i class="fas fa-plus-circle settings-btn" onclick="showAddCardModal()"></i>
    </header>

    <div id="tab-itinerary">
        <div class="date-scroller" id="dateScroller">
            </div>

        <div class="container">
            <div class="weather-widget" id="weatherWidget">
                <div class="weather-header">
                    <div>
                        <div class="temp-big" id="weatherTemp">6°C</div>
                        <div class="weather-loc" id="weatherLoc">大阪市 (Osaka)</div>
                    </div>
                    <i class="fas fa-cloud-sun" style="font-size: 40px; opacity: 0.8;"></i>
                </div>
                <div class="hourly-forecast">
                    <div class="hour-item"><span>12:00</span><br><i class="fas fa-sun"></i><br>7°</div>
                    <div class="hour-item"><span>13:00</span><br><i class="fas fa-cloud"></i><br>8°</div>
                    <div class="hour-item"><span>14:00</span><br><i class="fas fa-cloud-sun"></i><br>7°</div>
                    <div class="hour-item"><span>15:00</span><br><i class="fas fa-cloud"></i><br>6°</div>
                    <div class="hour-item"><span>16:00</span><br><i class="fas fa-snowflake"></i><br>4°</div>
                </div>
            </div>

            <div id="cardContainer">
                </div>
        </div>
    </div>

    <div id="tab-info" class="info-section">
        <div class="info-card">
            <div class="info-title"><i class="fas fa-plane"></i> 航班資訊</div>
            <div class="info-row"><span class="info-label">去程 (2/10)</span> <span>07:40 TPE ➔ 11:10 KIX</span></div>
            <div class="info-row"><span class="info-label">回程 (2/17)</span> <span>12:20 KIX ➔ 14:35 TPE</span></div>
        </div>

        <div class="info-card">
            <div class="info-title"><i class="fas fa-bed"></i> 住宿資訊</div>
            <div class="info-row">
                <span class="info-label">2/10-12 (大阪)</span>
                <span style="text-align:right">GRIDS PREMIUM HOTEL<br>OSAKA NAMBA</span>
            </div>
            <div class="info-row">
                <span class="info-label">2/12-13 (神戶)</span>
                <span>Peanuts Hotel</span>
            </div>
            <div class="info-row">
                <span class="info-label">2/13-17 (京都)</span>
                <span style="text-align:right">Miyako Hotel<br>Kyoto Hachijo</span>
            </div>
        </div>

        <div class="info-card">
            <div class="info-title"><i class="fas fa-lightbulb"></i> 旅遊小貼士</div>
            <p style="font-size:13px; color:#666;">
                1. 氣溫約 3-10度，請攜帶保暖衣物。<br>
                2. 大阪主要用南海電鐵，京都用JR/巴士。<br>
                3. 請準備零錢包，許多小店仍收現金。
            </p>
        </div>
    </div>

    <div class="bottom-nav">
        <div class="nav-item active" onclick="switchTab('itinerary')">
            <i class="fas fa-map-marked-alt"></i>
            <span>行程</span>
        </div>
        <div class="nav-item" onclick="switchTab('info')">
            <i class="fas fa-suitcase"></i>
            <span>資訊</span>
        </div>
    </div>

    <div class="modal" id="addCardModal">
        <div class="modal-content">
            <h3>新增行程卡片</h3>
            <p style="font-size:12px; color:#999;">將新增至目前選擇的日期</p>
            <button class="btn btn-confirm" onclick="addNewCard()">確認新增範例</button>
            <button class="btn btn-cancel" onclick="closeModal()">取消</button>
        </div>
    </div>

    <script>
        // === 資料庫 (從 PDF 提取) ===
        const tripData = {
            "2026-02-10": {
                city: "大阪 (Osaka)",
                cards: [
                    { id: 101, type: "transport", time: "11:30", title: "機場移動", desc: "搭乘南海電鐵 Rapi:t 至難波 (約40分)。", cost: 1450, map: "https://goo.gl/maps/KIX" },
                    { id: 102, type: "spot", time: "14:30", title: "心齋橋 & 道頓堀", desc: "必拍固力果跑跑人，逛心齋橋商店街。", tags: ["逛街熱點"], cost: 0, map: "https://goo.gl/maps/Dotonbori" },
                    { id: 103, type: "food", time: "18:00", title: "道頓堀美食", desc: "晚餐自由活動。推薦：章魚燒、金龍拉麵。", guide: "導遊筆記：記得試試 Takamasa 章魚燒仙貝，鹹香酥脆！", tags: ["必吃", "B級美食"], cost: 2000, map: "https://goo.gl/maps/DotonboriFood" }
                ]
            },
            "2026-02-11": {
                city: "大阪 (Osaka)",
                cards: [
                    { id: 201, type: "spot", time: "09:00", title: "大阪海遊館", desc: "世界最大水族館之一，觀賞鯨鯊。", cost: 2700, map: "https://goo.gl/maps/Kaiyukan" },
                    { id: 202, type: "food", time: "13:00", title: "天保山購物中心", desc: "午餐時間。可品嚐難波美食横丁。", cost: 1500, map: "https://goo.gl/maps/Tempozan" },
                    { id: 203, type: "spot", time: "15:30", title: "Snoopy Town Shop", desc: "心齋橋 PARCO 店採購。", tags: ["必買"], cost: 5000, map: "https://goo.gl/maps/Parco" }
                ]
            },
            "2026-02-12": {
                city: "神戶 (Kobe)",
                cards: [
                    { id: 301, type: "transport", time: "09:00", title: "移動至神戶", desc: "搭乘阪神電鐵直通特急至神戶三宮。", cost: 410, map: "https://goo.gl/maps/Sannomiya" },
                    { id: 302, type: "spot", time: "13:00", title: "北野異人館街", desc: "體驗歐式建築，風見雞館、萌黃館。", guide: "導遊筆記：神戶 Frantz 的『魔法之壺布丁』和草莓松露巧克力是這裡的必買伴手禮。", tags: ["必買", "拍照"], cost: 1000, map: "https://goo.gl/maps/Kitano" },
                    { id: 303, type: "spot", time: "17:00", title: "神戶港夜景", desc: "Mosaic 廣場，觀賞神戶塔。", cost: 0, map: "https://goo.gl/maps/Harborland" }
                ]
            },
            "2026-02-13": {
                city: "京都 (Kyoto)",
                cards: [
                    { id: 401, type: "transport", time: "09:00", title: "移動至京都", desc: "搭乘 JR 新快速至京都車站 (約50分)。", cost: 1100, map: "https://goo.gl/maps/KyotoStn" },
                    { id: 402, type: "spot", time: "13:00", title: "清水寺 & 二三年坂", desc: "世界遺產清水舞台，沿途逛老街。", guide: "導遊筆記：沿途會經過許多抹茶店，Malebranche 的『茶之菓』是京都頂級伴手禮。", tags: ["必去", "必買"], cost: 400, map: "https://goo.gl/maps/Kiyomizu" },
                    { id: 403, type: "spot", time: "17:00", title: "祇園 & 花見小路", desc: "感受藝妓文化，欣賞古老街道。", cost: 0, map: "https://goo.gl/maps/Gion" }
                ]
            },
            "2026-02-14": {
                city: "京都 (Kyoto)",
                cards: [
                    { id: 501, type: "spot", time: "09:00", title: "嵐山竹林 & 天龍寺", desc: "漫步竹林之道，參觀天龍寺庭園。", cost: 600, map: "https://goo.gl/maps/Arashiyama" },
                    { id: 502, type: "spot", time: "15:30", title: "金閣寺", desc: "欣賞金碧輝煌的舍利殿。", cost: 500, map: "https://goo.gl/maps/Kinkakuji" },
                    { id: 503, type: "food", time: "17:30", title: "錦市場", desc: "京都的廚房，品嚐各種小吃。", guide: "導遊筆記：試試看史努比茶屋或當地的豆乳甜甜圈。", tags: ["必吃"], cost: 1500, map: "https://goo.gl/maps/Nishiki" }
                ]
            },
            "2026-02-15": {
                city: "宇治 (Uji)",
                cards: [
                    { id: 601, type: "spot", time: "10:00", title: "平等院", desc: "10圓硬幣上的圖案，世界遺產。", cost: 600, map: "https://goo.gl/maps/Byodoin" },
                    { id: 602, type: "food", time: "12:30", title: "宇治抹茶午餐", desc: "推薦：中村藤吉或伊藤久右衛門。", guide: "導遊筆記：必點抹茶蕎麥麵與生茶果凍套餐！", tags: ["必吃", "抹茶控"], cost: 2000, map: "https://goo.gl/maps/Nakamura" }
                ]
            },
            "2026-02-16": {
                city: "彥根 (Hikone)",
                cards: [
                    { id: 701, type: "spot", time: "10:30", title: "彥根城", desc: "日本國寶天守之一，眺望琵琶湖。", cost: 800, map: "https://goo.gl/maps/Hikone" },
                    { id: 702, type: "food", time: "13:00", title: "近江牛午餐", desc: "品嚐滋賀縣著名的近江牛料理。", tags: ["高級美食"], cost: 5000, map: "https://goo.gl/maps/OmiBeef" }
                ]
            },
            "2026-02-17": {
                city: "返程 (Return)",
                cards: [
                    { id: 801, type: "transport", time: "09:00", title: "搭乘 Haruka", desc: "京都站直達關西機場。", cost: 3000, map: "https://goo.gl/maps/KyotoStn" },
                    { id: 802, type: "spot", time: "10:30", title: "機場最後採購", desc: "免稅店購物。", guide: "導遊筆記：最後機會購買『呼吸巧克力』與限定口味 KitKat。", tags: ["最後衝刺"], cost: 10000, map: "https://goo.gl/maps/KIXDutyFree" }
                ]
            }
        };

        let currentDay = "2026-02-10";
        const exchangeRate = 0.22; // 匯率設定

        // === 初始化 ===
        function init() {
            renderDateScroller();
            renderCards(currentDay);
            updateWeather(currentDay);
        }

        // === 渲染日期選單 ===
        function renderDateScroller() {
            const scroller = document.getElementById('dateScroller');
            scroller.innerHTML = '';
            
            const days = ["週二", "週三", "週四", "週五", "週六", "週日", "週一", "週二"];
            let idx = 0;

            for (const [date, data] of Object.entries(tripData)) {
                const chip = document.createElement('div');
                chip.className = `date-chip ${date === currentDay ? 'active' : ''}`;
                chip.innerHTML = `${date.slice(5)} ${days[idx]}`;
                chip.onclick = () => changeDay(date);
                scroller.appendChild(chip);
                idx++;
            }
        }

        // === 切換日期 ===
        function changeDay(date) {
            currentDay = date;
            renderDateScroller();
            // 添加淡出動畫
            const container = document.getElementById('cardContainer');
            container.style.opacity = '0';
            setTimeout(() => {
                renderCards(date);
                updateWeather(date);
                container.style.opacity = '1';
            }, 200);
        }

        // === 更新天氣 (模擬) ===
        function updateWeather(date) {
            const city = tripData[date].city;
            document.getElementById('weatherLoc').innerText = city;
            // 隨機生成一點變化讓它看起來像真的
            const baseTemp = 4 + Math.floor(Math.random() * 5);
            document.getElementById('weatherTemp').innerText = `${baseTemp}°C`;
        }

        // === 渲染卡片 ===
        function renderCards(date) {
            const container = document.getElementById('cardContainer');
            container.innerHTML = '';
            const dayData = tripData[date];

            dayData.cards.forEach((card, index) => {
                const el = document.createElement('div');
                el.className = `card type-${card.type}`;
                el.draggable = true; // 啟用拖曳
                
                // 拖曳事件監聽
                el.addEventListener('dragstart', () => el.classList.add('dragging'));
                el.addEventListener('dragend', () => el.classList.remove('dragging'));

                // 生成標籤 HTML
                let tagsHtml = '';
                if(card.tags) {
                    tagsHtml = '<div class="tags">';
                    card.tags.forEach(tag => {
                        let tagClass = '';
                        if(tag === '必吃') tagClass = 'must-eat';
                        if(tag === '必買') tagClass = 'must-buy';
                        tagsHtml += `<span class="tag ${tagClass}">${tag}</span>`;
                    });
                    tagsHtml += '</div>';
                }

                // 生成導遊筆記 HTML
                let guideHtml = card.guide ? `<div class="guide-tip"><i class="fas fa-comment-dots"></i> ${card.guide}</div>` : '';

                el.innerHTML = `
                    <div class="card-header">
                        <div class="card-time">${card.time}</div>
                        <div class="card-actions">
                            <i class="fas fa-trash" onclick="deleteCard('${date}', ${index})"></i>
                        </div>
                    </div>
                    <div class="card-title">
                        ${getIcon(card.type)} ${card.title}
                    </div>
                    <div class="card-desc">${card.desc}</div>
                    ${tagsHtml}
                    ${guideHtml}
                    <div class="expense-box">
                        <i class="fas fa-yen-sign" style="color:#aaa; font-size:12px;"></i>
                        <input type="number" class="expense-input" value="${card.cost}" oninput="calcRate(this)">
                        <span class="expense-result">NT$ ${Math.round(card.cost * exchangeRate)}</span>
                    </div>
                    <a href="${card.map}" target="_blank" class="map-link"><i class="fas fa-map-marker-alt"></i> 導航</a>
                `;
                container.appendChild(el);
            });

            // 拖曳排序容器事件
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });
        }

        // === 輔助功能：拖曳排序邏輯 ===
        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.card:not(.dragging)')];
            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        // === 輔助功能：圖標 ===
        function getIcon(type) {
            if (type === 'spot') return '<i class="fas fa-camera" style="color:var(--primary)"></i>';
            if (type === 'food') return '<i class="fas fa-utensils" style="color:var(--accent)"></i>';
            if (type === 'transport') return '<i class="fas fa-subway" style="color:var(--secondary)"></i>';
            return '<i class="fas fa-star"></i>';
        }

        // === 刪除卡片 ===
        function deleteCard(date, index) {
            if(confirm("確定要刪除這張行程卡片嗎？")) {
                tripData[date].cards.splice(index, 1);
                renderCards(date);
            }
        }

        // === 匯率計算 ===
        function calcRate(input) {
            const val = input.value;
            const res = Math.round(val * exchangeRate);
            input.parentElement.querySelector('.expense-result').innerText = `NT$ ${res}`;
        }

        // === 頁面切換 ===
        function switchTab(tab) {
            document.getElementById('tab-itinerary').style.display = tab === 'itinerary' ? 'block' : 'none';
            document.getElementById('tab-info').style.display = tab === 'info' ? 'block' : 'none';
            
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            if(tab === 'itinerary') document.querySelectorAll('.nav-item')[0].classList.add('active');
            else document.querySelectorAll('.nav-item')[1].classList.add('active');
        }

        // === Modal 控制 ===
        function showAddCardModal() {
            document.getElementById('addCardModal').style.display = 'flex';
        }
        function closeModal() {
            document.getElementById('addCardModal').style.display = 'none';
        }
        function addNewCard() {
            tripData[currentDay].cards.push({
                id: Date.now(),
                type: "spot",
                time: "New",
                title: "新景點",
                desc: "點擊編輯詳細內容...",
                cost: 0,
                map: ""
            });
            renderCards(currentDay);
            closeModal();
        }

        // 啟動
        init();
    </script>
</body>
</html>
