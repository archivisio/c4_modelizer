import { BaseBlock } from '@/types/c4';
import { useC4Store } from '@store/c4Store';
import { useMemo, useState } from 'react';

interface SearchNodeResult extends BaseBlock {
  type: 'system' | 'container' | 'component' | 'codeElement';
}

export function useSearch() {
  const { model } = useC4Store();
  const [searchValue, setSearchVal] = useState<string>('');

  const setSearchValue = (value: string) => setSearchVal(value);
  const items = useMemo(() => {
    const { systems } = model;
    const list: SearchNodeResult[] = [];

    systems.forEach((system) => {
      list.push({ ...system, type: 'system' });
      if (system.containers) {
        system.containers.forEach((container) => {
          list.push({ ...container, type: 'container' });
          if (container.components) {
            container.components.forEach((component) => {
              list.push({ ...component, type: 'component' });
              if (component.codeElements) {
                component.codeElements.forEach((codeElement) => {
                  list.push({ ...codeElement, type: 'codeElement' });
                });
              }
            });
          }
        });
      }
    });

    return list;
  }, [model]);
    

  const searchResults = useMemo(() => {
    const searchValueLower = searchValue.toLowerCase();
    if (!searchValueLower) return [];
    
    const filteredItems = items.filter((item) => {
      return item.name.toLowerCase().includes(searchValueLower);
    });
    
    return filteredItems;
  }, [model, searchValue]);

  return {
    searchValue,
    setSearchValue,
    searchResults
  };
}
