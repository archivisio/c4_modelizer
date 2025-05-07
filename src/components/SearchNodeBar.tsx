import { useDialogs } from "@/contexts/DialogContext";
import { COLORS } from "@/data/colors";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useSearch } from "@/hooks/useSearch";
import { Box, TextField, Typography } from "@mui/material";
import { useRef } from "react";

const SearchNodeBar: React.FC = () => {
  const { searchValue, setSearchValue, searchResults } = useSearch();
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
  const { connectionState } = pendingConnection;

  console.log(searchResults);

  return (
    <Box 
      ref={searchBarRef}
      sx={{ 
        position: "absolute", 
        top: connectionState.to?.y, 
        left: connectionState.to?.x, 
        zIndex: 10, 
        backgroundColor: COLORS.primary.background,
        backdropFilter: "blur(8px)", 
        padding: "10px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        border: "1px solid rgba(0,0,0,0.1)"
      }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
        autoFocus
        sx={{ 
          width: "300px",
          '& .MuiOutlinedInput-root': {
            borderRadius: "6px",
            '&.Mui-focused fieldset': {
              borderColor: "primary.main",
              borderWidth: "2px"
            },
          },
          '& .MuiInputLabel-root': {
            fontWeight: "500"
          }
        }}
      />

      <Box>
        {searchResults.map((item) => (
          <Box key={item.id}>
            <Typography variant="body2">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
};

export default SearchNodeBar;
