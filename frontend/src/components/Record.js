import React, { useRef, useState, useMemo, useEffect, use } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import {
  Box,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  Paper,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "../utils/axiosConfig";


const Record = ({
  handleClick,
}) => {
  const waveformRef = useRef(null); // Ref for the waveform container
  const [phrases, setPhrases] = useState({}); // Phrases from the API
  const phrasesRef = useRef(phrases); // Ref for phrases
  const [totalPhrases, setTotalPhrases] = useState(0); // Total phrases
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0); // Current phrase index
  const [loadingPhrases, setLoadingPhrases] = useState(true); // Loading state
  const [waveSurferInstance, setWaveSurferInstance] = useState(null); // WaveSurfer instance
  const [recordPlugin, setRecordPlugin] = useState(null); // Record plugin instance
  const [recording, setRecording] = useState(false); // Recording state
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [playing, setPlaying] = useState(false);



  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);
  // Fetch phrases from API
  useEffect(() => {
    axios
      .get("/random-phrase/", { withCredentials: true })
      .then((response) => {
        console.log("Response:", response.data.phrase);
        setPhrases(response.data.phrase);
        setCurrentPhraseIndex(response.data.done_phrases+1);
        setTotalPhrases(response.data.total_phrases);
        setLoadingPhrases(false);

        console.log("Phrases:", response.data);
      })
      .catch((error) => {
        console.error("Error fetching random phrase:", error);
        setLoadingPhrases(false);
        
      });
  }, []);

  // Initialize WaveSurfer
  useEffect(() => {
    if (waveformRef.current) {
      console.log("Initializing WaveSurfer...");
      const waveSurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff006c",
        height: 100,
      });

      const record = waveSurfer.registerPlugin(
        RecordPlugin.create({
          renderRecordedAudio: true,
          scrollingWaveform: false,
          continuousWaveform: true,
        })
      );

      // Handle recording end
      record.on("record-end", (blob) => {
        const recordedUrl = URL.createObjectURL(blob);
        setRecordedAudio(recordedUrl);
        waveSurfer.load(recordedUrl);
        
        console.log("Recorded audio:", recordedUrl);
        // You can save or play the recorded audio using the recordedUrl
      });

      waveSurfer.on("finish", () => {
        console.log("Playback finished.");
        setPlaying(false); // Set playing to false when playback finishes
      });

      setWaveSurferInstance(waveSurfer);
      setRecordPlugin(record);

      return () => {
        console.log("Destroying WaveSurfer instance...");
        waveSurfer.destroy();
      };
    }
  }, [waveformRef]);

  // Start or stop recording
  const handleRecord = () => {
    if (!recordPlugin) {
      console.error("Record plugin is not available.");
      return;
    }

    if (recording) {
      recordPlugin.stopRecording();
      waveSurferInstance.stop();
      setRecording(false);
    } else {
      RecordPlugin.getAvailableAudioDevices()
        .then((devices) => {
          const deviceId = devices[0]?.deviceId;
          recordPlugin.startRecording({ deviceId }).then(() => {
            console.log("Recording started");
            setRecording(true);
          });
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  };

  const handlePlayPause = () => {
    if (!waveSurferInstance || !recordedAudio) return;
    if (playing) {
      waveSurferInstance.pause();
    } else {
        
      waveSurferInstance.play();
    }
    setPlaying(!playing);
  };

 const handleUploadAudio = async () => {
  if (!recordedAudio) {
    alert("No audio to upload!");
    return;
  }

  let audioBlob;
  try {
    console.log("Fetching recorded audio URL...");
    const response = await fetch(recordedAudio); // Fetch the audio file from its URL
    audioBlob = await response.blob(); // Convert to Blob
    console.log("Audio blob prepared:", audioBlob);
  } catch (error) {
    console.error("Error fetching audio URL or converting to Blob:", error);
    alert("Failed to prepare audio for upload.");
    return;
  }

  const formData = new FormData();
  formData.append("audio", audioBlob, "recording.wav");

  try {
    console.log("Uploading audio...");
    const response = await axios.post(
      `/upload-audio/${phrases.id}/`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("Audio uploaded successfully:", response.data);
    handleClick("Audio subido correctamente");

    // Fetch a new phrase after successful upload
    setLoadingPhrases(true);
    console.log("Fetching a new phrase...");
    axios
      .get("/random-phrase/", { withCredentials: true })
      .then((response) => {
        console.log("New phrase received:", response.data.phrase);
        setPhrases(response.data.phrase);
        setCurrentPhraseIndex(response.data.done_phrases + 1);
        setTotalPhrases(response.data.total_phrases);
        setLoadingPhrases(false);
        setRecordedAudio(null);
        waveSurferInstance.empty(); // Reset WaveSurfer instance
      })
      .catch((error) => {
        console.error("Error fetching random phrase:", error);
        setLoadingPhrases(false);
      });
  } catch (error) {
    console.error("Error uploading audio:", error);
    alert("Failed to upload audio.");
  }
}; 

  const handleSpeakPhrase = () => {
    if ("speechSynthesis" in window) {
      console.log("Speaking phrase:", phrasesRef.current.text);
      const utterance = new SpeechSynthesisUtterance(phrasesRef.current.text);
      utterance.lang = "es-ES"; // Set the language if needed
      utterance.rate = 0.50; // Adjust the rate to slow down the speech
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech is not supported in this browser.");
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      console.log("Key pressed:", event.key);
  
      if (event.key === "e") {
        console.log("Speaking phrase...");
        handleSpeakPhrase();
      }
  
      if (event.key === " ") { // Space key for recording
        event.preventDefault(); // Prevent default behavior (e.g., page scrolling)
        console.log("Toggling recording...");
        handleRecord();
      }
  
      if (event.key === "p") { // "p" key for play/pause
        console.log("Toggling play/pause...");
        handlePlayPause();
      }
  
      if (event.key === "u") { // "u" key for upload
        console.log("Uploading audio...");
        handleUploadAudio();
      }
    };
  
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [handleSpeakPhrase, handleRecord, handlePlayPause, handleUploadAudio]);

  return (
    <Box
      sx={{
        textAlign: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#4a4a4a", mb: 2 }}
      >
        🎤 Graba tu voz
      </Typography>

      {/* Progress bar and count */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ color: "#6a6a6a", mb: 1 }}>
          Frases completadas:
        </Typography>
        <LinearProgress
          variant="determinate"
          value={(currentPhraseIndex / totalPhrases) * 100}
          sx={{
            width: "50%",
            margin: "auto",
            height: "10px",
            borderRadius: "5px",
          }}
        />
        <Typography variant="body2" sx={{ mt: 1, color: "#4a4a4a" }}>
          {currentPhraseIndex} / {totalPhrases}
        </Typography>
      </Box>

      {/* Current phrase */}
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: "20px",
          marginBottom: "20px",
          maxWidth: "600px",
          margin: "auto",
          borderRadius: "10px",
          mb: 4,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1.5rem", mb: 2 }}>
          {phrases.text}
        </Typography>
        <IconButton onClick={handleSpeakPhrase} aria-label="speak phrase">
          <VolumeUpIcon fontSize="large" />
        </IconButton>
      </Paper>
      <Box ref={waveformRef} sx={{ border: "1px solid #ddd", margin: "1rem 0", height: "100px", width: "100%" }} />

      {/* Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        {/* Record Button */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRecord}
          disabled={playing} // Disabled if playing
          startIcon={<RecordVoiceOverIcon />}
        >
          {recording ? "STOP RECORDING" : "START RECORDING"}
        </Button>

        {/* Play Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handlePlayPause}
          disabled={!recordedAudio || recording} // Disabled if not recording
          startIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
        >
          {playing ? "PAUSE RECORDING" : "PLAY RECORDING"}
        </Button>

        {/* Upload Button */}
        <Button
          variant="contained"
          color="primary"
          onClick={handleUploadAudio}
          disabled={!recordedAudio || recording} // Disabled if no recording is done
          startIcon={<UploadIcon />}
        >
          UPLOAD
        </Button>
      </Box>
      <Box>
        <Typography variant="body1" sx={{ mt: 2, color: "#4a4a4a" }}>
          E: Escuchar la frase.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "#4a4a4a" }}>
          Espacio: Iniciar y parar la grabación.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "#4a4a4a" }}>
          P: Reproducir la grabación.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "#4a4a4a" }}>
          U: Subir la grabación al servidor y pasar a la siguiente frase.
        </Typography>
      </Box>
    </Box>
  );
};

export default Record;








