import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { FaClock, FaPercent, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) {
          console.error('Token not found.');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://176.119.254.188:8080/offerType/view/all', config);

        if (response.status === 200) {
          setOffers(response.data);
        } else {
          throw new Error('Failed to fetch offers');
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
        setError(error.message || 'Failed to fetch offers. Please try again later.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to fetch offers. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const handleTakeOffer = (offerId) => {
    navigate(`/offerDetails/${offerId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="Service pt-5 mt-5">
        <h2 className="">View Offers</h2>
        <div className="row">
          <div className="col-md-8">
            <p className='py-0 my-0'>Review the list of All Offers below.</p>
          </div>
        </div>
        <hr />
        <div className="row mb-5">
          {offers.length > 0 ? (
            offers.map((offer) => (
              <div key={offer.id} className="col-md-4 mb-4">
                <div className="card rounded-0">
                  <div className="card-body">
                    <span className="badge">New</span>
                    <div className="offer-icon text-center">
                      <FaCalendarAlt />
                    </div>
                    <h5 className="card-title text-center w-100 ">{offer.description}</h5>
                    <hr />
                    <div className="details mb-3">
                      <div className="detail-item">
                        <FaClock /> <strong className='pe-1'>Duration:</strong> {offer.duration} months
                      </div>
                      <div className="detail-item">
                        <FaCalendarAlt /> <strong className='pe-1'>Number of Days:</strong> {offer.timesAllowed}
                      </div>
                      <div className="detail-item">
                        <FaPercent /> <strong className='pe-1'>Discount:</strong> {offer.discountPercentage * 100}%
                      </div>
                      <div className="detail-item">
                        <strong className='text-danger'>UP TO {offer.maxHours} HOURS PER ORDER!</strong>
                      </div>
                    </div>
                    <hr></hr>
                    <button
                      className="btn deleteBtn btn-red-background w-100 text-light ps-5 btn-sm"
                      onClick={() => handleTakeOffer(offer.id)}
                    >
                      Take This Offer
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No offer details available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Offers;
