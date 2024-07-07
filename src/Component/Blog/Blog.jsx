import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import './Blog.css';

function Blog() {
  const userId = Cookies.get('userId');


  return (
    <>
  <div className='BlogBackground'>
    <h2 className='title pt-5 text-center'>Nanny Net Special Offers</h2>
    <div className='d-flex justify-content-center'>
    <RouterLink to={`/offers/${userId}`} className="nav-link position-relative">View Special Offers</RouterLink>
    </div>
  </div>
    </>
  )
}
export default Blog;