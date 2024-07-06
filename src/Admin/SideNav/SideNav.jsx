import React, { useState } from 'react';
import './SideNav.css';
import { Link as RouterLink } from 'react-router-dom';


function SideNav() {
  const [showUsers, setShowUsers] = useState(false);
  const [showAdminsSubMenu, setShowAdminsSubMenu] = useState(false);
  const [showBabysittersSubMenu, setShowBabysittersSubMenu] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard'); // State to track active menu item

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);}

  const toggleUsers = () => {
    setShowUsers(!showUsers);
  };

  const toggleAdminsSubMenu = () => {
    setShowAdminsSubMenu(!showAdminsSubMenu);
  };

  const toggleBabysittersSubMenu = () => {
    setShowBabysittersSubMenu(!showBabysittersSubMenu);
  };

  return (
    <div className="d-flex flex-column flex-shrink-0 pt-4 bg-dark sideNav" style={{ height: '100vh', width: 280 }}>
      <ul className="nav nav-pills flex-column mb-auto">
      <li className={`nav-item pt-3 ${activeMenuItem === 'dashboard' ? 'active' : ''}`}>
            <RouterLink to="/Admin" className="nav-link " onClick={() => handleMenuItemClick('dashboard')}><i className="fas fa-home me-2"></i>Dashboard</RouterLink>
        </li>

        <li className="nav-item pt-3 menu">
          <a href="#" className="nav-link text-light" onClick={toggleUsers}>
            <div className="d-flex justify-content-between align-items-center">
              <div className="col-md-10">
              <i class="fa-solid fa-user-group me-2"></i>
                Users
              </div>
              <div className="col-md-2 d-flex justify-content-end">
                <span className=" ">{showUsers ? '▼' : '>'}</span>
              </div>
            </div>
          </a>
          {showUsers && (
            <ul className="nav flex-column sub-menu">
              <li className="nav-item pt-2">
                <a href="#" className="nav-link text-light" onClick={toggleAdminsSubMenu}>
                    <div className="row">
                        <div className="col-md-10">
                        <i className="fa-brands fa-black-tie ps-4 pe-3"></i>
                  Admins
                        </div>
                        <div className="col-md-2 d-flex justify-content-end">
                        <span className="ml-auto">{showAdminsSubMenu ? '▼' : '>'}</span>

                        </div>
                    </div>
                 
                </a>
                {showAdminsSubMenu && (
                  <ul className="nav flex-column sub-sub-menu">
                     <li className={`nav-item pt-3 ${activeMenuItem === 'AllAdmins' ? 'active' : ''}`}>
                      <RouterLink to="/Admin/AllAdmins" className="nav-link " onClick={() => handleMenuItemClick('AllAdmins')}><i class="fa-solid fa-users ps-5 pe-3"></i>All Admins</RouterLink>
                    </li>

                    <li className="nav-item pt-2 pb-1">
                        
                      <a href="#" className="nav-link text-light" style={{ fontSize: '0.9rem' }}>
                      <i class="fa-solid fa-user-plus ps-5 pe-3"></i>
                        Add Admin
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item pt-2">
                <a href="#" className="nav-link text-light" onClick={toggleBabysittersSubMenu}>
                <div className="row">
                        <div className="col-md-10">
                        <i className="fa-solid fa-user-tie ps-4 pe-3"></i>
                  Babysitters
                        </div>
                        <div className="col-md-2 d-flex justify-content-end">
                        <span className="ml-auto">{showBabysittersSubMenu ? '▼' : '>'}</span>

                        </div>
                    </div>
                </a>
                {showBabysittersSubMenu && (
                  <ul className="nav flex-column sub-sub-menu">
                    <li className={`nav-item pt-3 ${activeMenuItem === 'AllBabysitters' ? 'active' : ''}`}>
                      <RouterLink to="/Admin/AllBabysitters" className="nav-link " onClick={() => handleMenuItemClick('AllBabysitters')}><i class="fa-solid fa-users ps-5 pe-3"></i>All Babysitters</RouterLink>
                    </li>
                    <li className={`nav-item pt-3 ${activeMenuItem === 'PindingBabysitters' ? 'active' : ''}`}>
                    <RouterLink to="/Admin/PindingBabysitters" className="nav-link " onClick={() => handleMenuItemClick('PindingBabysitters')}><i class="fa-solid fa-user-clock ps-5 pe-3"></i>Pending Babysitters</RouterLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`nav-item pt-3 mb-2 ${activeMenuItem === 'AllCustomers' ? 'active' : ''}`}>
              <RouterLink to="/Admin/AllCustomers" className="nav-link " onClick={() => handleMenuItemClick('AllCustomers')}><i className="fa-solid fa-user  ps-4 pe-3"></i>All Customers</RouterLink>
              </li>
            </ul>
          )}
        </li>

        <li className={`nav-item mb-2 ${activeMenuItem === 'BookingList' ? 'active' : ''}`}>
        <RouterLink to="/Admin/BookingList" className="nav-link " onClick={() => handleMenuItemClick('BookingList')}><i className="fa-solid fa-table me-2"></i>Booking List</RouterLink>
        </li>

        <li className={`nav-item pt-3 mb-2 ${activeMenuItem === 'fastRequestList' ? 'active' : ''}`}>
          <RouterLink to="/Admin/fastRequestList" className="nav-link " onClick={() => handleMenuItemClick('fastRequestList')}><i class="fa-solid fa-clock-rotate-left me-2"></i>Fast Request</RouterLink>
        </li>

        <li className="nav-item pt-2">
                <a href="#" className="nav-link text-light" onClick={toggleBabysittersSubMenu}>
                <div className="row">
                        <div className="col-md-10">
                        <i class="fa-solid fa-percent pe-3"></i>
                  Offers
                        </div>
                        <div className="col-md-2 d-flex justify-content-end">
                        <span className="ml-auto">{showBabysittersSubMenu ? '▼' : '>'}</span>

                        </div>
                    </div>
                </a>
                {showBabysittersSubMenu && (
                  <ul className="nav flex-column sub-sub-menu">
                    <li className={`nav-item pt-3 ${activeMenuItem === 'addOffer' ? 'active' : ''}`}>
                      <RouterLink to="/Admin/AddOffer" className="nav-link " onClick={() => handleMenuItemClick('addOffer')}><i class="fa-solid fa-plus ps-5 pe-3"></i>Add Offer</RouterLink>
                    </li>
                    <li className={`nav-item pt-3 ${activeMenuItem === 'showOffer' ? 'active' : ''}`}>
                    <RouterLink to="/Admin/ViewOffer" className="nav-link " onClick={() => handleMenuItemClick('showOffer')}><i class="fa-regular fa-eye ps-5 pe-3"></i>Show Offers</RouterLink>
                    </li>
                  </ul>
                )}
              </li>
              <li className={`nav-item  ${activeMenuItem === 'blog' ? 'active' : ''}`}>
        <RouterLink to="/Admin/blog" className="nav-link " onClick={() => handleMenuItemClick('blog')}><i class="fa-brands fa-microblog  me-2"></i>
        Blog</RouterLink>
        </li>
        <li className={`nav-item  pt-4 ${activeMenuItem === 'payment' ? 'active' : ''}`}>
        <RouterLink to="/Admin/payment" className="nav-link " onClick={() => handleMenuItemClick('payment')}><i class="fa-solid fa-sack-dollar me-2"></i>
        Payment</RouterLink>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
