import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Trash2, GripVertical, Menu, X, Plane, Hotel, DollarSign, Info, Navigation } from 'lucide-react';

// 匯率常數
const JPY_TO_TWD = 0.21;

// 初始資料
const initialFlightInfo = {
  outbound: { date: '2026/02/10', time: '07:40-11:10', route: '桃園(TPE) → 關西(KIX)', airline: '航空公司' },
  return: { date: '2026/02/17', time: '12:20-14:35', route: '關西(KIX) → 桃園(TPE)', airline: '航空公司' }
};

const initialAccommodations = [
  { id: 1, name: 'GRIDS PREMIUM HOTEL OSAKA NAMBA', city: '大阪', checkIn: '02/10', checkOut: '02/12', address: '難波' },
  { id: 2, name: 'Peanuts Hotel', city: '神戶', checkIn: '02/12', checkOut: '02/13', address: '三宮' },
  { id: 3, name: 'Miyako Hotel Kyoto Hachijo', city: '京都', checkIn: '02/13', checkOut: '02/17', address: '京都車站附近' }
];

const initialItinerary = [
  {
    day: 1,
    date: '2/10',
    city: '大阪',
    weather: { temp: '8°C', condition: '晴', hourly: [{ time: '14:00', temp: '10°C' }, { time: '17:00', temp: '8°C' }] },
    items: [
      { id: '1-1', type: 'attraction', time: '14:30-18:00', name: '心齋橋筋商店街 & 道頓堀', cost: 0, description: '大阪最熱鬧的商圈，必看固力果跑跑人看板', highlights: ['固力果跑跑人', '大阪購物天堂'], mustEat: ['章魚燒', '大阪燒', '金龍拉麵'], mustBuy: [] },
      { id: '1-2', type: 'food', time: '18:00-21:00', name: '道頓堀美食街', cost: 2000, description: '品嚐大阪道地美食', highlights: [], mustEat: ['章魚燒', '大阪燒', '金龍拉麵'], mustBuy: [] }
    ]
  },
  {
    day: 2,
    date: '2/11',
    city: '大阪',
    weather: { temp: '9°C', condition: '多雲', hourly: [{ time: '09:00', temp: '7°C' }, { time: '13:00', temp: '10°C' }] },
    items: [
      { id: '2-1', type: 'attraction', time: '09:00-13:00', name: '大阪海遊館', cost: 2700, description: '世界最大水族館之一', highlights: ['鯨鯊', '企鵝', '海豚表演'], mustEat: [], mustBuy: ['海洋生物周邊商品'] },
      { id: '2-2', type: 'attraction', time: '14:30-17:00', name: '天保山大摩天輪', cost: 800, description: '欣賞大阪港全景', highlights: ['俯瞰大阪港', '關西機場遠眺'], mustEat: [], mustBuy: [] }
    ]
  },
  {
    day: 3,
    date: '2/12',
    city: '神戶',
    weather: { temp: '7°C', condition: '晴', hourly: [{ time: '13:00', temp: '9°C' }, { time: '17:00', temp: '7°C' }] },
    items: [
      { id: '3-1', type: 'attraction', time: '13:00-17:00', name: '北野異人館街', cost: 0, description: '歐式建築群，體驗異國風情', highlights: ['風見雞館', '萌黃館', '藍瓶咖啡'], mustEat: ['藍瓶咖啡'], mustBuy: [] },
      { id: '3-2', type: 'food', time: '19:00-21:00', name: '神戶牛料理', cost: 8000, description: '頂級神戶牛饗宴', highlights: [], mustEat: ['神戶牛排', 'A5和牛'], mustBuy: [] }
    ]
  },
  {
    day: 4,
    date: '2/13',
    city: '京都',
    weather: { temp: '6°C', condition: '陰', hourly: [{ time: '13:00', temp: '8°C' }, { time: '17:00', temp: '6°C' }] },
    items: [
      { id: '4-1', type: 'attraction', time: '13:00-17:00', name: '清水寺', cost: 400, description: '京都代表性寺廟，UNESCO世界遺產', highlights: ['音羽瀑布', '二年坂', '三年坂'], mustEat: ['抹茶冰淇淋'], mustBuy: ['清水燒陶器', '京都扇子'] },
      { id: '4-2', type: 'attraction', time: '17:00-19:00', name: '祇園 & 花見小路', cost: 0, description: '京都傳統藝妓文化街區', highlights: ['傳統町家', '藝妓文化'], mustEat: [], mustBuy: ['京都傳統工藝品'] }
    ]
  },
  {
    day: 5,
    date: '2/14',
    city: '京都',
    weather: { temp: '5°C', condition: '晴', hourly: [{ time: '09:00', temp: '4°C' }, { time: '15:00', temp: '7°C' }] },
    items: [
      { id: '5-1', type: 'attraction', time: '09:00-14:00', name: '嵐山 & 天龍寺', cost: 600, description: '世界遺產寺廟與竹林美景', highlights: ['嵯峨野竹林之道', '天龍寺庭園', '渡月橋'], mustEat: ['嵐山湯豆腐', '抹茶甜點'], mustBuy: ['竹製工藝品'] },
      { id: '5-2', type: 'attraction', time: '15:30-17:30', name: '金閣寺', cost: 500, description: '京都最具代表性的金色寺廟', highlights: ['金色舍利殿', '鏡湖池倒影'], mustEat: [], mustBuy: ['金閣寺御守'] }
    ]
  }
];

// 天氣圖示組件
const WeatherIcon = ({ condition }) => {
  const icons = {
    '晴': '☀️',
    '多雲': '⛅',
    '陰': '☁️',
    '雨': '🌧️',
    '雪': '❄️'
  };
  return <span className="text-2xl">{icons[condition] || '☀️'}</span>;
};

// 卡片組件
const DraggableCard = ({ item, dayIndex, onEdit, onDelete, onDragStart, onDragOver, onDrop }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const typeConfig = {
    attraction: { bg: 'bg-blue-50', border: 'border-blue-200', icon: '🏛️', label: '景點' },
    food: { bg: 'bg-orange-50', border: 'border-orange-200', icon: '🍜', label: '美食' },
    transport: { bg: 'bg-green-50', border: 'border-green-200', icon: '🚇', label: '交通' }
  };

  const config = typeConfig[item.type];
  const twd = Math.round(item.cost * JPY_TO_TWD);

  return (
    <div
      className={`${config.bg} ${config.border} border-2 rounded-xl p-4 mb-3 cursor-move hover:shadow-lg transition-all`}
      draggable
      onDragStart={(e) => onDragStart(e, dayIndex, item.id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, dayIndex)}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{config.icon}</div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs text-gray-500">{item.time}</span>
              <h3 className="font-semibold text-gray-800">{item.name}</h3>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-600 hover:text-blue-800">
                <Info size={16} />
              </button>
              <button onClick={() => onEdit(dayIndex, item.id)} className="text-gray-600 hover:text-gray-800">
                <Edit2 size={16} />
              </button>
              <button onClick={() => onDelete(dayIndex, item.id)} className="text-red-500 hover:text-red-700">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {item.cost > 0 && (
            <div className="flex gap-4 text-sm mb-2">
              <span className="text-gray-700">¥{item.cost.toLocaleString()}</span>
              <span className="text-blue-600">≈ NT${twd.toLocaleString()}</span>
            </div>
          )}

          {isExpanded && (
            <div className="mt-3 space-y-2 text-sm">
              {item.description && <p className="text-gray-600">{item.description}</p>}
              
              {item.highlights && item.highlights.length > 0 && (
                <div>
                  <span className="font-semibold text-purple-700">✨ 亮點：</span>
                  <span className="text-gray-700"> {item.highlights.join('、')}</span>
                </div>
              )}
              
              {item.mustEat && item.mustEat.length > 0 && (
                <div>
                  <span className="font-semibold text-red-600">🍴 必吃：</span>
                  <span className="text-gray-700"> {item.mustEat.join('、')}</span>
                </div>
              )}
              
              {item.mustBuy && item.mustBuy.length > 0 && (
                <div>
                  <span className="font-semibold text-green-600">🛍️ 必買：</span>
                  <span className="text-gray-700"> {item.mustBuy.join('、')}</span>
                </div>
              )}

              <a 
                href={`https://www.google.com/maps/search/${encodeURIComponent(item.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-2"
              >
                <Navigation size={14} />
                <span>Google 地圖</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 主應用
export default function TravelPlanner() {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [menuOpen, setMenuOpen] = useState(false);
  const [itinerary, setItinerary] = useState(initialItinerary);
  const [draggedItem, setDraggedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ type: 'attraction', time: '', name: '', cost: 0, description: '', highlights: '', mustEat: '', mustBuy: '' });

  const handleDragStart = (e, dayIndex, itemId) => {
    setDraggedItem({ dayIndex, itemId });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetDayIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newItinerary = [...itinerary];
    const sourceDay = newItinerary[draggedItem.dayIndex];
    const targetDay = newItinerary[targetDayIndex];
    const itemIndex = sourceDay.items.findIndex(item => item.id === draggedItem.itemId);
    
    if (itemIndex === -1) return;
    
    const [movedItem] = sourceDay.items.splice(itemIndex, 1);
    targetDay.items.push(movedItem);
    
    setItinerary(newItinerary);
    setDraggedItem(null);
  };

  const handleDelete = (dayIndex, itemId) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].items = newItinerary[dayIndex].items.filter(item => item.id !== itemId);
    setItinerary(newItinerary);
  };

  const handleAddItem = (dayIndex) => {
    if (!newItem.name || !newItem.time) return;
    
    const item = {
      id: `${dayIndex}-${Date.now()}`,
      type: newItem.type,
      time: newItem.time,
      name: newItem.name,
      cost: Number(newItem.cost),
      description: newItem.description,
      highlights: newItem.highlights ? newItem.highlights.split('、') : [],
      mustEat: newItem.mustEat ? newItem.mustEat.split('、') : [],
      mustBuy: newItem.mustBuy ? newItem.mustBuy.split('、') : []
    };
    
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].items.push(item);
    setItinerary(newItinerary);
    setShowAddForm(false);
    setNewItem({ type: 'attraction', time: '', name: '', cost: 0, description: '', highlights: '', mustEat: '', mustBuy: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            關西之旅
          </h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Menu Overlay */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setMenuOpen(false)}>
          <div className="absolute right-0 top-16 bg-white rounded-l-2xl shadow-xl p-6 w-64" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => { setShowAddForm(true); setMenuOpen(false); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg text-left"
            >
              <Plus size={20} />
              <span>新增卡片</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white/60 backdrop-blur-sm p-1 rounded-xl">
          {[
            { id: 'itinerary', label: '行程', icon: '📅' },
            { id: 'flight', label: '航班', icon: '✈️' },
            { id: 'hotel', label: '住宿', icon: '🏨' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-md text-purple-600'
                  : 'text-gray-600 hover:bg-white/50'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {itinerary.map((day, dayIndex) => (
              <div key={day.day} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md">
                {/* Day Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Day {day.day} - {day.date}</h2>
                    <p className="text-gray-600">{day.city}</p>
                  </div>
                  <div className="text-right">
                    <WeatherIcon condition={day.weather.condition} />
                    <p className="text-sm text-gray-600">{day.weather.temp}</p>
                  </div>
                </div>

                {/* Hourly Weather */}
                <div className="flex gap-4 mb-4 text-sm text-gray-600 bg-blue-50/50 p-3 rounded-lg">
                  {day.weather.hourly.map((h, i) => (
                    <span key={i}>{h.time}: {h.temp}</span>
                  ))}
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {day.items.map(item => (
                    <DraggableCard
                      key={item.id}
                      item={item}
                      dayIndex={dayIndex}
                      onEdit={() => {}}
                      onDelete={handleDelete}
                      onDragStart={handleDragStart}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'flight' && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-md space-y-6">
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Plane className="text-blue-600" size={20} />
                去程航班
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">日期：</span>{initialFlightInfo.outbound.date}</p>
                <p><span className="font-medium">時間：</span>{initialFlightInfo.outbound.time}</p>
                <p><span className="font-medium">航線：</span>{initialFlightInfo.outbound.route}</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Plane className="text-purple-600 transform rotate-180" size={20} />
                回程航班
              </h3>
              <div className="space-y-2 text-gray-700">
                <p><span className="font-medium">日期：</span>{initialFlightInfo.return.date}</p>
                <p><span className="font-medium">時間：</span>{initialFlightInfo.return.time}</p>
                <p><span className="font-medium">航線：</span>{initialFlightInfo.return.route}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'hotel' && (
          <div className="space-y-4">
            {initialAccommodations.map(hotel => (
              <div key={hotel.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 shadow-md">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Hotel className="text-pink-600" size={20} />
                  {hotel.name}
                </h3>
                <div className="space-y-1 text-gray-700">
                  <p><span className="font-medium">城市：</span>{hotel.city}</p>
                  <p><span className="font-medium">入住：</span>{hotel.checkIn} | <span className="font-medium">退房：</span>{hotel.checkOut}</p>
                  <p><span className="font-medium">地址：</span>{hotel.address}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddForm(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">新增卡片</h2>
            <div className="space-y-4">
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                className="w-full p-3 border rounded-lg"
              >
                <option value="attraction">景點</option>
                <option value="food">美食</option>
                <option value="transport">交通</option>
              </select>
              
              <input
                type="text"
                placeholder="時間 (例: 09:00-12:00)"
                value={newItem.time}
                onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="text"
                placeholder="名稱"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="number"
                placeholder="費用 (日幣)"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <textarea
                placeholder="描述"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full p-3 border rounded-lg"
                rows="3"
              />
              
              <input
                type="text"
                placeholder="亮點 (用「、」分隔)"
                value={newItem.highlights}
                onChange={(e) => setNewItem({ ...newItem, highlights: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="text"
                placeholder="必吃 (用「、」分隔)"
                value={newItem.mustEat}
                onChange={(e) => setNewItem({ ...newItem, mustEat: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <input
                type="text"
                placeholder="必買 (用「、」分隔)"
                value={newItem.mustBuy}
                onChange={(e) => setNewItem({ ...newItem, mustBuy: e.target.value })}
                className="w-full p-3 border rounded-lg"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const dayIndex = 0; // 默認加到第一天，之後可拖動
                    handleAddItem(dayIndex);
                  }}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700"
                >
                  新增
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
