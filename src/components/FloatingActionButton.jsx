import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import { isAuthenticated, validateTokenWithBackend } from "../utils/authUtils";

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

  const handleLogin = () => {
    setShowAuthDialog(false);
    navigate("/login", { state: { from: redirectPath } });
  };

  const handleCancelAuth = () => {
    setShowAuthDialog(false);
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-10 lg:right-10 flex flex-col gap-2 sm:gap-3 z-[1000]">
        {/* Locate User Button */}
        <button
          onClick={onLocateUser}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#357FCC] transition-all duration-200 active:scale-95"
          aria-label="Locate User"
        >
          <img
            src="icons/synclocation.png"
            alt="Locate User"
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9"
          />
        </button>

        {/* Chat Button */}
        <button
          onClick={handleChatClick}
          className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#3C91E6] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:bg-[#357FCC] transition-all duration-200 active:scale-95"
          aria-label="Chat"
        >
          <img 
            src="icons/chat.png" 
            alt="Chat" 
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9" 
          />
        </button>
      </div>

      {/* Authentication Dialog */}
      {showAuthDialog && (
        <ConfirmDialog
          isOpen={showAuthDialog}
          onConfirm={handleLogin}
          onCancel={handleCancelAuth}
          message="Harap login untuk mengakses konten ini. Ingin masuk sekarang?"
          confirmLabel="Masuk"
          cancelLabel="Batal"
          confirmColor="text-[#3C91E6]"
          cancelColor="text-red-500"
        />
      )}
    </>
  );
};

export default FloatingActionButton;