const API_KEY = "8b70e59619de4e19daaa1f496403d1d7"; 
const YOUTUBE_API_KEY = "AIzaSyBjxEakElJh70wejaydmHRV8AZNNUvpf18";
const GEMINI_API_KEY = "AIzaSyCb0tsKbOQyhFScqosFfOGzcRHkInL9ZP8";
const SPOTIFY_CLIENT_ID = 'e4989ca3b57945d994087f2f950afb82';
const SPOTIFY_CLIENT_SECRET = 'c1bd7a100d80418994b8615e0041a3c4';

// Function to get Spotify access token
async function getSpotifyToken() {
    const url = 'https://accounts.spotify.com/api/token';
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(e4989ca3b57945d994087f2f950afb82 + ':' + c1bd7a100d80418994b8615e0041a3c4 )
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json();
    return data.access_token;
}
async function getWeatherFromSpotify() {
    const token = await getSpotifyToken();

    // Simulated Spotify API for weather-music moods (replace with real API endpoint if available)
    const weatherMoods = {
        "Sunny": "happy hits",
        "Rainy": "rainy day chill",
        "Cloudy": "relaxing cloudy tunes",
        "Snowy": "winter vibes",
        "Stormy": "moody beats",
        "Clear": "feel-good classics"
    };

}

async function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${'8b70e59619de4e19daaa1f496403d1d7'}&units=metric`;

            try {
                let response = await fetch(url);
                let data = await response.json();

                document.getElementById("weather-info").innerText = `Current Weather: ${data.weather[0].main}, ${data.main.temp}°C`;
                
                getMusic(data.weather[0].main);
                getGeminiSong(data.weather[0].main); // Call AI function with weather condition
            } catch (error) {
                console.error("Weather API Error:", error);
            }
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
        query = "Happy,joyful,travelling ,enjoying songs";
    } else if (weather.toLowerCase().includes("cloud")) {
        query = "Calm cloudy day music";
    } else {
        query = "Relaxing music,night lo-fi music";
    }

    const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${AIzaSyBjxEakElJh70wejaydmHRV8AZNNUvpf18}`;

    try {
        let response = await fetch(searchURL);
        let data = await response.json();

        if (data.items.length > 0) {
            let videoId = data.items[0].id.videoId;
            document.getElementById("music-player").innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
        } else {
            document.getElementById("music-player").innerText = "No music found!";
        }
    } catch (error) {
        console.error("YouTube API Error:", error);
    }
}

async function getGeminiSong(weatherCondition) {
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AIzaSyCb0tsKbOQyhFScqosFfOGzcRHkInL9ZP8}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `Suggest a song for ${weatherCondition} weather.` }] }]
                })
            }
        );

        let data = await response.json();

        if (data.candidates && data.candidates.length > 0) {
            document.getElementById("ai-suggestion").innerText = data.candidates[0].content.parts[0].text;
        } else {
            document.getElementById("ai-suggestion").innerText = "No AI song recommendation.";
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
        document.getElementById("ai-suggestion").innerText = "Failed to get AI song recommendation.";
    }
}
