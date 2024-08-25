import React, { useState, useEffect, useRef } from "react";
import Profile from "../../public/Profile.jpeg";
import { toast } from "react-toastify";
import getUser from "../../api/getUser";
import getMessages from "../../api/getMessage";
import addMessage from "../../api/MessageRequests";
import { format } from "timeago.js";
import "./ChatBox.css";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ chat, currentUser, setSendMessage, receiveMessage }) => {
  const [userData, setUserData] = useState(currentUser);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetching data for header
  useEffect(() => {
    const userId = chat?.members?.find((id) => id !== currentUser);
    const getUserData = async () => {
      try {
        const { data } = await getUser(userId);
        console.log(data);
        setUserData(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (chat !== null) getUserData();
  }, [currentUser, chat]);

  // Fetching data for messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await getMessages(chat._id);
        setMessages(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    if (chat != null) fetchMessages();
  }, [chat]);

  // To handle the input text
  const handleChange = (newMessage) => {
    setNewMessage(newMessage);
  };

  // scroll to last message
  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    const message = {
      senderId: currentUser,
      text: newMessage,
      chatId: chat._id,
    };

    if (newMessage != "") {
      // send message to socket server
      const receiverId = chat.members.find((id) => id !== currentUser);
      setSendMessage({ ...message, receiverId });

      try {
        const { data } = await addMessage(message);
        setMessages([...messages, data]);
        setNewMessage("");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // recieve message
  useEffect(() => {
    if (receiveMessage !== null && receiveMessage.chatId === chat._id) {
      setMessages([...messages, receiveMessage]);
    }
  }, [receiveMessage]);

  const scroll = useRef();
  return (
    <>
      <div className="ChatBox-container">
        {chat ? (
          <>
            {/* chat-header */}
            <div className="chat-header">
              <div className="follower">
                <div style={{display:"flex"}}>
                  <img
                    src={Profile}
                    alt="Profile"
                    className="followerImage"
                    style={{ width: "90px", height: "90px", borderRadius:"45%" }}
                  />
                  <div className="name" style={{ fontSize: "2rem", fontWeight:"750", marginLeft:"2rem" }}>
                    <span>{userData.username}</span>
                  </div>
                </div>
              </div>
              <hr
                style={{
                  width: "100%",
                  border: "0.1px solid #000",
                  marginTop: "10px",
                }}
              />
            </div>
            {/* chat-body */}
            <div className="chat-body">
              {messages.map((message) => (
                // console.log(message),
                <div
                  ref={scroll}
                  className={
                    message.senderId === currentUser ? "message own" : "message"
                  }
                >
                  <span>{message.text}</span>{" "}
                  <span>{format(message.createdAt)}</span>
                </div>
              ))}
            </div>
            {/* chat-sender */}
            <div className="chat-sender">
              <InputEmoji
                value={newMessage}
                onChange={handleChange}
                cleanOnEnter
                placeholder="Type a message"
              />
              <button
                type="button"
                onClick={handleSend}
                style={{ padding: "0.4rem 1rem", marginRight:"1rem"}}
                class="btn btn-success btn-lg"
              >
                send
              </button>
            </div>{" "}
          </>
        ) : (
          <span className="chatbox-empty-message">
            Tap on a chat to start conversation...
          </span>
        )}
      </div>
    </>
  );
};

export default ChatBox;
