import React, { useEffect, useState } from 'react';
import './BabysittersList.css';
import './Fonts.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';


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
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedBabysitters, setSelectedBabysitters] = useState([]); // State to store selected babysitters


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

// Function to handle selection of a babysitter
const handleSelectBabysitter = (babysitterId) => {
  console.log('Selecting babysitter:', babysitterId);
  const index = selectedBabysitters.indexOf(babysitterId);
  if (index === -1) {
    setSelectedBabysitters([...selectedBabysitters, babysitterId]);
  } else {
    setSelectedBabysitters(selectedBabysitters.filter(id => id !== babysitterId)); // Remove from selected babysitters if already selected
  }
  console.log('Selected babysitters:', selectedBabysitters);
};


 // Function to handle booking
const handleBookNow = () => {
  if (selectedBabysitters.length === 0) {
    alert('Please select at least one babysitter.');
  } else {
    const selectedBabysitterNames = selectedBabysitters.map(id =>
      babysitterData.find(babysitter => babysitter?.user?.id === id)?.user?.name
    );

    // Generate HTML for checkboxes with babysitter names
    const checkboxesHTML = selectedBabysitterNames.map(name => `
    <div class="red-border checkbox-container">
      <input type="checkbox" id="${name}" name="${name}" value="${name}" checked>
      <label for="${name}">${name}</label>
    </div>
    `).join('');

    Swal.fire({
      title: 'Booking Confirmation',
      html: `
        You have selected the following babysitter(s):<br/>
        <div id="babysitters">
          ${checkboxesHTML}
        </div>
      `,
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'btn-red-background',
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Retrieve unique babysitter IDs
        const uniqueBabysitterIds = [...new Set(selectedBabysitters)];

        // Convert to comma-separated string
        const selectedBabysitterIds = uniqueBabysitterIds.join(',');

        window.location.href = `/DetailedBook?ids=${selectedBabysitterIds}`;
      }
    });
  }
};

  return (
    <>
      <div className="Book-container-fluid">
        <div className="Service pt-5 mt-5">
          <h2 className="py-5">Book Online</h2>
          <div className="">
            <div className="row pb-1">
              <div className="col-md-8">
                <p>Discover our babysitters' availability and choose one or more for your booking needs.</p>
              </div>
              <div className="col-md-4 d-flex justify-content-end align-items-start">
                <div className='ServiceDeatils w-50'>
                  <button className='btn w-100' onClick={handleBookNow}>Book Now</button>
                </div>
              </div>
            </div>
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
                      <div className="w-50 d-flex m-auto mt-2 bg-secondary" style={{ overflow: 'hidden', borderRadius: '100%', aspectRatio: '1/1' }}>
                        <img src="/images/UserProfile.jpg" className="card-img-top w-100" alt="Babysitter" />
                      </div>
                      {/* Add checkbox here */}
                      <div className="form-check position-absolute top-0 end-0 mt-2 me-2">
                        <input className="form-check-input border-danger" type="checkbox" value="" id={`checkbox-${babysitter?.user?.id}`}   onChange={() => handleSelectBabysitter(babysitter?.user?.id)} />
                        <label className="form-check-label" htmlFor={`checkbox-${babysitter?.user?.id}`}></label>
                      </div>
                      {/* End of checkbox */}
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
                          <button className="text-light border-0 w-100 BlueColor" >View Profile</button>
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
