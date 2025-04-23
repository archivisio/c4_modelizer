import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ComponentBlockProps {
  data: {
    name: string;
    description?: string;
    technology?: string;
    onEdit: () => void;
  };
  selected: boolean;
}

const ComponentBlock: React.FC<ComponentBlockProps> = memo(({ data, selected }) => {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: '#e6f7ff',
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
        minWidth: 180,
        maxWidth: 250,
        position: 'relative',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1" fontWeight="bold">
          {data.name}
        </Typography>
        <IconButton size="small" onClick={data.onEdit}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Box>
      
      {data.description && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          {data.description}
        </Typography>
      )}
      
      {data.technology && (
        <Typography variant="body2" sx={{ mt: 0.5, color: 'text.secondary', fontStyle: 'italic' }}>
          [{data.technology}]
        </Typography>
      )}
      
      <Typography variant="caption" sx={{ position: 'absolute', bottom: 4, right: 8 }}>
        Component
      </Typography>
    </Box>
  );
});

export default ComponentBlock;
