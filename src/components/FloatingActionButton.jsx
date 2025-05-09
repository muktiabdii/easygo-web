import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthDialog from './AuthDialog';
import { isAuthenticated, validateTokenWithBackend } from '../utils/authUtils';

const FloatingActionButton = ({ onLocateUser }) => {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [isAuthValid, setIsAuthValid] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const isValid = await validateTokenWithBackend();
          setIsAuthValid(isValid);
        } catch (error) {
          setIsAuthValid(false);
        }
      } else {
        setIsAuthValid(false);
      }
      setIsChecking(false);
    };

    checkAuth();
  }, []);

  const handleSecureNavigation = async (path) => {
    if (isChecking) {
      return;
    }

    if (isAuthValid) {
      navigate(path);
      return;
    }
    if (isAuthenticated() && !isAuthValid) {
      try {
        const isValid = await validateTokenWithBackend();
        if (isValid) {
          setIsAuthValid(true);
          navigate(path);
          return;
        }
      } catch (error) {
        console.error("Authentication validation failed:", error);
      }
    }
    setRedirectPath(path);
    setShowAuthDialog(true);
  };

  const handleChatClick = () => {
    handleSecureNavigation("/chat");
  };

  const handleProfileClick = () => {
    handleSecureNavigation("/profile");
  };

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { from: redirectPath } });
  };

  const handleCancelAuth = () => {
    setShowAuthDialog(false);
  };

  return (
    <div className="absolute bottom-10 right-10 flex flex-col gap-3 z-[1000]">
      <button
        onClick={onLocateUser}
        className="w-16 h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
      >
        <img
          src="icons/synclocation.png"
          alt="Locate User"
          className="w-9 h-9"
        />
      </button>
      <button
        onClick={handleChatClick}
        className="w-16 h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:cursor-pointer"
      >
        <img src="icons/chat.png" alt="Chat" className="w-9 h-9" />
      </button>

      {showAuthDialog && (
        <div className="fixed inset-0 z-[1001]">
          <AuthDialog 
            onLogin={handleLogin} 
            onCancel={handleCancelAuth} 
          />
        </div>
      )}
    </div>
  );
};

export default FloatingActionButton;