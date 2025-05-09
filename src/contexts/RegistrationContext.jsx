import React, { createContext, useState, useContext } from 'react';

// Membuat context untuk menyimpan data registrasi
const RegistrationContext = createContext();

// Provider component untuk menyediakan state registrasi ke seluruh aplikasi
export const RegistrationProvider = ({ children }) => {
  // State untuk menyimpan semua data registrasi
  const [registrationData, setRegistrationData] = useState({
    name: '',
    number: '',
    country: '',
    province: '',
    city: '',
    email: '',
    password: '',
    password_confirmation: ''
  });

  // Fungsi untuk memperbarui data registrasi
  const updateRegistrationData = (newData) => {
    setRegistrationData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  return (
    <RegistrationContext.Provider value={{ registrationData, updateRegistrationData }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration harus digunakan dalam RegistrationProvider');
  }
  return context;
};