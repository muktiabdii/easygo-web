import React from 'react'

const ForgotPasswordStepThree = () => {
    const handleSubmit = (e) => {
      e.preventDefault()
      // Tambahkan aksi kalau mau, misalnya redirect ke halaman login setelah reset
      console.log('Password reset submitted')
    }

  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat"
      style={{ backgroundPosition: '-30px 0px' }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full min-w-[540px] p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
        <form className="flex flex-col items-center space-y-4 text-center" onSubmit={handleSubmit}>
          <h1 className="text-[40px] font-bold mb-2">Reset Password</h1>
            <input
              type="email"
              placeholder="Email"
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Kata Sandi Baru"
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Ulangi Kata Sandi Baru"
              className="w-full max-w-[400px] mt-4 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="mt-8 w-full max-w-[400px] bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
            >
              Ubah Kata Sandi
            </button>
          </form>

          <p className="text-sm mt-4">
            Ingat kata sandi?{' '}
            <a href="/login" className="font-semibold hover:underline">
              Masuk
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordStepThree
