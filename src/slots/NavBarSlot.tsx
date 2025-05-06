import { NavBarProps } from "@/components/NavBar";
import { lazyRegistry } from "@/plugins/lazyRegistry";
import { Suspense } from "react";

const NavBar = lazyRegistry<NavBarProps>("navbar:main");

export default function NavBarSlot(props: NavBarProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NavBar {...props} />
    </Suspense>
  );
}
