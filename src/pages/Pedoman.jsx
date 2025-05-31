import Navbar from "../components/Navbar";

const Pedoman = () => {
  const daftarPedoman = [
    {
      title: "Peraturan Menteri PUPR No. 14/PRT/M/2017",
      subtitle: "Kementerian PUPR Republik Indonesia - 15 Agustus 2017",
      href: "https://peraturan.bpk.go.id/Details/104477/permen-pupr-no-14prtm2017-tahun-2017",
    },
    {
      title: "Peraturan Pemerintah (PP) Nomor 52 Tahun 2019",
      subtitle: "Peraturan Pemerintah Republik Indonesia - 26 Juli 2019",
      href: "https://peraturan.bpk.go.id/Details/116978/pp-no-52-tahun-2019",
    },
    {
      title: "Peraturan Pemerintah (PP) Nomor 13 Tahun 2020",
      subtitle: "Peraturan Pemerintah Republik Indonesia - 20 Februari 2020",
      href: "https://www.hukumonline.com/pusatdata/detail/lt5e58e75eac3e8/peraturan-pemerintah-nomor-13-tahun-2020/",
    },
    {
      title: "Peraturan Pemerintah (PP) Nomor 42 Tahun 2020",
      subtitle: "Peraturan Pemerintah Republik Indonesia - 24 Juli 2020",
      href: "https://jdih.pu.go.id/detail-dokumen/PP-nomor-42-Tahun-2020-tahun-2020-Aksesibilitas-terhadap-Permukiman-Pelayanan-Publik-dan-Pelindungan-dari-Bencana-bagi-Penyandang-Disabilitas",
    },
    {
      title: "UU No. 8 Tahun 2016 Tentang Disabilitas",
      subtitle: "Undang-Undang Republik Indonesia - 15 April 2016",
      href: "https://jdih.mahkamahagung.go.id/legal-product/uu-nomor-8-tahun-2016/detail",
    },
  ];

  return (
    <div>
      <Navbar hideBackground={false} showSearch={false} showFilter={false} />
      <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4">
        <h2 className="text-4xl font-bold text-[#3C91E6] mt-18 mb-8">
          Daftar Pedoman
        </h2>

        <div className="bg-[#EFF0F7] w-full max-w-3xl  pt-4 px-4 sm:px-8 py-10 shadow">
          {daftarPedoman.map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-4 border-b border-blue-200 text-center hover:bg-blue-100 transition duration-200 rounded"
            >
              <h3 className="font-semibold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pedoman;
