import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div
      className="min-h-screen bg-[url('/login-bg.png')] bg-cover bg-no-repeat"
      style={{ backgroundPosition: '-30px 0px' }}
    >
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <img src="/logo.png" alt="EasyGo Logo" className="w-60" />
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
