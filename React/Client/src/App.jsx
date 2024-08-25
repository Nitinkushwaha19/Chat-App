import { useContext, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login";
import SignUp from "./Components/Signup";
import Chat from "./pages/Chat/Chat";
import UserContext from "./Components/context/UserProvider";
import './App.css'


function App() {

  const { user, loading } = useContext(UserContext);

  return (
    loading?<div>Loading...</div>:<>
      <Router>
        <Navbar user={user} />
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/chat" element={ user?<Chat user={user}/> : <Navigate to="/login" /> } />
        </Routes>
      </Router>
    </>
  );
}

export default App;
