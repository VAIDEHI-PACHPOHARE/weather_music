const API_KEY = "8b70e59619de4e19daaa1f496403d1d7"; 
const YOUTUBE_API_KEY = "AIzaSyBjxEakElJh70wejaydmHRV8AZNNUvpf18";
const OPENAI_API_KEY = "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";

async function getWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${'8b70e59619de4e19daaa1f496403d1d7'}&units=metric`;

            let response = await fetch(url);
            let data = await response.json();

            document.getElementById("weather-info").innerText = `Current Weather: ${data.weather[0].main}, ${data.main.temp}°C`;
            
            getMusic(data.weather[0].main);
            getAISong(data.weather[0].main); // Call AI function with weather condition
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
        query = " joyful , sunny , travelling , refreshing songs";
    } else if (weather.toLowerCase().includes("cloud")) {
        query = "Calm cloudy day music";
    } else {
        query = "Relaxing music";
    }

    const searchURL = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${YOUTUBE_API_KEY}`;

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

async function getAISong(weatherCondition) {
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${'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' }`
            },
            body: JSON.stringify({
                model: "gpt-4", // Or "gpt-3.5-turbo"
                messages: [{ role: "user", content: `Suggest a song for ${weatherCondition} weather.` }],
                temperature: 0.7,
                max_tokens: 50
            })
        });

        let data = await response.json();

        if (data.choices && data.choices.length > 0) {
            document.getElementById("ai-suggestion").innerText = data.choices[0].message.content.trim();
        } else {
            document.getElementById("ai-suggestion").innerText = "No AI song recommendation.";
        }
    } catch (error) {
        console.error("OpenAI API Error:", error);
        document.getElementById("ai-suggestion").innerText = "Failed to get AI song recommendation.";
    }
}