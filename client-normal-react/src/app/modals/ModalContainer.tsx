import { observer } from 'mobx-react-lite';
import { Modal } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

export default observer(function ModalContainer() {
  const {
    modalStore: { open, body, size, closeModal },
  } = useStore();
  return (
    <Modal open={open} onClose={closeModal} size={size}>
      <Modal.Content>{body}</Modal.Content>
    </Modal>
  );
});
