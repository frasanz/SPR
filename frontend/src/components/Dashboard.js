// src/components/Dashboard.js
import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate } from "react-router-dom";
import axios from '../utils/axiosConfig';
const Dashboard = () => {
  const { user, loading } = useContext(AuthContext); // Access user and loading from context
  const [phrases, setPhrases] = useState([]); // State for phrases
  const [loadingPhrases, setLoadingPhrases] = useState(true); // Loading state for phrases
  const [newPhrase, setNewPhrase] = useState(""); // State for new phrase input


  useEffect(() => {
    if (user) {
      // Fetch phrases only if the user is authenticated
      axios
        .get("http://localhost:8000/api/phrases/", { withCredentials: true })
        .then((response) => {
          setPhrases(response.data);
          setLoadingPhrases(false);
        })
        .catch((error) => {
          console.error("Error fetching phrases:", error);
          setLoadingPhrases(false);
        });
    }
  }, [user]);

  const handleAddPhrase = () => {
    // Add your logic to add a new phrase
    if (newPhrase.trim() === "")
        return alert("Please enter a valid phrase!");
    axios
        .post(
            "http://localhost:8000/api/add-phrase/",
            { text: newPhrase },
            { withCredentials: true }
        )
        .then((response) => {
            setPhrases([...phrases, response.data]);
            setNewPhrase("");
        })
        .catch((error) => {
            console.error("Error adding phrase:", error);
        });
  };

  if (loading) return <p>Loading user info...</p>;
  if (!user) return <Navigate to="/" />;

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>First Name: {user.first_name}</p>
      <p>Last Name: {user.last_name}</p>

      <h2>Your Phrases</h2>
      {loadingPhrases ? (
        <p>Loading phrases...</p>
      ) : phrases.length > 0 ? (
        <ul>
          {phrases.map((phrase) => (
            <li key={phrase.id}>{phrase.text}</li> // Adjust `phrase.text` based on your API response
          ))}
        </ul>
      ) : (
        <p>You have no phrases yet.</p>
      )}
      <h3>Add a New Phrase</h3>
      <div>
        <input
          type="text"
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
          placeholder="Enter a new phrase"
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <button
          onClick={handleAddPhrase}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
        >
          Add Phrase
        </button>
      </div>
    </div>
  );
};

export default Dashboard;


