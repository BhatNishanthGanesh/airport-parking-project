import React, { useEffect, useState } from 'react'
import moment from 'moment'
import axios from 'axios'
import AirportSuggestions from '../components/AirportSuggestions'
const SearchForm = () => {
    const [Errors, setErrors] = useState({
        departureName: false,
        Checkin: false,
        Checkout: false
    });

    const today = moment().format('YYYY-MM-DD').toString()
    const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD').toString()
    const [departureName, setdepartureName] = useState('Delhi');
    const [Checkin, setCheckin] = useState(today);
    const [Checkout, setCheckout] = useState(tomorrow);
    const [loading, setLoading] = useState(false);
    
    const [airports, setAirports] = useState([]);
    const [filteredAirports, setFilteredAirports] = useState('');

    const getAirports = async () => {
        try {
            setLoading(true);
          const { data, status } = await axios.get(
            "https://rl.talentcoco.in/v1/airports"
          );
          
          if (status === 200 && data) {
            setAirports(data?.results ?? []);
          } else {
            setAirports([]);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error.message);
        }
      };
    useEffect(() => {
        getAirports()
    }, [])

    const selectAirport = (value) => {
        setdepartureName(value);
        setFilteredAirports([])
    }


    const DepartureHandler = (e) => {
        const { value } = e.target;
        if (value.length <= 10) {
            setdepartureName(value);
        }
        setdepartureName(value);
        if (e.target.value) {
            setErrors((err) => ({ ...err, departureName: false }))
        }
        else {
            setErrors((err) => ({ ...err, departureName: true }))
        }
        const filteredAirportsData = airports.filter((airport) => airport.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredAirports(filteredAirportsData ?? [])
        console.log(setFilteredAirports);


    }

    const CheckinHandler = (e) => {
        const { value } = e.target;
        setCheckin(value);
        if (e.target.value) {
            setErrors((err) => ({ ...err, Checkin: false }))
        } else {
            setErrors((err) => ({ ...err, Checkin: true }))
        }
    }

    const CheckoutHandler = (e) => {
        const { value } = e.target;
        setCheckout(value);
        if (moment(Checkin) > moment(Checkout)) {
            setErrors((err) => ({ ...err, Checkout: true }))
        }
        if (e.target.value) {
            setErrors((err) => ({ ...err, Checkout: false }))
        } else {
            setErrors((err) => ({ ...err, Checkout: true }))
        }
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        console.log(departureName);
        console.log(Checkin);
        console.log(Checkout);
        if (moment(Checkin) > moment(Checkout)) {
            alert("Invalid")
            setErrors((err) => ({ ...err, Checkout: true }))
        } else
            if (departureName && Checkin && Checkout) {
                alert('Form is submitted')
                // navigate(`/results?departureAirport=${departureName}&checkin=${Checkin}&checkout=${Checkout}`)
                window.location.href=`/results?departureAirport=${departureName}&checkin=${Checkin}&checkout=${Checkout}`
                
             
            } else {
                setErrors({
                    departureName: !departureName,
                    Checkin: !Checkin,
                    Checkout: !Checkout
                })
            }
    }
    
   

    // const fetchData = async () => {
    //     setLoading(true)
    //     const { data } = await axios.get('http://43.205.1.85:9009/v1/airports')
    //     setLoading(false)
    //     setRecords(data.results)
    // }
    // useEffect(() => {
    //     fetchData()
    // }, [])

    return (
        <div>
            <form action="/results.html" method="post">
                                        <div className="options row m-0"><label className="col-12 col-xl-3 p-0 mr-xl-3 mb-2">
                                                <div className="heading mb-1">Departure Airport</div>
                                                <div className="placeholder placeholder-airport">
                                                    <input type="text" onChange={DepartureHandler} 
                                                    value={departureName}  
                                                    placeholder="Departure Airport" 
                                                    className="placeholder placeholder-airport" />
                                                    
                                                </div> <i
                                                    className="fas fa-map-marker-alt input-icon"></i>
                                                    {loading && <h3>loading..</h3>}
                            {(Errors && Errors.departureName)? <div><br/><h4 style={{color:"white",backgroundColor:"Highlight"}}>Invalid Departure Airport</h4></div>:null}
                            <AirportSuggestions airports={filteredAirports} selectAirport={selectAirport} />
                                                    
                                            </label>
                                            <div className="col p-0 row m-0 mb-2 dates"><label
                                                    className="col-sm-6 p-0 pr-sm-3 date_input">
                                                    <div className="heading mb-1">Parking Check-In</div>
                                                    <div className="placeholder">
                                                        <input name="checkin" 
                                                        type="date"
                                                         onChange={CheckinHandler} 
                                                         placeholder="Parking Check-In"
                                                         value={Checkin}
                                                          className="placeholder placeholder-airport"
                                                           style={{width:'100%'}}/>
                                                        {(Errors.Checkin?<div><br/><div  style={{border:1,backgroundColor:"#da70d6"}}><h4><em>Invalid checkin Date</em></h4></div></div>:null)}
                                                    </div> 
                                                </label> <label className="col-sm-6 p-0 pl-sm-0 date_input">
                                                    <div className="heading mb-1">Parking Check-Out</div>
                                                        <input name="Check-Out"
                                                         type="date"
                                                          onChange={CheckoutHandler} 
                                                          placeholder="Parking Check-Out" 
                                                          value={Checkout}
                                                          className="placeholder placeholder-airport" 
                                                          style={{width:"100%"}}/>
                                                        {(Errors.Checkout?<div><br/><div  style={{border:1,backgroundColor:"#da70d6"}}><h4><em>Invalid checkout Date</em></h4></div></div>:null)}
                                                </label></div>
                                            <div className="col-12 col-xl-2 p-0 pl-xl-3 my-3 my-xl-0">
                                                <div className="d-none d-xl-block heading mb-1 invisible">Submit</div>
                                                <button type="submit" onClick={SubmitHandler} className="btn btn-secondary btn-big btn-block p-2"><span>SEARCH</span></button>
                                            </div>
                                        </div>
                                    </form>
        </div>
    );       
}

function Home() {
    
    return (
      <div className="App">
            <div id="app" className="generic">
          <div>
              {/* <app-header>
                  <Header/>
              </app-header> */}
              <div className="content">
                  {/* <us-page-home inline-template> */}
                      <section id="home_page">
                          <div className="years-of-service">
                              <div className="container">
                                  For 20 years, we’ve helped travelers on their way. With free cancellations & a customer
                                  service team in the US, we are committed to serving you.
                              </div>
                          </div>
                          <section id="hero"
                              style={{ 
                                backgroundImage: `url(${process.env.PUBLIC_URL}/assets/generic_landing.jpg)`,
                                minHeight: '500px'
                              }}>
                              <div className="hero-backdrop"></div>
                              <div className="container position-relative">
                                  <div className="hero-heading mb-4">
                                      <h1>SAVE BIG ON AIRPORT PARKING</h1>
                                      <h2>We have the best deals for airport parking lots!</h2>
                                  </div>
                                  <div className="searchbox landing">
                                      <div className="row tabs">
                                          <div className="tab">
                                              <div className="heading">Most Convenient</div>
                                              <div className="button">
                                                  <div className="icon"><i className="fas fa-car"></i></div>
                                                  Airport Parking Only
                                              </div>
                                          </div>
                                          <div className="tab">
                                              <div className="heading">Best Value</div>
                                              <div className="button">
                                                  <div className="icon"><i className="fas fa-bed"></i> + <i
                                                          className="fas fa-car"></i></div>
                                                  Hotel &amp; Parking Package
                                              </div>
                                          </div> 
                                      </div>
                                      <SearchForm/>
                                  </div>
                              </div>
                          </section>
                          <section id="benefits">
                              <div className="container">
                                  <h5>What Can You Save with AirportParkingReservations.com?</h5>
  
                                  <ul className="row">
                                      <li className="col-12 col-lg-4 p-3">
                                      <img src="/assets/check.png" alt="Tick" width="50" height="50" />
                                          <div>
                                              <h6>Save Money</h6>
                                              <p>Save up to 70% off on our site compared to the cost of on-airport
                                                  parking.</p>
                                          </div>
                                      </li>
                                      <li className="col-12 col-lg-4 p-3">
                                      <img src="/assets/check.png" alt="Tick" width="50" height="50" />
                                          <div>
                                              <h6>Save Time</h6>
                                              <p>
                                                  It's easy to compare parking at all major airports.<br />
                                                  Booking a reservation is quick & simple!
                                              </p>
                                          </div>
                                      </li>
                                      <li className="col-12 col-lg-4 p-3">
                                      <img src="/assets/check.png" alt="Tick" width="50" height="50" />
                                          <div>
                                              <h6>Save Stress</h6>
                                              <p>
                                                  Guarantee your parking spot by booking in advance. Can't make it?
                                                  Cancellations are free.
                                              </p>
                                          </div>
                                      </li>
                                  </ul>
                              </div>
                          </section>
  
                      </section>
                  {/* </us-page-home> */}
              </div>
          </div>
      </div>
  
      </div>
    );
  }
  
  export default Home;

