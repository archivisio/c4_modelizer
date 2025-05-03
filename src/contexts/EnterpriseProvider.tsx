import { useEffect, useState } from "react";
import { useC4Store } from "../store/c4Store";

export default function Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const c4Store = useC4Store();
  const [EnterpriseProvider, setEnterpriseProvider] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
      import("@c4-enterprise/enterprise-context")
      .then((mod) => setEnterpriseProvider(() => mod.EnterpriseProvider))
      .catch(() => setEnterpriseProvider(null));
  }, []);

  if (!EnterpriseProvider) {
    return <>{children}</>;
  }
  return <EnterpriseProvider c4Store={c4Store}>{children}</EnterpriseProvider>;
}
