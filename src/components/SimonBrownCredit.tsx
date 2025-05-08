import { Tooltip, Typography } from "@mui/material";
import React from "react";

const SimonBrownCredit: React.FC = () => {
  return (
    <Tooltip title="Inspired by Simon Brown's C4 Model - Thank you for revolutionizing software architecture visualization!">
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          bottom: 8,
          right: 16,
          opacity: 0.6,
          fontSize: "0.7rem",
          cursor: "help"
        }}
      >
        C4 Model © Simon Brown
      </Typography>
    </Tooltip>
  );
};

export default SimonBrownCredit;
