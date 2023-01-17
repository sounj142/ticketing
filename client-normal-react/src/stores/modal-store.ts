import { makeAutoObservable } from 'mobx';

type ModalSize = 'mini' | 'tiny' | 'small' | 'large' | 'fullscreen' | undefined;

export default class ModalStore {
  open = false;
  body?: JSX.Element = undefined;
  size: ModalSize;

  constructor() {
    makeAutoObservable(this);
  }

  openModal = (content: JSX.Element, size: ModalSize = 'mini') => {
    this.open = true;
    this.body = content;
    this.size = size;
  };

  closeModal = () => {
    this.open = false;
    this.body = undefined;
    this.size = undefined;
  };
}
