import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useC4Store } from '../store/c4Store';

interface NavBarProps {
  systemName?: string;
  containerName?: string;
  componentName?: string;
}

const NavBar: React.FC<NavBarProps> = ({ systemName, containerName, componentName }) => {
  const { setViewLevel, model } = useC4Store();
  const { t } = useTranslation();
  
  const handleSystemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewLevel('system');
  };
  
  const handleContainersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId) {
      setViewLevel('container');
    }
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId && model.activeContainerId) {
      setViewLevel('component');
    }
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
        
        {(model.viewLevel === 'container' || model.viewLevel === 'component' || model.viewLevel === 'code') && systemName && (
          <Link
            underline="hover"
            color={model.viewLevel === 'container' ? 'text.primary' : 'inherit'}
            href="#"
            onClick={handleContainersClick}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {systemName} {t('containers')}
          </Link>
        )}
        
        {(model.viewLevel === 'component' || model.viewLevel === 'code') && containerName && (
          <Link
            underline="hover"
            color={model.viewLevel === 'component' ? 'text.primary' : 'inherit'}
            href="#"
            onClick={handleComponentsClick}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            {containerName} {t('components')}
          </Link>
        )}

        {model.viewLevel === 'code' && componentName && (
          <Typography color="text.primary">
            {componentName} {t('code')}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default NavBar;
