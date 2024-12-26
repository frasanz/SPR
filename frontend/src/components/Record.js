import React, { useRef, useState, useMemo, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import {
  Box,
  Typography,
  Button,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  duration,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import UploadIcon from "@mui/icons-material/Upload";
import axios from "../utils/axiosConfig";

const Record = () => {
  const waveformRef = useRef(null); // Ref for the waveform container
  const [phrases, setPhrases] = useState([]); // Phrases from the API
  const [loadingPhrases, setLoadingPhrases] = useState(true); // Loading state
  const [waveSurferInstance, setWaveSurferInstance] = useState(null); // WaveSurfer instance
  const [recordPlugin, setRecordPlugin] = useState(null); // Record plugin instance
  const [recording, setRecording] = useState(false); // Recording state
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Fetch phrases from API
  useEffect(() => {
    axios
      .get("http://localhost:8000/api/random-phrase/", { withCredentials: true })
      .then((response) => {
        setPhrases(response.data);
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
    console.log(typeof recordedAudio)
  
   
    try {
    const response = await fetch(recordedAudio); // Fetch the audio file from its URL
        audioBlob = await response.blob(); // Convert to Blob
      } catch (error) {
        console.error("Error fetching audio URL:", error);
        alert("Failed to prepare audio for upload.");
        return;
      }
   
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.wav");
  
    try {
      const response = await axios.post(
        `http://localhost:8000/api/upload-audio/${phrases.id}/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(`Audio uploaded successfully: ${response.data.file_url}`);
    // Fetch a new phrase after successful upload
    setLoadingPhrases(true);
    axios
      .get("http://localhost:8000/api/random-phrase/", { withCredentials: true })
      .then((response) => {
        setPhrases(response.data);
        setLoadingPhrases(false);
        setRecordedAudio(null);
        waveSurferInstance.empty();
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
      const utterance = new SpeechSynthesisUtterance(phrases.text);
      utterance.lang = "es-ES"; // Set the language if needed
      window.speechSynthesis.speak(utterance);
    } else {
      console.error("Text-to-Speech is not supported in this browser.");
    }
  };

return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography variant="h4" gutterBottom>
            Graba tu voz
        </Typography>
        {loadingPhrases ? (
            <CircularProgress />
        ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" gutterBottom>
                    {phrases.text}
                </Typography>
                <IconButton onClick={handleSpeakPhrase} aria-label="speak phrase">
                    <VolumeUpIcon />
                </IconButton>
            </Box>
        )}

        <Box ref={waveformRef} sx={{ border: "1px solid #ddd", margin: "1rem 0", height: "100px", width: "100%" }} />

        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleRecord}
                disabled={playing}
                startIcon={<RecordVoiceOverIcon />}
            >
                {recording ? "Stop Recording" : "Start Recording"}
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handlePlayPause}
                disabled={!recordedAudio || recording}
                startIcon={playing ? <PauseIcon /> : <PlayArrowIcon />}
            >
                {playing ? "Pause Playback" : "Play Recording"}
            </Button>

            <Button
                variant="contained"
                color="primary"
                onClick={handleUploadAudio}
                startIcon={<UploadIcon />}
                disabled={!recordedAudio || recording}
            >
                Upload
            </Button>
        </Box>
    </Box>
);
};

export default Record;








