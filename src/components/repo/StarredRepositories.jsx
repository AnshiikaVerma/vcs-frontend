
import React, { useEffect, useState } from "react";
// import api from "api";
import api from "../../api/axios";
import Navbar from "../Navbar";

import { useNavigate } from "react-router-dom";
import "./StarredRepository.css";


const StarredRepositories = () => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchStarredRepos();
  }, []);

  const fetchStarredRepos = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const userRes = await api.get(
        `http://localhost:3002/userProfile/${userId}`
      );

      const starredIds = userRes.data.starRepos || [];

      const repoPromises = starredIds.map((repoId) =>
        api.get(`http://localhost:3002/repo/${repoId}`)
      );

      const repoResponses = await Promise.all(repoPromises);

      const repoData = repoResponses.map((res) => res.data);

      setRepos(repoData);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      {/* <div>
        <h2>Starred Repositories</h2>

        {repos.length === 0 ? (
          <p>No starred repositories yet.</p>
        ) : (
          repos.map((repo) => (
            <div key={repo._id}>
              <h3>{repo.name}</h3>

              <p>{repo.description}</p>

              <p>
                {repo.visibility ? "Public" : "Private"}
              </p>
            </div>
          ))
        )}
      </div> */}
<div className="star-page">

<div className="star-container">

<h1>Starred Repositories</h1>

<p className="star-subtitle">
Repositories you've starred.
</p>

{
repos.length===0 ?

<div className="empty-state">

<h3>No starred repositories</h3>

<p>
Start starring repositories from Dashboard.
</p>

</div>

:

repos.map((repo)=>(

<div
className="star-card"
key={repo._id}
onClick={()=>navigate(`/repo/${repo._id}`)}
>

<div className="star-header">

<h3>{repo.name}</h3>

<span
className={
repo.visibility
?
"visibility public"
:
"visibility private"
}
>

{
repo.visibility
?
"Public"
:
"Private"
}

</span>

</div>

<p className="repo-desc">

{repo.description || "No description"}

</p>

<p className="repo-owner">

Owner :
<strong>

{" "}
{repo.owner?.username}

</strong>

</p>

<button
className="open-btn"
>

Open Repository →

</button>

</div>

))

}

</div>

</div>


    </>
  );
};

export default StarredRepositories;