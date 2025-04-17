// src/pages/Login.jsx
import React from 'react'

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-xl shadow-md text-center">
        <img src="/logo.png" alt="EasyGo Logo" className="w-20 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-6">Masuk</h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <div className="relative">
            <input
              type="password"
              placeholder="Kata Sandi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <a href="#" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
              Lupa kata sandi?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
          >
            Masuk
          </button>
        </form>

        <p className="text-sm mt-4">
          Belum punya akun? <a href="#" className="font-semibold">Daftar sekarang!</a>
        </p>
      </div>
    </div>
  )
}

export default Login
