
import React, { useState } from "react";
// import axios from "axios";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
//css
import "./CreateRepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();

  const [repoData, setRepoData] = useState({
    name: "",
    description: "",
    visibility: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRepoData({
      ...repoData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
    const owner = localStorage.getItem("userId");
    //  const token = localStorage.getItem("token");

      const response = await api.post(   //replace  await axios.post with  await api.post
        "http://localhost:3002/repo/create",
        {
          owner,
          name: repoData.name,
          description: repoData.description,
          visibility: repoData.visibility,
          content: [],
          issues: [],
        },
  //       {
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   }
  // }
      );

      alert("Repository Created Successfully");

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create repository");
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-page">

    <div className="create-repo-card">

      
        <h2 className="create-title"> 📦Create  New Repository</h2>
        <p className="create-subtitle">
            Create a repository to manage your project files,
            commits and issues.
        </p>

        <form  className="create-form" onSubmit={handleSubmit}>
          <label className="form-label">Repository Name</label>

          <input className="form-input"
            type="text"
            name="name"
            value={repoData.name}
            onChange={handleChange}
            required
          />

          <label className="form-label">Description</label>

          <textarea className="form-textarea"
            name="description"
            value={repoData.description}
            onChange={handleChange}
          />

          <label className="form-label">Visibility</label>

          <select className="form-select"
            value={repoData.visibility}
            onChange={(e) =>
              setRepoData({
                ...repoData,
                visibility: e.target.value === "true",
              })
            }
          >
            <option value="true">🌍Public</option>
            <option value="false">🔒Private</option>
          </select>

          <button  className="create-btn"type="submit">
            Create Repository
          </button>
        </form>
      </div>
       </div>

  
    </>
  );
};

export default CreateRepository;