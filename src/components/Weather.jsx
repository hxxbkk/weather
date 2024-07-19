import React, { useState } from 'react'

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
  const apiKey = import.meta.env.VITE_API_KEY

  const fetchWeather = async (url) => {
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
    }
  }

  const getWeatherByCity = () => {
    const englishCity = cityName[city]
    if (city && isKorean(city) && englishCity) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${englishCity}&appid=${apiKey}&units=metric`
      fetchWeather(url)
    } else {
      setError('도시 이름을 한국어로 쳐주세요!')
      setWeatherData(null)
    }
  }

  return (
    <div>
      <h1>날씨 알려줄🐶</h1>
      <input type="text" className="inputText" placeholder="도시 이름을 입력하세요" value={city} onChange={(e) => setCity(e.target.value)} />
      <button onClick={getWeatherByCity}>날씨 조회</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {weatherData && (
        <div>
          <h2>{reverseCityName[weatherData.name]}</h2>
          <p>온도: {weatherData.main.temp}°C</p>
          <p>날씨: {weatherData.weather[0].description}</p>
          <p>☁️ : {weatherData.clouds.all}%</p>
          {weatherData.rain && weatherData.rain['1h'] ? <p>1시간 강수량: {weatherData.rain['1h']} mm</p> : <p>한 시간 동안 비가 오지 않았어요</p>}
        </div>
      )}
    </div>
  )
}

export default Weather
