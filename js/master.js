let inputsearchapi = document.getElementById("searchapi");
let btnapi = document.getElementById("btnapi");
let erroriinput = document.getElementById("error");
let loading = document.getElementById("loading");
let weatherInfo = document.getElementById("weatherInfo");

// اسم المدينة الافتراضية
const defaultCity = "Cairo";

// استدعاء الطقس للمدينة الافتراضية عند فتح الصفحة
window.onload = function () {
    getWeather(defaultCity);
};

// البحث التلقائي عند كتابة اسم المدينة
inputsearchapi.addEventListener("input", function () {
    let city = inputsearchapi.value.trim();
    if (city !== "") {
        getWeather(city);
    }
});

btnapi.addEventListener("click", function () {
    let city = inputsearchapi.value.trim(); // إزالة المسافات الزائدة
    if (city === "") {
        // إذا كان الإدخال فارغًا
        erroriinput.classList.remove("d-none");
        erroriinput.innerText = "Please enter a city name.";
    } else {
        erroriinput.classList.add("d-none"); // إخفاء رسالة الخطأ
        getWeather(city);
    }
});

async function getWeather(city) {
    try {
        loading.classList.remove("d-none"); // إظهار المؤشر
        let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=14b144d729064cef93c135137240812&q=${city}&days=3&aqi=no`);
        let data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        displayWeather(data);
        erroriinput.classList.add("d-none"); // إخفاء رسالة الخطأ
    } catch (error) {
        erroriinput.classList.remove("d-none");
        erroriinput.innerText = error.message || "Failed to fetch weather data.";
    } finally {
        loading.classList.add("d-none"); // إخفاء المؤشر
    }
}

function displayWeather(data) {
    let { location, forecast } = data;

    // الحصول على تاريخ اليوم
    let today = new Date();
    let todayDate = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    function getDayName(dateString) {
        let date = new Date(dateString);
        return date.toLocaleDateString("en-US", { weekday: "long" });
    }

    let todayWeather = forecast.forecastday[0];
    let tomorrowWeather = forecast.forecastday[1];
    let dayAfterTomorrowWeather = forecast.forecastday[2];

    weatherInfo.innerHTML = `
        <div class="row g-4 ">
           
            <div class="col-md-4">
                <div class="item">
                    <div class="heading">
                        <h6>${getDayName(todayWeather.date)}</h6>
                        <p> ${todayDate}</p>
                    </div>
                    <div class="box">
                    <div class="content">
                        <h6>${location.name}, ${location.country}</h6>
                        <h1 class="num" > ${todayWeather.day.avgtemp_c}°C</h1>
                        <img src="${todayWeather.day.condition.icon}" alt="Weather Icon">
                        <p class="text">  ${todayWeather.day.condition.text}</p>
                    
                    </div>
                    <div class="footer">
                        <p><i class="fas fa-wind"></i>  ${todayWeather.day.maxwind_kph} kph</p>
                        <p><i class="fas fa-tint"></i>  ${todayWeather.day.avghumidity}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-4">
                <div class="item">
                    <div class="head2">
                        <h6>${getDayName(tomorrowWeather.date)}</h6>
                    
                    </div>
                    <div class="box-two text-center">
                    <div class="content">
                        <h1  >  ${tomorrowWeather.day.avgtemp_c}°C</h1>
                        <img src="${tomorrowWeather.day.condition.icon}" alt="Weather Icon">
                        <p class="text">  ${tomorrowWeather.day.condition.text}</p>
                    
                    </div>
                    <div class="footer text-center">
                        <p><i class="fas fa-wind"></i>  ${todayWeather.day.maxwind_kph} kph</p>
                        <p><i class="fas fa-tint"></i>  ${todayWeather.day.avghumidity}%</p>
                        </div>
                    </div>
                </div>
            </div>

        <div class="col-md-4">
         <div class="item">
            <div class="head3">
                <h6>${getDayName(dayAfterTomorrowWeather.date)}</h6>
               
            </div>
            <div class="box-threr text-center">
                <div class="content">
                    <h1  > ${dayAfterTomorrowWeather.day.avgtemp_c}°C</h1>
                    <img src="${dayAfterTomorrowWeather.day.condition.icon}" alt="Weather Icon">
                    <p class="text">  ${dayAfterTomorrowWeather.day.condition.text}</p>
                
                </div>
                <div class="footer text-center">
                    <p><i class="fas fa-wind"></i>  ${dayAfterTomorrowWeather.day.maxwind_kph} kph</p>
                    <p><i class="fas fa-tint"></i>  ${dayAfterTomorrowWeather.day.avghumidity}%</p>
                    </div>
            </div>
            
            </div>
        </div>

        </div>
    `;
}
