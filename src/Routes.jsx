import React ,{useEffect} from "react";
import {useNavigate,useRoutes} from 'react-router-dom'

//Pages list
import Dashboard from "./components/dashboard/Dashboard"
import Profile from "./components/user/Profile"
import Login from "./components/auth/Login"
import Signup from "./components/auth/Signup"
import CreateRepository from "./components/repo/CreateRepository";
import StarredRepositories from "./components/repo/StarredRepositories";

import RepositoryDetails from "./components/repo/RepositoryDetails";
import EditRepository from "./components/repo/EditRepository";
//Auth context ->calling this hook gives us  info abt user login status
import { useAuth } from "./authContext";

const ProjectRoutes=()=>{
const {currentUser,setCurrentUser}=useAuth(); //check if the user authenticated
const navigate=useNavigate();

useEffect(()=>{
const userIdFromStorage=localStorage.getItem("userId");
if(userIdFromStorage&&!currentUser){ //userlogged in so we re setting user as a curr user 
    setCurrentUser(userIdFromStorage);
}
if(!userIdFromStorage&&!["/auth","/signup"].includes(window.location.pathname)){ ///if not login and not in login or signup paage navigate them to auth
    navigate("/auth");
}
if(userIdFromStorage&&window.location.pathname=='/auth'){
navigate("/");    //user login h and is is at auth page redirect it to home
}
},[currentUser,navigate,setCurrentUser]);
//userid change ,new page navigate , curr user status change kiya(login/logout)

let element=useRoutes([
    {
        path:"/",
        element: <Dashboard/>
    },
    {
        path:"/auth",
        element:<Login/>
    },
    {
        path:"/signup",
        element:<Signup/>
    },
    {
        path:"/profile",
        element:<Profile/>
    },
    {
  path: "/create",
  element: <CreateRepository />
},
{
   path:"/repo",
   element:<StarredRepositories/>
},
{
   path:"/repo/:id",
   element:<RepositoryDetails/>
},{
    path:"/repo/edit/:id",
    element:<EditRepository/>
}
]);
return element;
}

export default ProjectRoutes;