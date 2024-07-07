import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import axios from 'axios';

function OfferDetails() {
  const [babysitterData, setBabysitterData] = useState([]);
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
  const [selectedStars, setSelectedStars] = useState(3);
  const [selectedHours, setSelectedHours] = useState(null); // State for selected hours
  const [selectedBabysitters, setSelectedBabysitters] = useState([]);
  const [offerDetails, setOfferDetails] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchOfferDetails = async () => {
      try {
        const response = await fetch(`http://176.119.254.188:8080/offerType/view/${id}`);
        
        if (response.ok) {
          const data = await response.json();
          setOfferDetails(data);
        } else {
          console.error('Failed to fetch offer details');
        }
      } catch (error) {
        console.error('Error fetching offer details:', error);
      }
    };

    fetchOfferDetails();
  }, [id]);

  useEffect(() => {
    const fetchBabysittersByStars = async (stars) => {
      try {
        const response = await fetch(`http://176.119.254.188:8080/customer/filter/stars/${stars}`);
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
        } else {
          console.error('Failed to fetch babysitters by star rating');
        }
      } catch (error) {
        console.error('Error fetching babysitters by star rating:', error);
      }
    };

    if (selectedStars !== null) {
      fetchBabysittersByStars(selectedStars);
    }
  }, [selectedStars]);

  const applyFilters = (data) => {
    let filteredBabysitters = data;
    if (selectedCity) {
      filteredBabysitters = filteredBabysitters.filter(babysitter => babysitter.city === selectedCity);
    }
    if (selectedType !== 'All') {
      filteredBabysitters = filteredBabysitters.filter(babysitter => babysitter.type === selectedType);
    }
    return filteredBabysitters;
  };

  const handleSelectStars = async (stars) => {
    setSelectedStars(stars);
  };

  const handleSelectHours = (hours) => {
    setSelectedHours(hours); // Update selected hours state
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

  const handleSelectBabysitter = (babysitterId) => {
    const index = selectedBabysitters.indexOf(babysitterId);
    if (index === -1) {
      setSelectedBabysitters([...selectedBabysitters, babysitterId]);
    } else {
      setSelectedBabysitters(selectedBabysitters.filter(id => id !== babysitterId));
    }
  };

  const handleBookNow = () => {
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
    if (!selectedHours || !selectedStars) {
      alert('Please select hours and stars before proceeding.');
      return;
    }

    if (selectedBabysitters.length === 0) {
      alert('Please select at least one babysitter.');
    } else {
      const uniqueBabysitterIds = [...new Set(selectedBabysitters)];
      const selectedBabysitterIds = uniqueBabysitterIds.join(',');

      const requestBody = {
        maxHoursAllowed: selectedHours,
        maxStars: selectedStars,
        employeeIds: selectedBabysitterIds,
        offerTypeId: id
      };

      // Make API call to apply the offer
      axios.post('http://176.119.254.188:8080/customer/offer/apply', requestBody, config)
        .then(response => {
          if (response.ok) {
            Swal.fire({
              title: 'Subscribe Confirmation',
              html: `
                You have successfully applied the offer.<br/>
                <p>Up to ${selectedHours} hours with ${selectedStars} stars</p>
              `,
              icon: 'success',
              confirmButtonText: 'OK',
              customClass: {
                confirmButton: 'btn-red-background',
              }
            });
          } else {
            throw new Error('Failed to apply offer');
          }
        })

        .catch(error => {
          console.error('Error applying offer:', error);
          if (error.response) {
            Swal.fire({
              title: 'Error',
              text: error.response.data, // Display the response data to the user
              icon: 'error',
              confirmButtonText: 'OK',
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Failed to apply the offer. Please try again later.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        });
    };
    }

  const handleSelectCity = (city) => {
    setSelectedCity(city);
  };

  const handleSelectType = (type) => {
    setSelectedType(type);
  };

  return (
    <>
      {offerDetails && (
        <div className="Book-container-fluid">
          <div className="Service  mt-5">
            <h2 className="py-5">Offer Details</h2>
            <div className="">
              <div className="row pb-1">
                <div className="col-md-8">
                  <h3 className='d-flex justify-content-start'>{offerDetails.description} by {offerDetails.discountPercentage * 100}% for {offerDetails.duration} months (up to {offerDetails.timesAllowed} orders)</h3>
                </div>
                <div className="col-md-4 d-flex justify-content-end align-items-start">
                  <div className='ServiceDeatils w-50'>
                    <button className='btn w-100' onClick={handleBookNow}>Next</button>
                  </div>
                </div>
              </div>
              <div className="row border-top">
                <div className="col-4 col-md-1">
                  <p className="pt-2 text">Filter by:</p>
                </div>
                <div className="dropdown col-4 col-md-2 border-left">
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
                        <button className="dropdown-item" onClick={() => handleSelectCity(city)}>
                          {city}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dropdown col-4 col-md-2">
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
                        above 5Y old
                      </button>
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
                <div className="col-4 col-md-2">
                  <p className="text">Up to :</p>
                </div>
                <div className="dropdown col-4 col-md-2 border-left">
                  <a
                    className="btn btn-secondary border-0 dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Hours ({selectedHours || 'All'})
                  </a>
                  <ul className="dropdown-menu">
                    {[...Array(offerDetails.maxHours)].map((_, index) => (
                      <li key={index + 1}>
                        <button className="dropdown-item" onClick={() => handleSelectHours(index + 1)}>{index + 1}</button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="dropdown col-4 col-md-2">
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
                  {(babysitterData || []).length > 0 ? (
                    applyFilters(babysitterData).map((babysitter) => (
                      <div className="col-lg-4 col-md-6 mb-3 d-flex justify-content-center" key={babysitter?.user?.id}>
                        <div className="card shadow" style={{ width: '15rem' }}>
                          <div className="w-50 d-flex m-auto mt-2 bg-secondary" style={{ overflow: 'hidden', borderRadius: '100%', aspectRatio: '1/1' }}>
                            <img src={babysitter.profileImageUrl || "/images/UserProfile.jpg"} className="card-img-top w-100" alt="Babysitter" />
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
                            <p className="text-secondary">{babysitter?.city}</p>
                            <Link to={`/babysitter-profile/${babysitter?.user?.id}`}>
                              <button className="text-light border-0 w-100 BlueColor">View Profile</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-md-12 text-center mt-5">
                      <p>No babysitters found for the selected criteria.</p>
                      <p>(choose different stars)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-5">
                <button onClick={handleBookNow} className="text border-0 bg-light d-flex m-auto">See All</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OfferDetails;
