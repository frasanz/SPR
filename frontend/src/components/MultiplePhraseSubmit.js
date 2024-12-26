import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";
import axios from "axios";

const MultiplePhraseSubmit = () => {
    const [jsonInput, setJsonInput] = useState(""); // For JSON input
    const [error, setError] = useState(""); // To handle JSON parsing errors

    const handleSubmit = async () => {
        try {
            // Validate and parse the JSON
            const parsedJson = JSON.parse(jsonInput);

            // Make an Axios POST request
            const response = await axios.post("/add-multiple-phrases/", parsedJson);

            // Handle success
            console.log("Phrases submitted successfully:", response.data);

            // Clear input
            setJsonInput("");
            setError(""); // Clear any previous errors
        } catch (err) {
            // Handle JSON parsing errors or submission errors
            setError("Invalid JSON. Please check your input.");
            console.error("Error submitting phrases:", err);
        }
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Submit JSON
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Enter JSON"
                    variant="outlined"
                    multiline
                    rows={10}
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    error={!!error}
                    helperText={error}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    disabled={!jsonInput.trim()}
                >
                    Submit JSON
                </Button>
            </Box>
        </Box>
    );
};

export default MultiplePhraseSubmit;