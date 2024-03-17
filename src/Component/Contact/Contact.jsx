import React from 'react';
import './Contact.css';

function Contact() {

  return (
    <div id='Contact' className='bg-light' >
        <div className='container-fluid'>
            <div className='contact-content d-flex justify-content-center align-items-center'>
                <div className='w-50'>
                    <h2 className='pt-5 pb-3 text-light'>Contact Me</h2>
                    <p className='w-50 m-auto pb-5'>I'm a paragraph. Click here to add your own text and edit me. I’m a great place for you to tell a story and let your users know a little more about you.</p>
                    <form>
                        <div className='row pb-3'>
                            <div className="form-group col-md-6">
                                <input type="text" className="no-background border-bottom w-100 form-item" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Name" />
                            </div>
                            <div className="form-group col-md-6">
                                <input type="email" className="no-background border-bottom w-100 form-item" id="exampleInputPassword1" placeholder="Email" />
                            </div>
                        </div>
                        <div className="form-group pb-5">
                            <textarea  className="py-5 w-100 no-background border-bottom form-item" id="exampleInputtextArea" placeholder="Type your massage here..." />
                        </div>
                        <div className='d-flex justify-content-center'>
                        <button type="submit" className="btn no-background pb-5 text-light">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}
export default Contact;