import React from "react";
import { Typography, Box } from "@mui/material";

const Overview = () => {
  return (
    <Box sx={{  }}>
      <Typography variant="h4" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="body1">
        Welcome to your dashboard! Here’s what you can do:
      </Typography>
      <Box sx={{ mt: 2 }}>
        <ul>
          <li>
            <Typography variant="body1">
              View and manage your phrases in the <strong>New Phrase</strong> section.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Record your voice for specific phrases in the <strong>Record</strong> section.
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              Use the filters and pagination to customize your experience.
            </Typography>
          </li>
        </ul>
      </Box>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This dashboard is designed to help you efficiently manage your tasks and track your progress. Explore the options in the menu to get started!
      </Typography>
    </Box>
  );
};

export default Overview;
