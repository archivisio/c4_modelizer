import { registry } from "@/plugins/registry";

interface Props {
  id: string;
}

export default function PortalTarget({ id }: Props) {
  const node = registry.getPortal(id);
  return node || null;
}
