import { useEffect, useState } from "react";
import { useC4Store } from "../store/c4Store";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const c4Store = useC4Store();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [EnterpriseProvider, setEnterpriseProvider] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    //@ts-expect-error This is a dynamic import
    import("@c4-enterprise/enterprise-context")
    .then((mod) => setEnterpriseProvider(() => mod.EnterpriseProvider))
    .catch(() => setEnterpriseProvider(null));
  }, []);

  if (!EnterpriseProvider) {
    return <>{children}</>;
  }
  return <EnterpriseProvider c4Store={c4Store}>{children}</EnterpriseProvider>;
}
