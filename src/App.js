import React, { useState, useEffect } from 'react';
import axios from "axios";

import './App.css';

function App() {
  const [userName, setUserName] = useState("");
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isChatStarted) {
      const source = new EventSource(`http://a638bccdf41c.ngrok.io/chat/${userName}`);

      source.addEventListener("message", (e) => {
        setConversations((conversations) => conversations.concat([JSON.parse(e.data)]));
      });
    }
  }, [isChatStarted]);

  const onUserNameChange = (e) => {
    setUserName(e.target.value);
  }

  const onChatStart = () => {
    setIsChatStarted(true);
  };

  const onMessageChange = (e) => {
    setMessage(e.target.value);
  }

  const onMessageSend = () => {
    axios({
      method: 'post',
      url: 'http://a638bccdf41c.ngrok.io/write',
      headers: {
        'content-type': 'application/json',
      },
      data: {
        user: userName,
        message
      }
    }).then(res => {
      setMessage("");
    });
  };
  
  return (
    <div className="App">
      <input type="text" onChange={onUserNameChange} value={userName} />
      <button disabled={!userName} type="button" onClick={onChatStart}>Start Chat</button>
      <div>
        <ul>
          {conversations.map((item) => (
            <li><b>{item.user}</b>{" "}<i>{item.message}</i> | {item.timeStamp}</li>
          ))}
        </ul>
        <input disabled={!isChatStarted} type="text" value={message} onChange={onMessageChange} />
        <button disabled={!message || !isChatStarted} type="button" onClick={onMessageSend}>Send</button>
      </div>
    </div>
  );
}

export default App;
