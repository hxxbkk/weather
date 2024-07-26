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
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const apiKey = import.meta.env.VITE_API_KEY

  const [theme, setTheme] = useState('light')

  const fetchWeather = async (url) => {
    setLoading(true)
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('날씨 정보를 가져오는 데 실패했습니다.')
      }
      const data = await response.json()
      setWeatherData(data)
      setError(null)
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
      setError('도시 이름을 한국어로 입력해주세요!')
      setWeatherData(null)
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

  useEffect(() => {
    getWeatherLocation()
  }, [])

  const Spinner = () => {
    return <div className="spinner"></div>
  }

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }
  useEffect(() => {
    document.body.className = theme
  }, [theme])

  return (
    <div>
      <h1>날씨 알려줄🐶</h1>

      <input type="text" className="inputText" placeholder="도시 이름을 입력하세요" value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={getWeatherByCity}>날씨 조회</button>
      <button onClick={toggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <Spinner />}
      {weatherData && (
        <div className="card">
          <h2>{reverseCityName[weatherData.name]}</h2>
          <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="weather icon" />

          <p>날씨: {weatherData.weather[0].description}</p>
          <p>온도: {weatherData.main.temp}°C</p>
          <p>구름 양: {weatherData.clouds.all}%</p>
          {weatherData.rain && weatherData.rain['1h'] ? <p>1시간 강수량: {weatherData.rain['1h']} mm</p> : <p>한 시간 동안 비가 오지 않았어요</p>}
          {history.length > 0 && (
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
      )}
    </div>
  )
}

export default Weather
