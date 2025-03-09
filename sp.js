const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const YOUTUBE_API_KEY = 'YOUR_YOUTUBE_API_KEY';
const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
const SPOTIFY_CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const SPOTIFY_CLIENT_SECRET = 'YOUR_SPOTIFY_CLIENT_SECRET';

async function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric;
            
            let response = await fetch(url);
            let data = await response.json();
            
            document.getElementById("weather-info").innerText = Current Weather: ${data.weather[0].main}, ${data.main.temp}°C;
            getMusic(data.weather[0].main);
            getSpotifyRecommendation(data.weather[0].main);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

async function getMusic(weather) {
    let query = "";

    if (weather.toLowerCase().includes("rain")) {
        query = "Rainy day chill music";
    } else if (weather.toLowerCase().includes("clear")) {
        query = "Happy sunny songs";
    } else if (weather.toLowerCase().includes("cloud")) {
        query = "Calm cloudy day music";
    } else {
        query = "Relaxing music";
    }

    const searchURL = https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY};
    let response = await fetch(searchURL);
    let data = await response.json();
    let videoId = data.items[0].id.videoId;
    document.getElementById("music-player").innerHTML = <iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>;
}

async function getAISong() {
    const prompt = "Suggest a song for " + document.getElementById("weather-info").innerText;

    const response = await fetch("https://api.openai.com/v1/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": Bearer ${OPENAI_API_KEY}
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            prompt: prompt,
            max_tokens: 50
        })
    });

    let data = await response.json();
    document.getElementById("ai-suggestion").innerText = data.choices[0].text.trim();
}

async function getSpotifyAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": Basic ${btoa(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET)}
        },
        body: "grant_type=client_credentials"
    });
    const data = await response.json();
    return data.access_token;
}

async function getSpotifyRecommendation(weather) {
    const token = await getSpotifyAccessToken();
    let genre = "pop"; 
    
    if (weather.toLowerCase().includes("rain")) genre = "chill";
    else if (weather.toLowerCase().includes("clear")) genre = "happy";
    else if (weather.toLowerCase().includes("cloud")) genre = "acoustic";
    else genre = "ambient";
    
    const response = await fetch(https://api.spotify.com/v1/recommendations?limit=1&seed_genres=${genre}, {
        method: "GET",
        headers: {
            "Authorization": Bearer ${token}
        }
    });
    
    const data = await response.json();
    const track = data.tracks[0];
    
    document.getElementById("spotify-player").innerHTML = <iframe src="https://open.spotify.com/embed/track/${track.id}" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>;
}