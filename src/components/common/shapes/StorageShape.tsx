import { BaseBlock } from "@/types/c4";
import EditIcon from "@mui/icons-material/Edit";
import FolderIcon from "@mui/icons-material/Folder";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslation } from "react-i18next";
import TechnologyIcon from "../../TechnologyIcon";
import {
  ActionIconButton,
  ActionsContainer,
  BlockContainer,
  BlockTitle,
  DescriptionText,
  EditTitleInput,
  HeaderContainer,
  PathText,
  StyledCard,
  StyledCardContent,
  TitleContainer,
} from "../c4BlockStyled";
import { ShapeProps } from "./BaseShape";

const StorageIconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& svg": {
    fontSize: 40,
  },
}));

const StorageCard = styled(StyledCard)(() => ({
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "10%",
    width: "80%",
    height: "10px",
    backgroundColor: "currentColor",
    opacity: 0.2,
    borderRadius: "5px 5px 0 0",
  },
}));

const StorageShape: React.FC<ShapeProps> = ({
  item,
  selected,
  colorStyles,
  children,
  description,
  isClone,
  clonePath,
  title,
  isEditing,
  onEditStart,
  onEditFinish,
  onTitleChange,
  url,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { technology } = item;

  return (
    <BlockContainer sx={{ opacity: isClone ? 0.5 : 1 }}>
      <StorageCard
        colorstyles={colorStyles}
        selected={selected}
        data-has-description={description ? "true" : "false"}
        className="tech-card storage-shape"
      >
        <StyledCardContent>
          <StorageIconContainer>
            <FolderIcon style={{ color: colorStyles.border }} />
          </StorageIconContainer>

          <HeaderContainer>
            <TitleContainer>
              {technology && (
                <TechnologyIcon
                  item={{ technology, name: title } as unknown as BaseBlock}
                  size={24}
                />
              )}

              <BlockTitle onClick={onEditStart}>
                {isEditing || title.length === 0 ? (
                  <EditTitleInput
                    type="text"
                    value={title}
                    data-testid="block-title-input"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onEditFinish(true);
                      }
                      if (e.key === "Escape") {
                        onEditFinish(false);
                      }
                    }}
                    onDoubleClick={(e) => e.stopPropagation()}
                    onChange={(e) => onTitleChange(e.target.value)}
                    onBlur={() => onEditFinish(true)}
                    autoFocus
                  />
                ) : (
                  <Tooltip title={title} arrow>
                    <Typography
                      noWrap
                      variant="subtitle1"
                      data-testid="block-title"
                    >
                      {title}
                    </Typography>
                  </Tooltip>
                )}
              </BlockTitle>
            </TitleContainer>

            <ActionsContainer>
              {url && (
                <Tooltip title={t("open_url")} arrow>
                  <ActionIconButton
                    size="small"
                    onClick={() => window.open(url, "_blank")}
                    aria-label={t("open_url")}
                    colorstyles={colorStyles}
                  >
                    <OpenInNewIcon fontSize="inherit" />
                  </ActionIconButton>
                </Tooltip>
              )}

              {!isClone && onEdit && (
                <Tooltip title={t("edit")} arrow>
                  <ActionIconButton
                    size="small"
                    onClick={onEdit}
                    aria-label={t("edit")}
                    colorstyles={colorStyles}
                  >
                    <EditIcon fontSize="inherit" />
                  </ActionIconButton>
                </Tooltip>
              )}
            </ActionsContainer>
          </HeaderContainer>

          {description && (
            <DescriptionText variant="body2">{description}</DescriptionText>
          )}

          {children}

          {isClone && clonePath && (
            <PathText variant="caption">{clonePath}</PathText>
          )}
        </StyledCardContent>
      </StorageCard>
    </BlockContainer>
  );
};

export default StorageShape;
