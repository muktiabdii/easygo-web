import React, { useState, useRef, useEffect, useCallback } from "react";
import NavbarBack from "../components/NavbarBack";
import { useChatRooms } from "../hooks/useChatRooms";
import { useMessages } from "../hooks/useMessages";
import { useSendMessages } from "../hooks/useSendMessages";
import { useCreateRoom } from "../hooks/useCreateRoom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useSearchMessages } from "../hooks/useSearchMessages";
import { isToday, isYesterday, format, parse, isValid } from "date-fns";
import id from "date-fns/locale/id";

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
  const { chatRooms, loading: roomsLoading, updateChatRoom } = useChatRooms();
  const {
    messages,
    loading: messagesLoading,
    refetch,
    updateMessages,
  } = useMessages(selectedRoom?.id);
  const { searchedMessages, search, clearSearch, loading: searchLoading, error: searchError } = useSearchMessages();
  const { handleSend, loading: sendLoading } = useSendMessages(
    selectedRoom?.id,
    (newMsg) => {
      console.log("New message sent:", newMsg);
      const formattedMsg = {
        id: newMsg.id,
        sender_id: newMsg.sender_id,
        message: newMsg.message,
        created_at: newMsg.created_at,
        time: new Date(newMsg.created_at).toLocaleTimeString("id-ID", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      updateMessages(formattedMsg);
      updateChatRoom({
        chat_room_id: selectedRoom.id,
        message: newMsg.message,
        created_at: newMsg.created_at,
        sender_id: newMsg.sender_id,
      });
      setShouldScrollToBottom(true);
    }
  );
  const { createRoom, loading: createLoading } = useCreateRoom();

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
    if (shouldScrollToBottom && messagesEndRef.current) {
      console.log(
        "Scrolling to bottom for new message, messages count:",
        Object.keys(messages).length
      );
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, messagesLoading, shouldScrollToBottom]);

  useEffect(() => {
    console.log("Selected room changed:", selectedRoom?.id);
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
        return { name: "Unknown", img: "/icons/default-user.png" };
      }
      const isUser1 = room.user1?.id === user.userId;
      return isUser1
        ? room.user2 || { name: "Unknown", img: "/icons/default-user.png" }
        : room.user1 || { name: "Unknown", img: "/icons/default-user.png" };
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
      console.log("Room selected:", normalizedRoom);
      setSelectedRoom(normalizedRoom);
    },
    [getOpponentUser]
  );

  const handleSendMessage = useCallback(async () => {
    if (newMessage.trim() === "" || !selectedRoom?.id) {
      console.log("Cannot send message: empty or no room selected");
      return;
    }
    try {
      console.log("Sending message:", newMessage);
      await handleSend(newMessage);
      setNewMessage("");
      setShouldScrollToBottom(true);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }, [newMessage, selectedRoom, handleSend]);

  const handleCreateRoom = useCallback(
    async (userId) => {
      if (!createRoom) {
        console.error("createRoom function is not defined");
        return;
      }
      try {
        console.log("Creating room for user:", userId);
        await createRoom(userId, (newRoom) => {
          if (!newRoom.chat_room_id) {
            console.error("New room missing chat_room_id:", newRoom);
            return;
          }
          const opponentUser = getOpponentUser(newRoom);
          const newRoomData = {
            chat_room_id: newRoom.chat_room_id,
            user1: newRoom.user1,
            user2: newRoom.user2,
            last_message: null,
          };
          console.log("New room created:", newRoomData);
          setChatRooms((prev) => [newRoomData, ...prev]);
          setSelectedRoom({
            id: newRoom.chat_room_id,
            opponentUser,
          });
        });
      } catch (error) {
        console.error("Failed to create room:", error);
      }
    },
    [createRoom, getOpponentUser]
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

  const formatDateLabel = (dateStr, messagesForDate) => {
    if (dateStr === "Hari Ini" || dateStr === "Kemarin") {
      return dateStr;
    }

    const firstMessage = messagesForDate && messagesForDate[0];
    if (firstMessage && firstMessage.created_at) {
      const date = new Date(firstMessage.created_at);
      if (isValid(date)) {
        if (isToday(date)) {
          return "Hari Ini";
        } else if (isYesterday(date)) {
          return "Kemarin";
        }
        return format(date, "iiii, d MMMM yyyy", { locale: id });
      }
    }

    try {
      const date = parse(dateStr, "iiii, d MMMM yyyy", new Date(), { locale: id });
      if (isValid(date)) {
        if (isToday(date)) {
          return "Hari Ini";
        } else if (isYesterday(date)) {
          return "Kemarin";
        }
        return dateStr;
      }
    } catch (error) {
      console.warn("Error parsing date:", dateStr, error);
    }

    console.warn("Invalid date:", dateStr);
    return "Tanggal Tidak Valid";
  };

  const formatLastMessageTime = (createdAt) => {
    if (!createdAt) {
      return new Date().toLocaleTimeString("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    const date = new Date(createdAt);
    if (isNaN(date)) {
      console.warn("Invalid last message date:", createdAt);
      return "Waktu Tidak Valid";
    }
    return date.toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter chat rooms based on search results
  const filteredChatRooms = searchKeyword
    ? chatRooms.filter((room) =>
        Object.values(searchedMessages).some((messagesForDate) =>
          messagesForDate.some(
            (msg) =>
              msg.chat_room_id === room.chat_room_id &&
              msg.message.toLowerCase().includes(searchKeyword.toLowerCase())
          )
        )
      )
    : chatRooms;

  if (authLoading) {
    return <div className="text-center">Memuat data pengguna...</div>;
  }

  if (authError) {
    return <div className="text-center text-red-500">{authError}</div>;
  }

  return (
    <>
      <NavbarBack title="Chat" />
      <div className="min-h-screen bg-white px-4 pt-16">
        <div className="flex flex-col md:flex-row md:space-x-6">
          <div className="w-full md:w-2/12 space-y-4">
            <button
              onClick={() => setActiveTab("cari")}
              className={`flex items-center space-x-2 px-6 py-4 transition-all duration-300 overflow-hidden ${
                activeTab === "cari"
                  ? "bg-[#EFF0F7] text-[#3C91E6] rounded-l-lg rounded-r-none w-[265px]"
                  : "bg-[#EFF0F7] text-black shadow rounded-lg w-[230px]"
              }`}
              aria-label="Cari Orang"
            >
              <img
                src={`/icons/${
                  activeTab === "cari" ? "cariorang-blue" : "cariorang-black"
                }.png`}
                alt=""
                className="h-5 w-5"
              />
              <span className="font-medium">Cari Orang</span>
            </button>
            <button
              onClick={() => setActiveTab("obrolan")}
              className={`flex items-center space-x-2 px-6 py-4 transition-all duration-300 overflow-hidden ${
                activeTab === "obrolan"
                  ? "bg-[#EFF0F7] text-[#3C91E6] rounded-l-lg rounded-r-none w-[265px]"
                  : "bg-[#EFF0F7] text-black shadow rounded-lg w-[230px]"
              }`}
              aria-label="Semua Obrolan"
            >
              <img
                src={`/icons/${
                  activeTab === "obrolan"
                    ? "semuaobrolan-blue"
                    : "semuaobrolan-black"
                }.png`}
                alt=""
                className="h-5 w-5"
              />
              <span className="font-medium">Semua Obrolan</span>
            </button>
          </div>

          {activeTab === "cari" ? (
            <div className="w-full md:w-10/12 flex flex-col md:flex-row md:space-x-6">
              <div className="w-full md:w-7/12 bg-[#EFF0F7] rounded-xl p-6 h-[calc(100vh-120px)] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Cari Orang
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Cari Orang..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#3C91E6] focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                    aria-label="Cari pengguna"
                  />
                  <img
                    src="/icons/search.png"
                    alt=""
                    className="absolute left-3 top-2.5 h-5 w-5"
                  />
                </div>
                <div className="space-y-5 overflow-y-auto flex-1">
                  {roomsLoading ? (
                    <div className="text-center">Memuat...</div>
                  ) : (
                    chatRooms.map((room) => {
                      const opponentUser = getOpponentUser(room);
                      return (
                        <div
                          key={room.chat_room_id}
                          className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg cursor-pointer"
                          onClick={() => handleRoomSelect(room)}
                        >
                          <img
                            src={opponentUser.img || "/icons/default-user.png"}
                            alt={opponentUser.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">{opponentUser.name}</p>
                            <p className="text-sm text-gray-600 truncate">
                              Telah mereview {opponentUser.reviewCount || 0}+
                              fasilitas aksesibilitas
                            </p>
                          </div>
                          <div className="text-right space-y-0">
                            <p className="text-xs text-gray-500">
                              {opponentUser.city || "Unknown"} | Aktif{" "}
                              {opponentUser.lastActive || "Unknown"}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCreateRoom(opponentUser.id);
                              }}
                              className="bg-[#3C91E6] text-white text-xs px-4 py-0.5 rounded"
                              disabled={createLoading}
                              aria-label={`Mulai obrolan baru dengan ${opponentUser.name}`}
                            >
                              {createLoading ? "Membuat..." : "Obrolan Baru"}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="w-full md:w-5/12 bg-[#EFF0F7] p-6 rounded-xl shadow h-[calc(100vh-120px)] flex flex-col">
                <h3 className="text-center text-lg font-semibold">
                  Filter Pencarian
                </h3>
                <div className="space-y-10 flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-full flex flex-col space-y-2"
                      ref={kotaRef}
                    >
                      <label
                        htmlFor="kota-filter"
                        className="text-sm font-medium text-gray-700"
                      >
                        Asal Kota
                      </label>
                      <div className="relative">
                        <button
                          id="kota-filter"
                          onClick={() =>
                            setDropdownOpen({
                              kota: !dropdownOpen.kota,
                              review: false,
                              aktif: false,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                          aria-label="Pilih kota"
                          aria-expanded={dropdownOpen.kota}
                        >
                          {selectedFilters.kota || "Pilih Kota"}
                          <img
                            src="/icons/dropdown.png"
                            alt=""
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.kota ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.kota && (
                          <div
                            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md"
                            role="listbox"
                          >
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
                                role="option"
                                aria-selected={selectedFilters.kota === kota}
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
                      className="w-full flex flex-col space-y-2"
                      ref={reviewRef}
                    >
                      <label
                        htmlFor="review-filter"
                        className="text-sm font-medium text-gray-700"
                      >
                        Jumlah Review
                      </label>
                      <div className="relative">
                        <button
                          id="review-filter"
                          onClick={() =>
                            setDropdownOpen({
                              kota: false,
                              review: !dropdownOpen.review,
                              aktif: false,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                          aria-label="Pilih jumlah review"
                          aria-expanded={dropdownOpen.review}
                        >
                          {selectedFilters.review || "Pilih Jumlah Review"}
                          <img
                            src="/icons/dropdown.png"
                            alt=""
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.review ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.review && (
                          <div
                            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md"
                            role="listbox"
                          >
                            {["Semua", "0", "10+", "50+", "100+", "1000+"].map(
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
                                  role="option"
                                  aria-selected={
                                    selectedFilters.review === review
                                  }
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
                      className="w-full flex flex-col space-y-2"
                      ref={aktifRef}
                    >
                      <label
                        htmlFor="aktif-filter"
                        className="text-sm font-medium text-gray-700"
                      >
                        Aktif Terakhir
                      </label>
                      <div className="relative">
                        <button
                          id="aktif-filter"
                          onClick={() =>
                            setDropdownOpen({
                              kota: false,
                              review: false,
                              aktif: !dropdownOpen.aktif,
                            })
                          }
                          className="p-3 bg-white rounded-md w-full text-left border border-gray-300"
                          aria-label="Pilih waktu aktif"
                          aria-expanded={dropdownOpen.aktif}
                        >
                          {selectedFilters.aktif || "Pilih Waktu"}
                          <img
                            src="/icons/dropdown.png"
                            alt=""
                            className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-transform duration-300 ${
                              dropdownOpen.aktif ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {dropdownOpen.aktif && (
                          <div
                            className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md"
                            role="listbox"
                          >
                            {[
                              "Semua",
                              "Hari ini",
                              "Kemarin",
                              "Minggu ini",
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
                                role="option"
                                aria-selected={selectedFilters.aktif === aktif}
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
                <button
                  className="bg-[#3C91E6] text-white w-full py-3 rounded-md mt-4"
                  aria-label="Terapkan filter"
                >
                  Terapkan
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-10/12 flex flex-col md:flex-row md:space-x-6">
              <div className="w-full md:w-7/12 bg-[#EFF0F7] rounded-xl p-6 h-[calc(100vh-120px)] flex flex-col">
                <h2 className="text-center text-lg font-semibold mb-4">
                  Cari Obrolan
                </h2>
                <div className="relative mb-6">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => handleSearchMessages(e.target.value)}
                    placeholder="Cari Obrolan..."
                    className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#3C91E6] focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                    aria-label="Cari obrolan"
                  />
                  <img
                    src="/icons/search.png"
                    alt=""
                    className="absolute left-3 top-2.5 h-5 w-5"
                  />
                </div>
                <div className="space-y-5 overflow-y-auto flex-1">
                  {roomsLoading || searchLoading ? (
                    <div className="text-center">Memuat...</div>
                  ) : searchKeyword && filteredChatRooms.length === 0 && !searchLoading ? (
                    <div className="text-center text-gray-500">
                      Tidak ada obrolan ditemukan
                    </div>
                  ) : (
                    filteredChatRooms.map((room) => {
                      const opponentUser = getOpponentUser(room);
                      return (
                        <div
                          key={room.chat_room_id}
                          className="flex items-center space-x-4 p-2 hover:bg-white rounded-lg cursor-pointer"
                          onClick={() => handleRoomSelect(room)}
                        >
                          <img
                            src={opponentUser?.img || "/icons/default-user.png"}
                            alt={opponentUser?.name}
                            className="h-10 w-10 rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold">
                              {opponentUser?.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {room.last_message?.message || "Belum ada pesan"}
                            </p>
                          </div>
                          <span className="text-xs text-gray-400">
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

              <div className="w-full md:w-5/12 bg-[#EFF0F7] rounded-xl shadow h-[calc(100vh-120px)] flex flex-col">
                {selectedRoom ? (
                  <>
                    <div className="flex items-center justify-between bg-[#3C91E6] text-white p-4 rounded-t-lg">
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            selectedRoom.opponentUser?.img ||
                            "/icons/default-user.png"
                          }
                          className="h-10 w-10 rounded-full"
                          alt={selectedRoom.opponentUser?.name}
                        />
                        <span className="font-semibold">
                          {selectedRoom.opponentUser?.name}
                        </span>
                      </div>
                      <button aria-label="Opsi lainnya">
                        <img src="/icons/more.png" className="h-5 w-5" alt="" />
                      </button>
                    </div>

                    <div
                      ref={chatBodyRef}
                      className="px-4 py-2 space-y-4 overflow-y-auto flex-1"
                    >
                      {messagesLoading ? (
                        <div className="text-center">Memuat pesan...</div>
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
                              if (!Array.isArray(messagesForDate) || messagesForDate.length === 0)
                                return null;

                              return (
                                <div
                                  key={`date-${date}-${dateIndex}`}
                                  className="space-y-2"
                                >
                                  <div className="flex justify-center">
                                    <span className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
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
                                      const senderId = Number(msg.sender_id);
                                      const isActiveUser =
                                        senderId === user?.userId;

                                      return (
                                        <div key={msg.id} className="space-y-1">
                                          <div
                                            className={`flex ${
                                              isActiveUser
                                                ? "justify-end"
                                                : "justify-start"
                                            }`}
                                          >
                                            <div className="max-w-[75%]">
                                              <p
                                                className={`p-3 rounded-lg shadow text-sm ${
                                                  isActiveUser
                                                    ? "bg-[#3C91E6] text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none"
                                                }`}
                                              >
                                                {msg.message}
                                              </p>
                                              {msg.time && (
                                                <p
                                                  className={`text-xs text-gray-500 ${
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

                    <div className="p-2 bg-[#EFF0F7]">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          maxLength="1000"
                          className="flex-1 p-3 border bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-[#3C91E6]"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          disabled={sendLoading}
                          aria-label="Type a message"
                        />
                        <button
                          onClick={handleSendMessage}
                          className="bg-[#3C91E6] text-white p-3 rounded-full hover:bg-[#2B7CDC] transition-colors relative"
                          disabled={sendLoading}
                          aria-label="Send message"
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
                              alt=""
                              className="h-5 w-5"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center flex-1 text-center">
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