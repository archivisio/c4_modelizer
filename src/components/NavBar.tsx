import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useC4Store } from '../store/c4Store';

interface NavBarProps {
  systemName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ systemName }) => {
  const { setViewLevel, model } = useC4Store();
  const { t } = useTranslation();
  
  const handleSystemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewLevel('system');
  };
  
  return (
    <Box sx={{ p: 1, bgcolor: '#f5f5f5' }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link
          underline="hover"
          color={model.viewLevel === 'system' ? 'text.primary' : 'inherit'}
          href="#"
          onClick={handleSystemsClick}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          {t('systems')}
        </Link>
        
        {model.viewLevel === 'container' && systemName && (
          <Typography color="text.primary">
            {systemName} {t('containers')}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default NavBar;
