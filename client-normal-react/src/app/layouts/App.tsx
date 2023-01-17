import { observer } from 'mobx-react-lite';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';
import NavBar from './NavBar';
import HomePage from '../../features/home/HomePage';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerSideError from '../../features/errors/ServerSideError';
import ModalContainer from '../modals/ModalContainer';
import PrivateRoute from './PrivateRoute';
import { useStore } from '../../stores/store';
import Loading from './Loading';

export default observer(function App() {
  const { userStore } = useStore();

  if (userStore.userLoading) return <Loading content='Loading app...' />;
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />

      <ModalContainer />

      <Switch>
        <Route exact path='/' component={HomePage} />

        <Route
          exact
          path='/(.+)'
          render={() => (
            <>
              <NavBar />

              <Container style={{ marginTop: '7em' }}>
                <Switch>
                  <PrivateRoute
                    exact
                    path='/server-side-error'
                    component={ServerSideError}
                  />

                  <PrivateRoute exact component={NotFound} />
                </Switch>
              </Container>
            </>
          )}
        />
      </Switch>
    </>
  );
});
