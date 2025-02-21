import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  filtersData: any[];
  setState: (fn: (state: AppState) => Partial<AppState>) => void;
}

let store: UseBoundStore<StoreApi<AppState>> | null = null;

const createDefaultStore = () =>
  create<AppState>()(
    devtools(
      persist(
        (set) => ({
          filtersData: [],
          setState: (fn) => set(fn),
        }),
        {
          name: 'monorepo-demo-store',
        }
      ),
      {
        name: 'monorepo-demo-store',
        enabled: process.env.NODE_ENV === 'development',
      }
    )
  );

export const setAppStore = (customStore: UseBoundStore<StoreApi<AppState>>) => {
  store = customStore;
  return store;
};

export const getAppStore = () => {
  if (!store) {
    store = createDefaultStore();
  }
  return store;
};

export const useAppStore = (() => getAppStore())();
