import { observer } from 'mobx-react-lite';
import { Container, Header, Segment } from 'semantic-ui-react';
import { useStore } from '../../stores/store';

export default observer(function ServerSideError() {
  const { serverSideErrorMessage } = useStore().commonStore;

  return (
    <Container>
      <Header as='h1' content='Server Side Error' />
      {serverSideErrorMessage && (
        <Segment>
          <code
            dangerouslySetInnerHTML={{ __html: serverSideErrorMessage }}
          ></code>
        </Segment>
      )}
    </Container>
  );
});
