import React, { useRef } from 'react';
import { AppBar, IconButton, Toolbar as MuiToolbar, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  onAddSystem: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onAddSystem, onExport, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  return (
    <AppBar position="static" color="primary" elevation={1}>
      <MuiToolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          {t('app_title')}
        </Typography>
        <Tooltip title={t('add_system')}>
          <IconButton color="inherit" onClick={onAddSystem}>
            <AddIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('export_json')}>
          <IconButton color="inherit" onClick={onExport}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t('import_json')}>
          <IconButton color="inherit" component="span" onClick={() => fileInputRef.current?.click()}>
            <UploadFileIcon />
            <input
              type="file"
              accept="application/json"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={onImport}
            />
          </IconButton>
        </Tooltip>
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
