import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar/Navbar.jsx'
import Footer from '../Footer/Footer.jsx'
import Contact from '../Contact/Contact.jsx'


export default function Layout() {

  return (
    <div className=''>
    <Navbar />
    <Outlet />
    <Contact />
    <Footer />
    </div>
  )
}
