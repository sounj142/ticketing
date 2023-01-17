import { createContext, useContext } from 'react';
import CommonStore from './common-store';
import ModalStore from './modal-store';
import UserStore from './user-store';

interface Store {
  commonStore: CommonStore;
  userStore: UserStore;
  modalStore: ModalStore;
}

export const store: Store = {
  commonStore: new CommonStore(),
  userStore: new UserStore(),
  modalStore: new ModalStore(),
};

export const StoreContext = createContext(store);

export function useStore() {
  return useContext(StoreContext);
}
