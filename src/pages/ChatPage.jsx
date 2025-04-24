import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const users = [
  {
    name: 'James',
    lastMessage: 'Hey bung! Apa kabar hari ini?',
    time: '9:00 PM',
    img: '/users/james.jpg',
  },
  {
    name: 'Rickley',
    lastMessage: 'Aku baru saja melihat reviewmu bung, terima kasih sangat me...',
    time: '12:30 AM',
    img: '/users/rickley.jpg',
  },
  {
    name: 'Billy',
    lastMessage: 'Heyy, kamu terlihat keren, mau jalan sama aku ga?',
    time: '10:30 AM',
    img: '/users/billy.jpg'
  }
]

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('cari') // 'cari' atau 'obrolan'

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-[#F7F8FD] px-8 py-4">
      <div className="flex space-x-6">
        {/* Sidebar */}
        <div className="w-1/6 space-y-4">
          <button
            onClick={() => setActiveTab('cari')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full ${
              activeTab === 'cari'
                ? 'bg-[#EFF0F7] text-[#3C91E6]'
                : 'bg-white text-black shadow'
            }`}
          >
            <img src="/icons/search-user.png" alt="Cari" className="h-5 w-5" />
            <span className="font-medium">Cari Orang</span>
          </button>
          <button
            onClick={() => setActiveTab('obrolan')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full ${
              activeTab === 'obrolan'
                ? 'bg-[#EFF0F7] text-[#3C91E6]'
                : 'bg-white text-black shadow'
            }`}
          >
            <img src="/icons/message.png" alt="Obrolan" className="h-5 w-5" />
            <span className="font-medium">Semua Obrolan</span>
          </button>
        </div>

        {/* Konten */}
        {activeTab === 'cari' ? (
          // --- TAMPILAN "CARI ORANG" ---
          <div className="w-5/6 flex space-x-6">
            <div className="w-2/3 bg-[#EFF0F7] rounded-xl p-6">
              <h2 className="text-center text-lg font-semibold mb-4">Cari Orang</h2>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Cari Orang..."
                  className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-300"
                />
                <img src="/icons/search.png" alt="Search" className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white transition duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <img src={user.img} alt={user.name} className="h-10 w-10 rounded-full" />
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600">
                          Telah mereview 100+ fasilitas aksesibilitas
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm text-gray-500">
                        Malang | Aktif 3 April
                      </p>
                      <button className="bg-[#3C91E6] text-white text-xs px-4 py-1 rounded">
                        Obrolan Baru
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="w-1/3 bg-[#EFF2FB] p-6 rounded-xl shadow space-y-4">
              <h3 className="text-center text-lg font-semibold">Filter Pencarian</h3>
              <div className="space-y-4">
                <select className="w-full p-2 bg-white rounded-md border border-gray-300">
                    <option>Asal Kota</option>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Yogyakarta</option>
                </select>
                <select className="w-full p-2 bg-white rounded-md border border-gray-300">
                    <option>Jumlah Review</option>
                    <option>0</option>
                    <option>10+</option>
                    <option>50+</option>
                    <option>100+</option>
                    <option>1000+</option>
                </select>
                <select className="w-full p-2 bg-white rounded-md border border-gray-300">
                    <option>Aktif Terakhir</option>
                    <option>Hari ini</option>
                    <option>Kemarin</option>
                    <option>Minggu lalu</option>
                    <option>Bulan lalu</option>
                    <option>Tahun lalu</option>
                </select>
              </div>
              <button className="bg-[#3C91E6] text-white w-full py-2 rounded-md mt-4">
                Terapkan
              </button>
            </div>
          </div>
        ) : (
          // --- TAMPILAN "SEMUA OBROLAN" ---
          <div className="w-5/6 flex space-x-6">
            {/* Daftar Obrolan */}
            <div className="w-6/10 bg-[#EFF0F7] rounded-xl p-6">
              <h2 className="text-center text-lg font-semibold mb-4">Cari Obrolan</h2>
              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Cari Obrolan..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300"
                />
                <img src="/icons/search.png" alt="Search" className="absolute left-3 top-2.5 h-5 w-5" />
              </div>
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={index} className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg">
                    <img src={user.img} alt={user.name} className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-600 truncate">{user.lastMessage}</p>
                    </div>
                    <span className="text-xs text-gray-400">{user.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Chat */}
            <div className="w-4/10 bg-white rounded-xl p-4 shadow">
              <div className="flex items-center justify-between bg-[#3C91E6] text-white p-4 rounded-t-lg">
                <div className="flex items-center space-x-4">
                  <img src="/users/james.jpg" className="h-10 w-10 rounded-full" alt="James" />
                  <span className="font-semibold">James</span>
                </div>
                <img src="/icons/more.png" className="h-5 w-5" alt="More" />
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <p className="bg-white p-3 rounded-lg shadow text-sm w-fit">Hey bung! Apa kabar hari ini?</p>
                  <p className="text-xs text-gray-400 mt-1">9:00 PM</p>
                </div>
                <div className="text-right">
                  <p className="bg-[#3C91E6] text-white p-3 rounded-lg inline-block text-sm">Hey! Aku baik-baik saja, bagaimana pekerjaanmu tadi?</p>
                  <p className="text-xs text-gray-400 mt-1">9:20 PM</p>
                </div>
                <div className="text-right">
                  <p className="bg-[#3C91E6] text-white p-3 rounded-lg inline-block text-sm">Aku lihat sepertinya kau kesulitan mencari akses kursi roda?</p>
                  <p className="text-xs text-gray-400 mt-1">9:23 PM</p>
                </div>
                <div>
                  <p className="bg-white p-3 rounded-lg shadow text-sm w-fit">Lorem ipsum dolor sit amet</p>
                  <p className="text-xs text-gray-400 mt-1">9:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default ChatPage
