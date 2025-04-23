import EditIcon from '@mui/icons-material/Edit';
import { Box, IconButton, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface ContainerBlockProps {
  data: {
    name: string;
    description?: string;
    technology?: string;
    onEdit: () => void;
  };
  selected: boolean;
}

const ContainerBlock: React.FC<ContainerBlockProps> = memo(({ data, selected }) => {
  return (
    <Box
      sx={{
        padding: 2,
        borderRadius: 1,
        backgroundColor: '#f0f8ff',
        border: selected ? '2px solid #1976d2' : '1px solid #ccc',
        minWidth: 200,
        maxWidth: 300,
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
        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: '#555' }}>
          [<span style={{ color: '#0d47a1' }}>{data.technology}</span>]
        </Typography>
      )}
      
      <Typography variant="caption" sx={{ position: 'absolute', bottom: 4, right: 8 }}>
        Container
      </Typography>
    </Box>
  );
});

export default ContainerBlock;
