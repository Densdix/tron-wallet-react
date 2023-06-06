import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Vip from './components/Vip/Vip';
import Team from './components/Team/Team';
import Wallet from './components/Wallet/Wallet';
import Profile from './components/Profile/Profile';
import Deposit from './components/Deposit/Deposit';
import WithdrawalHistory from './components/WithdrawalHistory/WithdrawalHistory';
import DepositHistory from './components/DepositHistory/DepositHistory';
import { Provider } from 'react-redux';
import store from './redux/store';
import FAQ from './components/FAQ/FAQ';
// import Preloader from './components/common/Preloader/Preloader';

// const LazyTeamComponent = React.lazy(() => import('./components/Team/Team'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "/vip",
        element: <Vip />
      },
      {
        path: "/team",
        element: <Team/>
      },
      {
        path: "/wallet",
        element: <Wallet />
      },
      {
        path: "/profile",
        element: <Profile />
      },
      {
        path: "/deposit",
        element: <Deposit />
      },
      {
        path: "/withdrawalhistory",
        element: <WithdrawalHistory />
      },
      {
        path: "/deposithistory",
        element: <DepositHistory />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "*",
    element: <Navigate to="/" />
  },

])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
