import { useState, useRef } from 'react';

const useSpeechRecognition = (onSearchChange) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  const searchInputRef = useRef(null);
  
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Maaf, browser Anda tidak mendukung fitur speech recognition.');
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = true;

    // Start listening
    setIsListening(true);
    recognition.start();

    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
  
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
  
        const currentTranscript = finalTranscript || interimTranscript;
        setTranscript(currentTranscript); 
        
        if (onSearchChange && currentTranscript) {
          const syntheticEvent = { target: { value: currentTranscript } };
          onSearchChange(syntheticEvent);
        }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
  };

  const stopSpeechRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  return {
    isListening,
    toggleSpeechRecognition,
    searchInputRef,
    transcript
  };
};

export default useSpeechRecognition;