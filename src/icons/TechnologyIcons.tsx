import ApiIcon from "@mui/icons-material/Api";
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import BugReportIcon from "@mui/icons-material/BugReport";
import BusinessIcon from '@mui/icons-material/Business';
import CloudIcon from "@mui/icons-material/Cloud";
import CodeIcon from "@mui/icons-material/Code";
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import DeveloperModeIcon from "@mui/icons-material/DeveloperMode";
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DnsIcon from "@mui/icons-material/Dns";
import HttpIcon from "@mui/icons-material/Http";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import JavascriptIcon from "@mui/icons-material/Javascript";
import LanguageIcon from "@mui/icons-material/Language";
import MemoryIcon from '@mui/icons-material/Memory';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ScienceIcon from "@mui/icons-material/Science";
import SecurityIcon from '@mui/icons-material/Security';
import SettingsIcon from "@mui/icons-material/Settings";
import StorageIcon from "@mui/icons-material/Storage";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WebIcon from "@mui/icons-material/Web";
import WebAssetIcon from '@mui/icons-material/WebAsset';

interface IconProps {
  size?: number;
  style?: React.CSSProperties;
}

export const iconMap: Record<string, React.ComponentType<IconProps>> = {
  java: IntegrationInstructionsIcon,
  spring: ScienceIcon,
  nodejs: LanguageIcon,
  ruby: CodeIcon,
  rails: WebIcon,
  python: CodeIcon,
  django: WebIcon,
  php: CodeIcon,
  csharp: CodeIcon,
  "dot-net": DeveloperModeIcon,
  go: CodeIcon,
  react: WebIcon,
  angularjs: WebIcon,
  vuejs: WebIcon,
  svelte: WebIcon,
  javascript: JavascriptIcon,
  typescript: JavascriptIcon,
  postgresql: StorageIcon,
  mysql: StorageIcon,
  mongodb: StorageIcon,
  redis: StorageIcon,
  docker: DnsIcon,
  kubernetes: CloudIcon,
  nginx: HttpIcon,
  graphql: ApiIcon,
  amazonwebservices: CloudIcon,
  jest: BugReportIcon,
  selenium: BugReportIcon,
  rspec: BugReportIcon,
  code: CodeIcon,
  user: PersonIcon,
  web_application: WebAssetIcon,
  mobile_application: PhoneIphoneIcon,
  public_api: CloudIcon,
  microservices: DnsIcon,
  enterprise_information_system: BusinessIcon,
  data_management_system: StorageIcon,
  notification_or_messaging_system: NotificationsIcon,
  payment_system: PaymentIcon,
  authentication_and_authorization_system: VerifiedUserIcon,
  external_system: DeviceHubIcon,
  desktop_application: DesktopWindowsIcon,
  iot_or_embedded_system: MemoryIcon,
  batch_or_async_processing_system: BatchPredictionIcon,
  monitoring_and_observability_system: VisibilityIcon,
  security_system: SecurityIcon,
  default: SettingsIcon,
};

export const getIconComponent = (
  iconName: string
): React.ComponentType<IconProps> => {
  return iconMap[iconName] || iconMap.default;
};
