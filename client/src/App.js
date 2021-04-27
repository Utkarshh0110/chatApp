import "./App.css";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;
const CONNECTION_PORT = "localhost:5000/";

const App = () => {
  //Before login
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState("");
  const [userName, setUserName] = useState("");

  //After login
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    socket = io(CONNECTION_PORT, {
      transports: ["websocket", "polling", "flashsocket"],
    });
  }, [CONNECTION_PORT]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList([...messageList, data]);
    });
  });

  const connectToRoom = () => {
    setLoggedIn(true);
    socket.emit("join_room", room);
  };

  const sendMessage = async () => {
    let messageContent = {
      room: room,
      content: {
        author: userName,
        message: message,
      },
    };
    await socket.emit("send_message", messageContent);
    setMessageList([...messageList, messageContent.content]);
    setMessage("");
  };

  return (
    <div className="App">
      {!loggedIn ? (
        <div className="logIn">
          <div className="inputs">
            <input
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              placeholder="Name..."
            />
            <input
              onChange={(e) => setRoom(e.target.value)}
              type="text"
              placeholder="Room..."
            />
          </div>
          <button onClick={connectToRoom}>Enter Chat</button>
        </div>
      ) : (
        <div className="chatContainer">
          <div className="messages">
            {messageList.map((val, key) => {
              return (
                <div className='messageContainer'>
                  <div key={key} className="messageIndividual">
                    {val.message}
                  </div>
                  <h1>{val.author}</h1>
                </div>
              );
            })}
          </div>
          <div className="messagesInputs">
            <input
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
