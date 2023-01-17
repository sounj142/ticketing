import { makeAutoObservable } from 'mobx';

export default class CommonStore {
  serverSideErrorMessage?: string = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  setServerSideErrorMessage = (err?: string) => {
    this.serverSideErrorMessage = err?.replaceAll('\r\n', '<br/>');
  };
}
