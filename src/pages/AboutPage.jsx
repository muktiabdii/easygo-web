import React from "react";
import Navbar from "../components/Navbar";

const AboutPage = () => {
  return (
    <>
      <Navbar hideBackground={false} showSearch={false} showFilter={false} />

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-800 px-6 pt-30 pb-16 text-center overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 animate-parallax"
          style={{
            backgroundImage: "url('/disable.jpg')",
          }}
        ></div>

        {/* Main Content */}
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight text-white animate-pulse">
            EasyGo: Akses untuk Semua
          </h1>
          <p className="text-white text-lg md:text-xl max-w-xl mx-auto mb-6 animate-fadeInUp delay-300">
            Temukan tempat ramah difabel dan bantu wujudkan lingkungan inklusif
            bersama kami.
          </p>

          {/* Call to Action Button */}
          <a
            href="/dashboard"
            className="inline-block bg-yellow-400 text-gray-900 px-6 py-3 rounded-full font-semibold text-lg hover:bg-yellow-500 transform hover:scale-105 transition duration-300 animate-fadeInUp"
          >
            Jelajahi Sekarang
          </a>
        </div>

        {/* Animated Wave Effect at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24">
          <svg
            className="w-full h-full animate-wave"
            viewBox="0 0 1440 100"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C360,80 1080,80 1440,0 L1440,100 L0,100 Z"
              fill="white"
              className="opacity-90"
            />
          </svg>
        </div>
      </div>

      <div className="bg-white text-gray-800 max-w-screen-lg mx-auto animate-fadeInSlow">
        {/* Tentang EasyGo */}
        <section className="px-6 py-8 grid md:grid-cols-2 gap-6 items-center bg-gray-50 rounded-xl mt-6">
          <div>
            <h2 className="text-3xl font-bold mb-4">Tentang EasyGo</h2>
            <p className="text-base leading-relaxed text-gray-700">
              Selamat datang di EasyGo — peta andalanmu untuk menemukan
              tempat-tempat yang benar-benar ramah untuk semua orang, terutama
              teman-teman difabel.
            </p>
          </div>
          <img
            src="/icons/wheelchair1.png"
            alt="Kursi roda"
            className="rounded-xl w-full max-w-xs mx-auto shadow-lg transform hover:-translate-y-1 transition duration-300"
          />
        </section>

        {/* Kenapa EasyGo Ini Ada */}
        <section className="px-6 py-8 grid md:grid-cols-2 gap-6 items-center bg-gray-50 rounded-xl mt-6">
          <img
            src="/icons/wheelchair2.png"
            alt="Aksesibel"
            className="rounded-xl w-full max-w-xs mx-auto shadow-lg transform hover:-translate-y-1 transition duration-300"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4">Kenapa EasyGo Ini Ada?</h2>
            <p className="text-base leading-relaxed text-gray-700">
              Kami sadar, mencari tempat yang aksesibel itu nggak selalu mudah.
              Entah kamu butuh kafe dengan jalur kursi roda, mall dengan juru
              bahasa isyarat, atau kampus dengan papan braille — EasyGo hadir
              supaya kamu bisa sampai ke sana dengan percaya diri.
            </p>
          </div>
        </section>

        {/* Apa yang Bisa Kamu Lakukan */}
        <section className="px-6 py-8 mt-6 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Apa yang Kami Wujudkan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#2b6cad] p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-500 ease-in-out">
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Aksesibilitas
              </h3>
              <p className="text-base text-white text-center">
                Temukan tempat dengan fasilitas ramah difabel secara cepat dan
                mudah.
              </p>
            </div>
            <div className="bg-[#2b6cad] p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-500 ease-in-out">
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Partisipasi
              </h3>
              <p className="text-base text-white text-center">
                Berbagi ulasan dan pengalaman untuk memperkaya informasi
                aksesibilitas.
              </p>
            </div>
            <div className="bg-[#2b6cad] p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-500 ease-in-out">
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Kontribusi
              </h3>
              <p className="text-base text-white text-center">
                Tambahkan tempat baru untuk membantu komunitas menemukan lokasi
                inklusif.
              </p>
            </div>
            <div className="bg-[#2b6cad] p-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition duration-500 ease-in-out">
              <h3 className="text-xl font-semibold text-white text-center mb-2">
                Inklusivitas
              </h3>
              <p className="text-base text-white text-center">
                Dukung terciptanya lingkungan yang ramah dan inklusif untuk
                semua.
              </p>
            </div>
          </div>
        </section>

        {/* Tim */}
        <section className="px-6 py-8 mt-6 bg-gray-50 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Tim Dibalik EasyGo
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                name: "Mukti Abdi Syukur",
                image: "/abdi.jpg",
                role: "Backend Developer",
                bio: "Rajanya console.log() di server. Backend jalan? Alhamdulillah. Backend error? Istighfar dulu.",
                linkedin: "https://www.linkedin.com/in/muktiabdii/",
              },
              {
                name: "Ade Nugroho",
                image: "/ade.png",
                role: "Frontend Developer",
                bio: "Pixel bukan sekadar titik. Kalau desain nggak presisi 1px, tidur pun tak nyenyak.",
                linkedin: "https://www.linkedin.com/in/adenugroho/",
              },
              {
                name: "Muhammad Gilang Hafizh",
                image: "/gilang.png",
                role: "Frontend Developer",
                bio: "Styling sampai ngeluarin aura Tailwind. Bug? Cuma dekorasi biar hidup lebih berwarna.",
                linkedin: "https://www.linkedin.com/in/gilang-hafizh/",
              },
              {
                name: "Dzikri Murtadlo",
                image: "/dzikri.png",
                role: "Fullstack Developer",
                bio: "Dari database sampe div, semua disikat. Hidup fullstack: ngoding pagi, debug malam, galau 24/7.",
                linkedin: "https://www.linkedin.com/in/dzikri-murtadlo/",
              },
            ].map((member, i) => (
              <div key={i} className="perspective-1000 cursor-pointer group">
                <div
                  className="relative w-full h-64 bg-white rounded-xl border border-gray-200 shadow-lg transition-transform duration-500 transform-style-preserve-3d group-hover:rotate-y-180 hover:scale-105 hover:border-blue-300"
                  style={{ animationDelay: `${i * 0.15}s` }}
                >
                  {/* Front of the Card */}
                  <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 animate-teamCard">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-28 h-28 rounded-full mb-3 object-cover border-4 border-transparent"
                    />
                    <p className="font-medium text-gray-800 text-base">
                      {member.name}
                    </p>
                  </div>

                  {/* Back of the Card */}
                  <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-6 bg-blue-100 rounded-xl rotate-y-180">
                    <h3 className="font-semibold text-gray-800 text-lg mb-2">
                      {member.role}
                    </h3>
                    <p className="text-gray-600 text-sm text-center leading-relaxed">
                      {member.bio}
                    </p>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-blue-500 text-sm relative inline-block group"
                    >
                      LinkedIn
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="relative bg-gray-50 px-20 py-10 text-sm text-gray-600 mt-10 rounded-t-xl overflow-hidden animate-fadeInSlow">
        {/* Icon */}
        <img
          src="/logo.png"
          alt="Background Icon"
          className="absolute w-40 bottom-40"
        />

        {/* Info Section */}
        <div className="relative z-10 mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-800 animate-fadeInUp">
            Bersama wujudkan aksesibilitas
          </h3>
          <p className="text-lg text-gray-600 animate-fadeInUp delay-200">
            Mari jadi bagian dari perubahan menuju lingkungan inklusif
          </p>
        </div>

        {/* Contact and Social */}
        <div className="text-base relative z-10 grid md:grid-cols-2 gap-6 items-center mb-6">
          <div>
            <p>📍 JL Veteran No.10-11, Ketawanggede, Malang</p>
            <p>📧 easygo@email.com | 📞 08 1234 5678 90</p>
          </div>
          <div className="flex justify-center md:justify-end gap-4">
            {[
              {
                src: "https://cdn-icons-png.flaticon.com/512/733/733635.png",
                alt: "X",
              },
              {
                src: "https://cdn-icons-png.flaticon.com/512/2111/2111463.png",
                alt: "Instagram",
              },
              {
                src: "https://cdn-icons-png.flaticon.com/512/145/145807.png",
                alt: "LinkedIn",
              },
              {
                src: "https://cdn-icons-png.flaticon.com/512/733/733547.png",
                alt: "Facebook",
              },
            ].map((icon, i) => (
              <a
                key={i}
                href="#"
                className="transform hover:scale-125 transition duration-300"
              >
                <img src={icon.src} alt={icon.alt} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} EasyGo. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};

export default AboutPage;
