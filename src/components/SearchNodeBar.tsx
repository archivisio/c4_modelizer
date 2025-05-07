import { useDialogs } from "@/contexts/DialogContext";
import { Box, TextField } from "@mui/material";
import { useState, useRef } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

const SearchNodeBar: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const { pendingConnection, setPendingConnection } = useDialogs();
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useOnClickOutside(searchBarRef, () => {
    if (pendingConnection) {
      setPendingConnection(null);
    }
  });

  if (!pendingConnection) return null;
  const { event, connectionState } = pendingConnection;
  console.log(event, connectionState);

  return (
    <Box 
      ref={searchBarRef}
      sx={{ position: "absolute", top: connectionState.to?.y, left: connectionState.to?.x, zIndex: 1, backgroundColor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)" }}>
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
