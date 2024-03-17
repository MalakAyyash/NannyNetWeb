import React from 'react';
import './Service.css';

function Service() {

    return (
        <>
            <div className='AboutBackground Service p-5'>
                <h2 className='pb-5'>Our Services</h2>
                <div className='row w-75 m-auto'>
                    <div className='col-md-4'>
                        <div className="icon-container">
                            <i className="fas fa-baby-carriage"></i>
                        </div>
                        <h3 className='pb-5 pt-3'>Babysitter Home Visits</h3>
                        <p className='w-75 m-auto'>Our babysitters are happy to come to your home to watch your children. We offer flexible scheduling and competitive pricing.</p>
                    </div>
                    <div className='col-md-4'>
                        <div className="icon-container">
                            <i class="fa-solid fa-droplet"></i>
                        </div>
                        <h3 className='pb-5 pt-3'>Nanny Consultation</h3>
                        <p className='w-75 m-auto'>Our experienced nannies are available to provide consultation services to new parents. We can answer any questions you may have and provide guidance and support.</p>
                    </div>
                    <div className='col-md-4'>
                        <div className="icon-container">
                            <i class="fa-solid fa-heart"></i>
                        </div>
                        <h3 className='pb-5 pt-3'>Babysitter</h3>
                        <p className='w-75 m-auto'>Our babysitters are available for a variety of needs, from date nights to full-time care. All of our babysitters are thoroughly vetted and have experience working with children of all ages.</p>
                    </div>
                </div>
                <div className='d-flex justify-content-center'> 
                <button className=' pt-5 no-background border-bottom border-dark'>Learn More</button>
                </div>
            </div>
        </>
    )
}
export default Service;