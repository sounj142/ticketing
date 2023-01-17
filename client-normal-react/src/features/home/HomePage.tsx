import { Button, Container, Header, Image, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '../../stores/store';
import LoginForm from '../users/LoginForm';
import RegisterForm from '../users/RegisterForm';

export default observer(function HomePage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image
            size='massive'
            src='/assets/logo.png'
            alt='logo'
            style={{ marginBottom: 12 }}
          />
          GitTix
        </Header>

        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Welcome to GitTix' />
            <Button
              as={Link}
              to='/tickets'
              size='huge'
              inverted
              content='Go to Tickets!'
              type='button'
            />
          </>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              size='huge'
              inverted
              content='Login'
              type='button'
            />
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size='huge'
              inverted
              content='Register'
              type='button'
            />
          </>
        )}
      </Container>
    </Segment>
  );
});
