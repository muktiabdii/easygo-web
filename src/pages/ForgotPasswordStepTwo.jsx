import React from 'react'

const ForgotPasswordStepTwo = () => {
  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat"
      style={{ backgroundPosition: '-30px 0px' }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Atur Ulang Kata Sandi</h1>
          <form className="space-y-4 text-left">
            <input
              type="password"
              placeholder="Kata Sandi Baru"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Ulangi Kata Sandi Baru"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
            >
              Ganti Kata Sandi
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

export default ForgotPasswordStepTwo
