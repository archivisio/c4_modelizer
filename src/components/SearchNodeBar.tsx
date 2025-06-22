import TechnologyIcon from "@/components/TechnologyIcon";
import { useDialogs } from "@/contexts/DialogContext";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import CloseIcon from "@mui/icons-material/Close";
import { Stack } from "@mui/material";
import {
  BaseBlock,
  useFlatC4Store,
  useFlatModelActions,
  useFlatSearch,
} from "c4-modelizer-sdk/core";
import { useRef } from "react";
import Draggable from "react-draggable";
import {
  CloseButton,
  DragIcon,
  EmptyResults,
  EmptyText,
  ItemName,
  ItemType,
  ResultItem,
  ResultsContainer,
  SearchBarContainer,
  SearchField,
  SubtitleText,
  TitleBar,
  TitleText,
} from "./searchBarNodeStyled";

const SearchNodeBar: React.FC = () => {
  const { searchValue, setSearchValue, searchResults } = useFlatSearch();
  const { pendingConnection, setPendingConnection } = useDialogs();
  const { addElement } = useFlatModelActions();
  const {
    model,
    connectSystems,
    connectContainers,
    connectComponents,
    connectCodeElements,
  } = useFlatC4Store();
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const resultFound = searchResults.length > 0;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useOnClickOutside(searchBarRef, () => {
    if (pendingConnection) {
      setPendingConnection(null);
    }
  });

  if (!pendingConnection) return null;
  const { connectionState } = pendingConnection;
  const sourceNodeId = connectionState.fromNode?.id;
  const sourceNode = connectionState.fromNode?.data as BaseBlock | undefined;

  const handleSelectResult = (result: BaseBlock) => {
    if (!connectionState.fromNode?.id) return;

    const sourceNodeId = connectionState.fromNode.id;
    const id = crypto.randomUUID();

    addElement({
      id,
      name: result.name,
      description: result.description,
      position: {
        x: connectionState.to?.x || 500,
        y: connectionState.to?.y || 500,
      },
      technology: result.technology,
      url: result.url,
      type: result.type,
      original: {
        id: result.id,
        type: result.type,
      },
    });

    const connectionData = {
      targetId: id,
      description: "",
    };

    if (model.viewLevel === "system") {
      connectSystems(sourceNodeId, connectionData);
    } else if (model.viewLevel === "container") {
      connectContainers(sourceNodeId, connectionData);
    } else if (model.viewLevel === "component") {
      connectComponents(sourceNodeId, connectionData);
    } else if (model.viewLevel === "code") {
      connectCodeElements(sourceNodeId, connectionData);
    }

    setPendingConnection(null);
  };

  return (
    <Draggable
      nodeRef={searchBarRef as React.RefObject<HTMLDivElement>}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <SearchBarContainer
        ref={searchBarRef}
        sx={{
          top: connectionState.to?.y,
          left: connectionState.to?.x,
        }}
      >
        <TitleBar id="draggable-dialog-title" direction="row">
          <Stack direction="row" alignItems="center" spacing={1}>
            <DragIcon />
            <Stack spacing={0.5}>
              <TitleText variant="subtitle2">
                Connecter depuis: {sourceNode?.name || "Nœud inconnu"}
              </TitleText>
              {sourceNode && sourceNode.type && (
                <SubtitleText variant="caption">
                  {sourceNode.type.charAt(0).toUpperCase() +
                    sourceNode.type.slice(1)}
                </SubtitleText>
              )}
            </Stack>
          </Stack>
          <CloseButton size="small" onClick={() => setPendingConnection(null)}>
            <CloseIcon fontSize="small" />
          </CloseButton>
        </TitleBar>

        <SearchField
          autoComplete="off"
          label="Search"
          variant="outlined"
          value={searchValue}
          onChange={handleSearchChange}
          autoFocus
          placeholder="Search nodes..."
        />

        {resultFound && (
          <ResultsContainer>
            {searchResults
              .filter((item) => item.id !== sourceNodeId)
              .map((item) => (
                <ResultItem
                  key={item.id}
                  onClick={() => {
                    handleSelectResult(item);
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    {item.technology && (
                      <TechnologyIcon
                        item={item}
                        size={18}
                        showTooltip={false}
                      />
                    )}
                    <ItemName variant="body2">{item.name}</ItemName>
                  </Stack>
                  {item.type && (
                    <ItemType variant="caption">{item.type}</ItemType>
                  )}
                </ResultItem>
              ))}
          </ResultsContainer>
        )}

        {!resultFound && searchValue.length > 0 && (
          <EmptyResults>
            <EmptyText variant="body2">No results found</EmptyText>
          </EmptyResults>
        )}
      </SearchBarContainer>
    </Draggable>
  );
};

export default SearchNodeBar;
