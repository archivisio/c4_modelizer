import CodeIcon from '@mui/icons-material/Code';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CodeBlockProps {
  data: {
    name: string;
    description?: string;
    codeType: 'class' | 'function' | 'interface' | 'variable' | 'other';
    language?: string;
    code?: string;
    onEdit: () => void;
  };
  selected: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = memo(({ data, selected }) => {
  // Helper to get the right background color based on the code type
  const getBackgroundColor = () => {
    switch (data.codeType) {
      case 'class':
        return '#e3f2fd'; // Light blue
      case 'function':
        return '#e8f5e9'; // Light green
      case 'interface':
        return '#fff8e1'; // Light amber
      case 'variable':
        return '#f3e5f5'; // Light purple
      default:
        return '#fafafa'; // Light grey
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: getBackgroundColor(),
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
        minWidth: 160,
        maxWidth: 240,
        position: 'relative',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      
      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {data.name}
          </Typography>
          <Chip 
            icon={<CodeIcon fontSize="small" />} 
            label={data.codeType} 
            size="small" 
            variant="outlined"
            sx={{ mt: 0.5, mb: 0.5 }}
          />
          {data.language && (
            <Chip 
              label={data.language} 
              size="small" 
              variant="outlined"
              sx={{ ml: 0.5, mt: 0.5, mb: 0.5 }}
            />
          )}
        </Box>
        <IconButton size="small" onClick={data.onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {data.description && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data.description}
        </Typography>
      )}
      
      {data.code && (
        <Box 
          sx={{ 
            mt: 1, 
            p: 1, 
            backgroundColor: 'rgba(0,0,0,0.04)', 
            borderRadius: 1,
            fontSize: '0.75rem',
            fontFamily: 'monospace',
            overflowX: 'auto',
            maxHeight: '60px',
            overflowY: 'auto'
          }}
        >
          {data.code}
        </Box>
      )}
      
      <Typography variant="caption" sx={{ position: 'absolute', bottom: 4, right: 8 }}>
        Code
      </Typography>
    </Box>
  );
});

export default CodeBlock;
