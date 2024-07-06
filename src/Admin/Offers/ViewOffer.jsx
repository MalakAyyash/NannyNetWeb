import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import './ViewOffer.css'; // Import the CSS file
import { FaClock, FaHourglassHalf, FaPercent, FaCalendarAlt } from 'react-icons/fa'; // Import some icons

function ViewOffer() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleDeleteOffer = async (offerId) => {
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

      const response = await axios.get(`http://176.119.254.188:8080/admin/offerType/delete/${offerId}`, config);

      if (response.status === 200) {
        // Remove the deleted offer from the local state
        const updatedOffers = offers.filter(offer => offer.id !== offerId);
        setOffers(updatedOffers);

        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Offer deleted successfully.',
        });
      } else {
        throw new Error('Failed to delete offer');
      }
    } catch (error) {
      console.error('Error deleting offer:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to delete offer. Please try again later.',
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
      <div className='DetaliedBook'>
      <p className="fst-normal">View Offers</p>
      </div>
      <div className="row pb-1">
        <div className="col-md-8">
          <p className='small text-secondary fst-normal'>Review the list of All Offers below.</p>
        </div>
      </div>
      <hr />
      <div className="row">
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
                      <FaClock /> <strong>Duration:</strong> {offer.duration}
                    </div>
                    <div className="detail-item">
                      <FaHourglassHalf /> <strong>Max Hours:</strong> {offer.maxHours} <strong>Hours</strong>
                    </div>
                    <div className="detail-item">
                      <FaPercent /> <strong>Discount:</strong> {offer.discountPercentage * 100}%
                    </div>
                    <div className="detail-item">
                      <FaCalendarAlt /> <strong>Times Allowed:</strong> {offer.timesAllowed}
                    </div>
                  </div>
                  <hr></hr>
                  <button
                    className="btn deleteBtn blueColor text-light ps-5 btn-sm"
                    onClick={() => handleDeleteOffer(offer.id)}
                  >
                    Delete
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
  );
}

export default ViewOffer;
