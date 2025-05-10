import { useFlatC4Store } from '@/store/flatC4Store';
import { CodeBlock, ComponentBlock, ContainerBlock, SystemBlock } from '@interfaces/c4';

function useFlatStore(): {
  getBlockById: (id: string) => SystemBlock | ContainerBlock | ComponentBlock | CodeBlock | undefined;
} {
  const { model } = useFlatC4Store();

  const getBlockById = (id: string) => {
    return [
      ...model.systems,
      ...model.containers,
      ...model.components,
      ...model.codeElements,
    ].find((block) => block.id === id);
  };

  return {
    getBlockById,
  };
}

export default useFlatStore;
