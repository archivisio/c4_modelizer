import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock } from '@interfaces/c4';
import { useActiveEntities, useFlatC4Store } from '@store/flatC4Store';
import { useMemo, useState } from 'react';

export function useFlatSearch() {
  const { model } = useFlatC4Store();
  const { activeSystem, activeContainer, activeComponent, viewLevel } = useActiveEntities();
  const [searchValue, setSearchVal] = useState<string>('');

  const setSearchValue = (value: string) => setSearchVal(value);

  const items = useMemo(() => {
    const list: Array<SystemBlock | ContainerBlock | ComponentBlock | CodeBlock> = [
      ...model.systems,
      ...model.containers,
      ...model.components,
      ...model.codeElements
    ];

    return list;
  }, [model]);

  const searchResults = useMemo(() => {
    const searchValueLower = searchValue.toLowerCase();
    if (!searchValueLower) return [];

    const clonesInCurrentView = new Set<string>();
    items.forEach((item) => {
      if (item.original && item.original.id) {
        let isInCurrentView = false;

        if (viewLevel === 'system') {
          isInCurrentView = (item as SystemBlock).type === 'system';
        } else if (viewLevel === 'container' && activeSystem) {
          isInCurrentView = (item as ContainerBlock).systemId === activeSystem.id;
        } else if (viewLevel === 'component' && activeContainer) {
          isInCurrentView = (item as ComponentBlock).containerId === activeContainer.id;
        } else if (viewLevel === 'code' && activeComponent) {
          isInCurrentView = (item as CodeBlock).componentId === activeComponent.id;
        }

        if (isInCurrentView) {
          clonesInCurrentView.add(item.original.id);
        }
      }
    });

    let filteredItems = items.filter((item) => {
      if (item.original) {
        return false;
      }
      if (clonesInCurrentView.has(item.id)) {
        return false;
      }

      return item.name.toLowerCase().includes(searchValueLower);
    });

    filteredItems = filteredItems.filter((item) => {
      if (viewLevel === 'system') {
        const systemItem = item as SystemBlock;
        return systemItem.type !== 'system';
      }
      if (viewLevel === 'container' && activeSystem) {
        const containerItem = item as ContainerBlock;
        return containerItem.systemId !== activeSystem.id;
      }
      if (viewLevel === 'component' && activeContainer) {
        const componentItem = item as ComponentBlock;
        return componentItem.containerId !== activeContainer.id;
      }
      if (viewLevel === 'code' && activeComponent) {
        const codeItem = item as CodeBlock;
        return codeItem.componentId !== activeComponent.id;
      }
      return true;
    });

    return filteredItems;
  }, [items, searchValue, viewLevel, activeSystem, activeContainer, activeComponent]);

  return {
    searchValue,
    setSearchValue,
    searchResults
  };
}
