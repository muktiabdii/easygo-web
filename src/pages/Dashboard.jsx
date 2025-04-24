import React from 'react'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Selamat datang di Dashboard! KONZ!!</h1>
        {/* Konten lainnya */}
      </div>
    </>
  )
}

export default Dashboard
