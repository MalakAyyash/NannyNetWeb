import React, { useState } from 'react';
import './SideNav.css';

function SideNav() {
  const [showUsers, setShowUsers] = useState(false);
  const [showAdminsSubMenu, setShowAdminsSubMenu] = useState(false);
  const [showBabysittersSubMenu, setShowBabysittersSubMenu] = useState(false);

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
        <li className="nav-item pt-3">
          <a href="#" className="nav-link active" aria-current="page">
            <i className="fas fa-home me-2"></i>
            Dashboard
          </a>
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
                    <li className="nav-item pt-2">
                      <a href="#" className="nav-link text-light" style={{ fontSize: '0.9rem' }}>
                      <i class="fa-solid fa-users ps-5 pe-3"></i>
                        All Admins
                      </a>
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
                    <li className="nav-item pt-2">
                      <a href="#" className="nav-link text-light" style={{ fontSize: '0.9rem' }}>
                      <i class="fa-solid fa-users ps-5 pe-3"></i>

                        All Babysitters
                      </a>
                    </li>
                    <li className="nav-item pt-2 pb-1">
                      <a href="#" className="nav-link text-light" style={{ fontSize: '0.9rem' }}>
                      <i class="fa-solid fa-user-clock ps-5 pe-3"></i>
                        Pinding Babysitters
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li className="nav-item pt-2">
                <a href="#" className="nav-link text-light" style={{ fontSize: '0.9rem' }}>
                  <i className="fa-solid fa-user  ps-4 pe-3"></i>
                  Customers
                </a>
              </li>
            </ul>
          )}
        </li>

        <li className="nav-item menu">
          <a href="#" className="nav-link link-dark text-light">
            <i className="fa-solid fa-table me-2"></i>
            Booking List
          </a>
        </li>

        <li className="nav-item menu">
          <a href="#" className="nav-link link-dark text-light">
          <i class="fa-brands fa-microblog me-2 mt-4"></i>
            Blog
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SideNav;
