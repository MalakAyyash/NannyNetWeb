import React from 'react';
import { Outlet } from 'react-router-dom';
import SideNav from '../SideNav/SideNav.jsx';
import Footer from '../../Component/Footer/Footer.jsx';
import WelcomePage from '../WelcomePage/WelcomePage.jsx';
import AdminNavbar from '../AdminNavbar/AdminNavbar.jsx';

export default function AdminHome() {
  return (
    <div className='admin-home p-0 bg-body-tertiary'>
      <div className="row">
      <div className='admin-content col-md-2'>

        <SideNav />
      </div>
      <div className='welcome-page col-md-10 px-5'>
      <AdminNavbar />
      <Outlet />
      </div>

      </div>
      <Footer />
    </div>
  );
}
