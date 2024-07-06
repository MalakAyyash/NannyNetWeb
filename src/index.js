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
import BabysitterRequest from './Component/BabysitterRequest/BabysitterRequest.jsx';
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
import Feedback from './Component/Feedback/Feedback.jsx';
import BabysitterFeedback from './Babysitter/BabysitterFeedback/BabysitterFeedback.jsx';
import AllFeedback from './Admin/AllCustomers/AllFeedback.jsx';
import BabysitterInfoStatus from './Admin/AllBabysitters/BabysitterInfoStatus.jsx';
import AllBabysitterFeedback from './Admin/AllBabysitters/AllBabysitterFeedback.jsx';
import BabysitterNotification from './Babysitter/BabysitterNotification/BabysitterNotification.jsx';
import FastBooking from './Component/FastBooking/FastBooking.jsx';
import CustomerNotification from './Component/CustomerNotification/CustomerNotification.jsx';
import FastOrderList from './Admin/FastOrderList/FastOrderList.jsx';
import SuggestedBabysitters from './Admin/FastOrderList/SuggestedBabysitters.jsx';
import AllBabysitterOrder from './Admin/AllBabysitters/AllBabysitterOrder.jsx';
import AddOffer from './Admin/Offers/AddOffer.jsx';
import ViewOffer from './Admin/Offers/ViewOffer.jsx';
import ViewBlog from './Admin/Blog/Blog.jsx';
import Offers from './Component/Offers/Offers.jsx';
import OfferDetails from './Component/Offers/OfferDetails.jsx';
import OfferBooking from './Component/OfferBooking/OfferBooking.jsx';
import Payment from './Admin/Payment/Payment.jsx';
import OfferDetailedBook from './Component/DetailedBook/OfferDetailedBook.jsx';



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
    { path: 'DetailedBook', element: <DetailedBook /> },
    { path: 'OfferDetailedBook', element: <OfferDetailedBook /> },
    { path: 'BabysitterRequest', element: <BabysitterRequest /> },
    { path: 'user-profile/:id', element: <UserProfile /> },
    { path: 'profile', element: <UserProfile /> },
    { path: 'UserEditAccount', element: <UserEditAccount /> },
    { path: 'signUp', element: <SignUp /> },
    { path: 'user-account', element: <UserEditAccount /> },
    { path: 'babysitter-profile/:id', element: <BabysitterProfile /> },
    { path: 'BabysitterEditAccount', element: <BabysitterEditAccount /> },
    { path: 'BabysitterBookings/:id', element: <BabysitterBookings /> },
    { path: 'customerBookings/:id', element: <Bookings /> },
    { path: 'Feedback/:id', element: <Feedback /> },
    { path: 'BabysitterFeedback/:id', element: <BabysitterFeedback /> },
    { path: 'BabysitterNotification/:id', element: <BabysitterNotification /> },
    { path: 'CustomerNotification/:id', element: <CustomerNotification /> },
    { path: 'FastBooking/:id', element: <FastBooking /> },
    { path: 'offers/:id', element: <Offers /> },
    { path: 'offerDetails/:id', element: <OfferDetails /> },
    { path: 'offerBookings/:id', element: <OfferBooking /> },


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
    { path: 'BabysitterInfoStatus/:id', element: <BabysitterInfoStatus /> },
    { path: 'AllFeedback/:id', element: <AllFeedback /> },
    { path: 'AllBabysitterFeedback/:id', element: <AllBabysitterFeedback /> },
    { path: 'fastRequestList', element: <FastOrderList /> },
    { path: 'suggestedBabysitters/:id', element: <SuggestedBabysitters /> },
    { path: 'AllBabysitterOrder/:id', element: <AllBabysitterOrder /> },
    { path: 'AddOffer', element: <AddOffer /> },
    { path: 'ViewOffer', element: <ViewOffer /> },
    { path: 'blog', element: <ViewBlog /> },
    { path: 'payment', element: <Payment /> },









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