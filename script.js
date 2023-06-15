const apiKey = '11f10791ec6cfff79552ccc6bfe89964'
const searchForm = document.querySelector('.searchBar')
const cityInput = document.getElementById('cities')
const displayElement = document.getElementById('display')
const tempElement = document.getElementById('temp')
const windElement = document.getElementById('wind')
const humidityElement = document.getElementById('humidity')
const forecastResults = document.getElementById('forecastResults')
const searchHistoryContainer = document.querySelector('.searchHistory')
let searchHistoryArray = JSON.parse(localStorage.getItem('search-history'))

// event listeners
searchForm.addEventListener('submit', e => {
    e.preventDefault()
    const city = cityInput.value.trim()
    if (city) {
        getWeatherData(city)
        cityInput.value = ''
    }
})

searchHistoryContainer.addEventListener('click', e => {
    if (e.target.classList.contains('search-history-item')) {
        const city = e.target.textContent
        getWeatherData(city)
    }
})

// get data using api endpoint 
function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayCurrentWeather(data)
            displayForecast(data)
            addToSearchHistory(city)
        })
        .catch(error => {
            console.error('Error:', error)
        })
}
// when displaying the temp, change it from K to F
function displayCurrentWeather(data) {
    const currentWeather = data.list[0]
    const city = data.city.name
    const temperatureK = currentWeather.main.temp
    const temperatureF = ((temperatureK - 273.15) * 9) / 5 + 32 
    const windSpeed = currentWeather.wind.speed
    const humidity = currentWeather.main.humidity

    displayElement.textContent = city
    tempElement.textContent = `Temperature: ${temperatureF.toFixed(2)} °F` 
    windElement.textContent = `Wind Speed: ${windSpeed} m/s`
    humidityElement.textContent = `Humidity: ${humidity} %`
}
// get the forcast data and display it 
function displayForecast(data) {
    const forecastData = data.list.slice(1, 6)

    forecastResults.innerHTML = ''

    forecastData.forEach((day, index) => {
        const forecastCard = document.createElement('div')
        forecastCard.classList.add('card')

        const forecastDisplay = document.createElement('h4')
        forecastDisplay.textContent = day.dt_txt
        forecastCard.appendChild(forecastDisplay)

        const forecastIcon = document.createElement('img')
        forecastIcon.src = `http://openweathermap.org/img/w/${day.weather[0].icon}.png`
        forecastIcon.alt = 'Weather Icon'
        forecastCard.appendChild(forecastIcon)

        const forecastTemperature = document.createElement('h5')
        forecastTemperature.textContent = `Temperature: ${day.main.temp} K`
        forecastCard.appendChild(forecastTemperature)

        const forecastWind = document.createElement('h5')
        forecastWind.textContent = `Wind Speed: ${day.wind.speed} m/s`
        forecastCard.appendChild(forecastWind)

        const forecastHumidity = document.createElement('h5')
        forecastHumidity.textContent = `Humidity: ${day.main.humidity} %`
        forecastCard.appendChild(forecastHumidity)

        forecastResults.appendChild(forecastCard)
    })
}

// add history to search and displat it when the input field is used
function addToSearchHistory(city) {
    searchHistoryArray.push(city)
    localStorage.setItem('search-history', JSON.stringify(searchHistoryArray))

    const searchHistoryItem = document.createElement('div')
    searchHistoryItem.classList.add('search-history-item')
    searchHistoryItem.textContent = city
    searchHistoryContainer.appendChild(searchHistoryItem)
}