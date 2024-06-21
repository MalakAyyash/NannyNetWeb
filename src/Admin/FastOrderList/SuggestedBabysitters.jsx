import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './FastOrderList'; // Import the CSS file

function SuggestedBabysitters() {
  const { id } = useParams();
  const [availableBabysitters, setAvailableBabysitters] = useState([]);
  const [selectedCity, setSelectedCity] = useState(''); // State to store the selected city
  const [selectedType, setSelectedType] = useState(''); // State to store the selected type
  const [selectedStars, setSelectedStars] = useState(null); // State to store the selected stars
  const [selectedGender, setSelectedGender] = useState(''); // State to store the selected gender

  const fetchAvailableBabysitters = async () => {
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const response = await axios.post('http://176.119.254.188:8080/admin/order/fastOrder/suggest', { orderId: id }, config);

      if (response && response.data) {
        setAvailableBabysitters(response.data);
      }
    } catch (error) {
      console.error('Error fetching available babysitters:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Unknown error occurred.',
      });
    }
  };

  const handleAssign = async (babysitterId) => {
    try {
      const token = Cookies.get('jwt');
      if (!token) {
        console.error('Token not found.');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const completeResponse = await axios.post('http://176.119.254.188:8080/admin/order/fastOrder/complete', { employeeId: babysitterId, orderId: id }, config);

      if (completeResponse && completeResponse.data) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Babysitter has been assigned and order completed successfully.',
        });
        fetchAvailableBabysitters(); // refresh the list
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'warning',
          title: 'Already Assigned',
          text: 'The fast order has already been chosen by a babysitter.',
        });
      } else {
        console.error('Error assigning and completing order:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Unknown error occurred.',
        });
      }
    }
  };

  useEffect(() => {
    fetchAvailableBabysitters();
  }, [id]);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  const handleSelectStars = (stars) => {
    setSelectedStars(stars);
  };

  const handleSelectGender = (gender) => {
    setSelectedGender(gender);
  };

  const cities = Array.from(new Set(availableBabysitters.map(babysitter => babysitter.city)));
  const types = ['Full-Time', 'Part-Time'];
  const genders = ['Male', 'Female', 'Other']; // Define possible genders

  // Filter the babysitters based on the selected criteria
  const filteredBabysitters = availableBabysitters.filter(babysitter => {
    return (
      (selectedCity === '' || babysitter.city === selectedCity) &&
      (selectedType === '' || babysitter.type === selectedType) &&
      (selectedStars === null || babysitter.stars >= selectedStars) &&
      (selectedGender === '' || babysitter.user.gender === selectedGender)
    );
  });

  return (
    <div className="container mt-4">
      <div className='DetaliedBook'>
        <p className='mt-4 profileTitle'>Suggested Babysitters</p>
      </div>
      <div className="row border-top mb-4">
        <div className="col-md-1">
          <p className="pt-2 text">Filter by:</p>
        </div>
        <div className="dropdown col-md-2 border-left">
          <a
            className="btn btn-secondary border-0 dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Location ({selectedCity || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleCitySelect('')}>
                All
              </button>
            </li>
            {cities.map((city) => (
              <li key={city}>
                <button className="dropdown-item" onClick={() => handleCitySelect(city)}>
                  {city}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Type ({selectedType || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectType('')}>
                All
              </button>
            </li>
            {types.map((type) => (
              <li key={type}>
                <button className="dropdown-item" onClick={() => handleSelectType(type)}>
                  {type}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Stars ({selectedStars !== null ? `${selectedStars}+` : 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectStars(null)}>
                All
              </button>
            </li>
            {[1, 2, 3, 4, 5].map((stars) => (
              <li key={stars}>
                <button className="dropdown-item" onClick={() => handleSelectStars(stars)}>
                  {stars}+
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown col-md-2">
          <a
            className="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Gender ({selectedGender || 'All'})
          </a>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => handleSelectGender('')}>
                All
              </button>
            </li>
            {genders.map((gender) => (
              <li key={gender}>
                <button className="dropdown-item" onClick={() => handleSelectGender(gender)}>
                  {gender}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='d-flex justify-content-center'>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Gender</th>
              <th>Date Added</th>
              <th>Availability</th>
              <th>Type</th>
              <th>City</th>
              <th>Date of Birth</th>
              <th>Stars</th>
              <th>Number of Cancellations</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBabysitters.map((babysitter) => (
              <tr key={babysitter.user.id}>
                <td>{babysitter.user.id}</td>
                <td>
                  <Link to={`/admin/BabysitterInfoStatus/${babysitter.user.id}`} className="textRedColor">
                    {babysitter.user.username}
                  </Link>
                </td>
                <td>{babysitter.user.email}</td>
                <td>{babysitter.user.telNumber}</td>
                <td>{babysitter.user.gender}</td>
                <td>{new Date(babysitter.user.dateAdded).toLocaleDateString()}</td>
                <td>{babysitter.availability}</td>
                <td>{babysitter.type}</td>
                <td>{babysitter.city}</td>
                <td>{new Date(babysitter.dateOfBirth).toLocaleDateString()}</td>
                <td>{babysitter.stars}</td>
                <td>{babysitter.numOfCancelation}</td>
                <td className='ServiceDeatils'>
                  <button className="btn rounded-0 ColorRed" onClick={() => handleAssign(babysitter.user.id)}>Assign</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SuggestedBabysitters;
