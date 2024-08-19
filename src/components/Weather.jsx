import React, { useState, useEffect } from 'react'

const cityName = {
  서울: 'Seoul',
  부산: 'Busan',
  대구: 'Daegu',
  인천: 'Incheon',
  광주: 'Gwangju',
  대전: 'Daejeon',
  울산: 'Ulsan',
  세종: 'Sejong',
  경기: 'Gyeonggi-do',
  강원: 'Gangwon-do',
  충북: 'Chungcheongbuk-do',
  충남: 'Chungcheongnam-do',
  전북: 'Jeollabuk-do',
  전남: 'Jeollanam-do',
  경북: 'Gyeongsangbuk-do',
  경남: 'Gyeongsangnam-do',
  제주: 'Jeju-do',
}

const reverseCityName = Object.fromEntries(Object.entries(cityName).map(([k, v]) => [v, k]))

const isKorean = (text) => /^[가-힣]+$/.test(text)

const Weather = () => {
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState(null)
  const [airPollutionData, setAirpollutionData] = useState(null)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const apiKey = import.meta.env.VITE_API_KEY

  const [theme, setTheme] = useState('light')

  const fetchWeather = async (url) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는 데 실패했어요.')
      }
      const data = await response.json()
      setWeatherData(data)
      setError(null)

      const { coord } = data
      const airPollutionData = await fetchAirPolution(coord.lat, coord.lon)
      setAirpollutionData(airPollutionData)
    } catch (error) {
      setError(error.message)
      setWeatherData(null)
    } finally {
      setLoading(false)
    }
  }

  const getWeatherByCity = () => {
    const englishCity = cityName[city]
    if (city && isKorean(city) && englishCity) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${englishCity}&appid=${apiKey}&units=metric&lang=kr`
      fetchWeather(url)
      setHistory((prev) => [...prev, city]) //검색 기록
    } else {
      setError('올바른 이름을 입력해주세요!')
      setWeatherData(null)
    }
  }

  const fetchAirPolution = async (lat, lon) => {
    const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('대기 오염 정보를 가져오는 데 실패했어요.')
      }
      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      console.error(error.message)
      return null
    }
  }

  const onGeoOk = (position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`
    fetchWeather(url)
  }

  const onGeoError = () => {
    setError('위치 정보를 가져오는 데 실패했어요.')
  }

  const getWeatherLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)
    } else {
      setError('이 브라우저는 Geolocation을 지원하지 않아요.')
    }
  }

  const Spinner = () => {
    return <div className="spinner"></div>
  }

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const isDarkMode = theme === 'dark'
    document.body.classList.toggle('dark', isDarkMode)

    const buttons = document.querySelectorAll('button')
    buttons.forEach((button) => {
      button.classList.toggle('dark', isDarkMode)
    })
    const historyItems = document.querySelectorAll('.history li')
    historyItems.forEach((item) => {
      item.classList.toggle('dark', isDarkMode)
    })
  }, [theme, history])

  return (
    <div className="container">
      <div className="weather-info">
        <h1>날씨 알려줄🐶</h1>

        <input type="text" className="inputText" placeholder="도시 이름을 입력하세요" value={city} onChange={(e) => setCity(e.target.value)} />
        <button onClick={getWeatherByCity}>날씨 조회</button>
        <button onClick={getWeatherLocation}>내 위치 날씨 조회</button>
        <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <Spinner />}
        {weatherData && (
          <div className={`card weather-card ${theme}`}>
            <h2>{reverseCityName[weatherData.name]}</h2>
            <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="weather icon" />
            <p>날씨: {weatherData.weather[0].description}</p>
            <p>온도: {weatherData.main.temp}°C</p>
            <p>구름 양: {weatherData.clouds.all}%</p>
            <p>습도 : {weatherData.main.humidity}%</p>
            {weatherData.rain && weatherData.rain['1h'] ? <p>1시간 강수량: {weatherData.rain['1h']} mm</p> : <p>한 시간 동안 비가 오지 않았어요</p>}
            {airPollutionData && (
              <div className={`card air-card ${theme}`}>
                <p>미세먼지 농도: {airPollutionData.list[0].components.pm10} µg/m³</p>
                <p>초미세먼지 농도: {airPollutionData.list[0].components.pm2_5} µg/m³</p>
                <p>
                  대기질 상태:{' '}
                  {airPollutionData.list[0].main.aqi === 1
                    ? '좋음'
                    : airPollutionData.list[0].main.aqi === 2
                      ? '보통'
                      : airPollutionData.list[0].main.aqi === 3
                        ? '보통'
                        : airPollutionData.list[0].main.aqi === 4
                          ? '나쁨'
                          : airPollutionData.list[0].main.aqi === 5
                            ? '매우 나쁨'
                            : '정보없음'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={`history ${theme}`}>
        <button onClick={() => setShowHistory(!showHistory)}>{showHistory ? '검색기록 숨기기' : '검색기록 보기'}</button>
        {showHistory && history.length > 0 && (
          <div>
            <h3>검색기록</h3>
            <ul className="noDot">
              {history.map((historyCity, index) => (
                <li key={index} onClick={() => setCity(historyCity)}>
                  {historyCity}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Weather
