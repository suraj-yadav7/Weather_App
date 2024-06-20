import React, { useState,useEffect,useRef } from 'react'
import axios from 'axios'
import { cities } from './popularCities'
import './App.css'

function App() {
  const apikey = import.meta.env.VITE_API_KEY

  const [cityName, setCityName] = useState('')
  const [value, setValue] = useState()
  const [suggestion, setSuggestion] = useState([])
  const inputRef = useRef(null)



  //fetching data when user update city name and enter
  const fetchCityData = async (e)=>{
          if(e.key==="Enter"){
              try{
              let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apikey}`)
              setValue(response)
              setCityName('')
              setSuggestion([])

          }
          catch(error){
              console.log("error occured while fetching data", error)
          }
      }
  }
// handle suggestion city selection 
  const fetchCity= async(city)=>{
      if(city.length>0){
        try{
        let response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`)
        setValue(response)
        setCityName(city)
        setSuggestion([])
        }
        catch(error){
            console.log("error occured while fetching data", error)
        }
    }
    //cursor at the end of input field
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
    }
  }

  // suggestion of cities
  const handleChange=(e)=>{
    const {value} = e.target
    setCityName(value)
    if(value.length>0){
      const filterSuggestion = cities.filter((elem)=>
      elem.toLowerCase().includes(value.toLowerCase())
      )
      setSuggestion(filterSuggestion.splice(0,4))
    }
    else{
      setSuggestion([])
    }

  }
  //initial static data when app opened
  useEffect(()=>{
      axios.get(`https://api.openweathermap.org/data/2.5/weather?q=hyderabad&units=metric&appid=${apikey}`).then((response)=>{
              setValue(response)
          })
  },[])

  return (
    <>
        <div className='app'>
        <div className="search">
        <input type='text' placeholder='enter your city' ref={inputRef} onKeyDown={(e)=>fetchCityData(e)} value={cityName} onChange={(e)=>handleChange(e)} />
        {
          setSuggestion.length>0 &&(
            <ul className='citiesList'>
              {
                suggestion.map((cities,index)=> (
                  <li key={index} onClick={(e)=> {fetchCity(cities)}}>{cities}</li>
                ))
              }
            </ul>
          )
        }
        </div>
        <div className="container">
            <div className="top">
                <div className="location">
                    <p> {value&& value.data.name}</p>
                </div>
                <div className="temp">
                    <h2>{value&& (value.data.main.temp).toFixed()} &deg;C</h2>
                </div>
                <div className="description">
                    <p>Clouds</p>
                    <p>{value&& value.data.clouds.all} </p>
                </div>
            </div>
            <div className='middleContainer'>
                <h2>{ value&& value.data.weather[0].main}</h2>
                <p>{value&& value.data.weather[0].description}</p>
            </div>
            <div className="bottom">
                <div className="feels">
                    <p className='bold'>{value&& value.data.main.feels_like.toFixed(1)}</p>
                    <p>Feels Like</p>
                </div>
                <div className="humidity">
                    <p className='bold'>{ value&& value.data.main.humidity}%</p>
                    <p>Humidity</p>
                </div>
                <div className="wind">
                    <p className='bold'>{value&& value.data.wind.speed} mph</p>
                    <p>wind speed</p>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default App;
