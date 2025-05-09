import { Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/system";
import React from "react";

const CreditText = styled(Typography)(() => ({
  position: "absolute",
  bottom: 8,
  right: 16,
  opacity: 0.6,
  fontSize: "0.7rem",
  cursor: "help"
}));

const SimonBrownCredit: React.FC = () => {
  return (
    <Tooltip title="Inspired by Simon Brown's C4 Model - Thank you for revolutionizing software architecture visualization!">
      <CreditText variant="caption">
        C4 Model © Simon Brown
      </CreditText>
    </Tooltip>
  );
};

export default SimonBrownCredit;
