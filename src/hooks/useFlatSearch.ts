import { BaseBlock } from '../types/c4';
import { useFlatC4Store } from '@store/flatC4Store';
import { useMemo, useState } from 'react';

export function useFlatSearch() {
  const { model } = useFlatC4Store();
  const [searchValue, setSearchVal] = useState<string>('');

  const setSearchValue = (value: string) => setSearchVal(value);
  
  // Dans la structure plate, les éléments sont déjà directement accessibles dans leurs listes respectives
  const items = useMemo(() => {
    const list: BaseBlock[] = [
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

    const filteredItems = items.filter((item) => {
      return item.name.toLowerCase().includes(searchValueLower);
    });

    return filteredItems;
  }, [items, searchValue]);

  return {
    searchValue,
    setSearchValue,
    searchResults
  };
}
