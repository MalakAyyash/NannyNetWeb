import React from 'react';
import './About.css';

function About() {

  return (
  <div id="about" className="about-section">
    <div className='AboutBackground'>
      <div className='row p-5'>
          <div className='col-md-6 AboutContent'>
              <div className='w-75'>
                  <h2 className='start-justified pb-4'>About Nanny Net</h2>
                  <p className='start-justified'>Nanny Net is the easiest and most reliable way for parents to find trusted childcare providers. Our platform connects you with experienced babysitters and nannies in your area. We understand that finding a babysitter can be stressful, so we have made it our mission to make it as simple as possible. Our platform is easy to use and provides you with all the information you need to make an informed decision. We pride ourselves on the quality of our babysitters and nannies, and we only work with the best. Whether you need a babysitter for a night out or a nanny for a more long-term arrangement, we have you covered. Sign up today and start browsing through our selection of childcare providers.</p>
              </div>
          </div>
          <div className='col-md-6'>
              <img className="my-image" src="../images/About.jpg" alt="My Image" />
          </div>
      </div>
    </div>
  </div>
  )
}
export default About;