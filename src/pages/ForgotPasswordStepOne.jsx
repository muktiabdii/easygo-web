import React from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPasswordStepOne = () => {
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/forgot-password-step-two')
  }

  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat"
      style={{ backgroundPosition: '-30px 0px' }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-full max-w-md p-8 bg-[#EFF0F7] rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold mb-6">Atur Ulang Kata Sandi</h1>
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"/>
            <input
              type="password"
              placeholder="Kode Verifikasi"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-full hover:bg-blue-600 transition"
            >
              Lanjut
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

export default ForgotPasswordStepOne
