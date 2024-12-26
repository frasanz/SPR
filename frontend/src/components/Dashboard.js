import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { Box, CssBaseline, Drawer, List, ListItemText, ListItemButton, Toolbar, CircularProgress } from "@mui/material";
import Overview from "./Overview";
import NewPhrase from "./NewPhrase";
import Record from "./Record";

const drawerWidth = 240;

// Main Dashboard Component
const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [phrases, setPhrases] = useState([]);
  const [loadingPhrases, setLoadingPhrases] = useState(true);
  const [newPhrase, setNewPhrase] = useState("");

  // Fetch phrases when user is authenticated
  useEffect(() => {
    if (user) {
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
    if (newPhrase.trim() === "") return alert("Please enter a valid phrase!");
    axios
      .post(
        "http://localhost:8000/api/add-phrase/",
        { text: newPhrase },
        { withCredentials: true }
      )
      .then((response) => {
        setPhrases([response.data, ...phrases]);
        setNewPhrase("");
      })
      .catch((error) => {
        console.error("Error adding phrase:", error);
      });
  };

  const handleDeletePhrase = (phraseId) => {
    axios
      .delete(`http://localhost:8000/api/delete-phrase/${phraseId}/`, {
        withCredentials: true,
      })
      .then(() => {
        setPhrases((prevPhrases) =>
          prevPhrases.filter((phrase) => phrase.id !== phraseId)
        );
      })
      .catch((error) => {
        console.error("Error deleting phrase:", error);
      });
  };

  const handleUpdatePhrase = async (id, updatedFields) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/partial-update-phrase/${id}/`,
        updatedFields, // Only send the fields to update
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Include cookies if required
        }
      );
      console.log("Phrase updated successfully:", response.data);
      setPhrases((prevPhrases) =>
        prevPhrases.map((phrase) =>
            phrase.id === id ? { ...phrase, ...response.data } : phrase
        )
    );
      return response.data;
    } catch (error) {
      console.error("Error updating phrase:", error.response?.data || error);
      alert("Failed to update phrase.");
    }
  };

  if (loading) return <CircularProgress />;
  if (!user) return <Navigate to="/" />;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton component={Link} to="/dashboard/overview">
              <ListItemText primary="Overview" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/new-phrase">
              <ListItemText primary="New Phrase" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/record">
              <ListItemText primary="Record" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route
            path="new-phrase"
            element={
              <NewPhrase
                phrases={phrases}
                loadingPhrases={loadingPhrases}
                newPhrase={newPhrase}
                setNewPhrase={setNewPhrase}
                handleAddPhrase={handleAddPhrase}
                handleDeletePhrase={handleDeletePhrase}
                handleUpdatePhrase={handleUpdatePhrase}
              />
            }
          />
          <Route path="record" element={<Record />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;

