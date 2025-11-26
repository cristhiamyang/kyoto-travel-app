import React, { useState, useEffect, useCallback, useRef } from 'react';

// --- Global Constants and Utilities ---
// 從環境變數獲取 App ID 和 Firebase Config
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-trip-app-id';

// 預設匯率：1 JPY = 0.22 TWD (請依實際匯率調整)
const DEFAULT_JPY_TO_TWD = 0.22;

// 初始行程資料 (從 PDF 擷取並結構化)
const initialItineraryData = [
  {
    day: 1, date: '2/10 (二)', city: '大阪', dayTitle: '抵達・大阪南區精華遊',
    activities: [
      { id: 1, type: '交通', time: '07:40-11:10', title: '桃園(TPE) → 關西機場(KIX)', detail: 'Check-in & 登機', cost: 0, guide: '' },
      { id: 2, type: '交通', time: '11:30-13:00', title: 'KIX → 難波 (Namba)', detail: '搭乘南海電鐵特急 Rapi:t 或急行線, 約40-50分鐘', cost: 1450, guide: '' },
      { id: 3, type: '住宿', time: '13:00-14:30', title: '飯店 Check-in & 午餐', detail: '住宿: GRIDS PREMIUM HOTEL OSAKA NAMBA (難波)', cost: 0, guide: '' },
      { id: 4, type: '景點', time: '14:30-18:00', title: '心齋橋筋商店街 & 道頓堀', detail: '逛街購物、跟「固力果跑跑人」拍照', cost: 0, guide: '' },
      { id: 5, type: '餐飲', time: '18:00-21:00', title: '晚餐 @ 道頓堀', detail: '必吃美食: 鶴橋風月大阪燒、章魚燒、金龍拉麵', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 2, date: '2/11 (三)', city: '大阪', dayTitle: '大阪灣區現代文創與海景',
    activities: [
      { id: 6, type: '景點', time: '09:00-13:00', title: '大阪海遊館(Kaiyukan)', detail: '世界最大的水族館之一,可從難波搭乘地鐵至大阪港站', cost: 2700, guide: '' },
      { id: 7, type: '餐飲', time: '13:00-14:30', title: '午餐 @ 天保山購物中心', detail: '在美食廣場或餐廳用餐', cost: 0, guide: '' },
      { id: 8, type: '景點', time: '14:30-17:00', title: '天保山大摩天輪', detail: '欣賞大阪港景色', cost: 800, guide: '' },
      { id: 9, type: '購物', time: '17:00-19:00', title: 'Snoopy Town Shop 心齋橋 PARCO店', detail: '大阪市中央区心斎橋筋1丁目8-3 心齋橋 PARCO 6F', cost: 0, guide: '' },
      { id: 10, type: '餐飲', time: '19:00-21:00', title: '晚餐', detail: '在難波/心齋橋或梅田區域用餐', cost: 3000, guide: '' },
    ],
    weather: null,
  },
  {
    day: 3, date: '2/12 (四)', city: '神戶', dayTitle: '移動日・神戶異國風情與夜景',
    activities: [
      { id: 11, type: '交通', time: '09:00-11:00', title: 'Check-out & 移動至神戶', detail: '從難波站搭乘阪神電鐵直通特急至神戶三宮站(約40-50分鐘)', cost: 410, guide: '' },
      { id: 12, type: '住宿', time: '11:00-13:00', title: '飯店寄放行李 & 午餐', detail: '住宿: Peanuts Hotel。在三宮或元町附近用餐', cost: 0, guide: '' },
      { id: 13, type: '景點', time: '13:00-17:00', title: '北野異人館街', detail: '參觀風見雞館、萌黃館等,體驗歐式建築群', cost: 0, guide: '' },
      { id: 14, type: '餐飲', time: '17:00-19:00', title: '藍瓶咖啡 (北野)', detail: '中央區前町1號', cost: 800, guide: '' },
      { id: 15, type: '景點', time: '17:00-19:00', title: '神戶港區(Kobe Harborland)', detail: '欣賞神戶塔與海洋博物館夜景', cost: 0, guide: '' },
      { id: 16, type: '購物', time: '17:00-19:00', title: 'Snoopy Town Shop 神戶店', detail: 'T-神戶港灣樂園 umie Mosaic 2F', cost: 0, guide: '' },
      { id: 17, type: '餐飲', time: '19:00-21:00', title: '晚餐', detail: '必吃美食: 神戶牛 (建議提前預約)', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 4, date: '2/13 (五)', city: '京都', dayTitle: '移動日・京都車站周邊與東山古道',
    activities: [
      { id: 18, type: '交通', time: '09:00-11:00', title: 'Check-out & 移動至京都', detail: '從神戶三宮搭乘JR 新快速至京都車站(約50-60分鐘)', cost: 1100, guide: '' },
      { id: 19, type: '住宿', time: '11:00-13:00', title: '飯店寄放行李 & 午餐', detail: '住宿: Miyako Hotel Kyoto Hachijo。可在京都車站地下街或拉麵小路用餐', cost: 0, guide: '' },
      { id: 20, type: '景點', time: '13:00-17:00', title: '清水寺 & 二年坂/三年坂', detail: '京都經典景點', cost: 0, guide: '' },
      { id: 21, type: '景點', time: '17:00-19:00', title: '祇園 & 花見小路', detail: '漫步祇園古街,感受京都傳統藝妓文化', cost: 0, guide: '' },
      { id: 22, type: '餐飲', time: '19:00-21:00', title: '晚餐', detail: '在祇園或河原町區域用餐', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 5, date: '2/14 (六)', city: '京都', dayTitle: '京都西部・嵐山竹林與天龍寺',
    activities: [
      { id: 23, type: '景點', time: '09:00-14:00', title: '嵐山地區 (天龍寺/竹林)', detail: '搭乘JR 或嵐電前往嵐山。參觀天龍寺,漫步嵯峨野竹林之道', cost: 500, guide: '' },
      { id: 24, type: '餐飲', time: '14:00-15:30', title: '午餐 @ 嵐山周邊', detail: '在嵐山周邊用餐', cost: 0, guide: '' },
      { id: 25, type: '景點', time: '15:30-17:30', title: '金閣寺 (鹿苑寺)', detail: '搭乘巴士前往金閣寺,欣賞冬季景色', cost: 0, guide: '' },
      { id: 26, type: '購物', time: '17:30-20:00', title: '河原町・錦市場', detail: '逛逛京都的廚房「錦市場」(部分店家可能已關門)或河原町百貨區', cost: 0, guide: '' },
      { id: 27, type: '餐飲', time: '20:00-22:00', title: '晚餐', detail: '在河原町或返回京都車站用餐', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 6, date: '2/15 (日)', city: '宇治', dayTitle: '宇治抹茶與世界遺產之旅',
    activities: [
      { id: 28, type: '交通', time: '09:00-10:00', title: '京都 → 宇治', detail: '從京都車站搭乘JR 奈良線至JR宇治站(約20-30分鐘)', cost: 240, guide: '' },
      { id: 29, type: '景點', time: '10:00-12:30', title: '平等院 (Byodo-in Temple)', detail: '參觀世界遺產鳳凰堂(10日圓硬幣上的圖案)', cost: 600, guide: '' },
      { id: 30, type: '餐飲', time: '12:30-14:00', title: '宇治午餐 & 抹茶甜點', detail: '必吃美食: 宇治茶蕎麥麵。必點菜單: 中村藤吉/伊藤久右衛門抹茶套餐', cost: 0, guide: '' },
      { id: 31, type: '景點', time: '14:00-16:30', title: '宇治上神社 & 宇治橋', detail: '參觀日本現存最古老的神社建築', cost: 0, guide: '' },
      { id: 32, type: '交通', time: '16:30-17:30', title: '返回京都', detail: '從JR宇治站搭JR奈良線返回京都車站', cost: 240, guide: '' },
      { id: 33, type: '餐飲', time: '17:30-20:00', title: '晚餐', detail: '在京都車站周邊用餐', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 7, date: '2/16 (一)', city: '彥根', dayTitle: '琵琶湖畔・國寶彥根城之旅',
    activities: [
      { id: 34, type: '交通', time: '09:00-10:30', title: '京都 → 彥根', detail: '從京都車站搭乘JR琵琶湖線(新快速/東海道本線)至彥根站(約50-60分鐘)', cost: 1140, guide: '' },
      { id: 35, type: '景點', time: '10:30-13:00', title: '彥根城 (Hikone Castle)', detail: '國寶天守之一,欣賞城堡與琵琶湖的冬季景色', cost: 800, guide: '' },
      { id: 36, type: '餐飲', time: '13:00-14:30', title: '午餐 @ 彥根城周邊', detail: '推薦品嚐: 近江牛 (Omi Beef) 或當地特色料理', cost: 0, guide: '' },
      { id: 37, type: '景點', time: '14:30-17:00', title: '玄宮園 & 琵琶湖畔', detail: '漫步於彥根城旁的日式庭園玄宮園', cost: 0, guide: '' },
      { id: 38, type: '交通', time: '17:00-18:30', title: '返回京都', detail: '從彥根站搭乘JR琵琶湖線返回京都車站', cost: 1140, guide: '' },
      { id: 39, type: '購物', time: '18:30-20:30', title: '晚餐 & 採購伴手禮', detail: '最後機會在京都車站伊勢丹百貨或周邊採購禮品。', cost: 0, guide: '' },
    ],
    weather: null,
  },
  {
    day: 8, date: '2/17 (二)', city: '返程', dayTitle: '返程',
    activities: [
      { id: 40, type: '交通', time: '09:00-10:00', title: 'Check-out & 前往關西機場(KIX)', detail: '從京都車站搭乘JR 特急 Haruka 直達關西機場(約75分鐘)', cost: 1880, guide: '' },
      { id: 41, type: '交通', time: '10:00-12:20', title: 'KIX Check-in', detail: '辦理登機手續', cost: 0, guide: '' },
      { id: 42, type: '交通', time: '12:20-14:35', title: 'KIX → 桃園(TPE)', detail: '結束旅程', cost: 0, guide: '' },
    ],
    weather: null,
  },
];

const itineraryInfo = {
  flights: [
    { type: '去程', flight: 'TPE (07:40) → KIX (11:10)', date: '2/10 (二)', airline: 'TBD' },
    { type: '回程', flight: 'KIX (12:20) → TPE (14:35)', date: '2/17 (二)', airline: 'TBD' },
  ],
  accommodations: [
    { city: '大阪 (難波)', hotel: 'GRIDS PREMIUM HOTEL OSAKA NAMBA', dates: '2/10 - 2/11', note: '2晚' },
    { city: '神戶', hotel: 'Peanuts Hotel', dates: '2/12', note: '1晚 (換宿)' },
    { city: '京都 (京都車站附近)', hotel: 'Miyako Hotel Kyoto Hachijo', dates: '2/13 - 2/16', note: '4晚 (換宿)' },
  ],
};

// Icon Mapping
const typeIcons = {
  景點: 'M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 7.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm0 8.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', // Pin/Location
  餐飲: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0zM7.5 10.5a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM12 21a9 9 0 100-18 9 9 0 000 18z', // Food/Circle
  交通: 'M13.5 10.5a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75zM13.5 6a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75zM13.5 15a.75.75 0 01.75-.75h6.75a.75.75 0 010 1.5H14.25a.75.75 0 01-.75-.75zM10.5 7.5a3 3 0 10-6 0 3 3 0 006 0zM12 21a9 9 0 100-18 9 9 0 000 18z', // Transport/List
  住宿: 'M8.25 21v-4.5H5.25v-3h3V9h3v3h3v-3h3v3h3v4.5h-3V21H8.25zM12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z', // Home/Hotel
  購物: 'M15.75 10.5a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM15.75 6a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM15.75 15a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM6 10.5a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 6a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H6.75a.75.75 0 01-.75-.75zM12 21a9 9 0 100-18 9 9 0 000 18z', // Shopping/Bag
};

const typeColors = {
  景點: 'bg-green-50 border-green-200 text-green-700',
  餐飲: 'bg-red-50 border-red-200 text-red-700',
  交通: 'bg-blue-50 border-blue-200 text-blue-700',
  住宿: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  購物: 'bg-indigo-50 border-indigo-200 text-indigo-700',
};

// --- Modals ---

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
        <div className="flex justify-end mt-4 space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  );
};

const EditModal = ({ isOpen, item, onSave, onClose, availableTypes }) => {
  if (!isOpen || !item) return null;
  const [formData, setFormData] = useState(item);

  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-lg p-6 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-800 mb-4">編輯行程卡片</h3>
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">類別</span>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm p-3"
            >
              {availableTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">時間區間</span>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm p-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">標題 (地點/活動)</span>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm p-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">詳細說明</span>
            <textarea
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm p-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-gray-700">花費 (日幣 JPY)</span>
            <input
              type="number"
              name="cost"
              value={formData.cost}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 text-sm p-3"
            />
          </label>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition"
          >
            儲存變更
          </button>
        </div>
      </div>
    </div>
  );
};

const GuideModal = ({ isOpen, item, onClose, loading, guideContent, sources }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-pink-600 mb-4">{item.title} - 導遊資訊</h3>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm text-gray-600">正在為您搜尋景點故事與即時天氣...</p>
          </div>
        ) : (
          <div className="text-gray-700 text-sm space-y-4">
            {guideContent ? (
              <>
                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="text-base font-semibold text-pink-700 mb-2">智能導覽分析</h4>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: guideContent.replace(/必吃美食|必點菜單|必買伴手禮/g, (match) =>
                        `<span class="font-bold text-red-600 bg-red-100 px-1 py-0.5 rounded-md">${match}</span>`
                      ),
                    }}
                    className="prose prose-sm max-w-none space-y-2"
                  />
                </div>
                {sources && sources.length > 0 && (
                  <div className="mt-4 text-xs text-gray-500 border-t pt-2">
                    <p className="font-semibold">資料來源:</p>
                    {sources.slice(0, 3).map((s, index) => (
                      <a
                        key={index}
                        href={s.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline"
                      >
                        - {s.title}
                      </a>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-500">無法獲取導遊資訊。請稍後再試。</p>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg hover:bg-pink-600 transition"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Itinerary Card Component ---

const ItineraryCard = ({ item, index, onEdit, onDelete, JPY_TO_TWD, onDragStart, onDragEnter, onDrop }) => {
  const twdCost = (item.cost * JPY_TO_TWD).toFixed(0);
  const cardClasses = typeColors[item.type] || 'bg-white border-gray-200 text-gray-700';
  const iconPath = typeIcons[item.type] || typeIcons['景點'];
  const dragRef = useRef(null);

  const handleMapClick = (title) => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title + ', 日本')}`;
    window.open(mapUrl, '_blank');
  };

  return (
    <div
      ref={dragRef}
      className={`relative p-4 rounded-xl shadow-md transition-shadow duration-300 hover:shadow-lg ${cardClasses} border cursor-move`}
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragEnter={(e) => onDragEnter(e, index)}
      onDragEnd={onDrop} // DragEnd on the card itself to trigger the final drop logic
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); }}
    >
      <div className="flex justify-between items-start">
        {/* Time and Icon */}
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-1">
            <svg className="w-5 h-5 opacity-75" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d={iconPath} clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold opacity-80">{item.time}</p>
            <h4 className="text-base font-bold text-gray-900 mt-0.5">{item.title}</h4>
          </div>
        </div>

        {/* Action Menu */}
        <div className="flex space-x-2 flex-shrink-0">
          <button
            onClick={() => onEdit(item)}
            title="編輯"
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-7-1v-4m-1 4h4m-4 0l9.5-9.5M17.5 3.5a2.121 2.121 0 013 3L11 16l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button
            onClick={() => onDelete(item)}
            title="刪除"
            className="p-1 rounded-full text-red-500 hover:bg-red-100 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
      </div>

      <p className="mt-2 text-sm text-gray-700 pr-10">{item.detail}</p>

      {/* Footer / Cost & Map */}
      <div className="flex justify-between items-end mt-3 border-t border-opacity-30 pt-2">
        <div className="text-sm font-semibold text-gray-900">
          <p className="text-xs opacity-70">花費 (JPY) / (TWD)</p>
          ¥{item.cost.toLocaleString('en')} / <span className="text-pink-600 font-extrabold">NT${twdCost}</span>
        </div>
        <button
          onClick={() => handleMapClick(item.title)}
          className="flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          地圖
        </button>
      </div>
    </div>
  );
};

// --- App Component ---

const App = () => {
  const [activeTab, setActiveTab] = useState('Itinerary'); // 'Itinerary', 'Info', 'Total'
  const [itineraryData, setItineraryData] = useState(initialItineraryData);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [JPY_TO_TWD, setJPY_TO_TWD] = useState(DEFAULT_JPY_TO_TWD);

  // Modals
  const [editModalState, setEditModalState] = useState({ isOpen: false, item: null });
  const [confirmModalState, setConfirmModalState] = useState({ isOpen: false, item: null });
  const [guideModalState, setGuideModalState] = useState({
    isOpen: false,
    item: null,
    loading: false,
    guideContent: '',
    sources: [],
    weather: null,
  });

  // Drag & Drop State
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  
  // 拖曳開始
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.target.classList.add('opacity-50', 'border-dashed', 'border-2', 'border-pink-500'); // 拖曳時的視覺效果
  };
  
  // 拖曳進入新的位置
  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    // 添加一個視覺指示，例如邊框
    e.preventDefault();
    e.currentTarget.classList.add('shadow-xl', 'scale-[1.01]');
  };

  // 拖曳離開
  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('shadow-xl', 'scale-[1.01]');
  }

  // 拖曳結束並放置
  const handleDrop = (e) => {
    e.preventDefault();
    if (dragItem.current === null || dragOverItem.current === null) return;
    
    // 清除視覺效果
    const items = e.currentTarget.parentNode.children;
    for (const item of items) {
      item.classList.remove('opacity-50', 'border-dashed', 'border-2', 'border-pink-500', 'shadow-xl', 'scale-[1.01]');
    }

    const startDayIndex = activeDayIndex;
    const startActivityIndex = dragItem.current;
    const endActivityIndex = dragOverItem.current;

    const newItineraryData = [...itineraryData];
    const currentDay = newItineraryData[startDayIndex];
    const newActivities = [...currentDay.activities];

    // 重新排序
    const [reorderedItem] = newActivities.splice(startActivityIndex, 1);
    newActivities.splice(endActivityIndex, 0, reorderedItem);

    newItineraryData[startDayIndex] = { ...currentDay, activities: newActivities };
    setItineraryData(newItineraryData);

    dragItem.current = null;
    dragOverItem.current = null;
  };

  // 編輯功能
  const handleEdit = (item) => {
    setEditModalState({ isOpen: true, item });
  };

  const handleSaveEdit = (updatedItem) => {
    const newItineraryData = itineraryData.map((day, dIndex) => {
      if (dIndex === activeDayIndex) {
        return {
          ...day,
          activities: day.activities.map(activity =>
            activity.id === updatedItem.id ? updatedItem : activity
          ),
        };
      }
      return day;
    });
    setItineraryData(newItineraryData);
  };

  // 刪除功能
  const handleDelete = (item) => {
    setConfirmModalState({
      isOpen: true,
      item: item,
      title: '確認刪除行程',
      message: `確定要從 Day ${itineraryData[activeDayIndex].day} 刪除「${item.title}」這項活動嗎？`,
    });
  };

  const handleConfirmDelete = () => {
    if (!confirmModalState.item) return;

    const itemIdToDelete = confirmModalState.item.id;
    const newItineraryData = itineraryData.map((day, dIndex) => {
      if (dIndex === activeDayIndex) {
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== itemIdToDelete),
        };
      }
      return day;
    });
    setItineraryData(newItineraryData);
    setConfirmModalState({ isOpen: false, item: null });
  };

  // 新增卡片
  const handleAddCard = (type) => {
    const currentDay = itineraryData[activeDayIndex];
    const newItem = {
      id: Date.now(),
      type: type || '景點',
      time: 'TBD',
      title: '新增活動名稱',
      detail: '詳細描述這項新活動的內容。',
      cost: 0,
      guide: '',
    };
    const newItineraryData = itineraryData.map((day, dIndex) => {
      if (dIndex === activeDayIndex) {
        return {
          ...day,
          activities: [...day.activities, newItem],
        };
      }
      return day;
    });
    setItineraryData(newItineraryData);
    setEditModalState({ isOpen: true, item: newItem });
  };

  // 匯率變更
  const handleRateChange = () => {
    const newRate = prompt(`請輸入新的日幣 (JPY) 對新台幣 (TWD) 匯率 (例如：0.22):`);
    if (newRate && !isNaN(parseFloat(newRate))) {
      setJPY_TO_TWD(parseFloat(newRate));
    }
  };

  // 總花費計算
  const calculateTotalCost = useCallback(() => {
    const totalJPY = itineraryData.reduce((sum, day) => {
      return sum + day.activities.reduce((daySum, activity) => daySum + activity.cost, 0);
    }, 0);
    const totalTWD = (totalJPY * JPY_TO_TWD).toFixed(0);
    return { totalJPY, totalTWD };
  }, [itineraryData, JPY_TO_TWD]);

  const { totalJPY, totalTWD } = calculateTotalCost();

  // Gemini API 智能導遊與天氣功能
  const fetchGuideContent = async (dayItem, placeName) => {
    if (guideModalState.loading) return;

    setGuideModalState({ ...guideModalState, isOpen: true, item: dayItem, loading: true, guideContent: '', sources: [] });

    // 1. 設置 API 參數
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const city = dayItem.city;
    const date = dayItem.date;

    const systemPrompt = `你是一位專業的日本旅遊導遊與資料分析師。請根據以下地點名稱，
      1. 搜尋該地點（或所在城市）的即時天氣和未來幾小時的變化。
      2. 搜尋該地點的歷史故事、遊玩攻略或重要資訊。
      3. 綜合所有資訊，用中文（繁體）條列式呈現，長度約 200 字。
      4. 在結果中，請使用粗體和標籤（例如：必吃美食、必點菜單、必買伴手禮）來強調重要推薦。`;

    const userQuery = `請提供以下地點的旅遊分析：
      - 地點名稱: ${placeName}
      - 旅遊城市: ${city}
      - 旅遊日期: ${date}
    `;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      tools: [{ "google_search": {} }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        const candidate = result.candidates?.[0];

        if (candidate && candidate.content?.parts?.[0]?.text) {
          const text = candidate.content.parts[0].text;
          
          let sources = [];
          const groundingMetadata = candidate.groundingMetadata;
          if (groundingMetadata && groundingMetadata.groundingAttributions) {
              sources = groundingMetadata.groundingAttributions
                  .map(attribution => ({
                      uri: attribution.web?.uri,
                      title: attribution.web?.title,
                  }))
                  .filter(source => source.uri && source.title);
          }

          // 2. 更新行程資料和Modal
          setItineraryData(prevData =>
            prevData.map((day, dIndex) => {
              if (dIndex === activeDayIndex) {
                return { ...day, weather: text }; // 使用整個生成結果作為 weather/guide content
              }
              return day;
            })
          );

          setGuideModalState(prev => ({
            ...prev,
            loading: false,
            guideContent: text,
            sources: sources,
          }));
          return;

        } else {
          throw new Error("API returned no valid content.");
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error);
        attempts++;
        if (attempts < maxAttempts) {
          const delay = Math.pow(2, attempts) * 1000; // Exponential backoff: 2s, 4s, 8s...
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all attempts fail
    setGuideModalState(prev => ({
      ...prev,
      loading: false,
      guideContent: '很抱歉，無法從 Google AI 獲取最新的導遊和天氣資訊。請檢查您的網路或稍後再試。',
    }));
  };

  // --- UI Components ---

  const Header = () => (
    <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-md p-4 flex items-center justify-between border-b border-pink-100">
      <h1 className="text-xl font-extrabold text-pink-600">
        <span className="text-sm font-light text-gray-500 mr-1">關西</span>
        京阪神8天7夜
      </h1>
      {/* 功能設定選單 (右上方) */}
      <div className="relative group">
        <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2z"></path></svg>
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300 z-20 overflow-hidden">
          <div className="py-2">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">新增行程卡片</p>
            {Object.keys(typeIcons).map(type => (
              <button
                key={type}
                onClick={() => handleAddCard(type)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
              >
                {type}
              </button>
            ))}
            <button
              onClick={handleRateChange}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 border-t mt-1"
            >
              變更匯率 ({JPY_TO_TWD.toFixed(4)} TWD/JPY)
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DaySelector = () => (
    <div className="w-full overflow-x-auto whitespace-nowrap px-4 py-3 bg-stone-50 border-b border-gray-200 sticky top-[57px] z-10 shadow-sm">
      {itineraryData.map((day, index) => (
        <button
          key={day.day}
          onClick={() => setActiveDayIndex(index)}
          className={`inline-block px-4 py-1 mr-2 text-sm font-medium rounded-full transition duration-200 
            ${index === activeDayIndex
              ? 'bg-pink-500 text-white shadow-md'
              : 'bg-white text-gray-600 hover:bg-pink-50'
            }`}
        >
          Day {day.day} - {day.city}
        </button>
      ))}
    </div>
  );

  const Navbar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around shadow-2xl z-20">
      {['Itinerary', 'Info', 'Total'].map(tab => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`flex-1 py-3 flex flex-col items-center text-xs font-medium transition duration-200 ${activeTab === tab ? 'text-pink-600' : 'text-gray-500 hover:text-pink-400'}`}
        >
          {tab === 'Itinerary' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
          {tab === 'Info' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>}
          {tab === 'Total' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-2.485 0-4.5 2.015-4.5 4.5S9.515 17 12 17s4.5-2.015 4.5-4.5S14.485 8 12 8z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21a9 9 0 100-18 9 9 0 000 18z"></path></svg>}
          {tab === 'Itinerary' ? '行程' : tab === 'Info' ? '資訊' : '記帳'}
        </button>
      ))}
    </div>
  );

  const ItineraryView = () => {
    const currentDay = itineraryData[activeDayIndex];
    const cityForSearch = currentDay.city === '宇治' ? '京都' : currentDay.city === '彥根' ? '琵琶湖' : currentDay.city; // 修正查詢城市

    return (
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
          Day {currentDay.day}: {currentDay.dayTitle}
        </h2>

        {/* Weather/Guide Section */}
        <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-pink-600">
              <svg className="w-5 h-5 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              城市導遊 & 天氣 ({currentDay.city})
            </h3>
            <button
              onClick={() => fetchGuideContent(currentDay, cityForSearch)}
              className="px-3 py-1 text-xs font-medium text-white bg-pink-500 rounded-full hover:bg-pink-600 transition shadow-md"
            >
              獲取即時資訊
            </button>
          </div>
          <div className="text-sm text-gray-600 max-h-32 overflow-y-auto">
            {currentDay.weather ? (
              <div dangerouslySetInnerHTML={{ __html: currentDay.weather.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ) : (
              <p>點擊「獲取即時資訊」按鈕，AI 導遊將為您提供 {currentDay.city} 的即時天氣預報（含每小時變化）以及當天景點的故事和必吃/必買推薦！</p>
            )}
          </div>
        </div>

        {/* Activity List */}
        <div className="space-y-4 pt-2">
          {currentDay.activities.length > 0 ? (
            currentDay.activities.map((item, index) => (
              <ItineraryCard
                key={item.id}
                item={item}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
                JPY_TO_TWD={JPY_TO_TWD}
                onDragStart={handleDragStart}
                onDragEnter={handleDragEnter}
                onDrop={handleDrop}
              />
            ))
          ) : (
            <div className="text-center p-8 bg-white rounded-xl text-gray-500 border border-dashed">
              今日暫無行程。請使用右上角選單「新增卡片」。
            </div>
          )}
        </div>
      </div>
    );
  };

  const InfoView = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">航班與住宿資訊</h2>

      {/* Flights */}
      <div className="p-4 bg-white rounded-xl shadow-lg border border-pink-100">
        <h3 className="text-lg font-bold text-pink-600 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          航班資訊
        </h3>
        {itineraryInfo.flights.map((flight, index) => (
          <div key={index} className="mb-3 p-3 border-b last:border-b-0">
            <p className="text-sm font-semibold text-gray-800">{flight.type}: <span className="text-pink-500">{flight.flight}</span></p>
            <p className="text-xs text-gray-500">日期: {flight.date} / 航空公司: {flight.airline || '待定'}</p>
          </div>
        ))}
        <p className="mt-3 text-xs text-red-500">請注意：Day 1 & Day 8 交通已納入總花費。</p>
      </div>

      {/* Accommodations */}
      <div className="p-4 bg-white rounded-xl shadow-lg border border-pink-100">
        <h3 className="text-lg font-bold text-pink-600 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          住宿列表
        </h3>
        {itineraryInfo.accommodations.map((acc, index) => (
          <div key={index} className="mb-3 p-3 border-b last:border-b-0">
            <p className="text-sm font-semibold text-gray-800">{acc.hotel} <span className="text-xs text-pink-500 ml-2">({acc.note})</span></p>
            <p className="text-xs text-gray-500">城市: {acc.city} / 期間: {acc.dates}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const TotalView = () => (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">旅遊記帳總覽</h2>

      {/* Summary Card */}
      <div className="p-6 bg-white rounded-xl shadow-lg border border-green-200">
        <h3 className="text-lg font-bold text-green-600 mb-4">總花費概算 (不含機票住宿)</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-700">
            <span className="text-sm font-medium">總計日幣 (JPY) 花費:</span>
            <span className="text-xl font-extrabold text-gray-900">¥{totalJPY.toLocaleString('en')}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700 border-t border-green-100 pt-3">
            <span className="text-sm font-medium">總計新台幣 (TWD) 估算:</span>
            <span className="text-2xl font-extrabold text-pink-600">NT${totalTWD}</span>
          </div>
          <p className="text-xs text-gray-500 pt-2">當前匯率: 1 JPY ≈ {JPY_TO_TWD.toFixed(4)} TWD。請透過右上角選單調整匯率。</p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-700">每日花費明細 (點擊查看)</h3>
        {itineraryData.map((day, index) => {
          const dayTotalJPY = day.activities.reduce((sum, a) => sum + a.cost, 0);
          const dayTotalTWD = (dayTotalJPY * JPY_TO_TWD).toFixed(0);
          return (
            <details key={index} className="bg-white rounded-xl shadow-md overflow-hidden transition duration-300 open:shadow-xl border border-gray-100">
              <summary className="p-4 flex justify-between items-center cursor-pointer bg-pink-50 hover:bg-pink-100 transition">
                <span className="text-base font-semibold text-gray-800">Day {day.day} - {day.city}</span>
                <span className="text-sm font-extrabold text-pink-600">NT${dayTotalTWD}</span>
              </summary>
              <div className="p-4 border-t border-gray-100 space-y-2">
                {day.activities
                  .filter(a => a.cost > 0)
                  .map(activity => (
                    <div key={activity.id} className="flex justify-between text-sm text-gray-600 border-b border-dashed pb-1">
                      <span className="font-medium">[{activity.type}] {activity.title}</span>
                      <span className="font-mono">¥{activity.cost.toLocaleString('en')} / NT${(activity.cost * JPY_TO_TWD).toFixed(0)}</span>
                    </div>
                  ))}
                {day.activities.filter(a => a.cost > 0).length === 0 && (
                  <p className="text-xs text-gray-500 italic">本日無計入花費的行程。</p>
                )}
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );

  // --- Main Render ---

  let Content;
  switch (activeTab) {
    case 'Info':
      Content = <InfoView />;
      break;
    case 'Total':
      Content = <TotalView />;
      break;
    case 'Itinerary':
    default:
      Content = <ItineraryView />;
      break;
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-20 font-sans text-gray-800" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Header />
      {activeTab === 'Itinerary' && <DaySelector />}
      <div className="pt-[110px] md:pt-[60px] max-w-2xl mx-auto">
        {Content}
      </div>
      <Navbar />

      {/* Modals */}
      <EditModal
        isOpen={editModalState.isOpen}
        item={editModalState.item}
        onSave={handleSaveEdit}
        onClose={() => setEditModalState({ isOpen: false, item: null })}
        availableTypes={Object.keys(typeIcons)}
      />
      <ConfirmationModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmModalState({ isOpen: false, item: null })}
      />
      <GuideModal
        isOpen={guideModalState.isOpen}
        item={guideModalState.item}
        onClose={() => setGuideModalState(prev => ({ ...prev, isOpen: false }))}
        loading={guideModalState.loading}
        guideContent={guideModalState.guideContent}
        sources={guideModalState.sources}
      />
    </div>
  );
};

export default App;
