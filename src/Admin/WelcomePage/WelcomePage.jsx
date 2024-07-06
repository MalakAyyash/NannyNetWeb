import React from 'react';
import './WelcomePage.css';
import OverallOrdersChart from '../OrderAnalysisChart/OrderAnalysisChart';
import UserCountChart from '../AdminHome/UserCountChart/UserCountChart';

function WelcomePage({ orderCount = 100, completedCount = 80, cancellationCount = 10 }) {
    return (
        <div className="container mt-4">
        <div className=''>
          <p className='mt-4'>Analytics Overview</p>
          <p className='small text-secondary fst-normal'>overview of orders and users count.</p>
          <hr className='' />
        </div>
        <div className='row'>
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">Orders Chart</h5>
                <OverallOrdersChart />
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title">User Count Chart</h5>
                <UserCountChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default WelcomePage;
