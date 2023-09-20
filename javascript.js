

const userTab = document.querySelector("[data-userTab]");
const searchTab = document.querySelector("[data-searchWeatherTab]");
const userContainer = document.querySelector(".weather-countainer");
const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAcessBtn = document.querySelector("[data-grantAccess]");



let currentTab = userTab;
const API_key = '7f360a960b15b1d3b5aacd6ac226f417';
currentTab.classList.add("current-tab");
getFromSessionStorage();

function switchTab(clickTab){
    if(clickTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAcessContainer.classList.remove("active");
            searchForm.classList.add("active");
    
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            // grantAcessContainer.classList.add("active");
            
            getFromSessionStorage();
        }
    }

    
}

userTab.addEventListener('click', ()=>{
    switchTab(userTab);
});

searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);
});

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if (!localCoordinates){
        grantAcessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);      
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;

    
    // make grantcontainer invisible
    grantAcessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API CALL
    try {
        
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`
          );  
        const  data = await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randarWeatherInfo(data);
    }
    catch(err) {
        loadingScreen.classList.remove("active");
        //HW

    }

}


function randarWeatherInfo(weatherInfo){
    
    const city_name = document.querySelector("[data-cityName]");
    
    const countryIcon = document.querySelector("[data-cityImage]");
    
    const desc = document.querySelector("[data-weatherDesc]");
    
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    
    const temp = document.querySelector("[data-temp]");
    
    const windspeed = document.querySelector("[data-windSpeed]");
    
    const humidity = document.querySelector("[data-humidity]");
    
    const cloudiness = document.querySelector("[data-cloud]");
    
    city_name.innerText = weatherInfo?.name;
    countryIcon.src =  `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}




function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("no geolocation support available")
    }
}
function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

}

grantAcessBtn.addEventListener('click', getLocation);

let searchInput = document.querySelector("[data-searchInput]");


searchForm.addEventListener("submit", (e) => { 
    console.log("hi")
    e.preventDefault();
    let city = searchInput.value;
    console.log("i am here");
    if(city === ""){
        return;
    }
    else{
        fetchWeatherInfo(city);
    } 
    
})

async function fetchWeatherInfo(city){
    console.log("i am here 1");
    loadingScreen.classList.add("active");
    console.log("i am here 2");
    userInfoContainer.classList.remove("active");
    grantAcessContainer.classList.remove("active")

    try{
        console.log("i am here 3");
        const respons = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await respons.json();
        console.log(data)
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        randarWeatherInfo(data);
    }
    catch(err){
        console.log("i am here 4");
        loadingScreen.classList.remove("active");
    }
}