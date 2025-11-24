import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Train, 
  Utensils, 
  CloudSun, 
  CloudRain, 
  Sun, 
  Info, 
  BookOpen, 
  Calendar, 
  Plane, 
  Hotel, 
  ChevronRight,
  ShoppingBag,
  Camera,
  Coffee,
  Loader2 // 導入新的載入圖示
} from 'lucide-react';

// --- 配置區塊 (請在此處替換您的 API Key) ---

// ❗️ 請前往 OpenWeatherMap 註冊並取得您的 API Key 
const OPEN_WEATHER_API_KEY = "9c003173b998d8e071466f107f7a68ca"; // <<-- 替換成您的真實金鑰

// 定義城市座標 (大阪、京都、奈良、神戶)
const CITY_COORDINATES = {
  "大阪": { lat: 34.6937, lon: 135.5023 },
  "京都": { lat: 35.0116, lon: 135.7681 },
  "奈良": { lat: 34.6851, lon: 135.8048 },
  "神戶": { lat: 34.6901, lon: 135.1955 }
};

// --- 模擬數據資料庫 (基於 PDF 內容) ---

const ITINERARY_DATA = [
  {
    day: 1,
    location: "大阪",
    theme: "抵達大阪 & 南區初體驗",
    // 移除原有的 weather 屬性，改由 API 獲取
    activities: [
      { type: "transport", time: "抵達", title: "關西機場 (KIX)", detail: "抵達後搭乘南海電鐵前往市區" },
      { type: "hotel", time: "Check-in", title: "難波/心齋橋 住宿", detail: "辦理入住手續" },
      { type: "visit", time: "下午", title: "道頓堀、心齋橋", detail: "逛街購物，感受大阪熱情" },
      { type: "food", time: "晚餐", title: "大阪燒 / 章魚燒", detail: "道地大阪B級美食", tag: "必吃" }
    ]
  },
  {
    day: 2,
    location: "大阪",
    theme: "藍色海洋療癒日",
    activities: [
      { type: "visit", time: "上午", title: "大阪海遊館", detail: "世界最大級別的水族館" },
      { type: "food", time: "午餐", title: "天保山 Marketplace", detail: "美食街自由覓食" },
      { type: "visit", time: "下午", title: "聖瑪麗亞號 / 摩天輪", detail: "遊覽大阪港灣風景" }
    ]
  },
  {
    day: 3,
    location: "大阪",
    theme: "歷史與現代的交織",
    activities: [
      { type: "visit", time: "上午", title: "大阪城公園", detail: "登上天守閣俯瞰大阪", tag: "歷史" },
      { type: "visit", time: "下午", title: "梅田商圈", detail: "百貨公司激戰區購物" },
      { type: "visit", time: "傍晚", title: "梅田藍天大廈", detail: "空中庭園展望台看夜景" }
    ]
  },
  {
    day: 4,
    location: "京都",
    theme: "京都會合 & 伏見稻荷",
    activities: [
      { type: "transport", time: "11:30", title: "前往京都", detail: "您：大阪退房搭JR / 友：Haruka抵達" },
      { type: "info", time: "13:30", title: "京都車站會合", detail: "重要會合點！先寄放行李" },
      { type: "visit", time: "下午", title: "伏見稻荷大社", detail: "千本鳥居打卡", tag: "必去" },
      { type: "food", time: "晚餐", title: "京都車站周邊", detail: "拉麵小路或地下街" }
    ]
  },
  {
    day: 5,
    location: "京都",
    theme: "京都最美散步路線",
    activities: [
      { type: "visit", time: "上午", title: "清水寺", detail: "清水舞台、地主神社" },
      { type: "food", time: "午餐", title: "二年坂湯豆腐", detail: "品嚐京豆腐料理", tag: "必吃" },
      { type: "visit", time: "下午", title: "祇園散策", detail: "二年坂 → 三年坂 → 八坂神社 → 花見小路" }
    ]
  },
  {
    day: 6,
    location: "京都",
    theme: "嵐山竹林 & 金閣輝煌",
    activities: [
      { type: "visit", time: "上午", title: "嵐山漫遊", detail: "竹林小徑、渡月橋、天龍寺" },
      { type: "food", time: "午餐", title: "嵐山當地美食", detail: "蕎麥麵或鯛魚茶泡飯" },
      { type: "visit", time: "下午", title: "金閣寺", detail: "鹿苑寺，欣賞金碧輝煌的倒影" }
    ]
  },
  {
    day: 7,
    location: "奈良",
    theme: "奈良小鹿療癒行",
    activities: [
      { type: "transport", time: "上午", title: "前往奈良", detail: "近鐵或JR前往" },
      { type: "visit", time: "全天", title: "奈良公園", detail: "餵食小鹿仙貝 (小心咬屁股)" },
      { type: "visit", time: "景點", title: "東大寺 & 春日大社", detail: "看大佛與萬燈籠" },
      { type: "shopping", time: "伴手禮", title: "中川政七 & 大佛布丁", detail: "車站周邊購買", tag: "必買" }
    ]
  },
  {
    day: 8,
    location: "京都",
    theme: "京都廚房 & 採買衝刺",
    activities: [
      { type: "visit", time: "上午", title: "二條城", detail: "德川家康的寓所，國寶二之丸御殿" },
      { type: "food", time: "午餐", title: "錦市場", detail: "京都的廚房，邊走邊吃", tag: "美食" }
      ,
      { type: "shopping", time: "下午", title: "四條河原町", detail: "藥妝、百貨最後補貨衝刺" }
    ]
  },
  {
    day: 9,
    location: "神戶",
    theme: "史努比夢幻夜 & 神戶牛",
    activities: [
      { type: "transport", time: "上午", title: "前往神戶", detail: "JR直達神戶三宮" },
      { type: "hotel", time: "中午", title: "Peanuts Hotel", detail: "Check-in & 主題午餐/下午茶", tag: "重點" },
      { type: "visit", time: "下午", title: "北野異人館街", detail: "參觀洋房、特色星巴克" },
      { type: "food", time: "晚餐", title: "神戶牛排大餐", detail: "Mouriya 或 Wakkoqu (務必預約!)", tag: "奢華" }
    ]
  },
  {
    day: 10,
    location: "返程",
    theme: "優雅返程",
    activities: [
      { type: "food", time: "上午", title: "飯店早餐", detail: "Peanuts Hotel 精緻早餐" },
      { type: "transport", time: "移動", title: "利木津巴士", detail: "三宮 → 關西機場 (KIX)" },
      { type: "plane", time: "返程", title: "搭機回國", detail: "平安回家" }
    ]
  }
];

// --- 導遊手冊模擬數據 (不變) ---
const GUIDE_TIPS = [
  {
    id: 1,
    city: "大阪",
    title: "大阪燒 vs 廣島燒",
    content: "大阪行程中必吃的大阪燒(Okonomiyaki)，特色是將所有材料攪拌在一起煎。推薦去「千房」或「美津の」。點餐時記得加點日式炒麵，雙重享受。",
    tags: ["美食知識", "必吃"]
  },
  {
    id: 2,
    city: "京都",
    title: "伏見稻荷拍照攻略",
    content: "千本鳥居剛入口處人潮最多。建議往上走約 15-20 分鐘到達半山腰，人潮會少很多，可以拍到空無一人的絕美鳥居照片。",
    tags: ["攝影", "攻略"]
  },
  {
    id: 3,
    city: "奈良",
    title: "大佛布丁 (大仏プリン)",
    content: "奈良必買伴手禮！瓶蓋上有可愛的大佛圖案。口感極度綿密，原味卡士達最經典，大和茶口味也很推薦。吃完瓶子可以留做紀念。",
    tags: ["必買", "甜點"]
  },
  {
    id: 4,
    city: "神戶",
    title: "神戶牛排的奧義",
    content: "行程提到的 Mouriya 是志玲姐姐推薦的名店。午間套餐 CP 值通常比晚餐高很多。吃鐵板燒時，廚師會將蒜片煎得像餅乾一樣脆，搭配牛肉是絕配。",
    tags: ["必吃", "美食"]
  },
  {
    id: 5,
    city: "京都",
    title: "清水寺二年坂",
    content: "這裡有一間榻榻米星巴克，位於百年老屋內。若走累了可以進去休息，體驗在日式傳統建築喝咖啡的違和感。",
    tags: ["景點", "休息"]
  }
];

const INFO_DATA = {
  flights: [
    { type: "入境", airport: "關西機場 (KIX)", note: "建議購買 Haruka & ICOCA 套票" },
    { type: "出境", airport: "關西機場 (KIX)", note: "神戶搭利木津巴士直達最方便" }
  ],
  hotels: [
    { city: "大阪", nights: "3晚", note: "難波/心齋橋周邊，方便逛街與移動" },
    { city: "京都", nights: "5晚", note: "京都車站附近，在此與朋友會合" },
    { city: "神戶", nights: "1晚", name: "Peanuts Hotel (史努比飯店)", note: "含主題午餐/下午茶，需提前預約" }
  ]
};

// --- API 邏輯：獲取天氣資料 ---

/**
 * 將 OpenWeatherMap 的天氣代碼 (ID) 轉換為 Lucide React 圖示類型
 * @param {number} id - OpenWeatherMap Weather ID
 * @returns {{type: string, text: string}}
 */
const mapWeatherIdToIcon = (id) => {
  if (id >= 200 && id < 600) { // Thunderstorm, Drizzle, Rain
    return { type: 'rain', text: '下雨天' };
  } else if (id >= 600 && id < 700) { // Snow
    return { type: 'snow', text: '下雪天' };
  } else if (id >= 700 && id < 800) { // Atmosphere (Mist, Fog, etc.)
    return { type: 'cloudy', text: '多雲/霧' };
  } else if (id === 800) { // Clear
    return { type: 'sunny', text: '晴朗' };
  } else if (id > 800) { // Clouds
    return { type: 'cloudy', text: '多雲' };
  }
  return { type: 'cloudy', text: '天氣資訊讀取中' };
};

// --- 組件 ---

const WeatherWidget = ({ weather, loading, error }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'sunny': return <Sun className="w-6 h-6 text-orange-400" />;
      case 'cloudy': return <CloudSun className="w-6 h-6 text-gray-400" />;
      case 'rain': return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'snow': return <Info className="w-6 h-6 text-sky-400" />; // 雪天用 Info 替代
      default: return <CloudSun className="w-6 h-6 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm mb-4 border border-stone-100 animate-pulse">
        <Loader2 className="w-5 h-5 mr-2 animate-spin text-stone-500" />
        <span className="text-sm text-stone-500">正在獲取即時天氣...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center bg-red-50 p-4 rounded-xl shadow-sm mb-4 border border-red-200">
        <Info className="w-5 h-5 mr-2 text-red-600" />
        <span className="text-sm text-red-600">載入失敗: {error}</span>
      </div>
    );
  }
  
  // 檢查 weather 是否有資料
  const isDataAvailable = weather && weather.main && weather.weather && weather.weather.length > 0;
  
  const iconMap = isDataAvailable 
    ? mapWeatherIdToIcon(weather.weather[0].id) 
    : { type: 'default', text: '無資料' };
  
  const temp = isDataAvailable 
    ? `${Math.round(weather.main.temp)}°C` 
    : '--°C';

  return (
    <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-sm mb-4 border border-stone-100">
      <div className="flex items-center gap-3">
        {getIcon(iconMap.type)}
        <div className="flex flex-col">
          <span className="text-xs text-stone-500">即時天氣</span>
          <span className="font-bold text-stone-800">{iconMap.text}</span>
        </div>
      </div>
      <div className="text-2xl font-light text-stone-800">{temp}</div>
    </div>
  );
};

// ActivityCard, GuideCard, InfoRow 組件保持不變
const ActivityCard = ({ activity }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'transport': return <Train className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'hotel': return <Hotel className="w-4 h-4" />;
      case 'shopping': return <ShoppingBag className="w-4 h-4" />;
      case 'plane': return <Plane className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'transport': return 'bg-blue-50 text-blue-600';
      case 'food': return 'bg-orange-50 text-orange-600';
      case 'shopping': return 'bg-purple-50 text-purple-600';
      default: return 'bg-stone-100 text-stone-600';
    }
  };

  return (
    <div className="flex gap-4 mb-6 last:mb-0 relative pl-2">
      {/* Timeline Line */}
      <div className="absolute left-[27px] top-8 bottom-[-24px] w-[2px] bg-stone-200 last:hidden"></div>
      
      <div className="flex flex-col items-center gap-1 min-w-[50px]">
        <span className="text-xs font-medium text-stone-400">{activity.time}</span>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${getColor(activity.type)}`}>
          {getIcon(activity.type)}
        </div>
      </div>
      
      <div className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-stone-50">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-stone-800 text-lg mb-1">{activity.title}</h3>
          {activity.tag && (
            <span className="px-2 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-full">
              {activity.tag}
            </span>
          )}
        </div>
        <p className="text-sm text-stone-600 leading-relaxed">{activity.detail}</p>
      </div>
    </div>
  );
};

const GuideCard = ({ tip }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-700 mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">{tip.city}</span>
      <div className="flex gap-1">
        {tip.tags.map(tag => (
          <span key={tag} className={`text-[10px] px-2 py-0.5 rounded-md ${tag === '必買' || tag === '必吃' ? 'bg-rose-100 text-rose-600' : 'bg-stone-100 text-stone-500'}`}>
            #{tag}
          </span>
        ))}
      </div>
    </div>
    <h3 className="font-bold text-lg text-stone-800 mb-2 flex items-center gap-2">
      {tip.tags.includes('必吃') ? <Utensils className="w-4 h-4 text-orange-500"/> : <BookOpen className="w-4 h-4 text-green-700"/>}
      {tip.title}
    </h3>
    <p className="text-sm text-stone-600 leading-relaxed text-justify">
      {tip.content}
    </p>
  </div>
);

const InfoRow = ({ icon: Icon, label, value, sub }) => (
  <div className="flex items-start gap-4 py-4 border-b border-stone-100 last:border-0">
    <div className="p-2 bg-stone-100 rounded-lg text-stone-600">
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <h4 className="font-medium text-stone-800">{label}</h4>
      <p className="text-stone-600 text-sm mt-0.5">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  </div>
);


// --- 主程式 ---

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [selectedDay, setSelectedDay] = useState(1);
  
  // 新增狀態：用於儲存每個城市的即時天氣資料
  const [cityWeather, setCityWeather] = useState({});
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  // 取得當前行程的城市
  const currentDayData = ITINERARY_DATA.find(d => d.day === selectedDay);
  const currentCity = currentDayData?.location;

  /**
   * 獲取指定城市的天氣資料
   * @param {string} city - 城市名稱 (例如: "大阪")
   */
  const fetchWeatherForCity = async (city) => {
    if (cityWeather[city] || !CITY_COORDINATES[city] || OPEN_WEATHER_API_KEY === "YOUR_OPEN_WEATHER_API_KEY") {
      // 如果已經有資料、或城市不存在、或 API Key 尚未設定，則不執行
      setWeatherError(OPEN_WEATHER_API_KEY === "YOUR_OPEN_WEATHER_API_KEY" ? "請設定 API Key" : null);
      return;
    }

    setLoadingWeather(true);
    setWeatherError(null);
    const { lat, lon } = CITY_COORDINATES[city];
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=zh_tw&appid=${OPEN_WEATHER_API_KEY}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        // 拋出包含狀態碼的錯誤
        throw new Error(`HTTP 錯誤: ${response.status}`);
      }
      const data = await response.json();
      setCityWeather(prev => ({ ...prev, [city]: data }));
    } catch (error) {
      console.error("獲取天氣資料失敗:", error);
      
      let errorMessage = "無法獲取即時天氣資訊";
      
      // 檢查是否為 401 錯誤 (Unauthorized)
      if (error.message && error.message.includes('401')) {
        errorMessage = "API 金鑰無效 (401 錯誤)。請檢查 OPEN_WEATHER_API_KEY 是否正確或已啟用 (新金鑰可能需等數小時)。";
      }

      setWeatherError(errorMessage);
    } finally {
      setLoadingWeather(false);
    }
  };

  // 監聽 selectedDay 變化，並獲取當前城市的天氣資料
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (currentCity && !cityWeather[currentCity]) {
      fetchWeatherForCity(currentCity);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay, activeTab, currentCity]);

  return (
    <div className="min-h-screen bg-[#F5F5F0] font-sans text-stone-800 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#F5F5F0]/95 backdrop-blur-md border-b border-stone-200/50">
        <div className="max-w-md mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight text-stone-800 flex items-center gap-2">
            <span className="w-2 h-6 bg-rose-400 rounded-full"></span>
            京阪神旅人
          </h1>
          <button className="p-2 bg-white rounded-full shadow-sm">
            <Camera className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Day Selector (Only visible in Itinerary tab) */}
        {activeTab === 'itinerary' && (
          <div className="overflow-x-auto scrollbar-hide py-2 pl-4 border-b border-stone-200/50 bg-white/50">
            <div className="flex gap-3 w-max pr-4">
              {ITINERARY_DATA.map((d) => (
                <button
                  key={d.day}
                  onClick={() => setSelectedDay(d.day)}
                  className={`flex flex-col items-center justify-center min-w-[60px] h-[64px] rounded-xl transition-all duration-300 ${
                    selectedDay === d.day 
                      ? 'bg-stone-800 text-white shadow-lg scale-105' 
                      : 'bg-white text-stone-400 border border-stone-100'
                  }`}
                >
                  <span className="text-[10px] font-medium uppercase opacity-80">Day</span>
                  <span className="text-xl font-bold">{d.day}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 pt-6">
        
        {/* 行程頁面 */}
        {activeTab === 'itinerary' && currentDayData && (
          <div className="animate-fade-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-stone-800 mb-1">{currentDayData.location}</h2>
              <p className="text-stone-500 text-sm">{currentDayData.theme}</p>
            </div>

            {/* 這裡使用即時天氣資料 */}
            <WeatherWidget 
              weather={cityWeather[currentCity]} 
              loading={loadingWeather} 
              error={weatherError}
            />

            <div className="mt-6">
              {currentDayData.activities.map((activity, index) => (
                <ActivityCard key={index} activity={activity} />
              ))}
            </div>
            
            {/* 每日小結尾 */}
            <div className="mt-8 p-4 bg-stone-200/50 rounded-xl text-center text-stone-500 text-xs">
              Day {selectedDay} End
            </div>
          </div>
        )}

        {/* 導遊手冊頁面 */}
        {activeTab === 'guide' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-700"/>
              在地情報與攻略
            </h2>
            <div className="grid gap-2">
              {GUIDE_TIPS.map((tip) => (
                <GuideCard key={tip.id} tip={tip} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <button className="text-sm text-stone-400 underline">載入更多攻略...</button>
            </div>
          </div>
        )}

        {/* 資訊頁面 */}
        {activeTab === 'info' && (
          <div className="animate-fade-in space-y-6">
             <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-stone-800 px-4 py-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Plane className="w-4 h-4"/> 航班資訊
                </h3>
              </div>
              <div className="p-2">
                {INFO_DATA.flights.map((flight, i) => (
                  <InfoRow 
                    key={i} 
                    icon={Plane} 
                    label={flight.type} 
                    value={flight.airport} 
                    sub={flight.note} 
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-stone-800 px-4 py-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Hotel className="w-4 h-4"/> 住宿安排
                </h3>
              </div>
              <div className="p-2">
                {INFO_DATA.hotels.map((hotel, i) => (
                  <InfoRow 
                    key={i} 
                    icon={Hotel} 
                    label={hotel.city} 
                    value={hotel.name || `${hotel.city}市區飯店`} 
                    sub={`${hotel.nights} - ${hotel.note}`} 
                  />
                ))}
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-rose-800 text-sm leading-relaxed">
              <strong>小提醒：</strong><br/>
              神戶 Peanuts Hotel 與 Mouriya 牛排建議提前 1-2 個月預約。京都市區公車人潮眾多，建議多利用地鐵移動。
            </div>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-stone-800 text-stone-400 rounded-full px-6 py-3 shadow-2xl flex items-center gap-8 z-50 w-[90%] max-w-sm justify-between backdrop-blur-sm bg-opacity-95">
        <button 
          onClick={() => setActiveTab('itinerary')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'itinerary' ? 'text-white' : 'hover:text-white'}`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">行程</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'guide' ? 'text-white' : 'hover:text-white'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-medium">攻略</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('info')}
          className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'info' ? 'text-white' : 'hover:text-white'}`}
        >
          <Info className="w-5 h-5" />
          <span className="text-[10px] font-medium">資訊</span>
        </button>
      </div>
    </div>
  );
}
