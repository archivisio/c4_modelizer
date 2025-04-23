// Using Material UI icons as technology icons
import CodeIcon from '@mui/icons-material/Code';
import JavascriptIcon from '@mui/icons-material/Javascript';
import StorageIcon from '@mui/icons-material/Storage';
import CloudIcon from '@mui/icons-material/Cloud';
import WebIcon from '@mui/icons-material/Web';
import DnsIcon from '@mui/icons-material/Dns';
import HttpIcon from '@mui/icons-material/Http';
import ApiIcon from '@mui/icons-material/Api';
import IntegrationInstructionsIcon from '@mui/icons-material/IntegrationInstructions';
import LanguageIcon from '@mui/icons-material/Language';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import BugReportIcon from '@mui/icons-material/BugReport';
import SettingsIcon from '@mui/icons-material/Settings';
import ScienceIcon from '@mui/icons-material/Science';

// Interface for icon components
interface IconProps {
  size?: number;
  style?: React.CSSProperties;
}

// Map of technology IDs to their icon components
export const iconMap: Record<string, React.ComponentType<IconProps>> = {
  // Backend languages
  java: IntegrationInstructionsIcon,
  spring: ScienceIcon,
  nodejs: LanguageIcon,
  ruby: CodeIcon,
  rails: WebIcon,
  python: CodeIcon,
  django: WebIcon,
  php: CodeIcon,
  csharp: CodeIcon,
  'dot-net': DeveloperModeIcon,
  go: CodeIcon,
  
  // Frontend frameworks
  react: WebIcon,
  angularjs: WebIcon,
  vuejs: WebIcon,
  svelte: WebIcon,
  javascript: JavascriptIcon,
  typescript: JavascriptIcon,
  
  // Databases
  postgresql: StorageIcon,
  mysql: StorageIcon,
  mongodb: StorageIcon,
  redis: StorageIcon,
  
  // Infrastructure
  docker: DnsIcon,
  kubernetes: CloudIcon,
  nginx: HttpIcon,
  graphql: ApiIcon,
  amazonwebservices: CloudIcon,
  
  // Testing frameworks
  jest: BugReportIcon,
  selenium: BugReportIcon,
  rspec: BugReportIcon,
  
  // Default fallbacks
  code: CodeIcon,
  default: SettingsIcon,
};

// Helper function to get an icon component by its ID
export const getIconComponent = (iconName: string): React.ComponentType<IconProps> => {
  return iconMap[iconName] || iconMap.default;
};
