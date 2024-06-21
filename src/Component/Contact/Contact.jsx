import React, { useState } from 'react';
import Cookies from 'js-cookie';
import './Contact.css';

function Contact() {
  const [message, setMessage] = useState('');
  const token = Cookies.get('jwt');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      comment: message,
    };

    try {
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const response = await fetch('http://176.119.254.188:8080/user/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        alert('Your message has been submitted successfully!');
        setMessage('');
      } else {
        alert('Failed to submit your message. Please try again.');
        console.log(await response.json()); // Log the response error
      }
    } catch (error) {
      alert('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  return (
    <div id='Contact' className='bg-light'>
      <div className='container-fluid'>
        <div className='contact-content d-flex justify-content-center align-items-center'>
          <div className='w-50'>
            <h2 className='pt-5 pb-3 text-light'>Contact Me</h2>
            <p className='w-50 m-auto pb-5 text-center'>
              Share your thoughts and experiences about our app. Click here to add your own text and become a part of our blog community. Your feedback helps us improve and grow!
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-group pb-5">
                <textarea
                  className="py-5 w-100 no-background border-bottom border-top form-item"
                  id="exampleInputtextArea"
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <div className='d-flex justify-content-center'>
                <button type="submit" className="btn no-background pb-5 text-light">Submit</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
