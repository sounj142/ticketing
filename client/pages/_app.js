import 'bootstrap/dist/css/bootstrap.css';
import './app.css';
import Header from '../components/header';
import buildClient from '../api/build-client';

export default function AppComponent({ Component, pageProps, prop_data }) {
  return (
    <>
      <Header currentUser={prop_data.currentUser} />
      <div className='container'>
        <Component {...pageProps} {...prop_data} />
      </div>
    </>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data: currentUser } = await client.get('/api/users/currentuser');

  const pageProps = appContext.Component.getInitialProps
    ? await appContext.Component.getInitialProps(
        appContext.ctx,
        client,
        currentUser
      )
    : {};

  return {
    prop_data: {
      currentUser,
      ...pageProps,
    },
  };
};
