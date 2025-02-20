import { ComponentType } from "react";

export type ItemOptionsType<T extends object> = Partial<Omit<T, 'children'>> & {
  listId?: string;
};

// function to map array items into component lists
export const renderArrayItems =
  <T extends object>(
    Component: ComponentType<T>
  ): ((
    items: T | T[],
    listItemOptions?: ItemOptionsType<T>
  ) => JSX.Element[]) =>
  (items: T | T[], listItemOptions?: ItemOptionsType<T>): JSX.Element[] => {
    const itemsList = Array.isArray(items) ? [...items] : [items];
    const itemTemplate = (item: T, idx: number) => {
      return {
        ...listItemOptions,
        ...item,
        key: idx,
      } satisfies T & { listItem?: string };
    };

    return itemsList.map((item: T, idx: number) => {
      const { listId, key, ...updatedItem } = itemTemplate(item, idx);
      return (
        <Component
          data-testid={`list-item-#${idx}`}
          id={listId ? `list-${listId}_list-item-${idx}` : `list-item-${idx}`}
          key={key}
          {...(updatedItem as T)}
        />
      );
    });
  };
