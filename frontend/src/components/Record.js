import React, { useRef, useState, useMemo, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.esm.js";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
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
          renderRecordedAudio: false,
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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Record Your Voice
      </Typography>

      <Box ref={waveformRef} sx={{ border: "1px solid #ddd", margin: "1rem 0" }} />

      <Button
        variant="contained"
        color="primary"
        onClick={handleRecord}
        disabled={playing}
        sx={{ marginBottom: 2, marginRight: 2 }}
      >
        {recording ? "Stop Recording" : "Start Recording"}
      </Button>
      <Button
          variant="contained"
          color="secondary"
          onClick={handlePlayPause}
          sx = {{ marginBottom: 2 }}
          disabled={!recordedAudio || recording}
        >
          {playing ? "Pause Playback" : "Play Recording"}
        </Button>

      {loadingPhrases ? (
        <CircularProgress />
      ) : (
        <List>
          {phrases.map((phrase) => (
            <ListItem key={phrase.id}>
              <ListItemText primary={phrase.text} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Record;








