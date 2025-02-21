/**
 * @module usePagination
 */

import React, { ReactNode, useMemo, useState } from 'react';
import { Icon } from '../Icon/Icon';

/**
 * Represents a control for pagination.
 * @typedef {Object} PaginationControl
 * @property {ReactNode} label - The label to display for the pagination control.
 * @property {(currentPage?: number) => void} [onClick] - Optional callback function to handle click events.
 */
export type PaginationControl = {
  label: ReactNode;
  onClick?: (currentPage?: number) => void;
};

/**
 * Props for the pagination component.
 * @interface IPaginationPageCountProps
 * @property {PaginationControl[]} pages - Array of pagination controls.
 * @property {number} [currentPage] - The current active page.
 * @property {PaginationControl} [nextControl] - Optional control for the next page.
 * @property {PaginationControl} [prevControl] - Optional control for the previous page.
 * @property {string} [className] - Optional CSS class name for styling.
 */
export interface IPaginationPageCountProps {
  pages: PaginationControl[];
  currentPage?: number;
  nextControl?: PaginationControl;
  prevControl?: PaginationControl;
  className?: string;
}

/**
 * Type for items in the pagination.
 * @typedef {Object} Itemtype
 * @property {any} [key] - Represents any key-value pairs.
 */
type Itemtype = { [key: string]: any };

/**
 * Return type for the useListPagination2 hook.
 * @template T
 * @typedef {Object} UsePaginationReturnType
 * @property {IPaginationPageCountProps['pages']} pages - Array of pagination controls.
 * @property {number} currentPage - The current active page.
 * @property {T[]} pageItems - Array of items for the current page.
 * @property {(page: number) => void} setCurrentPage - Function to set the current page.
 * @property {PaginationControl} [nextControl] - Control for the next page.
 * @property {PaginationControl} [prevControl] - Control for the previous page.
 */
type UsePaginationReturnType<T> = {
  pages: IPaginationPageCountProps['pages'];
  currentPage: number;
  pageItems: T[];
  setCurrentPage: (page: number) => void;
  nextControl?: PaginationControl;
  prevControl?: PaginationControl;
};

/**
 * Type for the input to the useListPagination2 hook.
 * @template T
 * @typedef {Object} UsePaginationType
 * @property {Array<T>} items - Array of items to paginate.
 * @property {number} itemsPerPage - Number of items per page.
 */
type UsePaginationType<T> = {
  items: Array<T>;
  itemsPerPage: number;
};

/**
 * Custom hook for paginating a list of items.
 * @template T
 * @param {UsePaginationType<T>} param0 - The items and items per page.
 * @returns {UsePaginationReturnType<T>} The pagination controls and current page information.
 */
export const useListPagination2 = <T extends Itemtype>({
  items,
  itemsPerPage,
}: UsePaginationType<T>): UsePaginationReturnType<T> => {
  const numberOfPages = Math.ceil(items.length / itemsPerPage);
  const pageItems = useMemo(
    () =>
      Array.from({ length: numberOfPages }, (_, idx) =>
        items.slice(idx * itemsPerPage, (idx + 1) * itemsPerPage)
      ),
    [items, itemsPerPage, numberOfPages]
  );

  const [currentPage, setCurrentPage] = useState<number>(1);

  const paginationPages = useMemo(
    () =>
      Array.from({ length: numberOfPages }, (_, idx) => ({
        label: idx + 1,
        onClick: () => setCurrentPage(idx + 1),
      })),
    [numberOfPages]
  );

  const nextControl = useMemo(
    () => ({
      label: <Icon size={12} type="arrow-block-right" />,
      onClick: (currentPage?: number) =>
        currentPage && setCurrentPage(currentPage + 1),
    }),
    []
  );

  const prevControl = useMemo(
    () => ({
      label: <Icon size={12} type="arrow-block-left" />,
      onClick: (currentPage?: number) =>
        currentPage && setCurrentPage(currentPage - 1),
    }),
    []
  );

  return {
    currentPage: currentPage,
    pages: paginationPages,
    pageItems: pageItems[currentPage - 1],
    setCurrentPage: setCurrentPage,
    nextControl: nextControl,
    prevControl: prevControl,
  };
};
