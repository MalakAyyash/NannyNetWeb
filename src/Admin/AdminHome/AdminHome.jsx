import React from 'react'
import { Outlet } from 'react-router-dom'
import SideNav from '../SideNav/SideNav.jsx'
import Footer from '../../Component/Footer/Footer.jsx'
import AdminNavbar from '../AdminNavbar/AdminNavbar.jsx'


export default function AdminHome() {

  return (
    <div className=''>
    <AdminNavbar/>
    <SideNav />
    <Outlet />
    <Footer />
    </div>
  )
}
