import { registry } from "@/plugins/registry";
import { createPortal } from "react-dom";

interface Props {
  id: string;
}

export default function PortalTarget({ id }: Props) {
  const node = registry.getPortal(id);
  return node ? createPortal(node, document.body) : null;
}
