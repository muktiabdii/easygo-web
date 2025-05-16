import { div } from "framer-motion/client";
import NavbarBack from "../components/NavbarBack";

const AllReview = () => {
  const placeName = "Universitas Brawijaya"
  const placeAddress = "Jl. Veteran No.10-11, Kec. Lowokwaru, Kota Malang";

  const ulasan = Array(4).fill({
    nama: "James",
    rating: 5,
    fasilitas: [
      "Jalur Kursi Roda",
      "Pintu Otomatis",
      "Parkir Disabilitas",
      "Toilet Disabilitas"
    ],
    komentar:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis"
  });

  const statistik = [
    { bintang: 5, jumlah: 5559, persentase: "97.2%" },
    { bintang: 4, jumlah: 125, persentase: "2.2%" },
    { bintang: 3, jumlah: 20, persentase: "0.3%" },
    { bintang: 2, jumlah: 3, persentase: "0.05%" },
    { bintang: 1, jumlah: 13, persentase: "0.2%" }
  ];

  return (
    <div>
      <NavbarBack title={placeName} showAvatar={false} />
    
    <div className="min-h-screen bg-white py-10 px-4">
      <h2 className="text-4xl font-bold text-center text-[#3C91E6] mt-4 mb-12">Ulasan</h2>

      {/* Header Ulasan */}
      <div className="max-w-6xl mx-auto mb-8 relative">
        {/* Gray container for university name and address */}
        <div className="bg-[#EFF0F7] rounded-2xl pt-6 px-6 pb-24">
          <h3 className="text-[26px] font-bold text-gray-800">{placeName}</h3>
          <p className="text-l text-black mb-2">
            {placeAddress}
          </p>
        </div>

        {/* White container for ratings - overlapping the gray container as shown in the image */}
        <div className="w-6xl ml-0 bg-white border border-blue-500 rounded-2xl p-4 mt-[-80px] mx-4 flex flex-col md:flex-row justify-between gap-x-2">
          {/* Rating Kiri */}
          <div className="flex-1 ml-2 mb-4">
            <div className="flex items-center">
              <span className="text-yellow-500 text-5xl mr-2">★</span>
              <span className="text-3xl font-bold">5.0</span>
              <span className="text-gray-700 text-base font-normal ml-1">/ 5.0</span>
            </div>
            <p className="text-base text-black mt-3 font-semibold">99% orang merasa puas</p>
            <p className="text-base text-black mt-1">5720 rating • 1360 ulasan</p>
          </div>

          {/* Statistik Bintang (Dibuat dari data array, dua kolom vertikal) */}
          <div className="flex-2 grid grid-cols-2 gap-x-1 text-m text-black mb-2">
            <div className="flex flex-col gap-2">
              {[5, 4, 3].map((bintang) => {
                const item = statistik.find((s) => s.bintang === bintang);
                return (
                  <div key={bintang} className="flex items-center gap-1">
                    <span className="text-yellow-500 text-3xl">★</span>
                    <span>
                      {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col gap-2">
              {[2, 1].map((bintang) => {
                const item = statistik.find((s) => s.bintang === bintang);
                return (
                  <div key={bintang} className="flex items-center gap-1">
                    <span className="text-yellow-500 text-3xl">★</span>
                    <span>
                      {item.bintang}: {item.jumlah} ulasan ({item.persentase})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Daftar Ulasan */}
      <div className="max-w-6xl mx-auto border-blue-500 border-1 rounded-2xl p-4">
        {ulasan.map((item, idx) => (
          <div key={idx}>
            {idx !== 0 && <hr className="my-4 border-blue-500" />}

            <div className="flex gap-2 py-6">
              {/* Icon User */}
              <div className="w-16 flex-shrink-0 flex justify-center items-start pt-2 ml-4">
                <img
                  src="/icons/user.png"
                  alt="User Icon"
                  className="w-13 h-13 rounded-full object-cover"
                />
              </div>

              {/* Isi Review */}
              <div className="flex-1 pl-4 space-y-4">
                {/* Nama & Rating */}
              <div>
                <p className="font-semibold text-gray-800 text-[26px]">{item.nama}</p>
                <div className="text-yellow-500 text-4xl">
                  {Array(item.rating)
                    .fill("★")
                    .map((star, i) => (
                      <span key={i} className="mr-2">{star}</span>
                    ))}
                </div>
              </div>

                {/* Fasilitas */}
                <div>
                  <ul className="text-sm text-gray-700 space-y-2">
                    {item.fasilitas.map((fasilitas, i) => (
                      <li key={i} className="flex items-center">
                        <div style={{ width: '125px' }} className="mr-2">
                          <span>{fasilitas}</span>
                        </div>
                        <img
                          src="/icons/check_rounded_black.png"
                          alt="Centang"
                          className="w-4 h-4"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Komentar */}
                <div className="pr-6">
                  <p className="text-black text-base leading-relaxed">
                    {item.komentar}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-14 text-m text-gray-700">
        <button className="px-2 py-1 hover:text-blue-600">&lt;</button>
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <button
            key={num}
            className={`px-3 py-1 rounded ${
              num === 1 ? "bg-blue-100 text-blue-600 font-bold" : "hover:text-blue-600"
            }`}
          >
            {num}
          </button>
        ))}
        <span>...</span>
        <button className="px-3 py-1 hover:text-blue-600">50</button>
        <button className="px-2 py-1 hover:text-blue-600">&gt;</button>
      </div>
    </div>
    </div>
  );
};

export default AllReview;