import EditIcon from '@mui/icons-material/Edit';
import { Box, Card, CardContent, Chip, IconButton, SxProps, Theme, Typography } from '@mui/material';
import { Handle, Position } from '@xyflow/react';
import { getTechnologyById } from '../../data/technologies';
import TechnologyIcon from '../TechnologyIcon';

// Types pour les positions des connecteurs
export type HandlePositions = {
  source: Position | Position[]; // Une position unique ou un tableau de positions pour les sorties
  target: Position | Position[]; // Une position unique ou un tableau de positions pour les entrées
};

// Props communes à tous les blocs C4
export interface C4BlockProps {
  name: string;
  description?: string;
  technology?: string;
  selected?: boolean;
  type: 'system' | 'container' | 'component' | 'code';
  codeType?: 'class' | 'function' | 'interface' | 'variable' | 'other';
  code?: string;
  onEdit: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary';
  handlePositions?: HandlePositions;
  additionalContent?: React.ReactNode;
}

// Constantes pour les couleurs et styles
const COLORS = {
  primary: {
    background: 'rgba(227, 242, 253, 0.7)',
    gradient: 'linear-gradient(135deg, rgba(187, 222, 251, 0.7) 0%, rgba(227, 242, 253, 0.7) 100%)',
    gradientHover: 'linear-gradient(135deg, rgba(187, 222, 251, 1) 0%, rgba(227, 242, 253, 1) 100%)',
    border: '#2196f3',
    hover: '#90caf9'
  },
  secondary: {
    background: 'rgba(232, 245, 233, 0.7)',
    gradient: 'linear-gradient(135deg, rgba(200, 230, 201, 0.7) 0%, rgba(232, 245, 233, 0.7) 100%)',
    gradientHover: 'linear-gradient(135deg, rgba(200, 230, 201, 1) 0%, rgba(232, 245, 233, 1) 100%)',
    border: '#4caf50',
    hover: '#a5d6a7'
  },
  tertiary: {
    background: 'rgba(255, 248, 225, 0.7)',
    gradient: 'linear-gradient(135deg, rgba(255, 236, 179, 0.7) 0%, rgba(255, 248, 225, 0.7) 100%)',
    gradientHover: 'linear-gradient(135deg, rgba(255, 236, 179, 1) 0%, rgba(255, 248, 225, 1) 100%)',
    border: '#ffc107',
    hover: '#ffe082'
  },
  quaternary: {
    background: 'rgba(243, 229, 245, 0.7)',
    gradient: 'linear-gradient(135deg, rgba(225, 190, 231, 0.7) 0%, rgba(243, 229, 245, 0.7) 100%)',
    gradientHover: 'linear-gradient(135deg, rgba(225, 190, 231, 1) 0%, rgba(243, 229, 245, 1) 100%)',
    border: '#9c27b0',
    hover: '#ce93d8'
  }
};

// Map des types de blocs aux variantes de couleurs par défaut
const TYPE_TO_VARIANT: Record<string, 'primary' | 'secondary' | 'tertiary' | 'quaternary'> = {
  system: 'primary',
  container: 'secondary',
  component: 'tertiary',
  code: 'quaternary',
  class: 'quaternary',
  function: 'secondary',
  interface: 'tertiary',
  variable: 'primary',
  other: 'quaternary'
};

// Fonction utilitaire pour convertir une couleur hex en RGB
const hexToRgb = (hex: string): string => {
  // Supprimer le # si présent
  const cleanHex = hex.startsWith('#') ? hex.slice(1) : hex;
  
  // Convertir en RGB
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  
  return `${r}, ${g}, ${b}`;
};

// Composant de bloc C4 réutilisable
const C4Block: React.FC<C4BlockProps> = ({
  name,
  description,
  technology,
  selected = false,
  type,
  codeType,
  code,
  onEdit,
  variant,
  handlePositions = { source: Position.Bottom, target: Position.Top },
  additionalContent
}) => {
  // Récupérer la technologie et sa couleur si disponible
  const techData = technology ? getTechnologyById(technology) : undefined;
  
  // Déterminer la variante de couleur à utiliser (priorité à la technologie)
  const colorVariant = variant || TYPE_TO_VARIANT[codeType || type] || 'primary';
  const defaultColors = COLORS[colorVariant];
  
  // Créer les couleurs personnalisées si une technologie est présente
  const colors = techData ? {
    background: `rgba(${hexToRgb(techData.color)}, 0.1)`,
    gradient: `linear-gradient(135deg, rgba(${hexToRgb(techData.color)}, 0.15) 0%, rgba(${hexToRgb(techData.color)}, 0.05) 100%)`,
    gradientHover: `linear-gradient(135deg, rgba(${hexToRgb(techData.color)}, 0.6) 0%, rgba(${hexToRgb(techData.color)}, 0.4) 100%)`,
    border: techData.color,
    hover: techData.color
  } : defaultColors;
  
  // Styles pour la carte
  const cardStyle: SxProps<Theme> = {
    minWidth: type === 'system' ? 220 : type === 'container' ? 200 : type === 'component' ? 180 : 160,
    maxWidth: type === 'system' ? 350 : type === 'container' ? 300 : type === 'component' ? 250 : 240,
    borderRadius: 2,
    transition: 'all 0.3s ease',
    background: colors.gradient,
    boxShadow: selected 
      ? `0 8px 16px rgba(0,0,0,0.2), 0 0 0 2px ${colors.border}`
      : '0 4px 12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
    '&:hover': {
      boxShadow: `0 8px 20px rgba(0,0,0,0.15), 0 0 0 1px ${colors.hover}`,
      transform: 'translateY(-2px)',
      background: colors.gradientHover,
    },
  };

  return (
    <>
      {/* Points d'entrée (targets) */}
      {Array.isArray(handlePositions.target) ? (
        // Plusieurs points d'entrée
        handlePositions.target.map((position, index) => (
          <Handle 
            key={`target-${index}`}
            type="target" 
            position={position}
            id={`target-${position}-${index}`}
            style={{ 
              background: colors.border, 
              border: `2px solid ${colors.border}`,
              width: 8,
              height: 8
            }} 
          />
        ))
      ) : (
        // Un seul point d'entrée
        <Handle 
          type="target" 
          position={handlePositions.target} 
          style={{ 
            background: colors.border, 
            border: `2px solid ${colors.border}`,
            width: 8,
            height: 8
          }} 
        />
      )}
      
      <Card sx={cardStyle}>
        <CardContent sx={{ position: 'relative', padding: 2, '&:last-child': { pb: 2 } }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5 }}>
                {name}
              </Typography>
              
              {/* Elements spécifiques au type de code */}
              {codeType && (
                <Chip 
                  label={codeType} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.7rem', 
                    height: 20, 
                    mb: 0.5,
                    backgroundColor: `${COLORS[TYPE_TO_VARIANT[codeType || 'other']].background}`, 
                    borderColor: `${COLORS[TYPE_TO_VARIANT[codeType || 'other']].border}`,
                    color: 'text.secondary',
                    fontWeight: 'medium'
                  }} 
                  variant="outlined"
                />
              )}
              
              {/* Affichage de la technologie avec icône */}
              {technology && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5, gap: 0.5 }}>
                  <TechnologyIcon technologyId={technology} size={16} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'medium' }}>
                    {technology}
                  </Typography>
                </Box>
              )}
            </Box>
            
            <IconButton 
              size="small" 
              onClick={onEdit} 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.5)', 
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.8)' },
                width: 28, 
                height: 28 
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {/* Description */}
          {description && (
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 1, 
                color: 'text.secondary',
                backgroundColor: 'rgba(255,255,255,0.4)',
                p: 1,
                borderRadius: 1
              }}
            >
              {description}
            </Typography>
          )}
          
          {/* Contenu supplémentaire (comme le code) */}
          {additionalContent}
          {code && (
            <Box 
              sx={{ 
                mt: 1, 
                p: 1, 
                backgroundColor: 'rgba(0,0,0,0.03)', 
                borderRadius: 1,
                fontSize: '0.75rem',
                fontFamily: 'monospace',
                overflowX: 'auto',
                maxHeight: '60px',
                overflowY: 'auto',
                border: '1px solid rgba(0,0,0,0.08)'
              }}
            >
              {code}
            </Box>
          )}
          
          {/* Label de type */}
          <Box 
            sx={{ 
              position: 'absolute', 
              bottom: 4, 
              right: 8, 
              backgroundColor: 'rgba(255,255,255,0.7)',
              px: 1,
              py: 0.2,
              borderRadius: 5,
              border: `1px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                fontWeight: 'bold', 
                fontSize: '0.65rem',
                color: colors.border,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              {type}
            </Typography>
          </Box>
        </CardContent>
      </Card>
      
      {/* Points de sortie (sources) */}
      {Array.isArray(handlePositions.source) ? (
        // Plusieurs points de sortie
        handlePositions.source.map((position, index) => (
          <Handle 
            key={`source-${index}`}
            type="source" 
            position={position}
            id={`source-${position}-${index}`}
            style={{ 
              background: colors.border, 
              border: `2px solid ${colors.border}`,
              width: 8,
              height: 8
            }} 
          />
        ))
      ) : (
        // Un seul point de sortie
        <Handle 
          type="source" 
          position={handlePositions.source} 
          style={{ 
            background: colors.border, 
            border: `2px solid ${colors.border}`,
            width: 8,
            height: 8
          }} 
        />
      )}
    </>
  );
};

export default C4Block;
