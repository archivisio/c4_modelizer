import { useC4Store } from "@store/c4Store";
import { useEffect, useRef, useState } from "react";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const c4Store = useC4Store();
  const initialized = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [EnterpriseComponents, setEnterpriseComponents] = useState<{EnterpriseProvider: React.ComponentType<any>, Registry: any} | null>(null);

  useEffect(() => {
    //@ts-expect-error This is a dynamic import
    import("@c4-enterprise/enterprise-context")
    .then((mod) => setEnterpriseComponents({
      EnterpriseProvider: mod.EnterpriseProvider,
      Registry: mod.Registry
    }))
    .catch(() => setEnterpriseComponents(null));
  }, []);

  useEffect(() => {
    if (EnterpriseComponents && !initialized.current) {
      EnterpriseComponents.Registry.registerStore(c4Store);
      initialized.current = true;
    }
  }, [EnterpriseComponents, c4Store, initialized]);

  if (!EnterpriseComponents) {
    return children;
  }
  return <EnterpriseComponents.EnterpriseProvider>{children}</EnterpriseComponents.EnterpriseProvider>;
}
