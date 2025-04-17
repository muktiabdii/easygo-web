import React from 'react'
import { Link } from 'react-router-dom';


const Login = () => {
  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat"
      style={{ backgroundPosition: '-30px 0px' }}
      >

      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <img src="/logo.png" alt="EasyGo Logo" className="w-60" />
      </div>

      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Masuk</h1>

          <form className="space-y-4 text-left">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="text-right text-sm">
              <a href="/forgot-password" className="hover:underline font-light">Lupa kata sandi?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
            >
              Masuk
            </button>
          </form>

          <p className="text-sm mt-4">
            Belum punya akun? <Link to="/register-step-one" className="font-semibold hover:underline">Daftar sekarang!</Link>
          </p>
        </div>
      </div>

    </div>
  )
}

export default Login
