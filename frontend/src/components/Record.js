import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import axios from "../utils/axiosConfig";

const Record = () => {
  const [phrases, setPhrases] = useState([]);
  const [loadingPhrases, setLoadingPhrases] = useState(true);
  const [currentPhrase, setCurrentPhrase] = useState(null);
  const [recording, setRecording] = useState(false);

  // Fetch phrases when the component loads
  useEffect(() => {
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
  }, []);

  // Start recording for the selected phrase
  const handleRecordStart = (phrase) => {
    setCurrentPhrase(phrase);
    setRecording(true);
    console.log(`Started recording for phrase: ${phrase.text}`);
    // Add recording logic here (e.g., integrate with Web Audio API)
  };

  // Stop recording
  const handleRecordStop = () => {
    setRecording(false);
    console.log(`Stopped recording for phrase: ${currentPhrase.text}`);
    // Add logic to save the recorded audio
    setCurrentPhrase(null);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Record Your Voice
      </Typography>

      {loadingPhrases ? (
        <CircularProgress />
      ) : phrases.length > 0 ? (
        <List>
          {phrases.map((phrase) => (
            <ListItem
              key={phrase.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ListItemText
                primary={phrase.text}
                sx={{
                  color: phrase.done ? "black" : "grey",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                disabled={recording && currentPhrase?.id !== phrase.id}
                onClick={() =>
                  recording && currentPhrase?.id === phrase.id
                    ? handleRecordStop()
                    : handleRecordStart(phrase)
                }
              >
                {recording && currentPhrase?.id === phrase.id
                  ? "Stop Recording"
                  : "Start Recording"}
              </Button>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No phrases available for recording.</Typography>
      )}
    </Box>
  );
};

export default Record;
