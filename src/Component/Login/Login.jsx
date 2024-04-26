import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Cookies from 'js-cookie';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page refresh

    if (!email || !password) {
      toast.error('Please enter both email and password.');
    } else {
      try {
        const response = await axios.post('http://176.119.254.188:8080/login', {
          email: email,
          password: password
        });

        if (response.status === 200) {
          const { jwt, id, role } = response.data; // Extract token and role from response
          toast.success('Login successful!');

          // Store user data in cookies
          Cookies.set('jwt', jwt);
          Cookies.set('userId', id);
          Cookies.set('userRole', role);

          // Redirect based on user role
          if (role === 'a') {
            // Redirect to admin home page
            navigate('/admin/home');
          } else {
            // Reload the page (you can redirect to another page here if needed)
            window.location.reload();
          }
        } else {
          setLoginError('Invalid email or password.');
        }
      } catch (error) {
        setLoginError('Invalid email or password.');
      }
    }
  };

  return (
    <div>
      <div className="dropdown">
        <button type="button" className="btn LoginBtn" data-bs-toggle="dropdown" aria-expanded="false">
          <p className="">Login</p>
        </button>
        <form className="dropdown-menu p-2" onSubmit={handleLogin}>
          {loginError && <p className="text-danger mb-2">{loginError}</p>}
          <div className="mb-3 pt-4">
            <input
              type="email"
              className="form-control border-0 border-bottom"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control border-0 border-bottom"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" id="dropdownCheck2" />
              <label className="form-check-label" htmlFor="dropdownCheck2">
                Remember me
              </label>
            </div>
          </div>
          <button type="submit" className="btn w-100 LoginBtn2">
            Log In
          </button>
          <div className="dropdown-divider" />
          <p>
            New to this site?{' '}
            <Link to={`/signUp`} className="text-decoration-none">
              <button className=" border-0 bg-light">Sign up</button>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
