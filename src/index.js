import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import './Component/Home/Home.css';
import './Component/BabysittersList/Fonts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import { createBrowserRouter, RouterProvider } from 'react-router-dom'; // Import createBrowserRouter and RouterProvider
import reportWebVitals from './reportWebVitals';
import Layout from './Component/Layout/Layout.jsx';
import Home from './Component/Home/Home.jsx';
import ServicePage from './Component/ServicePage/ServicePage';
import BookingForm from './Component/BookingForm/BookingForm.jsx';
import BabysitterRequest from './Component/BabysitterRequest/BabysitterRequest.jsx';
import Account from './Component/Account/Account.jsx';
import SignUp from './Component/SignUp/SignUp.jsx';
import AdminHome from './Admin/AdminHome/AdminHome.jsx';
import UserEditAccount from './Component/UserEditAccount/UserEditAccount.jsx';
import DetailedBook from './Component/DetailedBook/DetailedBook.jsx';
import BabysittersList from './Component/BabysittersList/BabysittersList.jsx';
import UserProfile from './Component/UserProfile/UserProfile.jsx';
import BabysitterProfile from './Babysitter/BabysitterProfile/BabysitterProfile.jsx';
import BabysitterEditAccount from './Babysitter/BabysitterEditAccount/BabysitterEditAccount.jsx';
import BabysitterBookings from './Babysitter/BabysitterBookings/BabysitterBookings.jsx';
import Bookings from './Component/Bookings/Bookings.jsx';
import AllBabysitters from './Admin/AllBabysitters/AllBabysitters.jsx';
import AllCustomers from './Admin/AllCustomers/AllCustomers.jsx';
import WelcomePage from './Admin/WelcomePage/WelcomePage.jsx';
import PindingBabysitters from './Admin/PindingBabysitters/PindingBabysitters.jsx';
import BookingList from './Admin/BookingList/BookingList.jsx';
import AllAdmins from './Admin/AllAdmins/AllAdmins.jsx';
import CustomerInfoStatus from './Admin/AllCustomers/CustomerInfoStatus.jsx';



function Main() {


  
  const router = createBrowserRouter([
  { 
  path: '/' ,
  element: <Layout />,
  children: [
    { index: true, element: <Home /> },
    { path: 'Home', element: <Home /> },
    { path: 'service', element: <ServicePage /> },
    { path: 'BabysittersList', element: <BabysittersList /> },
    { path: 'DetailedBook/:id', element: <DetailedBook /> },
    { path: 'BookingForm', element: <BookingForm /> },
    { path: 'BabysitterRequest', element: <BabysitterRequest /> },
    { path: 'Account/:babysitterKey', element: <Account /> },
    { path: 'user-profile/:id', element: <UserProfile /> },
    { path: 'profile', element: <UserProfile /> },
    { path: 'UserEditAccount', element: <UserEditAccount /> },
    { path: 'signUp', element: <SignUp /> },
    { path: 'user-account', element: <UserEditAccount /> },
    { path: 'babysitter-profile/:id', element: <BabysitterProfile /> },
    { path: 'BabysitterEditAccount', element: <BabysitterEditAccount /> },
    { path: 'BabysitterBookings/:id', element: <BabysitterBookings /> },
    { path: 'customerBookings/:id', element: <Bookings /> },







  ],
},

// ======================================ADMIN=======================
{
  path: 'admin',
  element: <AdminHome />,
  children: [
    { index: true, element: <WelcomePage /> },
    { path: 'Home', element: <WelcomePage /> },
    { path: 'AllBabysitters', element: <AllBabysitters /> },
    { path: 'AllCustomers', element: <AllCustomers /> },
    { path: 'AllAdmins', element: <AllAdmins /> },
    { path: 'PindingBabysitters', element: <PindingBabysitters /> },
    { path: 'BookingList', element: <BookingList /> },
    { path: 'CustomerInfoStatus/:id', element: <CustomerInfoStatus /> },



   
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