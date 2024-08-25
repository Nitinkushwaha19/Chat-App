import React, { useEffect, useState, useRef } from "react";
import "./Chat.css";
import { toast } from "react-toastify";
import userChats from "../../api/ChatRequests.js";
import Conversation from "../../Components/Conversation/Conversation.jsx";
import ChatBox from "../../Components/ChatBox/ChatBox.jsx";
import {io} from "socket.io-client";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import { styled, alpha } from "@mui/material/styles";
import findUser from "../../api/findUser.js";
import postChats from "../../api/postChat.js";


const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Chat = ({ user }) => {
  const [chats, setChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [sendMessage, setSendMessage] = useState(null);
  const [receiveMessage, setReceiveMessage] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  
  const socket = useRef();
    // Connectiong to Socket 
    useEffect(()=> {
      socket.current = io('http://localhost:8080');
      socket.current.emit("new-user-add",user._id);
      socket.current.on('get-users',(user)=> {
       setOnlineUser(user);
      })
    },[user])
  
  // sending message to socket server
  useEffect(()=> {
      if(sendMessage !== null){
        socket.current.emit('send-message', sendMessage);
        
      }
  },[sendMessage])


  // Receive message to socket server
  useEffect(()=> {
    socket.current.on("recieve-message", (data)=> {
      setReceiveMessage(data);
    })
  },[])
  
  
  // Effect to get Chat 
  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user._id);
        setChat(data);
      } catch (err) {
        toast.error(err.message);
      }
    };
    getChats();
  }, [user._id, chats]);




  const checkOnlineStatus = (chat) => {
    const chatMember = chat.members.find((member)=> member !== user._id);
    const online = onlineUser.find((user)=> user.userId === chatMember);
    return online? true : false;
  }
  

  const handleSearchUser = async () => {
    console.log(searchInput);

    try {
      // gettting reciever id
      const response = await findUser(searchInput);
      const recieverId = response.data._id;
      setSearchInput("");

      // Setting up the chat
      const addChat = {
        senderId: user._id,
        receiverId: recieverId,
      };

      const chatResponse = await postChats(addChat);
      console.log(chatResponse);
    } catch (err) {
      setSearchInput("");
      toast.error("User not exist!");
    }
  };

  return (
    <div className="Chat">
      {/* Left Side */}
      <div className="Left-side-chat">
        <div className="Chat-container">
        {user ? (
              <div className="search-input">
                {" "}
                <input class="form-control me-2" value={searchInput} onChange={(e)=> setSearchInput(e.target.value)} type="search" placeholder="Search" aria-label="Search"/>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleSearchUser}
                >
                   <SearchIcon />
                </Button>
              </div>
            ) : (
              ""
            )}
          <div className="Chat-list">
            {chats.map((chat) => (
              <div onClick={()=> setCurrentChat(chat)}>
                <Conversation
                  data={chat}
                  currentUser={user._id}
                  online={checkOnlineStatus(chat)}
                />
                
              </div>
             ))} 
          </div>
        </div>
      </div>

      {/* Right Side */}

      <div className="Right-side-chat">
        <div style={{ width: "20rem", alignSelf: "flex-end" }}>
          {/* <NavIcons /> */}
        </div>
        <ChatBox
          chat={currentChat}
          currentUser={user._id}
          setSendMessage={setSendMessage}
          receiveMessage={receiveMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
