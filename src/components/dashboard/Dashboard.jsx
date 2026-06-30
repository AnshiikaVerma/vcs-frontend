import React,{useState,useEffect} from 'react';
// import axios from "axios";
import api from "../../api/axios";
import "./dashboard.css";
import { StarIcon, StarFillIcon } from "@primer/octicons-react";
import Navbar from '../Navbar';
import { useNavigate } from "react-router-dom";


const Dashboard=()=>{

    const navigate = useNavigate();
const [repositories,setRepositories]=useState([]);
const [searchQuery,setSearchQuery]=useState("");
const[suggestedRepositories,setSuggestedRepositories]=useState([]); //all public repo from database will be fetch there
const [searchResults,setSearchResults]=useState([]);

const [starredRepos,setStarredRepos]=useState([]);
useEffect(()=>{
const userId=localStorage.getItem("userId");
const fetchRepositories=async()=>{
    try{   //-----------can use fetch logic instead of using axios------------
        // const response=await fetch(`http://localhost:3002/repo/user/${userId}`);
        // const data= await response.json();
        // setRepositories(data.repositories);
const res=await api.get(`http://localhost:3002/repo/user/${userId}`);
setRepositories(res.data.repositories);
    }catch(err){
        console.error("Error while fetching repositories: ",err)
    }
   
};
const fetchSuggestedRepositories=async()=>{
    try{ 
const res=await api.get("http://localhost:3002/repo/all");
setSuggestedRepositories(res.data);

    }catch(err){
        console.error("Error while fetching repositories: ",err)
    }
   
};
const fetchStarredRepos = async () => {
    try {
        const res = await api.get(
            `http://localhost:3002/userProfile/${userId}`
        );

        setStarredRepos(res.data.starRepos || []);
    } catch (err) {
        console.error("Error fetching starred repositories:", err);
    }
};

fetchRepositories();
fetchSuggestedRepositories();
fetchStarredRepos();
},[]);

useEffect(()=>{
if(searchQuery==''){
    setSearchResults(repositories); //sb kuch deikhana h
}else{
    const filteredRepos=repositories.filter((repo)=>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())  //if search qurey is the part of repo name
    );
    setSearchResults(filteredRepos);
}
},[repositories,searchQuery]);


const toggleStar = async (repoId) => {
    try {
        const userId = localStorage.getItem("userId");

        const res = await api.post(
            "http://localhost:3002/user/starRepository",
            {
                userId,
                repoId
            }
        );

        if (res.data.starred) {

            setStarredRepos(prev =>
                [...new Set([...prev, repoId])]
            );

        } else {

            setStarredRepos(prev =>
                prev.filter(id => id !== repoId)
            );
        }

    } catch (err) {
        console.error(err);
    }
};

return (
    <>
    <Navbar/> 
<div className="dashboard-hero">

<h1>
Welcome back 👋
</h1>

<p>
Manage your repositories, commits and issues in one place.
</p>

</div>


<section id="dashboard">
    <aside>
         <h3>Suggested Repositories </h3>
         {suggestedRepositories.map((repo)=>{
           const isStarred = starredRepos.some(
    id => id.toString() === repo._id.toString()
);
          return(
      
        <div  className="repo-card"key={repo._id}   onClick={() => navigate(`/repo/${repo._id}`)}>
            <div className='repo-card-header'>
        <h4>{repo.name}  </h4>
           
      <span  className="star-btn" onClick={(e)=>{ e.stopPropagation();
      toggleStar(repo._id)}}
        >
       {
            isStarred
            ? <StarFillIcon size={18} fill="gold"/>
            : <StarIcon size={18}/>
        }</span> 
</div>
 
   
  <p>{repo.description}</p>

</div>
         )}
          )
         }
           
    </aside>
    <main>
<h3>Your Repositories </h3>
<div id="search"><input type="text" value={searchQuery} placeholder='Search Your Repositories' onChange={(e)=>setSearchQuery(e.target.value)} /></div>
         {searchResults.map((repo)=>
            // <div key={repo._id}>
            <div className="repo-card"
   key={repo._id}
   onClick={() => navigate(`/repo/${repo._id}`)}
   style={{ cursor: "pointer" }}
>
                <h4>{repo.name}</h4>
                <p>{repo.description}</p>
            </div>
         )}

    </main>
    <aside>
        <h3> 📅Upcoming  Events</h3>
        <ul>
         <li><p>Tech Conference - Dec 15</p></li>
         <li><p>Developers Meetup - Dec 25</p></li>
         <li><p>React Summit - Jan 05</p></li>
        </ul>
    </aside>
</section>
</>
)
}

export default Dashboard;