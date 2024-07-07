import React from 'react';
import './ServicePage.css';


function ServicePage() {

    return (
        <>
        <div className='container-fluid'>
            <div className='AboutBackground Service pt-5 mt-5'>
                <h2 className=''>Our Services</h2>
                <div className='row pb-5 w-75 m-auto'>
                    <div className='col-md-4 pt-5'>
                        <div className="icon-container">
                            <i className="fas fa-baby-carriage"></i>
                        </div>
                        <h3 className=' pt-3'>Babysitting at Home</h3>
                        <p className='w-75 m-auto'>At Nanny Net, we offer the convenience of babysitting in your own home. Our experienced and trusted babysitters will come to your house and take care of your children while you go out and enjoy your time.</p>
                    </div>
                    <div className='col-md-4 pt-5'>
                        <div className="icon-container">
                            <i class="fa-solid fa-droplet"></i>
                        </div>
                        <h3 className='pt-3'>Lactation Support</h3>
                        <p className='w-75 m-auto'>Our lactation consultants are here to help you with any breastfeeding issues you may be facing. We offer one-on-one consultations to help you improve your breastfeeding experience and ensure that your baby is getting the nutrition they need.</p>
                    </div>
                    <div className='col-md-4 pt-5'>
                        <div className="icon-container">
                        <i class="fa-solid fa-ice-cream"></i>                         </div>
                        <h3 className=' pt-3'>Expert Advice</h3>
                        <p className='w-75 m-auto'>Our team of childcare experts is always available to provide you with alternative advice on how to handle different situations related to your child's care. We understand that every child is unique, and we tailor our advice to meet the specific needs of your family.</p>
                    </div>
                    <div className='col-md-4'>
                        <div className="icon-container">
                        <i class="fa-solid fa-puzzle-piece"></i>
                        </div>
                        <h3 className='pt-3'>Child Development Resources</h3>
                        <p className='w-75 m-auto'>We understand that every child goes through different stages of development, and we provide resources to help you navigate those stages. From educational toys to expert advice, we're here to support your child's growth and development.</p>
                    </div>
                    <div className='col-md-4 pb-3'>
                        <div className="icon-container">
                        <i class="fa-solid fa-baby"></i>
                        </div>
                        <h3 className='pt-3'>Sleep Solutions</h3>
                        <p className='w-75 m-auto'>Our sleep lab offers solutions to help your child get the restful sleep they need for optimal growth and development. From sleep training to bedtime routines, we're here to help you establish healthy sleep habits for your child.</p>
                    </div>
                    </div>
                <div className=''>
                <img className="ServicePageImg" src="../images/babycare2.jpg" alt="Baby care" />

                </div>
                </div>
                </div>
        </>
    )
}
export default ServicePage;