import React, { useState } from 'react'



export default function SignUp({ toggleForm }) {
  console.log('im at SignUp')

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Your login logic here
  };

  return (
    <div>
      <div className="dropdown">
        <button type="button" className="btn LoginBtn" data-bs-toggle="dropdown" aria-expanded="false">
            Signup       
        </button>
        <form className="dropdown-menu p-2" onSubmit={handleSubmit}>
        <div className="pt-2">
            <input type="text" className="form-control border-0 border-bottom" id="exampleDropdownFormname" placeholder="User Name" />
          </div>
          <div className="mb-3 pt-2">
            <input type="email" className="form-control border-0 border-bottom" id="exampleDropdownFormEmail2" placeholder="Email" />
          </div>   
          <div className="mb-3">
            <input type="password" className="form-control border-0 border-bottom" id="exampleDropdownFormPassword2" placeholder="Password" />
          </div>
          <div className="mb-3">
            <input type="password" className="form-control border-0 border-bottom" id="exampleDropdownFormPassword3" placeholder="Confirm Password" />
          </div>
          <div className="mb-3">
          </div>
          <button type="submit" className="btn w-100 LoginBtn2">Sign Up</button>
          <div className="dropdown-divider" />
          <p>Already Have Account?<button type="button" className="dropdown-item w-25" onClick={() => toggleForm()}>Log In</button></p>
       

        </form>
      </div>        
       </div>
  )
}