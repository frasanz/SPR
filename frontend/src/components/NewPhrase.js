import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../AuthContext";
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
    Checkbox,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DeleteIcon from "@mui/icons-material/Delete";
import MicExternalOffIcon from '@mui/icons-material/MicExternalOff';
import axios from "axios";


const NewPhrase = ({
    phrases,
    loadingPhrases,
    setPhrases,
    setLoadingPhrases,
    newPhrase,
    setNewPhrase,
    handleAddPhrase,
    handleDeletePhrase,
    handleUpdatePhrase,
    handleClick,
}) => {
    const [filter, setFilter] = useState("all"); // State for filtering
    const [currentPage, setCurrentPage] = useState(1); // Current page
    const { user, loading } = useContext(AuthContext);
    const phrasesPerPage = 5; // Number of phrases per page

    const filteredPhrases = phrases.filter((phrase) => {
        if (filter === "done") return phrase.done;
        if (filter === "notDone") return !phrase.done;
        if (filter === "validated") return phrase.is_valid;
        if (filter === "notValidated") return !phrase.is_valid;
        return true;
    });

    const totalPages = Math.ceil(filteredPhrases.length / phrasesPerPage);
    const indexOfLastPhrase = currentPage * phrasesPerPage;
    const indexOfFirstPhrase = indexOfLastPhrase - phrasesPerPage;
    const currentPhrases = filteredPhrases.slice(
        indexOfFirstPhrase,
        indexOfLastPhrase
    );

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
             <Typography variant="h4" gutterBottom>
                    List of Phrases
                  </Typography>
           

            <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
                <Typography>Filter:</Typography>
                <Select value={filter} onChange={handleFilterChange}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="done">Done</MenuItem>
                    <MenuItem value="notDone">Not Done</MenuItem>
                    <MenuItem value="validated">Validated</MenuItem>
                    <MenuItem value="notValidated">Not Validated</MenuItem>
                </Select>
            </Box>
            {loadingPhrases ? (
                <CircularProgress />
            ) : currentPhrases.length > 0 ? (
                <List>
                    {currentPhrases.map((phrase) => (
                        <React.Fragment key={phrase.id}>
                            <ListItem sx={{ paddingTop: 2, paddingBottom: 2 }}
                                secondaryAction={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {phrase.done && (
                                            <audio controls sx={{ marginTop: 2 }}>
                                                <source src={phrase.audio_url} type="audio/mpeg" />
                                                Your browser does not support the audio element.
                                            </audio>
                                        )}
                                        <Checkbox
                                            checked={phrase.is_valid}
                                            onChange={() => handleUpdatePhrase(phrase.id, { is_valid: !phrase.is_valid })}
                                            sx={{ cursor: phrase.done ? "pointer" : "not-allowed"  }}
                                            icon={<RemoveDoneIcon />}
                                            checkedIcon={<CheckCircleIcon />}
                                            title={phrase.is_valid ? "Mark as not validated" : "Mark as validated"}
                                            disabled = {!phrase.done}
                                            
                                        />
                                        <MicExternalOffIcon
                                            color={phrase.done ? "error" : "disabled"}
                                            sx={{ cursor: phrase.done ? "pointer" : "not-allowed"  }}
                                            onClick={ phrase.done ? () => handleUpdatePhrase(phrase.id, { done: !phrase.done , is_valid: false }) : undefined}
                                            title = {phrase.done ? "Delete audio" : "Phrase not done"}
                                            disabled = {phrase.done}
                                        />
                                        

                                        <DeleteIcon
                                            color="error"
                                            sx={{ cursor: "pointer" }}
                                            onClick={() => handleDeletePhrase(phrase.id)}
                                            title="Delete phrase"
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
            <Typography variant="h5" sx={{mt: 3}}>
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
        </>
    );
};

export default NewPhrase;
