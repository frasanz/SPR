import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../utils/axiosConfig";
import { Box, CssBaseline, Drawer, List, ListItemText, ListItemButton, Toolbar, CircularProgress, Typography } from "@mui/material";
import Overview from "./Overview";
import NewPhrase from "./NewPhrase";
import Record from "./Record";
import MultiplePhraseSubmit from "./MultiplePhraseSubmit";
import { Snackbar, Alert } from "@mui/material";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const drawerWidth = 240;

// Main Dashboard Component
const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [phrases, setPhrases] = useState([]);
  const [loadingPhrases, setLoadingPhrases] = useState(true);
  const [newPhrase, setNewPhrase] = useState("");
  const [message, setMessage] = useState("");

  // Fetch phrases when user is authenticated
  useEffect(() => {
    if (user) {
      axios
        .get("/phrases/", { withCredentials: true })
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
    if (newPhrase.trim() === "") {
      handleClick("Please enter a phrase to add.");
      return;
    }
    axios
      .post(
        "http://add-phrase/",
        { text: newPhrase },
        { withCredentials: true }
      )
      .then((response) => {
        setPhrases([response.data, ...phrases]);
        setNewPhrase("");
        handleClick("Phrase added successfully!");
      })
      .catch((error) => {
        handleClick("Failed to add phrase. Please try again.");
      });
  };

  const handleDeletePhrase = (phraseId) => {
    axios
      .delete(`/delete-phrase/${phraseId}/`, {
        withCredentials: true,
      })
      .then(() => {
        setPhrases((prevPhrases) =>
          prevPhrases.filter((phrase) => phrase.id !== phraseId)
        );
        handleClick("Phrase deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting phrase:", error);
        handleClick("Failed to delete phrase. Please try again.");
      });
  };

  const handleUpdatePhrase = async (id, updatedFields) => {
    try {
      const response = await axios.patch(
        `/partial-update-phrase/${id}/`,
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
      handleClick("Phrase updated successfully: "+response.data.text);
      return response.data;
    } catch (error) {
      console.error("Error updating phrase:", error.response?.data || error);
      alert("Failed to update phrase.");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClick = (message) => {
    setMessage(message);
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

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
        <Typography variant="h5" sx={{ p: 2 }}>
           Speech Record          
          </Typography>
        <Box sx={{ overflow: "auto" }}>
          <List>
            <ListItemButton component={Link} to="/dashboard/overview">
              <ListItemText primary="Overview" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/record">
              <ListItemText primary="Record" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/new-phrase">
              <ListItemText primary="List" />
            </ListItemButton>
            <ListItemButton component={Link} to="/dashboard/multiple-phrase-submit">
              <ListItemText primary="Add Multiple Phrases" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 2,
        }}
      >
<Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message={message}
  action={action}
/>
        <Routes>
          <Route path="overview" element={<Overview />} />
          <Route
            path="new-phrase"
            element={
              <NewPhrase
                phrases={phrases}
                loadingPhrases={loadingPhrases}
                newPhrase={newPhrase}
                setPhrases={setPhrases}
                setLoadingPhrases={setLoadingPhrases}
                setNewPhrase={setNewPhrase}
                handleAddPhrase={handleAddPhrase}
                handleDeletePhrase={handleDeletePhrase}
                handleUpdatePhrase={handleUpdatePhrase}
                handleClick={handleClick}
              />
            }
          />
          <Route path="record" element={<Record 
            handleClick={handleClick}  />} />
          <Route path="*" element={<Navigate to="overview" replace />} />
          <Route path="multiple-phrase-submit" element={<MultiplePhraseSubmit />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;

