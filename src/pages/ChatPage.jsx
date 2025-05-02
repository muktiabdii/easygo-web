import React, { useState } from 'react'
import Navbar from '../components/Navbar'

const users = [
  {
    name: 'James',
    lastMessage: 'Aku lihat sepertinya kau kesulitan mencari akses kursi roda?',
    time: '9:23 PM',
    img: '/users/james.jpg',
    messages: [
      { text: 'Hey bung! Apa kabar hari ini?', time: '9:00 PM' },
      { text: 'Aku baik-baik saja, bagaimana denganmu?', time: '9:20 PM' },
      { text: 'Aku lihat sepertinya kau kesulitan mencari akses kursi roda?', time: '9:23 PM' },
      { text: 'Betul, aku butuh bantuan untuk menemukan lift.', time: '9:25 PM' },
      { text: 'Oke, aku bantu cari informasi ya.', time: '9:27 PM' },
      { text: 'Terima kasih banyak!', time: '9:30 PM' },
    ]
  },
  {
    name: 'Rickley',
    lastMessage: 'Sama-sama, semoga membantu!',
    time: '12:45 AM',
    img: '/users/rickley.jpg',
    messages: [
      { text: 'Aku baru saja melihat reviewmu bung, terima kasih banyak!', time: '12:30 AM' },
      { text: 'Sama-sama, semoga membantu!', time: '12:45 AM' },
      { text: 'Kalau butuh rekomendasi lain, kabarin aja ya.', time: '1:00 AM' },
      { text: 'Siap, akan kuingat.', time: '1:10 AM' },
    ]
  },
  {
    name: 'Billy',
    lastMessage: 'Tentu, kapan saja!',
    time: '10:45 AM',
    img: '/users/billy.jpg',
    messages: [
      { text: 'Heyy, kamu terlihat keren, mau jalan sama aku ga?', time: '10:30 AM' },
      { text: 'Tentu, kapan saja!', time: '10:45 AM' },
      { text: 'Mungkin akhir pekan ini?', time: '11:00 AM' },
      { text: 'Oke, aku kosong kok.', time: '11:10 AM' },
    ]
  },
  {
    name: 'Sarah',
    lastMessage: 'Besok kita bertemu ya!',
    time: '4:00 PM',
    img: '/users/sarah.jpg',
    messages: [
      { text: 'Halo! Aku baru daftar aplikasi ini.', time: '3:00 PM' },
      { text: 'Selamat datang!', time: '3:10 PM' },
      { text: 'Terima kasih, senang bertemu kamu.', time: '3:20 PM' },
      { text: 'Besok kita bertemu ya!', time: '4:00 PM' },
    ]
  },
  {
    name: 'Michael',
    lastMessage: 'Aku bisa rekomendasikan beberapa tempat bagus.',
    time: '2:15 PM',
    img: '/users/michael.jpg',
    messages: [
      { text: 'Hai, kamu tau tempat makan ramah disabilitas?', time: '2:00 PM' },
      { text: 'Aku bisa rekomendasikan beberapa tempat bagus.', time: '2:15 PM' },
      { text: 'Wah, makasih banget!', time: '2:20 PM' },
      { text: 'Nanti aku kirim daftarnya ya.', time: '2:30 PM' },
    ]
  },
  {
    name: 'Emma',
    lastMessage: 'Aku support selalu!',
    time: '5:30 PM',
    img: '/users/emma.jpg',
    messages: [
      { text: 'Lihat perkembangan aplikasi ini keren banget.', time: '5:00 PM' },
      { text: 'Terima kasih, dukunganmu penting banget.', time: '5:15 PM' },
      { text: 'Aku support selalu!', time: '5:30 PM' },
    ]
  },
  {
    name: 'Daniel',
    lastMessage: 'Kalau mau, kita bisa buat komunitas kecil.',
    time: '6:45 PM',
    img: '/users/daniel.jpg',
    messages: [
      { text: 'Aku ingin berbagi pengalaman tentang aksesibilitas.', time: '6:00 PM' },
      { text: 'Wah, keren! Aku juga tertarik.', time: '6:15 PM' },
      { text: 'Kalau mau, kita bisa buat komunitas kecil.', time: '6:45 PM' },
      { text: 'Ide bagus, ayo kita atur.', time: '7:00 PM' },
    ]
  },
]

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('cari')
  const [selectedUser, setSelectedUser] = useState(null)

  const handleUserSelect = (user) => {
    setSelectedUser(user)
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F7F8FD] px-15 pt-20">
        <div className="flex space-x-6">
          {/* Sidebar */}
          <div className="w-1/6 space-y-4">
            {/* Tombol Cari Orang */}
            <button
              onClick={() => setActiveTab('cari')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-l-lg w-full ${
                activeTab === 'cari' ? 'bg-[#EFF0F7] text-[#3C91E6]' : 'bg-white text-black shadow'
              } ${activeTab === 'cari' ? 'rounded-r-none' : ''}`}
            >
              <img
                src={`/icons/${activeTab === 'cari' ? 'cariorang-blue' : 'cariorang-black'}.png`}
                alt="Cari"
                className="h-5 w-5"
              />
              <span className="font-medium">Cari Orang</span>
            </button>

            {/* Tombol Semua Obrolan */}
            <button
              onClick={() => setActiveTab('obrolan')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-l-lg w-full ${
                activeTab === 'obrolan' ? 'bg-[#EFF0F7] text-[#3C91E6]' : 'bg-white text-black shadow'
              } ${activeTab === 'obrolan' ? 'rounded-r-none' : ''}`}
            >
              <img
                src={`/icons/${activeTab === 'obrolan' ? 'semuaobrolan-blue' : 'semuaobrolan-black'}.png`}
                alt="Obrolan"
                className="h-5 w-5"
              />
              <span className="font-medium">Semua Obrolan</span>
            </button>
          </div>

          {/* Konten */}
          {activeTab === 'cari' ? (
            <div className="w-5/6 flex space-x-6">
              {/* Cari Orang */}
              <div className="w-2/3 bg-[#EFF0F7] rounded-xl p-6 cari-container h-[600px] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">Cari Orang</h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari Orang..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-300"
                  />
                  <img src="/icons/search.png" alt="Search" className="absolute left-3 top-2.5 h-5 w-5" />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg hover:bg-white transition duration-200"
                      onClick={() => handleUserSelect(user)}
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
              <div className="w-1/3 bg-[#EFF0F7] p-6 rounded-xl shadow space-y-4 filter-container h-[600px] flex flex-col">
                <h3 className="text-center text-lg font-semibold">Filter Pencarian</h3>
                <div className="space-y-10 flex-1">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Asal Kota</label>
                  <select className="w-full p-2.5 bg-white rounded-md border border-gray-300">
                    <option value="" disabled hidden></option>
                    <option>Jakarta</option>
                    <option>Bandung</option>
                    <option>Surabaya</option>
                    <option>Yogyakarta</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Jumlah Review</label>
                  <select className="w-full p-2.5 bg-white rounded-md border border-gray-300">
                    <option value="" disabled hidden></option>
                    <option>0</option>
                    <option>10+</option>
                    <option>50+</option>
                    <option>100+</option>
                    <option>1000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Aktif Terakhir</label>
                  <select className="w-full p-2.5 bg-white rounded-md border border-gray-300">
                    <option value="" disabled hidden></option>
                    <option>Hari ini</option>
                    <option>Kemarin</option>
                    <option>Minggu lalu</option>
                    <option>Bulan lalu</option>
                    <option>Tahun lalu</option>
                  </select>
                </div>
              </div>
                <button className="bg-[#3C91E6] text-white w-full py-2 rounded-md mt-4">
                  Terapkan
                </button>
              </div>
            </div>
          ) : (
            <div className="w-5/6 flex space-x-6">
              {/* Semua Obrolan */}
              <div className="w-6/10 bg-[#EFF0F7] rounded-xl p-6 obrolan-container h-[600px] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">Cari Obrolan</h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari Obrolan..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-gray-300"
                  />
                  <img src="/icons/search.png" alt="Search" className="absolute left-3 top-2.5 h-5 w-5" />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg"
                      onClick={() => handleUserSelect(user)}
                    >
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
              <div className="w-4/10 bg-[#EFF0F7] rounded-xl shadow chat-container h-[600px] flex flex-col">
                {selectedUser ? (
                  <>
                    <div className="flex items-center justify-between bg-[#3C91E6] text-white p-4 rounded-t-lg">
                      <div className="flex items-center space-x-4">
                        <img src={selectedUser.img} className="h-10 w-10 rounded-full" alt={selectedUser.name} />
                        <span className="font-semibold">{selectedUser.name}</span>
                      </div>
                      <img src="/icons/more.png" className="h-5 w-5" alt="More" />
                    </div>
                    <div className="p-4 space-y-4 overflow-y-auto flex-1">
                      {selectedUser.messages.map((msg, index) => (
                        <div key={index}>
                          <div>
                            <p className="bg-white p-3 rounded-lg shadow text-sm w-fit">{msg.text}</p>
                            <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-center text-gray-400">
                    Pilih pengguna untuk mulai chatting
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default ChatPage
