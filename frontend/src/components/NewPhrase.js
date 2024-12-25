import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";

const NewPhrase = ({
  phrases,
  loadingPhrases,
  newPhrase,
  setNewPhrase,
  handleAddPhrase,
  handleDeletePhrase,
}) => {
  const [filter, setFilter] = useState("all"); // State for filtering
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const phrasesPerPage = 5; // Number of phrases per page

  const filteredPhrases = phrases.filter((phrase) => {
    if (filter === "done") return phrase.done;
    if (filter === "notDone") return !phrase.done;
    return true;
  });

  const totalPages = Math.ceil(filteredPhrases.length / phrasesPerPage);
  const indexOfLastPhrase = currentPage * phrasesPerPage;
  const indexOfFirstPhrase = indexOfLastPhrase - phrasesPerPage;
  const currentPhrases = filteredPhrases.slice(
    indexOfFirstPhrase,
    indexOfLastPhrase
  );

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1); // Reset to the first page
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      <Typography variant="h5" sx={{ mt: 4 }}>
        Add a New Phrase
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField
          label="Enter a new phrase"
          variant="outlined"
          fullWidth
          value={newPhrase}
          onChange={(e) => setNewPhrase(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddPhrase}>
          Add
        </Button>
      </Box>

      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>Filter:</Typography>
        <Select value={filter} onChange={handleFilterChange}>
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="done">Done</MenuItem>
          <MenuItem value="notDone">Not Done</MenuItem>
        </Select>
      </Box>

      <Typography variant="h5">Your Phrases</Typography>
      {loadingPhrases ? (
        <CircularProgress />
      ) : currentPhrases.length > 0 ? (
        <List>
          {currentPhrases.map((phrase) => (
            <React.Fragment key={phrase.id}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {phrase.done ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <CancelIcon color="error" />
                    )}
                    <DeleteIcon
                      color="error"
                      sx={{ cursor: "pointer" }}
                      onClick={() => handleDeletePhrase(phrase.id)}
                    />
                  </Box>
                }
              >
                <ListItemText
                  primary={phrase.text}
                  sx={{
                    color: phrase.done ? "black" : "grey",
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      ) : (
        <Typography>No phrases found.</Typography>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          disabled={currentPage === 1}
          onClick={handlePreviousPage}
        >
          Previous
        </Button>
        <Typography>
          Page {currentPage} of {totalPages}
        </Typography>
        <Button
          variant="contained"
          disabled={currentPage === totalPages}
          onClick={handleNextPage}
        >
          Next
        </Button>
      </Box>
    </>
  );
};

export default NewPhrase;
