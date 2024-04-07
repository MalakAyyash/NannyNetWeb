import React from 'react';
import './WelcomePage.css';
import OverallOrdersChart from '../OrderAnalysisChart/OrderAnalysisChart';
import ProfitAnalysisChart from '../ProfitAnalysisChart/ProfitAnalysisChart';
import UserCountChart from '../AdminHome/UserCountChart/UserCountChart';
import OrderTableAtHome from '../OrderTableAtHome/OrderTableAtHome';
import AdminNavbar from '../AdminNavbar/AdminNavbar';

function WelcomePage() {
    // Dummy numbers for demonstration
    const orderCount = 100;
    const completedCount = 80;
    const cancellationCount = 10;

    return (
        <div className='p-0'>
<AdminNavbar/>
       <div className='pt-3'>
        <div className="row pt-3 mx-0 ">
            <div className="col-md-6 p-0">
                <div className="card mb-3 rounded-0 shadow">
                    <div className="row p-2">
                        <div className="col-md-2 ">
                            <div className='redColor p-2 border rounded-1'>
                            <i className="fa-solid fa-book text-light fs-4 d-flex justify-content-center py-1"></i>
                            </div>
                        </div>
                        <div className="card-body col-md-6 p-0 d-flex align-items-center ">
                            <h6 className="card-title">Documentation and App Policies</h6>
                        </div>
                        <div className="card-body col-md-4 p-0 d-flex align-items-center justify-content-center">
                            <button className=" bg-dark ms-3 p-2 border rounded-0 text-light fw-semibold shadow">
                                LEARN MORE
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-3 rounded-0 shadow">
                    <div className="row p-2">
                        <div className="col-md-2 ">
                            <div className='redColor p-2 border rounded-1'>
                            <i className="fa-solid fa-envelope text-light fs-4 d-flex justify-content-center py-1"></i>
                            </div>
                        </div>
                        <div className="card-body col-md-6 p-0 d-flex align-items-center ">
                            <h6 className="card-title">Need help? Contact support team</h6>
                        </div>
                        <div className="card-body col-md-4 p-0 d-flex align-items-center justify-content-center">
                            <button className="p-2 bg-dark ms-3  border rounded-0 text-light fw-semibold shadow d-flex m-auto">
                                CONTACT NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className='row mt-3 p-0'>
            <div className='col-md-6  px-4'>
                <div className='row'>
                    <div className='col-md-6  p-0 shadow'>
                        <div className='statics p-2 d-flex justify-content-center'>
                            $ Profit

                        </div>
                        <div className='pt-3'>
                        <ProfitAnalysisChart/>
                        </div>
                    </div>
                    <div className='col-md-5 p-0  ms-4 shadow'>
                        <div className='statics p-2 d-flex justify-content-center'>
                            Users Count

                        </div>
                        <div className='pt-3'>
                        <UserCountChart/>
                        </div>

                    </div>
                </div>

                <div className='pt-4' >
                    <OrderTableAtHome/>


                </div>
            </div>
            <div className='col-md-6 border p-0 shadow'>
                <div className='statics p-2 d-flex justify-content-center'>
                   ORDERS
                </div>
                <div className='UserCount'>
                    <ul className="nav px-2 pt-3">
                        <li className="nav-item col-md-4 d-flex flex-column align-items-center">
                            <div>Total Orders</div>
                            <div className='fw-medium'>{orderCount}</div>
                        </li>
                        <li className="nav-item col-md-4 d-flex flex-column align-items-center">
                            <div>completed</div>
                            <div className='fw-medium'>{completedCount}</div>
                        </li>
                        <li className="nav-item col-md-3 d-flex flex-column align-items-center">
                            <div>cancellation</div>
                            <div className='fw-medium'>{cancellationCount}</div>
                        </li>
                    </ul>
                </div>
                <div className='pt-4'>
                    <OverallOrdersChart/>
                </div>
            </div>
        </div>
        </div>
        </div>
    );
}

export default WelcomePage;
