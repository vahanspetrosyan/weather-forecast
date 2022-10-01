import React, {useState} from 'react';
import Layout from "../components/Layout/Layout"
import Input from "../components/Input/Input";

function HomePage() {
    const [weatherData, setWeatherData] = useState({});

    const validate = (value, rules) => {
        let isValid = true;
        for (const rule in rules) {
            switch (rule) {
                case 'minLength':
                    isValid = isValid && minLengthValidator(value, rules[rule]);
                    break;
                case 'isRequired':
                    isValid = isValid && requiredValidator(value);
                    break;
                default:
                    isValid = true;
            }
        }
        return isValid;
    }
    const requiredValidator = value => {
        return value.trim() !== '';
    }
    const minLengthValidator = (value, minLength) => {
        return value.length >= minLength;
    }

    const defaultFormData = {
        cityName: {
            value: '',
            placeholder: 'Enter city name here (e.g New York)',
            valid: false,
            validationRules: {
                minLength: 3,
                isRequired: true,
            },
            validationMessages: {
                minLength: 'The input min length is 3',
                isRequired: 'This field is required',
            },
            touched: false,
        }
    }

    const [formControls, setformControls] = useState({...Object.assign({}, defaultFormData)});
    const [formIsValid, setformIsValid] = useState(false);
    const [dataLoaded, setDataLoaded] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const  changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;

        const updatedControls = {
            ...formControls,
        };
        const updatedFormElement = {
            ...updatedControls[name],
        };
        updatedFormElement.value = value;
        updatedFormElement.touched = true;
        updatedFormElement.valid = validate(value, updatedFormElement.validationRules);

        updatedControls[name] = updatedFormElement;

        let formIsValid = true;
        for (const inputIdentifier in updatedControls) {
            formIsValid = updatedControls[inputIdentifier].valid && formIsValid
        }

        setformControls(updatedControls);
        setformIsValid(formIsValid);
    }

    const getApiData = async () => {
        setDataLoaded(false);
        setErrorMessage('');
        setSuccessMessage('');
        const city = formControls['cityName'].value;
        axios.get(`/api/v1/weather/getData?city=${city}`).then(function (response) {
            if (response.data.status === 'OK') {
                setWeatherData(response.data.data);
                setDataLoaded(true);
            }
            else {
                setErrorMessage(response.data.message);
                setDataLoaded(true);
            }
        })
            .catch(function (error) {
                setErrorMessage(error.response.data.message);
                setDataLoaded(true);
            })
    }

    const getDBData = async () => {
        setDataLoaded(false);
        setErrorMessage('');
        setSuccessMessage('');
        const city = formControls['cityName'].value;
        axios.get(`/api/v1/weather/getData/db?city=${city}`).then(function (response) {
            if (response.data.status === 'OK') {
                setWeatherData(response.data.data);
                setDataLoaded(true);
            }
            else {
                setErrorMessage(response.data.message);
                setDataLoaded(true);
            }
        })
            .catch(function (error) {
                setErrorMessage(error.response.data.message);
                setDataLoaded(true);
            })
    }

    const saveForecast = async () => {
        setErrorMessage('');
        setSuccessMessage('');
        const data = {
            city_name: weatherData.city_name,
            min_temp: weatherData.weather[0].temp_min,
            max_temp: weatherData.weather[0].temp_max,
            wind_speed: weatherData.weather[0].wind_speed,
            date: weatherData.weather[0].date,
        };
        await axios.post(`/api/v1/weather/saveData`, data).then(function (response) {
            if (response.data.status === 'OK') {
                setSuccessMessage(response.data.message);
            }
            else {
                setErrorMessage(response.data.message);
            }
        })
            .catch(function (error) {
                setErrorMessage(error.response.data.message);
            });
    }

    return (
        <Layout>
            <div className='text-center mt-3 mb-3'>
                <h1>Get Weather information in city where you wish</h1>
            </div>
            {
                !dataLoaded &&
                <div className="d-flex justify-content-center">
                    <div className="spinner-border text-info" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            }
            {
                dataLoaded &&
                <>
                    <div className="get-data">
                        <form action='#'>
                            <div className="d-flex justify-content-center">
                                <Input
                                    name='cityName'
                                    id='cityName'
                                    value={formControls.cityName.value}
                                    onChange={changeHandler}
                                    touched={formControls.cityName.touched}
                                    valid={formControls.cityName.valid}
                                    labelname={formControls.cityName.placeholder}
                                    message={formControls.cityName.validationMessages.minLength}
                                />
                                <button
                                    onClick={getApiData} disabled={!formIsValid}
                                    type='button'
                                    className='btn btn-primary text-nowrap me-3'
                                >Get from API
                                </button>
                                <button
                                    onClick={getDBData} disabled={!formIsValid}
                                    type='button'
                                    className='btn btn-warning text-nowrap'
                                >Get from DB
                                </button>
                            </div>
                            {
                                errorMessage &&
                                <div className="alert alert-danger mt-3" role="alert">
                                    {errorMessage}
                                </div>
                            }
                            {
                                successMessage &&
                                <div className="alert alert-success mt-3" role="alert">
                                    {successMessage}
                                </div>
                            }
                        </form>
                    </div>
                    {weatherData.weather && (
                        <div className="card-body">
                            <div className="card mt-3 mb-3">
                                <div className="card-body">
                                    <h3>{weatherData.city_name}</h3>
                                    {weatherData.starts_at && weatherData.ends_at && (
                                        <div className='period'>
                                            <h5>Period</h5>
                                            <p className='mb-0'>Starts at: {weatherData.starts_at}</p>
                                            <p>Ends at: {weatherData.ends_at}</p>
                                            <button className='btn btn-success' onClick={saveForecast}>Save forecast</button>
                                        </div> ) }
                                    {weatherData.updated_at && (
                                        <p className='starts-at'>Updated at: {weatherData.updated_at}</p>
                                    )}
                                </div>
                            </div>
                            <table className="table table-hover">
                                <thead>
                                <tr className='text-primary'>
                                    <th>Datetime</th>
                                    <th>Min temp</th>
                                    <th>Max temp</th>
                                    <th>Wind speed</th>
                                </tr>
                                </thead>
                                <tbody>
                                {weatherData.weather.map((weather, key)=>{
                                    return (
                                        <tr key={key}>
                                            <td>{weather.date}</td>
                                            <td>{weather.temp_min} °C</td>
                                            <td>{weather.temp_max} °C</td>
                                            <td>{weather.wind_speed} km/h</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div> ) }
                </>
            }
        </Layout>
    );
}

export default HomePage;
