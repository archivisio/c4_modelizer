import { Alert, Button, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRegisterSW } from "virtual:pwa-register/react";

export const UpdateNotification: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log("SW registered:", r);
    },
    onRegisterError(error: unknown) {
      console.log("SW registration error", error);
    },
    onOfflineReady() {
      console.log("App ready to work offline");
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  useEffect(() => {
    if (needRefresh) {
      setOpen(true);
    }
  }, [needRefresh]);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={null}
    >
      <Alert
        severity="info"
        action={
          <>
            <Button color="secondary" size="small" onClick={handleClose}>
              {t("updateNotification.later")}
            </Button>
            <Button color="primary" size="small" onClick={handleUpdate}>
              {t("updateNotification.update")}
            </Button>
          </>
        }
      >
        {t("updateNotification.newVersionAvailable")}
      </Alert>
    </Snackbar>
  );
};

export default UpdateNotification;
