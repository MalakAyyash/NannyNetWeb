import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { FaClock, FaPercent, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function CustomerOffers() {
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOffer = async () => {
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

        const response = await axios.get('http://176.119.254.188:8080/customer/offer/view/current', config);

        if (response.status === 200) {
          setOffer(response.data);
        } else {
          throw new Error('Failed to fetch offer');
        }
      } catch (error) {
        console.error('Error fetching offer:', error);
        setError(error.message || 'Failed to fetch offer. Please try again later.');
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to fetch offer. Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOffer();
  }, []);

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

  if (!offer) {
    return (
      <div>
        <p>No offer details available.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="Service mt-5">
        <div className="row mb-5">
          <div className="col-md-4 mb-4">
            <div className="card rounded-0">
              <div className="card-body">
                <span className="badge">New</span>
                <div className="offer-icon text-center">
                  <FaCalendarAlt />
                </div>
                <h5 className="card-title text-center w-100">{offer.offerType.description}</h5>
                <hr />
                <div className="details mb-3">
                  <div className="detail-item">
                    <FaClock /> <strong className="pe-1">Duration:</strong> {offer.offerType.duration}
                  </div>
                  <div className="detail-item">
                    <FaCalendarAlt /> <strong className="pe-1">Number of Days:</strong> {offer.offerType.timesAllowed}
                  </div>
                  <div className="detail-item">
                    <FaPercent /> <strong className="pe-1">Discount:</strong> {offer.offerType.discountPercentage * 100}%
                  </div>
                  <div className="detail-item">
                    <strong className="text-danger">UP TO {offer.offerType.maxHours} HOURS PER ORDER!</strong>
                  </div>
                  <div className="detail-item">
                    <strong className="pe-1">Max Stars:</strong> {offer.maxStars}
                  </div>
                  <div className="detail-item">
                    <strong className="pe-1">Price:</strong> ${offer.price}
                  </div>
                  <div className="detail-item">
                    <strong className="pe-1">Remaining Times:</strong> {offer.timesLeft}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOffers;
