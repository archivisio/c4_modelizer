import { useDialogs } from "@/contexts/DialogContext";
import { Box, TextField } from "@mui/material";
import { useState } from "react";

const SearchNodeBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { pendingConnection } = useDialogs();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  if (!pendingConnection) return null;
  const { event, connectionState } = pendingConnection;

  console.log(event, connectionState);

  return (
    <Box sx={{ position: "absolute", top: connectionState.to?.y, left: connectionState.to?.x, zIndex: 1, backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
      />
    </Box>
  )
};

export default SearchNodeBar;
