import Router from 'next/router';
import axios from 'axios';
import Link from 'next/link';

export default function Header({ currentUser }) {
  async function signOutHandle(event) {
    event.preventDefault();
    await axios.post('/api/users/signout');
    Router.push('/');
  }

  return (
    <div className='container'>
      <header className='d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom'>
        <Link href='#'>
          <span
            role='button'
            className='d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none'
            style={{ fontSize: '1.5rem' }}
          >
            <span className='fs-4'>GitTix</span>
          </span>
        </Link>

        <ul className='nav nav-pills'>
          {!currentUser && (
            <>
              <li className='nav-item'>
                <Link href='/auth/signup'>
                  <span role='button' className='nav-link'>
                    Sign Up
                  </span>
                </Link>
              </li>
              <li className='nav-item'>
                <Link href='/auth/signin'>
                  <span role='button' className='nav-link'>
                    Sign In
                  </span>
                </Link>
              </li>
            </>
          )}

          {!!currentUser && (
            <>
              <li className='nav-item'>
                <Link href='/orders'>
                  <span className='nav-link' role='button'>
                    My Orders
                  </span>
                </Link>
              </li>

              <li className='nav-item'>
                <Link href='/tickets/create'>
                  <span className='nav-link' role='button'>
                    Sell Tickets
                  </span>
                </Link>
              </li>

              <li className='nav-item'>
                <Link href='/' onClick={signOutHandle}>
                  <span
                    className='nav-link'
                    role='button'
                  >
                    Sign Out
                  </span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </header>
    </div>
  );
}
