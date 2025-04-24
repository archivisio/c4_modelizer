import { SvgIconProps } from '@mui/material';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CloudIcon from '@mui/icons-material/Cloud';
import StorageIcon from '@mui/icons-material/Storage';
import BusinessIcon from '@mui/icons-material/Business';
import DnsIcon from '@mui/icons-material/Dns';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PaymentIcon from '@mui/icons-material/Payment';
import SecurityIcon from '@mui/icons-material/Security';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import MemoryIcon from '@mui/icons-material/Memory';
import BatchPredictionIcon from '@mui/icons-material/BatchPrediction';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

export const systemTypeIconMap: Record<string, React.ComponentType<SvgIconProps>> = {
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
};

export function getSystemTypeIcon(type: string): React.ReactNode {
  const Icon = systemTypeIconMap[type] || WebAssetIcon;
  return <Icon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />;
}
