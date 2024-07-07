import React from 'react';
import Welcome from '../Welcome/Welcome.jsx';
import About from '../About/About.jsx';
import Blog from '../Blog/Blog.jsx';
import Service from '../Service/Service.jsx';
import Testimonials from '../Testimonials/Testimonials.jsx';
import Contact from '../Contact/Contact.jsx';
import './Home.css';


function Home() {
  return (
    <>
    <div className='Home'>
        <div className='container-fluid'>
        <Welcome />
        <About />
        <Blog />
        <Service/>
        <div className='empty-section'></div>
        </div>
    </div>
    </>
  )
}
export default Home;