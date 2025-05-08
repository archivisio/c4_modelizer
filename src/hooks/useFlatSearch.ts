import { useActiveEntities, useFlatC4Store } from '@store/flatC4Store';
import { useMemo, useState } from 'react';
import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock } from '../types/c4';

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

    let filteredItems = items.filter((item) => {
      if (item.original) {
        return false;
      }
      return item.name.toLowerCase().includes(searchValueLower);
    });

    filteredItems = filteredItems.filter((item) => {
      if (viewLevel === 'system') {
        return item.type !== 'system';
      }
      if (viewLevel === 'container') {
        return item.systemId !== activeSystem?.id;
      }
      if (viewLevel === 'component') {
        return item.containerId !== activeContainer?.id;
      }
      if (viewLevel === 'code') {
        return item.componentId !== activeComponent?.id;
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
