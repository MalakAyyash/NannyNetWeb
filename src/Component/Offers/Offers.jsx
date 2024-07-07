import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { FaClock, FaPercent, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Offers() {
  const [offers, setOffers] = useState([]);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = Cookies.get('jwt');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const offersResponse = await axios.get('http://176.119.254.188:8080/offerType/view/all');
        if (offersResponse.status === 200) {
          setOffers(offersResponse.data);
        } else {
          throw new Error('Failed to fetch offers');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message || 'Failed to fetch data. Please try again later.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to fetch data. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();

    if (token) {
      const fetchCurrentOffer = async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const currentOfferResponse = await axios.get('http://176.119.254.188:8080/customer/offer/view/current', config);
          if (currentOfferResponse.status === 200) {
            setCurrentOffer(currentOfferResponse.data);
          } else {
            throw new Error('Failed to fetch current offer');
          }
        } catch (error) {
          console.error('Error fetching current offer:', error);
          setError(error.message || 'Failed to fetch current offer. Please try again later.');
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.message || 'Failed to fetch current offer. Please try again later.',
          });
        }
      };

      fetchCurrentOffer();
    }
  }, [token]);

  const handleTakeOffer = (offerId) => {
    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You need to be logged in to take an offer.',
      });
      return;
    }

    if (!currentOffer) {
      navigate(`/offerDetails/${offerId}`);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'You already have an active offer.',
      });
    }
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
              <div key={offer.id} className="col-lg-4 col-md-4 mb-4">
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
                      disabled={!token || currentOffer}
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
