import 'bootstrap/dist/css/bootstrap.css';
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
  const { data } = await buildClient(appContext.ctx).get(
    '/api/users/currentuser'
  );

  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  }

  return {
    prop_data: {
      currentUser: data,
      ...pageProps,
    },
  };
};
