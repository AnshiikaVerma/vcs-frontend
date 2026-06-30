import React,{useEffect,useState} from "react";
// import api from "api";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon,RepoIcon } from "@primer/octicons-react";
import HeatMap from "./HeatMap";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile=()=>{
  const {setCurrentUser}=useAuth();
const navigate=useNavigate();
const [userDetails,setUserdetails]=useState({
    name:"username"
});
//use effect so that when profile page renders backend se data fetch ho jae
useEffect(()=>{
const fetchUserDetails=async()=>{
    const userId=localStorage.getItem("userId");
    if(userId){ //if user id not avialable then nsvigate to login ->login in projectRouter
   try{
  const response=await api.get(`http://localhost:3002/userProfile/${userId}`);
  setUserdetails(response.data);
   }catch(err){
console.error("Cannot fetch user details : ",err);
   }} 
};
fetchUserDetails();
},[]);

return (
    <>
    <Navbar/>
    <div className="profile-container">
    <UnderlineNav aria-label="Repository" >
        <UnderlineNav.Item
        
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color:"#24292f",
            "&:hover": {
              textDecoration: "underline",
              color: "#24292f",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "#57606a",
            "&:hover": {
              textDecoration: "underline",
              color:  "#24292f",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <button className="logout-btn"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          setCurrentUser(null);

          window.location.href = "/auth";
        }}
        // style={{ position: "fixed", bottom: "50px", right: "50px" }}
        id="logout"
      >
        Logout
      </button>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
      
          <div
  className="profile-image"
  style={{
    backgroundImage: `url(${
      userDetails.avatar ||
 "https://avatars.githubusercontent.com/u/49699333?v=4"
    })`,
  }}
></div>

          <div className="name">
            <h3>{userDetails.username}</h3>
             <p className="profile-role">
              Full Stack Developer
          </p>
           <p className="profile-email">
        ✉  {userDetails.email}
    </p>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
             <div className="stat">

        <h4>10</h4>

        <span>Followers</span>

    </div>

    <div className="stat">

        <h4>3</h4>

        <span>Following</span>

    </div>
          </div>
        </div>

        <div className="heat-map-section">
         <div className="heatmap-wrapper">

        <HeatMapProfile/>

    </div>

        </div>
      </div>
      </div>
    </>
)
}


export default Profile;