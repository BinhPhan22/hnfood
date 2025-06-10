import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Load Dialogflow Messenger
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
    script.async = true;
    document.body.appendChild(script);
    
    // Create Dialogflow element
    const dfMessenger = document.createElement('df-messenger');
    dfMessenger.setAttribute('intent', 'WELCOME');
    dfMessenger.setAttribute('chat-title', 'HN FOOD Hỗ trợ');
    dfMessenger.setAttribute('agent-id', process.env.REACT_APP_DIALOGFLOW_AGENT_ID);
    dfMessenger.setAttribute('language-code', 'vi');
    
    // Style the chatbot
    dfMessenger.style.position = 'fixed';
    dfMessenger.style.bottom = '20px';
    dfMessenger.style.right = '20px';
    dfMessenger.style.zIndex = '1000';
    
    document.body.appendChild(dfMessenger);
    
    return () => {
      // Cleanup
      document.body.removeChild(script);
      document.body.removeChild(dfMessenger);
    };
  }, []);
  
  return null; // Component doesn't render anything directly
};

export default Chatbot;