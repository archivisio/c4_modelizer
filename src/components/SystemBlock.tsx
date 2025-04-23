import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent, IconButton, Typography } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';

export type SystemBlockData = {
  name: string;
  description?: string;
  onEdit: () => void;
};

export default function SystemBlock({ data }: NodeProps<SystemBlockData>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Card sx={{ minWidth: 180, boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ position: 'relative', pb: '16px!important' }}>
          <Typography variant="h6" gutterBottom>
            {data.name}
            <IconButton size="small" onClick={data.onEdit} sx={{ float: 'right' }}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Typography>
          {data.description && (
            <Typography variant="body2" color="text.secondary">
              {data.description}
            </Typography>
          )}
        </CardContent>
      </Card>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
