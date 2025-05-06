import { ToolbarProps } from "@/components/Toolbar";
import { lazyRegistry } from "@/plugins/lazyRegistry";
import { Suspense } from "react";

const Toolbar = lazyRegistry<ToolbarProps>("toolbar:main");

export default function ToolbarSlot(props: ToolbarProps & React.RefAttributes<HTMLButtonElement>) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Toolbar {...props} />
    </Suspense>
  );
}
