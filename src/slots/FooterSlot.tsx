import React, { Suspense } from "react";
import { lazyRegistry } from "@plugins/lazyRegistry";

const FooterSlot: React.FC = () => {
  const FooterCredit = lazyRegistry("footer:credit");

  return (
    <Suspense fallback={null}>
      <FooterCredit />
    </Suspense>
  );
};

export default FooterSlot;
