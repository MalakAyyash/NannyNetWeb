import React from 'react';
import './Testimonials.css';

function Testimonials() {

    return (
        <div id="Testimonials" className='pb-3'>
            <div className='TestimonialsBackground p-5'>
                <h2 className='py-5'>Our Happy Customers</h2>
                <div className='d-flex align-items-center justify-content-center'>
                    <div className='w-75'>
                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">

                            <div className='d-flex align-items-center justify-content-center'>

                                <div class="carousel-inner pb-5 w-50">
                                    <div class="carousel-item active">

                                    </div>
                                    <div class="carousel-item">
                                        <p>“I was really impressed with the nanny consultation services provided by Nanny Net. The consultant was knowledgeable and provided great advice.” </p>   </div>
                                    <div class="carousel-item">
                                        <p>“I've used Nanny Net for all my babysitting needs and have never been disappointed. The quality of the babysitters is exceptional.”</p>    </div>
                                </div>
                                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Testimonials;