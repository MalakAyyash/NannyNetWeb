import React, { useEffect, useState } from 'react';
import PaymentData from './PaymentData';
import ProfitAnalysisChart from '../ProfitAnalysisChart/ProfitAnalysisChart';
import Profit from '../ProfitAnalysisChart/Profit';


function Payment() {
    const [activeTab, setActiveTab] = useState('paymentData');


    return (
        <div className='mx-4'>
            <div className=' normalFont'>
                <div className=''>
                <div className='DetaliedBook'>
        <p className='mt-4 fst-normal'>All Payments</p>
      </div>
      <p className='small text-secondary fst-normal'>Manage the list of All payments below.</p>
        <hr></hr>
                    <ul className="nav nav-tabs">
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'paymentData' ? 'active' : ''}`} onClick={() => setActiveTab('paymentData')} href="#">
                                Payment Data
                            </a>
                        </li>
                        <li className="nav-item">
                            <a className={`nav-link text-dark px-5 ${activeTab === 'paymentAnalysis' ? 'active' : ''}`} onClick={() => setActiveTab('paymentAnalysis')} href="#">
                                Payment Analysis
                            </a>
                        </li>
                       
                    </ul>
                    <div>
                      
                        {activeTab === 'paymentData' && <PaymentData/>} 
                        {activeTab === 'paymentAnalysis' && <Profit/>} 


                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;
