import { observer } from 'mobx-react-lite';
import { NavLink } from 'react-router-dom';
import { Container, Dropdown, Image, Menu } from 'semantic-ui-react';
import { useStore } from '../../stores/store';
import { history } from '../../utils/route';

export default observer(function NavBar() {
  const { userStore } = useStore();
  const { user, logOut } = userStore;

  const handleLogout = () => {
    logOut();
    history.push('/');
  };

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item header as={NavLink} to='/' exact>
          <img
            src='/assets/logo.png'
            alt='logo'
            style={{ marginRight: '10px' }}
          />
          Ticketing
        </Menu.Item>

        {user && (
          <>
            <Menu.Item position='right'>
              <Image src='/assets/user.png' avatar spaced='right' />
              <Dropdown pointing='top left' text={user.email}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={handleLogout}
                    text='Log out'
                    icon='power'
                  />
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
});
