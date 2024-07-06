import React, { useEffect, useState } from 'react';
import './BabysittersList.css';
import './Fonts.css';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


function BabysittersList() {
  const [babysitterData, setBabysitterData] = useState([]);
  const userRole = Cookies.get('userRole');
  const [cities, setCities] = useState([
    'BeitSahour',
    'BeitLehem',
    'Nablus',
    'Jenin',
    'Ramallah',
    'Hebron',
    'Tulkarm',
    'Qalqilya',
    'Salfeet'
  ]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStars, setSelectedStars] = useState(null);
  const [selectedGender, setSelectedGender] = useState('All');
  const [selectedBabysitters, setSelectedBabysitters] = useState([]);
  const [filteredBabysitters, setFilteredBabysitters] = useState([]);

  useEffect(() => {
    const fetchBabysitters = async () => {
      try {
        const response = await fetch('http://176.119.254.188:8080/admin/getAllEmployees');
        
        if (response.ok) {
          const data = await response.json();
          const babysittersWithImages = await Promise.all(data.map(async babysitter => {
            const responseImage = await fetch(`http://176.119.254.188:8080/user/image/${babysitter.user.id}`);
            if (responseImage.ok) {
              const imageData = await responseImage.blob();
              babysitter.profileImageUrl = URL.createObjectURL(imageData);
            } else {
              console.error(`Failed to fetch profile image for babysitter with id ${babysitter.user.id}`);
            }
            return babysitter;
          }));
          setBabysitterData(babysittersWithImages);
          setFilteredBabysitters(babysittersWithImages); // Initialize filteredBabysitters with all babysitters
        } else {
          console.error('Failed to fetch babysitters');
        }
      } catch (error) {
        console.error('Error fetching babysitters:', error);
      }
    };

    fetchBabysitters();
  }, []);

  useEffect(() => {
    filterBabysitters(selectedCity, selectedType, selectedStars, selectedGender);
  }, [selectedCity, selectedType, selectedStars, selectedGender]);

  const handleSelectBabysitter = (babysitterId) => {
    const index = selectedBabysitters.indexOf(babysitterId);
    if (index === -1) {
      setSelectedBabysitters([...selectedBabysitters, babysitterId]);
    } else {
      setSelectedBabysitters(selectedBabysitters.filter(id => id !== babysitterId));
    }
  };

  const handleBookNow = () => {
    if (selectedBabysitters.length === 0) {
      alert('Please select at least one babysitter.');
    } else {
      const selectedBabysitterNames = selectedBabysitters.map(id =>
        babysitterData.find(babysitter => babysitter?.user?.id === id)?.user?.name
      );

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
          const uniqueBabysitterIds = [...new Set(selectedBabysitters)];
          const selectedBabysitterIds = uniqueBabysitterIds.join(',');
          window.location.href = `/DetailedBook?ids=${selectedBabysitterIds}`;
        }
      });
    }
  };

  const handleOfferOrder = () => {
    window.location.href = `/OfferDetailedBook`;
  };
  

    

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

  const filterBabysitters = (city, type, stars, gender) => {
    let filtered = babysitterData;

    if (city !== '') {
      filtered = filtered.filter(babysitter => babysitter.city === city);
    }

    if (type !== 'All') {
      filtered = filtered.filter(babysitter => babysitter.type === type);
    }

    if (stars !== null) {
      filtered = filtered.filter(babysitter => babysitter.stars >= stars);
    }

    if (gender !== 'All') {
      filtered = filtered.filter(babysitter => babysitter.user.gender === gender);
    }

    setFilteredBabysitters(filtered);
  };

  const renderStarRating = (stars) => {
    const starElements = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= stars) {
        starElements.push(<i key={i} className="fa-solid fa-star text-warning"></i>);
      } else {
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
            <div className="row pb-1">
              <div className="col-md-8">
                <p>Discover our babysitters' availability and choose one or more for your booking needs.</p>
              </div>
              {userRole === 'c' && (

              <div className="col-md-4 d-flex justify-content-end align-items-start">
                <div className='ServiceDeatils w-50'>
                  <button className='btn w-100 py-1 px-0 text-center' onClick={handleBookNow}>Book Now</button>
                </div>
                <div className='ServiceDeatils w-50 ms-2'>
                  <button className='btn w-100 py-1 text-center' onClick={handleOfferOrder}>Offer order </button>
                </div>
              </div>
               )}
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
                    <button className="dropdown-item" onClick={() => handleSelectType('All')}>
                      All
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectType('above 5Y old')}>
                    above 5Y old                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectType('Under 5Y old')}>
                    Under 5Y old
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectType('Medical')}>
                    Medical
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectType('Special Care')}>
                    Special Care
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
                    <button className="dropdown-item" onClick={() => handleSelectGender('All')}>
                      All
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectGender('male')}>
                      male
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => handleSelectGender('female')}>
                      female
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div className="py-5 my-3">
              <div className="row">
                {(filteredBabysitters || []).map((babysitter) => (
                  <div className="col-md-4 mb-4" key={babysitter?.user?.id}>
                    <div className="card shadow" style={{ width: '15rem' }}>
                      <div className="w-50 d-flex m-auto mt-2 bg-secondary" style={{ overflow: 'hidden', borderRadius: '100%', aspectRatio: '1/1' }}>
                        <img src={babysitter.profileImageUrl || "/images/UserProfile.jpg"} className="card-img-top" alt="Babysitter" />
                      </div>
                      <div className="form-check position-absolute top-0 end-0 mt-2 me-2">
                        <input className="form-check-input border-danger" type="checkbox" value="" id={`checkbox-${babysitter?.user?.id}`} onChange={() => handleSelectBabysitter(babysitter?.user?.id)} />
                        <label className="form-check-label" htmlFor={`checkbox-${babysitter?.user?.id}`}></label>
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
                        <p className="text-secondary">{babysitter?.city}/{babysitter?.user?.gender}</p>
                        <Link to={`/babysitter-profile/${babysitter?.user?.id}`}>
                          <button className="text-light border-0 w-100 BlueColor">View Profile</button>
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
