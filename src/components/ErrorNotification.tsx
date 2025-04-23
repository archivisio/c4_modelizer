import { Box } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorNotificationProps {
  message: string | null;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <Box sx={{ position: 'absolute', bottom: 16, left: 16, bgcolor: 'error.main', color: 'white', p: 2, borderRadius: 1 }}>
      {t(message)}
    </Box>
  );
};

export default ErrorNotification;
