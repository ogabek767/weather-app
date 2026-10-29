let white = document.querySelector("#white");
let takliflar = document.querySelector("#takliflar");

white.addEventListener("input", async function() {
    let matn = white.value.trim();

    if (matn.length < 2) {
        takliflar.innerHTML = "";
        return;
    }

    try {
        let javob = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(matn)}&count=7&language=en&format=json`
        );

        let data = await javob.json();

        takliflar.innerHTML = "";

        if (!data.results) {
            return;
        }

        data.results.forEach(function(shahar) {
            let element = document.createElement("div");

            element.textContent =
                shahar.name +
                (shahar.admin1 ? ", " + shahar.admin1 : "") +
                (shahar.country ? ", " + shahar.country : "");

            element.addEventListener("click", function() {
                white.value = shahar.name;
                takliflar.innerHTML = "";
                qidirish();
            });

            takliflar.appendChild(element);
        });

    } catch (xato) {
        takliflar.innerHTML = "";
        console.log("Shaharlarni qidirishda xatolik:", xato);
    }
});



let saqlanganShahar = localStorage.getItem("shahar");

if (saqlanganShahar) {
    white.value = saqlanganShahar;
}

let black = document.querySelector("#black");
let celsius = document.querySelector("#celsius");
let fahrenheit = document.querySelector("#fahrenheit");
let skyblue = document.querySelector("#skyblue");
let forecast = document.querySelector("#forecast");
let darkMode = document.querySelector("#darkMode");

let birlik = localStorage.getItem("birlik") || "C";

if (birlik === "F") {
    fahrenheit.classList.add("active");
} else {
    celsius.classList.add("active");
}
celsius.addEventListener("click",function() {
    birlik="C";
    localStorage.setItem("birlik", "C");
    celsius.classList.add("active");
fahrenheit.classList.remove("active");
    qidirish();
});
fahrenheit.addEventListener("click",function(){
    birlik="F";
    localStorage.setItem("birlik", "F");
    fahrenheit.classList.add("active");
celsius.classList.remove("active");
    qidirish();
});

darkMode.addEventListener("click", function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("rang", "dark");
        darkMode.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("rang", "light");
        darkMode.textContent = "🌙 Dark Mode";
    }
});
if (localStorage.getItem("rang") === "dark") {
    document.body.classList.add("dark");
} else {
    document.body.classList.remove("dark");
}

if (document.body.classList.contains("dark")) {
    darkMode.textContent = "☀️ Light Mode";
} else {
    darkMode.textContent = "🌙 Dark Mode";
}

white.addEventListener("keydown", (event)=>{
    if(event.key==="Enter") {
        qidirish();
    }
});

function qidirish () {
    let shahar = white.value;

    localStorage.setItem("shahar", shahar);
    
if (shahar.trim() === "") {
    skyblue.textContent = "❌ Shahar nomini kiriting";
    return;
}

skyblue.textContent = "⏳ Qidirilmoqda...";

    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${shahar}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => { 


if (!data.results || data.results.length === 0) {
    skyblue.textContent = "❌ Shahar topilmadi";
    return;
}


            let shaharNomi = data.results[0].name;
        

          let kenglik = data.results[0].latitude;
          let uzunlik = data.results[0].longitude;

          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${kenglik}&longitude=${uzunlik}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min&forecast_days=5`)
    .then((response) => {
    return response.json();
})
.then((data) => {
            

                if (!data.current) {
    skyblue.textContent = "⏳ Server vaqtincha ishlamayapti. Qayta urinib ko‘ring.";
    return;
}
                let namlik = data.current.relative_humidity_2m;
                let shamol = data.current.wind_speed_10m;
                let obHavoKodi = data.current.weather_code;

                let kunlar = data.daily.time;
let yuqoriHarorat = data.daily.temperature_2m_max;
let pastHarorat = data.daily.temperature_2m_min;

function aylantir(harorat) {
    if (birlik === "F") {
        return (harorat * 9 / 5) + 32;
    } else {
        return harorat;
    }
}



let prognozHTML = "";

for (let i = 0; i < kunlar.length; i++) {
    prognozHTML += `
        <div class="kun">
            <h3>📅 ${kunlar[i]}</h3>
            <p>🌡️ Eng yuqori: ${aylantir(yuqoriHarorat[i]).toFixed(1)}°${birlik}</p>
<p>❄️ Eng past: ${aylantir(pastHarorat[i]).toFixed(1)}°${birlik}</p>
        </div>
    `;
}

                let holatlar = {
    0: "☀️ Ochiq havo",
    1: "🌤️ Asosan ochiq",
    2: "⛅ Qisman bulutli",
    3: "☁️ Bulutli",

    45: "🌫️ Tuman",
    48: "🌫️ Qirovli tuman",

    51: "🌦️ Yengil mayda yomg‘ir",
    53: "🌦️ O‘rtacha mayda yomg‘ir",
    55: "🌧️ Kuchli mayda yomg‘ir",

    56: "🌧️ Yengil muzli yomg‘ir",
    57: "🌧️ Kuchli muzli yomg‘ir",

    61: "🌧️ Yengil yomg‘ir",
    63: "🌧️ O‘rtacha yomg‘ir",
    65: "🌧️ Kuchli yomg‘ir",

    66: "🌧️ Yengil muzli yomg‘ir",
    67: "🌧️ Kuchli muzli yomg‘ir",

    71: "🌨️ Yengil qor",
    73: "🌨️ O‘rtacha qor",
    75: "❄️ Kuchli qor",
    77: "❄️ Qor donachalari",

    80: "🌦️ Yengil yomg‘ir jala",
    81: "🌧️ O‘rtacha yomg‘ir jala",
    82: "⛈️ Kuchli yomg‘ir jala",

    85: "🌨️ Yengil qor jala",
    86: "❄️ Kuchli qor jala",

    95: "⛈️ Momaqaldiroq",
    96: "⛈️ Momaqaldiroq va yengil do‘l",
    99: "⛈️ Momaqaldiroq va kuchli do‘l"
};

let holat = holatlar[obHavoKodi] || "🌍 Noma'lum ob-havo";



 skyblue.innerHTML = `
    <h2>${shaharNomi}</h2>
    <h1>🌡️ ${aylantir(data.current.temperature_2m).toFixed(1)}°${birlik}</h1>
    <p>💧 Namlik: ${namlik}%</p>
    <p>💨 Shamol: ${shamol} km/h</p>
    <p>${holat}</p>
`;

forecast.innerHTML = `
    <h2>📅 5 kunlik prognoz</h2>
    <div class="prognozlar">${prognozHTML}</div>
`;
        }).catch((error) => {
    console.log(error);
    skyblue.textContent = "❌ Ob-havoni yuklashda xatolik!";
});
});
}

black.addEventListener("click", qidirish);
celsius.addEventListener("click", function() {
    birlik = "C";
    qidirish();
});

fahrenheit.addEventListener("click", function() {
    birlik = "F";
    qidirish();
});

if (saqlanganShahar) {
    qidirish();
}


