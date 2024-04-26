import React, { useEffect, useState } from 'react';
import './BabysittersList.css';
import './Fonts.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function BabysittersList() {
  const [babysitterData, setBabysitterData] = useState([]);
  const [cities, setCities] = useState([
    'BeitSahour',
    'BeitLehem',
    'Nabulus',
    'Jenin',
    'Ramallah',
  ]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('Full-Time');
  const [selectedStars, setSelectedStars] = useState(null); // State for selected star rating

  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const response = await fetch('http://176.119.254.188:8080/admin/getAllEmployees');
        if (response.ok) {
          const data = await response.json();
          setBabysitterData(data || []);
        } else {
          console.error('Failed to fetch babysitters');
        }
      } catch (error) {
        console.error('Error fetching babysitters:', error);
      }
    };

    fetchBabysitters();
  }, []);

  const handleCitySelect = async (city) => {
    try {
      const response = await fetch('http://176.119.254.188:8080/customer/filter/city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cities: [city],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBabysitterData(data || []);
        setSelectedCity(city);
      } else {
        console.error('Failed to fetch babysitters by city');
      }
    } catch (error) {
      console.error('Error fetching babysitters by city:', error);
    }
  };

  const handleSelectType = async (type) => {
    try {
      const response = await fetch('http://176.119.254.188:8080/customer/filter/type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: type,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBabysitterData(data || []);
        setSelectedType(type);
      } else {
        console.error('Failed to fetch babysitters by type');
      }
    } catch (error) {
      console.error('Error fetching babysitters by type:', error);
    }
  };

  const handleSelectStars = async (stars) => {
    try {
      const response = await fetch(`http://176.119.254.188:8080/customer/filter/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stars: stars,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBabysitterData(data || []);
        setSelectedStars(stars);
      } else {
        console.error('Failed to fetch babysitters by star rating');
      }
    } catch (error) {
      console.error('Error fetching babysitters by star rating:', error);
    }
  };

  const renderStarRating = (stars) => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        // Render a filled star
        starElements.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
      } else {
        // Render an empty star
        starElements.push(<i key={i} className="fa-regular fa-star text-secondary"></i>);
      }
    }
    return starElements;
  };

  return (
    <>
      <div className="Book-container-fluid">
        <div className="Service pt-5 mt-5">
          <h2 className="py-5">Book Online</h2>
          <div className="">
            <p>Check out our availability and book the date and time that works for you</p>
            <div className="row border-top">
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
                    <button className="dropdown-item" onClick={() => handleSelectType('Full-Time')}>
                      Full-Time
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectType('Part-Time')}>
                      Part-Time
                    </button>
                  </li>
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
                    <button className="dropdown-item" onClick={() => handleSelectStars(0)}>
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
            </div>

            <div className="py-5 my-3">
              <div className="row">
                {(babysitterData || []).map((babysitter) => (
                  <div className="col-md-4" key={babysitter?.user?.id}>
                    <div className="card shadow mb-5" style={{ width: '15rem' }}>
                      <div
                        className="w-50 d-flex m-auto mt-2 bg-secondary"
                        style={{ overflow: 'hidden', borderRadius: '100%', aspectRatio: '1/1' }}
                      >
                        <img src="/images/UserProfile.jpg" className="card-img-top w-100" alt="Babysitter" />
                      </div>
                      <div className="card-body">
                        <h3>{babysitter?.user?.name}</h3>
                        <hr />
                        <div className="row">
                          <div className="col-md-6">
                            <p className="text-dark normalFont">{renderStarRating(babysitter.stars)}</p>
                          </div>
                          <div className="col-md-6">
                            <p className="text-secondary">{babysitter?.type}</p>
                          </div>
                        </div>
                        <p className="text-secondary">{babysitter?.city}</p>

                        <Link to={`/babysitter-profile/${babysitter?.user?.id}`}>
                          <button className="text-light border-0 w-100">View Profile</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <button className="text border-0 bg-light d-flex m-auto">See All</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BabysittersList;
