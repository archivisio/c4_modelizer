import React from "react";
import { useTranslation } from "react-i18next";
import { ErrorBox } from "./errorNotificationStyled";

interface ErrorNotificationProps {
  message: string | null;
}

const ErrorNotification: React.FC<ErrorNotificationProps> = ({ message }) => {
  const { t } = useTranslation();

  if (!message) return null;

  return (
    <ErrorBox>
      {t(message)}
    </ErrorBox>
  );
};

export default ErrorNotification;
