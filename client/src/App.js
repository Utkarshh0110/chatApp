import "./App.css";
import React, { useState, useEffect } from "react";
import io from 'socket.io-client'

let socket;
const CONNECTION_PORT = 'localhost:5000/'

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    socket = io(CONNECTION_PORT, { transports: ['websocket', 'polling', 'flashsocket'] })
  },[CONNECTION_PORT])

  const connectToRoom = () => {
    socket.emit('join_room', room)
  }

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Name..." />
            <input onChange={(e) => setRoom(e.target.value)} type="text" placeholder="Room..." />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <h1>You are logged in</h1>
      )}
    </div>
  );
};

export default App;
