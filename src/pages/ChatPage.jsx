import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import NavbarBack from "../components/NavbarBack";
import { useChatRooms } from "../hooks/useChatRooms";
import { useMessages } from "../hooks/useMessages";
import { useSendMessages } from "../hooks/useSendMessages";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useSearchMessages } from "../hooks/useSearchMessages";
import { useSearchUsers } from "../hooks/useSearchUsers";
import { isToday, isYesterday, format, parse, isValid } from "date-fns";
import id from "date-fns/locale/id";
import "../styles/ChatPage.css";

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState("cari");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const kotaRef = useRef(null);
  const reviewRef = useRef(null);
  const aktifRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatBodyRef = useRef(null);
  const lastScrollTop = useRef(0);

  const { user, loading: authLoading, error: authError } = useCurrentUser();
  const { chatRooms, loading: roomsLoading, addChatRoom } = useChatRooms();
  const {
    messages,
    loading: messagesLoading,
    refetch,
    error: messagesError,
  } = useMessages(selectedRoom?.id);
  const {
    handleSend,
    loading: sendLoading,
    error: sendError,
  } = useSendMessages();
  const {
    searchedMessages,
    search,
    clearSearch,
    loading: searchLoading,
    error: searchError,
  } = useSearchMessages();
  const {
    createRoom,
    loading: createLoading,
    error: createError,
  } = useCreateRoom();
  const {
    users,
    searchUsers,
    loading: usersLoading,
    error: usersError,
  } = useSearchUsers();

  // Handle profile image errors
  const handleImageError = (e) => {
    console.log("Profile image failed to load, using placeholder:", e.target.src);
    e.target.src = "/icons/user.png";
  };

  // Fetch users when "Cari Orang" tab is active or filters change
  useEffect(() => {
    if (activeTab === "cari") {
      searchUsers({
        query: searchKeyword,
        city: selectedFilters.kota !== "Semua Kota" ? selectedFilters.kota : "",
        review_count:
          selectedFilters.review !== "Semua" ? selectedFilters.review : "",
        last_active:
          selectedFilters.aktif !== "Semua" ? selectedFilters.aktif : "",
      });
    }
  }, [activeTab, searchKeyword, selectedFilters, searchUsers]);

  useEffect(() => {
    const chatBody = chatBodyRef.current;
    if (!chatBody) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatBody;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      setShouldScrollToBottom(isAtBottom);
      lastScrollTop.current = scrollTop;
    };

    chatBody.addEventListener("scroll", handleScroll);
    return () => chatBody.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (messagesLoading) {
      chatBodyRef.current?.scrollTo(0, lastScrollTop.current);
      return;
    }
    if (
      shouldScrollToBottom &&
      messagesEndRef.current &&
      Object.keys(messages).length > 0
    ) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesLoading, shouldScrollToBottom]);

  useEffect(() => {
    setShouldScrollToBottom(true);
    setSearchKeyword("");
    clearSearch();
  }, [selectedRoom?.id, clearSearch]);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getOpponentUser = useCallback(
    (room) => {
      if (!room || !user?.userId) {
        return { name: "Unknown", img: "/icons/user.png" };
      }
      const isUser1 = room.user1?.id === user.userId;
      const opponent = isUser1
        ? room.user2 || { name: "Unknown", img: "/icons/user.png" }
        : room.user1 || { name: "Unknown", img: "/icons/user.png" };
      return {
        ...opponent,
        img: opponent.img || "/icons/user.png",
      };
    },
    [user]
  );

  const handleRoomSelect = useCallback(
    (room) => {
      if (!room?.chat_room_id) {
        console.log("Invalid room selected:", room);
        return;
      }
      const opponentUser = getOpponentUser(room);
      const normalizedRoom = {
        id: room.chat_room_id,
        opponentUser,
      };
      setSelectedRoom(normalizedRoom);
    },
    [getOpponentUser]
  );

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !selectedRoom?.id) {
      console.log("Cannot send message: empty or no room selected", {
        newMessage,
        selectedRoomId: selectedRoom?.id,
      });
      return;
    }
    try {
      console.log("Attempting to send message:", {
        message: newMessage,
        chatRoomId: selectedRoom.id,
      });
      await handleSend(selectedRoom.id, newMessage);
      console.log("Message sent successfully");
      setNewMessage("");
      setShouldScrollToBottom(true);
    } catch (error) {
      console.error("Failed to send message:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    }
  }, [newMessage, selectedRoom, handleSend]);

  const handleCreateRoom = useCallback(
    async (userId) => {
      try {
        console.log("Creating room for user:", userId);
        await createRoom(userId, (newRoom) => {
          if (!newRoom.id) {
            console.error("New room missing id:", newRoom);
            return;
          }
          const opponentUser = users.find((u) => u.id === userId) || {
            id: userId,
            name: "Unknown",
            img: "/icons/user.png",
          };
          const newRoomData = {
            chat_room_id: newRoom.id,
            user1: newRoom.user1 || { id: user.userId, name: user.name, img: user.img || "/icons/user.png" },
            user2: newRoom.user2 || { id: userId, name: opponentUser.name, img: opponentUser.img || "/icons/user.png" },
            last_message: null,
          };
          addChatRoom(newRoomData);
          setSelectedRoom({
            id: newRoom.id,
            opponentUser,
          });
          setActiveTab("obrolan");
        });
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    },
    [createRoom, user, users, addChatRoom]
  );

  const handleSearchMessages = useCallback(
    (keyword) => {
      setSearchKeyword(keyword);
      if (keyword.trim() === "") {
        clearSearch();
      } else {
        search(keyword);
      }
    },
    [search, clearSearch]
  );

  const handleSearchUsers = useCallback(
    (keyword) => {
      setSearchKeyword(keyword);
      searchUsers({
        query: keyword,
        city: selectedFilters.kota !== "Semua Kota" ? selectedFilters.kota : "",
        review_count:
          selectedFilters.review !== "Semua" ? selectedFilters.review : "",
        last_active:
          selectedFilters.aktif !== "Semua" ? selectedFilters.aktif : "",
      });
    },
    [searchUsers, selectedFilters]
  );

  const formatDateLabel = useCallback((dateStr, messagesForDate) => {
    if (dateStr === "Hari Ini" || dateStr === "Kemarin") {
      return dateStr;
    }
    const firstMessage = messagesForDate && messagesForDate[0];
    if (firstMessage && firstMessage.created_at) {
      const date = new Date(firstMessage.created_at);
      if (isValid(date)) {
        if (isToday(date)) return "Hari Ini";
        if (isYesterday(date)) return "Kemarin";
        return format(date, "iiii, d MMMM yyyy", { locale: id });
      }
    }
    try {
      const date = parse(dateStr, "iiii, d MMMM yyyy", new Date(), {
        locale: id,
      });
      if (isValid(date)) {
        if (isToday(date)) return "Hari Ini";
        if (isYesterday(date)) return "Kemarin";
        return dateStr;
      }
    } catch (error) {
      console.warn("Error parsing date:", dateStr, error);
    }
    return "Tanggal Tidak Valid";
  }, []);

  const formatLastMessageTime = useCallback((createdAt) => {
    if (!createdAt) {
      return new Date().toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const date = new Date(createdAt);
    if (isNaN(date)) {
      return "Waktu Tidak Valid";
    }
    return date.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const filteredChatRooms = useMemo(
    () =>
      searchKeyword
        ? chatRooms.filter((room) =>
            Object.values(searchedMessages).some((messagesForDate) =>
              messagesForDate.some(
                (msg) =>
                  msg.chat_room_id === room.chat_room_id &&
                  msg.message.toLowerCase().includes(searchKeyword.toLowerCase())
              )
            )
          )
        : chatRooms,
    [chatRooms, searchKeyword, searchedMessages]
  );

  if (authLoading) {
    return <div className="text-center p-6">Memuat data pengguna...</div>;
  }

  if (authError) {
    return <div className="text-center text-red-500 p-6">{authError}</div>;
  }

  return (
    <>
      <NavbarBack title="Chat" />
      <div className="min-h-screen bg-white px-4 pt-25 pb-4 chat-container">
        <div className="flex flex-col lg:flex-row lg:space-x-6 max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="w-full lg:w-64 space-y-4 mb-6 lg:mb-0">
            {["cari", "obrolan"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab-button rounded-lg ${
                  activeTab === tab ? "active" : "text-gray-700 hover:bg-[#E5E7EB]"
                }`}
                aria-label={tab === "cari" ? "Cari Orang" : "Semua Obrolan"}
              >
                <div className="tab-content">
                  <img
                    src={`/icons/${
                      tab === "cari"
                        ? activeTab === "cari"
                          ? "cariorang-blue"
                          : "cariorang-black"
                        : activeTab === "obrolan"
                        ? "semuaobrolan-blue"
                        : "semuaobrolan-black"
                    }.png`}
                    alt=""
                    className="h-6 w-6"
                  />
                  <span className="font-semibold text-base">
                    {tab === "cari" ? "Cari Orang" : "Semua Obrolan"}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {activeTab === "cari" ? (
            <div className="w-full flex flex-col lg:flex-row lg:space-x-6">
              {/* Search Users Panel */}
              <div className="w-full lg:w-2/3 bg-[#EFF0F7] rounded-2xl p-6 h-[calc(100vh-140px)] flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Cari Pengguna
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari nama pengguna..."
                    value={searchKeyword}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] transition-shadow"
                    aria-label="Cari pengguna"
                  />
                  <img
                    src="/icons/search.png"
                    alt="Search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {usersLoading ? (
                    <div className="text-center text-gray-600">Memuat...</div>
                  ) : usersError ? (
                    <div className="text-center text-red-500">{usersError}</div>
                  ) : users.length === 0 ? (
                    <div className="text-center text-gray-500">
                      Tidak ada pengguna ditemukan
                    </div>
                  ) : (
                    users.map((u) => (
                      <div
                        key={u.id}
                        className="chat-room-item flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-white cursor-pointer transition-colors"
                        onClick={() => handleCreateRoom(u.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === "Enter" && handleCreateRoom(u.id)}
                      >
                        <img
                          src={u.profile_image || "/icons/user.png"}
                          onError={handleImageError}
                          alt={u.name}
                          className="h-12 w-12 rounded-full object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{u.name}</p>
                          <p className="text-sm text-gray-600 truncate">
                            {u.reviews_count || 0}+ ulasan aksesibilitas
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-xs text-gray-500">
                            {u.city || "Tidak Diketahui"} | Aktif{" "}
                            {u.last_active
                              ? new Date(u.last_active).toLocaleDateString(
                                  "id-ID",
                                  { day: "numeric", month: "short" }
                                )
                              : "Tidak Diketahui"}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCreateRoom(u.id);
                            }}
                            className="bg-[#3C91E6] text-white text-xs px-4 py-1 rounded-full hover:bg-[#2B7CDC] transition-colors"
                            disabled={createLoading}
                            aria-label={`Mulai obrolan baru dengan ${u.name}`}
                          >
                            {createLoading ? "Membuat..." : "Obrolan Baru"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Filter Panel */}
              <div className="w-full lg:w-1/3 bg-[#EFF0F7] p-6 rounded-2xl h-[calc(100vh-140px)] flex flex-col mt-6 lg:mt-0">
                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                  Filter Pencarian
                </h3>
                <div className="flex-1 space-y-6">
                  {[
                    {
                      id: "kota",
                      label: "Asal Kota",
                      options: [
                        "Semua Kota",
                        "Jakarta",
                        "Bandung",
                        "Surabaya",
                        "Yogyakarta",
                      ],
                      ref: kotaRef,
                    },
                    {
                      id: "review",
                      label: "Jumlah Ulasan",
                      options: ["Semua", "0", "10+", "50+", "100+", "1000+"],
                      ref: reviewRef,
                    },
                    {
                      id: "aktif",
                      label: "Aktif Terakhir",
                      options: [
                        "Semua",
                        "Hari ini",
                        "Kemarin",
                        "Minggu ini",
                        "Bulan lalu",
                        "Tahun lalu",
                      ],
                      ref: aktifRef,
                    },
                  ].map(({ id, label, options, ref }) => (
                    <div key={id} className="flex flex-col space-y-2" ref={ref}>
                      <label
                        htmlFor={`${id}-filter`}
                        className="text-sm font-medium text-gray-700"
                      >
                        {label}
                      </label>
                      <div className="relative">
                        <button
                          id={`${id}-filter`}
                          onClick={() =>
                            setDropdownOpen((prev) => ({
                              kota: false,
                              review: false,
                              aktif: false,
                              [id]: !prev[id],
                            }))
                          }
                          className="p-3 bg-gray-50 rounded-lg w-full text-left border border-gray-300 hover:bg-gray-100 transition-colors"
                          aria-label={`Pilih ${label.toLowerCase()}`}
                          aria-expanded={dropdownOpen[id]}
                        >
                          {selectedFilters[id] || `Pilih ${label}`}
                          <img
                            src="/icons/dropdown.png"
                            alt=""
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen[id] ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen[id] && (
                          <div className="dropdown-menu absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-1">
                            {options.map((option) => (
                              <div
                                key={option}
                                onClick={() => {
                                  setSelectedFilters((prev) => ({
                                    ...prev,
                                    [id]: option,
                                  }));
                                  setDropdownOpen((prev) => ({
                                    ...prev,
                                    [id]: false,
                                  }));
                                }}
                                className="px-4 py-2 hover:bg-[#EFF0F7] cursor-pointer text-sm"
                                role="option"
                                aria-selected={selectedFilters[id] === option}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  className="bg-[#3C91E6] text-white w-full py-3 rounded-lg mt-6 hover:bg-[#2B7CDC] transition-colors"
                  onClick={() =>
                    searchUsers({
                      query: searchKeyword,
                      city:
                        selectedFilters.kota !== "Semua Kota"
                          ? selectedFilters.kota
                          : "",
                      review_count:
                        selectedFilters.review !== "Semua"
                          ? selectedFilters.review
                          : "",
                      last_active:
                        selectedFilters.aktif !== "Semua"
                          ? selectedFilters.aktif
                          : "",
                    })
                  }
                  aria-label="Terapkan filter pencarian"
                >
                  Terapkan Filter
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col lg:flex-row lg:space-x-6">
              {/* Chat Rooms Panel */}
              <div className="w-full lg:w-2/3 bg-[#EFF0F7] rounded-2xl p-6 h-[calc(100vh-140px)] flex flex-col">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  Obrolan
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearchMessages(e.target.value)}
                    placeholder="Cari pesan dalam obrolan..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] transition-shadow"
                    aria-label="Cari obrolan"
                  />
                  <img
                    src="/icons/search.png"
                    alt="Search"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5"
                  />
                </div>
                <div className="space-y-4 overflow-y-auto flex-1 pr-2">
                  {roomsLoading || searchLoading ? (
                    <div className="text-center text-gray-600">Memuat...</div>
                  ) : searchKeyword &&
                    filteredChatRooms.length === 0 &&
                    !searchLoading ? (
                    <div className="text-center text-gray-500">
                      Tidak ada obrolan ditemukan
                    </div>
                  ) : (
                    filteredChatRooms.map((room) => {
                      const opponentUser = getOpponentUser(room);
                      return (
                        <div
                          key={room.chat_room_id}
                          className="chat-room-item flex items-center space-x-4 p-3 rounded-lg bg-gray-50 hover:bg-white cursor-pointer transition-colors"
                          onClick={() => handleRoomSelect(room)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === "Enter" && handleRoomSelect(room)}
                        >
                          <img
                            src={opponentUser?.img || "/icons/user.png"}
                            onError={handleImageError}
                            alt={opponentUser?.name}
                            className="h-12 w-12 rounded-full object-cover"
                            loading="lazy"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">
                              {opponentUser?.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {room.last_message?.message || "Belum ada pesan"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatLastMessageTime(
                              room.last_message?.created_at
                            )}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className="w-full lg:w-1/3 bg-[#EFF0F7] rounded-2xl h-[calc(100vh-140px)] flex flex-col mt-6 lg:mt-0">
                {selectedRoom ? (
                  <>
                    <div className="flex items-center justify-between bg-gradient-to-r from-[#3C91E6] to-[#2B7CDC] text-white p-4 rounded-t-2xl">
                      <div className="flex items-center space-x-3">
                        <img
                          src={
                            selectedRoom.opponentUser?.img || "/icons/user.png"
                          }
                          onError={handleImageError}
                          className="h-10 w-10 rounded-full object-cover"
                          alt={selectedRoom.opponentUser?.name}
                          loading="lazy"
                        />
                        <span className="font-semibold text-lg">
                          {selectedRoom.opponentUser?.name}
                        </span>
                      </div>
                      <button
                        aria-label="Opsi lainnya"
                        className="hover:bg-white/20 p-2 rounded-full transition-colors"
                      >
                        <img src="/icons/more.png" className="h-5 w-5" alt="" />
                      </button>
                    </div>

                    <div
                      ref={chatBodyRef}
                      className="px-4 py-4 space-y-4 overflow-y-auto flex-1"
                    >
                      {messagesLoading ? (
                        <div className="text-center text-gray-600">
                          Memuat pesan...
                        </div>
                      ) : messagesError ? (
                        <div className="text-center text-red-500">
                          {messagesError}
                        </div>
                      ) : !messages ||
                        typeof messages !== "object" ||
                        Object.keys(messages).length === 0 ? (
                        <div className="text-center text-gray-500">
                          Belum ada pesan
                        </div>
                      ) : (
                        <div>
                          {Object.entries(messages)
                            .sort((a, b) => {
                              const dateA = a[1][0]?.created_at
                                ? new Date(a[1][0].created_at)
                                : new Date(0);
                              const dateB = b[1][0]?.created_at
                                ? new Date(b[1][0].created_at)
                                : new Date(0);
                              return dateA - dateB;
                            })
                            .map(([date, messagesForDate], dateIndex) => {
                              if (
                                !Array.isArray(messagesForDate) ||
                                messagesForDate.length === 0
                              )
                                return null;
                              return (
                                <div
                                  key={`date-${date}-${dateIndex}`}
                                  className="space-y-3"
                                >
                                  <div className="flex justify-center">
                                    <span className="bg-gray-200/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-gray-600">
                                      {formatDateLabel(date, messagesForDate)}
                                    </span>
                                  </div>
                                  {messagesForDate
                                    .filter(
                                      (msg, index, self) =>
                                        msg.id &&
                                        index ===
                                          self.findIndex((m) => m.id === msg.id)
                                    )
                                    .map((msg) => {
                                      console.log(
                                        "Rendering message:",
                                        JSON.stringify(msg, null, 2)
                                      );
                                      const senderId = Number(msg.sender_id);
                                      const isActiveUser =
                                        senderId === user?.userId;
                                      return (
                                        <div
                                          key={msg.id}
                                          className="message-bubble space-y-1"
                                          role="region"
                                          aria-label={`Pesan dari ${
                                            isActiveUser ? "Anda" : selectedRoom.opponentUser?.name
                                          }`}
                                        >
                                          <div
                                            className={`flex ${
                                              isActiveUser
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                          >
                                            <div className="max-w-[80%] group">
                                              <p
                                                className={`p-3 rounded-2xl text-sm transition-all ${
                                                  isActiveUser
                                                    ? "bg-[#3C91E6] text-white rounded-tr-none"
                                                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                                                }`}
                                              >
                                                {msg.message}
                                              </p>
                                              {msg.time && (
                                                <p
                                                  className={`text-xs text-gray-500 mt-1 transition-opacity opacity-0 group-hover:opacity-100 ${
                                                    isActiveUser
                                                      ? "text-right"
                                                      : "text-left"
                                                  }`}
                                                >
                                                  {msg.time}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              );
                            })}
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Ketik pesan..."
                          maxLength="1000"
                          className="flex-1 p-3 bg-white rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3C91E6] transition-shadow"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sendLoading}
                          aria-label="Ketik pesan"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-[#3C91E6] text-white p-3 rounded-full hover:bg-[#2B7CDC] transition-colors disabled:opacity-50"
                          disabled={sendLoading}
                          aria-label="Kirim pesan"
                        >
                          {sendLoading ? (
                            <svg
                              className="animate-spin h-5 w-5 text-white"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                            </svg>
                          ) : (
                            <img
                              src="/icons/send.png"
                              alt="Send"
                              className="h-5 w-5"
                            />
                          )}
                        </button>
                      </div>
                      {sendError && (
                        <p className="text-red-500 text-xs mt-2">{sendError}</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-center text-gray-500">
                    Pilih obrolan untuk mulai chatting
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