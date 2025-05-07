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
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        border: `1px solid ${COLORS.primary.border}`,
        width: "350px",
        maxHeight: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}>
      <TextField
        label="Search"
        variant="outlined"
        value={searchValue}
        onChange={handleSearchChange}
        autoFocus
        placeholder="Search nodes..."
        sx={{ 
          width: "100%",
          '& .MuiOutlinedInput-root': {
            borderRadius: "6px",
            color: COLORS.primary.border,
            '&.Mui-focused fieldset': {
              borderColor: COLORS.primary.border,
              borderWidth: "2px"
            },
            '& input': {
              color: COLORS.primary.border
            }
          },
          '& .MuiInputLabel-root': {
            color: COLORS.primary.border,
            fontWeight: "500"
          }
        }}
      />

      {searchResults.length > 0 && (
        <Box
          sx={{
            mt: 1,
            overflowY: "auto",
            maxHeight: "300px",
            '&::-webkit-scrollbar': {
              width: '6px',
              borderRadius: '3px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: COLORS.primary.background
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: COLORS.primary.hover,
              borderRadius: '3px'
            }
          }}
        >
          {searchResults.map((item) => (
            <Box 
              key={item.id}
              sx={{
                py: 1.5,
                px: 2,
                borderRadius: "4px",
                cursor: "pointer",
                transition: "all 0.2s ease",
                '&:hover': {
                  backgroundColor: COLORS.primary.hover,
                },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5
              }}
            >
              <Typography 
                variant="body2"
                sx={{ 
                  color: COLORS.primary.border,
                  fontWeight: "500"
                }}
              >
                {item.name}
              </Typography>
              {item.type && (
                <Typography 
                  variant="caption"
                  sx={{ 
                    color: COLORS.secondary.border,
                    backgroundColor: COLORS.secondary.background,
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                    fontSize: "0.7rem"
                  }}
                >
                  {item.type}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}
      
      {searchResults.length === 0 && searchValue.length > 0 && (
        <Box
          sx={{
            py: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 1
          }}
        >
          <Typography 
            variant="body2"
            sx={{ color: COLORS.secondary.border }}
          >
            No results found
          </Typography>
        </Box>
      )}
    </Box>
  )
};

export default SearchNodeBar;
