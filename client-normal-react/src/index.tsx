import 'semantic-ui-css/semantic.min.css';
import 'react-toastify/dist/ReactToastify.min.css';
import './app/layouts/styles.css';
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import App from './app/layouts/App';
import { store, StoreContext } from './stores/store';
import { history } from './utils/route';
import ScrollToTop from './app/layouts/ScrollToTop';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <Router history={history}>
      <ScrollToTop />
      <App />
    </Router>
  </StoreContext.Provider>
);
