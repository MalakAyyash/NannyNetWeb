import React from 'react';
import './BookOnline.css';
import './Fonts.css';
import { Link as RouterLink } from 'react-router-dom';
import BabysitterData from '../BabysitterData/BabysitterData';
import { Link } from 'react-router-dom';




function BookOnline() {
    const babysitterData = BabysitterData(); // get the data of the babysitter
    // console.log("babysitterData:", babysitterData);
    // console.log("Keys:", Object.keys(babysitterData));


    return (
        <>
        <div className='Book-container-fluid'>
            <div className='Service pt-5 mt-5'>
                <h2 className='py-5'>Book Online</h2>
                <div className=''>
                    <p>Check out our availability and book the date and time that works for you</p>
                    <div className="row border-top">
                        <div className='col-md-1'>
                            <p className='pt-2 text'>Filter by:</p>
                        </div>
                        <div class="dropdown col-md-2 border-left">
                            <a class="btn btn-secondary border-0 dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Location (All)
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Lacation 1</a></li>
                                <li><a class="dropdown-item" href="#">Location 2</a></li>
                                <li><a class="dropdown-item" href="#">Location 3</a></li>
                            </ul>
                        </div>
                        <div class="dropdown col-md-2">
                            <a class="btn btn-secondary dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Staff Member (All)
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#"> Staff Member 1</a></li>
                                <li><a class="dropdown-item" href="#"> Staff Member 2</a></li>
                                <li><a class="dropdown-item" href="#"> Staff Member 3</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className='py-5 my-3'>
                        <div className='row'>
                        {Object.keys(babysitterData).map((babysitterKey) => (
   
                            <div className="col-md-4" key={babysitterKey}>
                                <div className="card shadow mb-5" style={{width: '15rem'}}>
                                    <div className=' w-50 d-flex m-auto mt-2' style={{ overflow: 'hidden', borderRadius: '100%', aspectRatio: '1/1' }}>
                                    <img src={babysitterData[babysitterKey].photo} className="card-img-top w-100" alt="..." />

                                        </div>
                                    <div className="card-body">
                                        <h3>{babysitterData[babysitterKey].fname} {babysitterData[babysitterKey].lname}</h3>
                                        <hr></hr>
                                        <p>{babysitterData[babysitterKey].price}$</p>
                                        <Link to={`/Account/${babysitterKey}`}>
                                        <button className="text-light border-0 w-100">View Profile</button>
                                        </Link>

                                    </div>
                                </div>
                             </div>
                             ))}
                        </div>
                        
                    </div>
  
                    <div className='mb-5'>
                        <button className='text border-0 bg-light d-flex m-auto'>See All</button>
                    </div>
                </div>
                </div>
                </div>
        </>
    )
}
export default BookOnline;