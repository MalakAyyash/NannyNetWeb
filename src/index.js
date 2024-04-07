import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './Component/Home/Home.css';
import './Component/BookOnline/Fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter and RouterProvider
import reportWebVitals from './reportWebVitals';
import Layout from './Component/Layout/Layout.jsx';
import Home from './Component/Home/Home.jsx';
import ServicePage from './Component/ServicePage/ServicePage';
import BookOnline from './Component/BookOnline/BookOnline.jsx';
import DetailedBook from './Component/DetailedBook/DetailedBook.jsx';
import BookingForm from './Component/BookingForm/BookingForm.jsx';
import BabysitterRequest from './Component/BabysitterRequest/BabysitterRequest.jsx';
import Profile from './Component/Profile/Profile.jsx';
import Account from './Component/Account/Account.jsx';
import SignUp from './Component/SignUp/SignUp.jsx';
import AdminHome from './Admin/AdminHome/AdminHome.jsx';
import UserAccount from './Component/UserAccount/UserAccount.jsx';
import UserEditAccount from './Component/UserEditAccount/UserEditAccount.jsx';



function Main() {


  
  const router = createBrowserRouter([
  { 
  path: '/' ,
  element: <Layout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'Home', element: <Home /> },
    { path: 'service', element: <ServicePage /> },
    { path: 'BookOnline', element: <BookOnline /> },
    { path: 'DetailedBook/:babysitterKey', element: <DetailedBook /> },
    { path: 'BookingForm', element: <BookingForm /> },
    { path: 'BabysitterRequest', element: <BabysitterRequest /> },
    { path: 'Account/:babysitterKey', element: <Account /> },
    { path: 'profile', element: <UserAccount /> },
    { path: 'UserEditAccount', element: <UserEditAccount /> },
    { path: 'signUp', element: <SignUp /> },



  ],
},
// ======================================ADMIN=======================
{
  path: 'admin',
  element: <AdminHome />,
  children: [
    
   
  ],
},
]);

  return (
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
reportWebVitals();