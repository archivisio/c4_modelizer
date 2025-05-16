import { BaseBlock } from "@/types/c4";
import { ColorStyle } from "@/theme/theme";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import TechnologyIcon from "../../../TechnologyIcon";
import {
  ActionIconButton,
  ActionsContainer,
  BlockTitle,
  EditTitleInput,
  HeaderContainer,
  TitleContainer,
} from "../../c4BlockStyled";

interface BlockHeaderProps {
  item: BaseBlock;
  title: string;
  isEditing: boolean;
  isClone: boolean;
  url?: string;
  colorStyles: ColorStyle;
  onEditStart: () => void;
  onEditFinish: (save: boolean) => void;
  onTitleChange: (newTitle: string) => void;
  onEdit?: () => void;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  item,
  title,
  isEditing,
  isClone,
  url,
  colorStyles,
  onEditStart,
  onEditFinish,
  onTitleChange,
  onEdit,
}) => {
  const { t } = useTranslation();
  const { technology } = item;

  return (
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
  );
};

export default BlockHeader;
