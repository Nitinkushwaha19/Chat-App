import React, { useEffect, useState } from "react";
import getUser from "../../api/getUser";
import { toast } from "react-toastify";
import image from "../../public/Profile.jpeg"

const Conversation = ({ data, currentUser, online }) => {
  const [userData, setUserData] = useState("");

  useEffect(() => {
    const userId = data.members.find((id) => id !== currentUser);
    const getUserData = async () => {
        try{
            const { data } = await getUser(userId);
            setUserData(data);
        } catch(err) {
            toast.error(err.message);
        }
    };
    getUserData();
  }, []);

  return (
    <>
      <div className="follower conversation">
        <div style={{display:"flex", alignItems: "center", justifyContent:"space-evenly"}}>
          { online && <div className="online-dot"></div>}
          <img
            src={image}
            alt="Profile"
            className="followerImage"
            style={{ width: "80px", height: "80px", borderRadius:"45%" }}
          />
          <div className="name" style={{fontSize: '1.25rem',fontWeight:"600"}}>
            <span style={{display:"block", fontWeight:"800"}}>{userData.username}</span>
            <span>{online ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "95%", border: "0.1px solid #5c5e5d" }} />
    </>
  );
};

export default Conversation;
