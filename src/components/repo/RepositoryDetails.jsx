import React, { useEffect, useState } from "react";
// import axios from "axios";
import api from "../../api/axios";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar";

import { useNavigate } from "react-router-dom";
//css file
import "./RepositoryDetails.css";

const RepositoryDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [repo, setRepo] = useState(null);

   //issue states
  const [issues, setIssues] = useState([]);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");

//delete update Repository
const [editName,setEditName] = useState("");
const [editDescription,setEditDescription] = useState("");
const [editing,setEditing] = useState(false);
//commits
const [commits, setCommits] = useState([]);
//commits file
const [expandedCommit, setExpandedCommit] = useState(null);

const [commitFiles, setCommitFiles] = useState({});



  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await api.get(
          `http://localhost:3002/repo/${id}`
        );

        setRepo(res.data);
       setEditName(res.data.name);
      setEditDescription(res.data.description);

           //fetching issues too
          const issueRes = await api.get(
      `http://localhost:3002/issue/all/${id}`
    );

    setIssues(issueRes.data);
//commit fetching too
const commitRes = await api.get(
  `http://localhost:3002/repo/${id}/commits`
);

setCommits(commitRes.data);

      } catch (err) {
        console.error(err);
      }
    };

    fetchRepo();
  }, [id]);

  const createIssue = async () => {
  try {
      // const token = localStorage.getItem("token");
    await api.post(
      `http://localhost:3002/issue/create/${id}`,
      {
        title,
        description,
      },
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );

    const issueRes = await api.get(
      `http://localhost:3002/issue/all/${id}`
    );

    setIssues(issueRes.data);

    setTitle("");
    setDescription("");

  } catch (err) {
    console.error(err);
  }
};

//commits file view

const viewFiles = async (commitId) => {

  try {

    if (expandedCommit === commitId) {
      setExpandedCommit(null);
      return;
    }

    if (!commitFiles[commitId]) {

      const res = await api.get(
        `http://localhost:3002/repo/${id}/commits/${commitId}/files`
      );
  

      setCommitFiles(prev => ({
        ...prev,
        [commitId]: res.data
      }));
    }

    setExpandedCommit(commitId);

  } catch (err) {

    console.error(err);

  }

};



//curr add
const deleteRepository = async () => {
  try {
    //  const token = localStorage.getItem("token");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmDelete) return;

    await api.delete(
      `http://localhost:3002/repo/delete/${id}`,
  //      {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }
    );

    window.location.href = "/";

  } catch (err) {
    console.error(err);
  }
};

//update
const toggleIssueStatus = async (issue) => {
  try {
// const token = localStorage.getItem("token");
    const newStatus =
      issue.status === "open"
        ? "closed"
        : "open";

    await api.put(
      `http://localhost:3002/issue/update/${issue._id}`,
      {
        title: issue.title,
        description: issue.description,
        status: newStatus,
      },
  //      {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }
    );

    const issueRes = await api.get(
      `http://localhost:3002/issue/all/${id}`
    );

    setIssues(issueRes.data);

  } catch (err) {
    console.error(err);
  }
};
//delete issue

const deleteIssue = async (issueId) => {
  try {
//  const token = localStorage.getItem("token");
    await api.delete(
      `http://localhost:3002/issue/delete/${issueId}`,
  //     {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }
    );

    const issueRes = await api.get(
      `http://localhost:3002/issue/all/${id}`
    );

    setIssues(issueRes.data);

  } catch (err) {
    console.error(err);
  }
};

  if (!repo) {
    return <h2>Loading...</h2>;
  }


const currentUserId = localStorage.getItem("userId");

const isOwner =repo?.owner?._id?.toString() === currentUserId;
console.log(commitFiles);



  return (
    <>
      <Navbar />

      <div className="repo-details-page">
    <div className="repo-details-container">
        {/* <h1>{repo.name}</h1> */}
          <h1 className="repo-title">
            {repo.name}
          </h1>

        {/* <p>{repo.description}</p> */}
        <p className="repo-description">
          {repo.description}
        </p>

        {/* <h3>
          Visibility :
          {" "}
          {repo.visibility ? "Public" : "Private"}
        </h3>

        <h3>
          Owner :
          {" "}
          {repo.owner?.username}
        </h3>


        <h3>
  Repository ID : {repo._id}
</h3>

<button
  onClick={() => {
    navigator.clipboard.writeText(repo._id);
    alert("Repository ID copied!");
  }}
>
  Copy Repository ID
</button> */}

<div className="repo-info-grid">

  <div className="info-card">
    <span className="info-label">
      Visibility
    </span>

    <span
      className={
        repo.visibility
          ? "visibility public"
          : "visibility private"
      }
    >
      {repo.visibility ? "🌍 Public" : " 🔒 Private"}
    </span>
  </div>

  <div className="info-card">
    <span className="info-label">
      Owner
    </span>

    <span>
       👤{repo.owner?.username}
    </span>
  </div>

  <div className="info-card repo-id-card">
    <span className="info-label">
       Repository ID
    </span>

    <code>
      🆔 {repo._id}
    </code>
  </div>

  <button
    className="copy-btn"
    onClick={() => {
      navigator.clipboard.writeText(repo._id);
      alert("Repository ID copied!");
    }}
  >
    📋 Copy Repository ID
  </button>

</div>

<div className="section-divider"></div>

{/* <h2>Commit History</h2> */}

<h2 className="section-title">
 🕒 Commit History
</h2>

{commits.length === 0 ? (
  <p>No commits found.</p>
) : (
  commits.map((commit) => (
  
    <div
    key={commit.commitId}
    className="commit-card"
>
      
<div className="commit-header">
      <h4 className="commit-message">
            {commit.message}
        </h4>
        <button
        className="secondary-btn"
        onClick={() => viewFiles(commit.id)}
    >
        {expandedCommit === commit.id
            ? "▼ Hide Files"
            : "▶ View Files"}
    </button>
</div>
      {/* <p>
        <strong>Commit ID:</strong> {commit.id.slice(0,8)}
      </p>

      <p>
        <strong>Date:</strong>{" "}
        {new Date(commit.date).toLocaleString()}
      </p> */}

      <div className="commit-meta">

    <span>
        Commit ID:
        <code>
            {commit.id} 
              </code>
    </span>

    <span>

        {new Date(commit.date).toLocaleString()}

    </span>

</div>

        {
          expandedCommit === commit.id && (

            // <ul style={{ marginTop: "10px" }}>
            <ul className="files-list">

              {
                commitFiles[commit.id]?.map((file) => (

                  <li key={file}>
                   📄 {file}
                  </li>

                ))
              }

            </ul>

          )
        }

    </div>
  ))
)}

        <h3>
         🐞 Issues :
          {" "}
        (  {issues.length} )
        </h3>
               

          {isOwner && (
  <>
  <div className="repo-actions">
    <button
      onClick={() => navigate(`/repo/edit/${repo._id}`)}
    >
      Edit Repository
    </button>

    <button  className="danger-btn" onClick={deleteRepository}>
      Delete Repository
    </button>
    </div>
  </>
)} 

   <div className="section-divider"></div>

  <h2 className="section-title">Issues ({issues.length})</h2>
{
  issues.map((issue) => (
   <div key={issue._id} className="issue-card">
    <div className="issue-header">
      <h3 className="issue-title">{issue.title}</h3>


   <span className={`status-badge ${
                issue.status === "open"
                    ? "status-open"
                    : "status-closed"
            }`}
        >
            {issue.status}
        </span>
</div>
   <p className="issue-description">{issue.description}</p>
        
         {isOwner && (
           <div className="issue-actions">
 <button className="secondary-btn"
  onClick={() => toggleIssueStatus(issue)}
>
  {issue.status === "open"
    ? "Close Issue"
    : "Reopen Issue"}
</button>

<button className="danger-btn"
  onClick={() => {
    if (
      window.confirm(
        "Are you sure you want to delete this issue?"
      )
    ) {
      deleteIssue(issue._id);
    }
  }}
>
  Delete 
</button>
</div>
         )}

 <div className="section-divider"></div>
    </div>
  ))
}

<div className="create-issue-card">
<h2 className="section-title">Create Issue</h2>

<input className="repo-input"
  type="text"
  placeholder="Issue Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
/>


<textarea className="repo-textarea"
  placeholder="Issue Description"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>



<button className="primary-btn" onClick={createIssue}>
 ➕ Create Issue
</button>
</div>

      </div>
      </div>
    </>
  );
};

export default RepositoryDetails;