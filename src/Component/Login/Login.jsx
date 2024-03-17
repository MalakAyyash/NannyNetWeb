import React, { useState } from 'react'
import './Login.css';



export default function Login({ toggleForm }) {
  console.log('im at login')

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Your login logic here
  };

  return (
    <div>
      <div className="dropdown">
        <button type="button" className="btn LoginBtn" data-bs-toggle="dropdown" aria-expanded="false">
          <p className=''>Login</p>
        </button>
        <form className="dropdown-menu p-2" onSubmit={handleSubmit}>
          <div className="mb-3 pt-4">
            <input type="email" className="form-control border-0 border-bottom" id="exampleDropdownFormEmail2" placeholder="Email" />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control border-0 border-bottom" id="exampleDropdownFormPassword2" placeholder="Password" />
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
              <label className="form-check-label" htmlFor="dropdownCheck2">
                Remember me
              </label>
            </div>
          </div>
          <button type="submit" className="btn w-100 LoginBtn2">Log In</button>
          <div className="dropdown-divider" />
          <p>New to this site?<button className="dropdown-item w-25" onClick={() => toggleForm()}>Sign up</button></p>
       

        </form>
      </div>        
       </div>
  )
}