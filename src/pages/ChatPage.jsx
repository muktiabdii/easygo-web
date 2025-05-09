import React, { useState, useRef, useEffect } from "react";
import NavbarBack from "../components/NavbarBack";

const users = [
  {
    name: "James",
    lastMessage: "Aku lihat sepertinya kau kesulitan mencari akses kursi roda?",
    time: "9:23 PM",
    img: "/users/james.jpg",
    city: "Malang",
    lastActive: "3 April",
    reviewCount: 120,
    messages: [
      {
        text: "Hey bung! Apa kabar hari ini?",
        time: "9:00 PM",
        date: "2025-04-28",
      },
      {
        text: "Aku lihat sepertinya kau kesulitan mencari akses kursi roda?",
        time: "9:23 PM",
        date: "2025-04-28",
      },
      {
        text: "Aku bantu cari informasi ya.",
        time: "9:27 PM",
        date: "2025-04-28",
      },
    ],
  },
  {
    name: "Rickley",
    lastMessage: "Sama-sama, semoga membantu!",
    time: "12:45 AM",
    img: "/users/rickley.jpg",
    city: "Surabaya",
    lastActive: "2 April",
    reviewCount: 85,
    messages: [
      {
        text: "Aku baru saja melihat reviewmu bung, terima kasih banyak!",
        time: "12:30 AM",
        date: "2025-04-02",
      },
      {
        text: "Kalau butuh rekomendasi lain, kabarin aja ya.",
        time: "1:00 AM",
        date: "2025-04-02",
      },
      {
        text: "By the way, aku juga menemukan tempat lain yang mungkin kamu suka.",
        time: "1:30 AM",
        date: "2025-04-03",
      },
    ],
  },
  {
    name: "Billy",
    lastMessage: "Tentu, kapan saja!",
    time: "10:45 AM",
    img: "/users/billy.jpg",
    city: "Bandung",
    lastActive: "1 April",
    reviewCount: 60,
    messages: [
      {
        text: "Heyy, kamu terlihat keren, mau jalan sama aku ga?",
        time: "10:30 AM",
        date: "2025-04-01",
      },
      {
        text: "Mungkin akhir pekan ini?",
        time: "11:00 AM",
        date: "2025-04-01",
      },
      {
        text: "Aku pikir hari Sabtu bisa jadi pilihan yang baik.",
        time: "11:30 AM",
        date: "2025-04-02",
      },
    ],
  },
  {
    name: "Sarah",
    lastMessage: "Besok kita bertemu ya!",
    time: "4:00 PM",
    img: "/users/sarah.jpg",
    city: "Jakarta",
    lastActive: "29 Maret",
    reviewCount: 150,
    messages: [
      {
        text: "Halo! Aku baru daftar aplikasi ini.",
        time: "3:00 PM",
        date: "2025-03-29",
      },
      {
        text: "Terima kasih, senang bertemu kamu.",
        time: "3:20 PM",
        date: "2025-03-29",
      },
    ],
  },
  {
    name: "Michael",
    lastMessage: "Aku bisa rekomendasikan beberapa tempat bagus.",
    time: "2:15 PM",
    img: "/users/michael.jpg",
    city: "Yogyakarta",
    lastActive: "31 Maret",
    reviewCount: 200,
    messages: [
      {
        text: "Hai, kamu tau tempat makan ramah disabilitas?",
        time: "2:00 PM",
        date: "2025-03-31",
      },
      {
        text: "Aku bisa rekomendasikan beberapa tempat bagus.",
        time: "2:15 PM",
        date: "2025-03-31",
      },
      {
        text: "Nanti aku kirim daftarnya ya.",
        time: "2:30 PM",
        date: "2025-03-31",
      },
    ],
  },
  {
    name: "Emma",
    lastMessage: "Aku support selalu!",
    time: "5:30 PM",
    img: "/users/emma.jpg",
    city: "Semarang",
    lastActive: "1 April",
    reviewCount: 95,
    messages: [
      {
        text: "Lihat perkembangan aplikasi ini keren banget.",
        time: "5:00 PM",
        date: "2025-04-01",
      },
      { text: "Aku support selalu!", 
        time: "5:30 PM", 
        date: "2025-04-01" 
      },
    ],
  },
  {
    name: "Daniel",
    lastMessage: "Kalau mau, kita bisa buat komunitas kecil.",
    time: "6:45 PM",
    img: "/users/daniel.jpg",
    city: "Bali",
    lastActive: "30 Maret",
    reviewCount: 110,
    messages: [
      {
        text: "Aku ingin berbagi pengalaman tentang aksesibilitas.",
        time: "6:00 PM",
        date: "2025-03-30",
      },
      {
        text: "Kalau mau, kita bisa buat komunitas kecil.",
        time: "6:45 PM",
        date: "2025-03-30",
      },
    ],
  },
];

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("cari");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState(""); // State untuk menyimpan pesan baru
  const messagesEndRef = useRef(null); // Ref untuk elemen paling bawah chat

  // Modifikasi data users dengan menambahkan isMe pada messages
  const modifiedUsers = users.map((user) => ({
    ...user,
    messages: user.messages.map((msg, index) => ({
      ...msg,
      // Asumsikan pesan dengan index ganjil adalah pesan kita (hanya contoh)
      // Dalam aplikasi nyata, ini harus disesuaikan dengan sistem auth
      isMe: index % 2 === 0, // Contoh: pesan genap adalah dari kita
    })),
  }));

  const handleUserSelect = (user) => {
    // Temukan user yang sesuai dari modifiedUsers
    const foundUser = modifiedUsers.find((u) => u.name === user.name);
    setSelectedUser(user);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedUser?.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    // Tambahkan pesan baru ke user yang dipilih
    const updatedUser = {
      ...selectedUser,
      messages: [
        ...selectedUser.messages,
        {
          text: newMessage,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date().toISOString().split("T")[0],
          isMe: true, // Pesan baru selalu dari kita
        },
      ],
    };

    setSelectedUser(updatedUser);
    setNewMessage("");
    scrollToBottom(); // Scroll ke bawah setelah mengirim pesan
  };

  const formatDateLabel = (dateStr) => {
    const now = new Date();
    const date = new Date(`2000-01-01T${dateStr}`); // pakai jam saja karena datanya tidak lengkap

    const today = now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    // Simulasi label (karena tidak ada tanggal aktual)
    return "Hari ini"; // Ubah sesuai kebutuhan
  };

  const [dropdownOpen, setDropdownOpen] = useState({
    kota: false,
    review: false,
    aktif: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    kota: "",
    review: "",
    aktif: "",
  });

  const kotaRef = useRef(null);
  const reviewRef = useRef(null);
  const aktifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        kotaRef.current &&
        !kotaRef.current.contains(event.target) &&
        reviewRef.current &&
        !reviewRef.current.contains(event.target) &&
        aktifRef.current &&
        !aktifRef.current.contains(event.target)
      ) {
        setDropdownOpen({ kota: false, review: false, aktif: false });
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <NavbarBack title="Chat" />
      <div className="max-h-screen bg-white px-15 pt-3">
        <div className="flex space-x-5">

          {/* Sidebar */}
          <div className="w-1/6 space-y-4">

            {/* Tombol Cari Orang */}
            <button
              onClick={() => setActiveTab("cari")}
              className={`flex items-center space-x-2 px-6 py-4 transition-all duration-300 overflow-hidden ${
                activeTab === "cari"
                  ? "bg-[#EFF0F7] text-[#3C91E6] rounded-l-lg rounded-r-none w-[265px]"
                  : "bg-[#EFF0F7] text-black shadow rounded-lg w-[230px]"
              } ${activeTab === "cari" ? "rounded-r-none" : ""}`}
            >
              <img
                src={`/icons/${
                  activeTab === "cari" ? "cariorang-blue" : "cariorang-black"
                }.png`}
                alt="Cari"
                className="h-5 w-5"
              />
              <span className="font-medium">Cari Orang</span>
            </button>

            {/* Tombol Semua Obrolan */}
            <button
              onClick={() => setActiveTab("obrolan")}
              className={`flex items-center space-x-2 px-6 py-4 transition-all duration-300 overflow-hidden ${
                activeTab === "obrolan"
                  ? "bg-[#EFF0F7] text-[#3C91E6] rounded-l-lg rounded-r-none w-[265px]"
                  : "bg-[#EFF0F7] text-black shadow rounded-lg w-[230px]"
              } ${activeTab === "obrolan" ? "rounded-r-none" : ""}`}
            >
              <img
                src={`/icons/${
                  activeTab === "obrolan"
                    ? "semuaobrolan-blue"
                    : "semuaobrolan-black"
                }.png`}
                alt="Obrolan"
                className="h-5 w-5"
              />
              <span className="font-medium">Semua Obrolan</span>
            </button>
          </div>

          {/* Konten sesuai sidebar*/}
          {activeTab === "cari" ? (
            <div className="w-5/6 flex space-x-6">
              
              {/* Cari Orang */}
              <div className="w-6/10 bg-[#EFF0F7] rounded-xl p-6 obrolan-container h-[600px] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Cari Orang
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari Orang..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#3C91E6] focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                  />
                  <img
                    src="/icons/search.png"
                    alt="Search"
                    className="absolute left-3 top-2.5 h-5 w-5"
                  />
                </div>
                <div className="space-y-5 overflow-y-auto flex-1">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.img}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          Telah mereview {user.reviewCount}+ fasilitas
                          aksesibilitas
                        </p>
                      </div>
                      <div className="text-right space-y-0">
                        <p className="text-xs text-gray-500">
                          {user.city} | Aktif {user.lastActive}
                        </p>
                        <button className="bg-[#3C91E6] text-white text-xs px-4 py-0.5 rounded">
                          Obrolan Baru
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filter */}
              <div className="w-4/10 bg-[#EFF0F7] p-6 rounded-xl shadow space-y-4 filter-container h-[600px] flex flex-col">
                <h3 className="text-center text-lg font-semibold">
                  Filter Pencarian
                </h3>
                <div className="space-y-10 flex-1">
                  <div className="flex flex-col items-center">
                    <div className="w-90 flex flex-col space-y-2" ref={kotaRef}>
                      <label className="text-sm font-medium text-gray-700">
                        Asal Kota
                      </label>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setDropdownOpen({
                              kota: !dropdownOpen.kota,
                              review: false,
                              aktif: false,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                        >
                          {selectedFilters.kota || "Pilih Kota"}
                          <img
                            src="/icons/dropdown.png"
                            alt="Dropdown Icon"
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.kota ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.kota && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md">
                            {[
                              "Semua Kota",
                              "Jakarta",
                              "Bandung",
                              "Surabaya",
                              "Yogyakarta",
                            ].map((kota) => (
                              <div
                                key={kota}
                                onClick={() => {
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    kota,
                                  }));
                                  setDropdownOpen((prev) => ({
                                    ...prev,
                                    kota: false,
                                  }));
                                }}
                                className="px-4 py-2 hover:bg-[#EFF0F7] cursor-pointer"
                              >
                                {kota}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className="w-90 flex flex-col space-y-2"
                      ref={reviewRef}
                    >
                      <label className="text-sm font-medium text-gray-700">
                        Jumlah Review
                      </label>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setDropdownOpen({
                              kota: false,
                              review: !dropdownOpen.review,
                              aktif: false,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                        >
                          {selectedFilters.review || "Pilih Jumlah Review"}
                          <img
                            src="/icons/dropdown.png"
                            alt="Dropdown Icon"
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.review ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.review && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md">
                            {[
                              "Semua",
                              "0",
                              "10+",
                              "50+",
                              "100+",
                              "1000+"
                            ].map(
                              (review) => (
                                <div
                                  key={review}
                                  onClick={() => {
                                    setSelectedFilters((prev) => ({
                                      ...prev,
                                      review,
                                    }));
                                    setDropdownOpen((prev) => ({
                                      ...prev,
                                      review: false,
                                    }));
                                  }}
                                  className="px-4 py-2 hover:bg-[#EFF0F7] cursor-pointer"
                                >
                                  {review}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div
                      className="w-90 flex flex-col space-y-2"
                      ref={aktifRef}
                    >
                      <label className="text-sm font-medium text-gray-700">
                        Aktif Terakhir
                      </label>
                      <div className="relative">
                        <button
                          onClick={() =>
                            setDropdownOpen({
                              kota: false,
                              review: false,
                              aktif: !dropdownOpen.aktif,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                        >
                          {selectedFilters.aktif || "Pilih Waktu"}
                          <img
                            src="/icons/dropdown.png"
                            alt="Dropdown Icon"
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.aktif ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.aktif && (
                          <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md">
                            {[
                              "Semua",
                              "Hari ini",
                              "Kemarin",
                              "Minggu lalu",
                              "Bulan lalu",
                              "Tahun lalu",
                            ].map((aktif) => (
                              <div
                                key={aktif}
                                onClick={() => {
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    aktif,
                                  }));
                                  setDropdownOpen((prev) => ({
                                    ...prev,
                                    aktif: false,
                                  }));
                                }}
                                className="px-4 py-2 hover:bg-[#EFF0F7] cursor-pointer"
                              >
                                {aktif}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <button className="bg-[#3C91E6] text-white w-90 mx-auto py-3 rounded-md mt-4">
                  Terapkan
                </button>
              </div>
            </div>
          ) : (
            <div className="w-5/6 flex space-x-6">
              {/* Semua Obrolan */}
              <div className="w-6/10 bg-[#EFF0F7] rounded-xl p-6 obrolan-container h-[600px] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Cari Obrolan
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari Obrolan..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#3C91E6] focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                  />
                  <img
                    src="/icons/search.png"
                    alt="Search"
                    className="absolute left-3 top-2.5 h-5 w-5"
                  />
                </div>
                <div className="space-y-5 overflow-y-auto flex-1">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg"
                      onClick={() => handleUserSelect(user)}
                    >
                      <img
                        src={user.img}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate">
                          {user.lastMessage}
                        </p>
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
                        <img
                          src={selectedUser.img}
                          className="h-10 w-10 rounded-full"
                          alt={selectedUser.name}
                        />
                        <span className="font-semibold">
                          {selectedUser.name}
                        </span>
                      </div>
                      <img
                        src="/icons/more.png"
                        className="h-5 w-5"
                        alt="More"
                      />
                    </div>
                    <div className="px-4 py-2 space-y-4 overflow-y-auto flex-1">
                      {selectedUser.messages.map((msg, index) => {
                        const prevMsg = selectedUser.messages[index - 1];
                        const showDateLabel =
                          !prevMsg || prevMsg.date !== msg.date;

                        const dateObj = new Date(msg.date);
                        const today = new Date();
                        const yesterday = new Date();
                        yesterday.setDate(today.getDate() - 1);

                        let label = dateObj.toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        });

                        if (dateObj.toDateString() === today.toDateString()) {
                          label = "Hari ini";
                        } else if (
                          dateObj.toDateString() === yesterday.toDateString()
                        ) {
                          label = "Kemarin";
                        }

                        return (
                          <div key={index} className="space-y-2">
                            {showDateLabel && (
                              <div className="sticky top-0 z-10 flex justify-center">
                                <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm transition-all duration-200">
                                  {label}
                                </span>
                              </div>
                            )}
                            <div
                              className={`flex ${
                                msg.isMe ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div className={"max-w-[75%]"}>
                                <p
                                  className={`p-3 rounded-lg shadow text-sm ${
                                    msg.isMe
                                      ? "bg-[#3C91E6] text-white rounded-tr-none"
                                      : "bg-white text-gray-800 rounded-tl-none"
                                  }`}
                                >
                                  {msg.text}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    msg.isMe
                                      ? "text-gray-300 text-right"
                                      : "text-gray-400 text-left"
                                  }`}
                                >
                                  {msg.time}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />{" "}
                      {/* Anchor untuk scroll ke bawah */}
                    </div>
                    {/* Input Pesan Baru */}
                    <div className="p-2 bg-[#EFF0F7]">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Ketik pesan..."
                          className="flex-1 p-3 border bg-white border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleSendMessage();
                            }
                          }}
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-[#3C91E6] text-white p-3 rounded-full hover:bg-[#2B7DCC] transition-colors"
                        >
                          <img
                            src="/icons/send.png"
                            alt="Send"
                            className="h-5 w-5"
                          />
                        </button>
                      </div>
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
  );
};

export default ChatPage;
