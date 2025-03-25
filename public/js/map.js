mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/outdoors-v12", // Change to light, outdoor, or terrain
  center: listing.geometry.coordinates,
  zoom: 10,
  pitch: 45, // Tilt for a better 3D view
  bearing: -15, // Slight rotation for an artistic feel
});

// 🌟 Add Smooth Navigation Controls
map.addControl(new mapboxgl.NavigationControl(), "top-right");
map.addControl(new mapboxgl.FullscreenControl(), "top-right");
map.addControl(
  new mapboxgl.GeolocateControl({ trackUserLocation: true }),
  "top-right"
);

// 🎨 Create a Custom Vibrant Marker
const markerElement = document.createElement("div");
markerElement.innerHTML = `
  <i class="fa-solid fa-map-pin" style="font-size: 34px; color: #ff5733; text-shadow: 2px 2px 5px rgba(0,0,0,0.2);"></i>
`;

// 📍 Add a Custom Styled Marker with Popup
new mapboxgl.Marker({ element: markerElement })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 20, closeOnClick: false }).setHTML(`
      <div style="font-family: Poppins, sans-serif; text-align: center;">
        <h3 style="color: #ff5733; font-weight: bold;">${listing.title}</h3>
        <p style="font-size: 14px; color: #333;">${listing.location}</p>
      </div>
    `)
  )
  .addTo(map);

// ✈️ Smooth Fly-To Effect When Map Loads
map.on("load", function () {
  map.flyTo({
    center: listing.geometry.coordinates,
    zoom: 12,
    speed: 0.8,
    curve: 1.2,
  });
});

// Adjust map when window resizes
window.addEventListener("resize", () => {
  map.resize();
});

const voiceBookingBtn = document.getElementById("voiceBookingBtn");
voiceBookingBtn.addEventListener("click", () => {
  const recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();
  recognition.start();
  document.getElementById("voiceStatus").innerText = "Listening... 🎤";

  recognition.onresult = function (event) {
    const command = event.results[0][0].transcript.toLowerCase();
    if (command.includes("book")) {
      document.getElementById("voiceStatus").innerHTML =
        "✅ Booking Confirmed!";
      document.getElementById("reserveBtn").click();
    } else {
      document.getElementById("voiceStatus").innerHTML =
        "❌ Didn't recognize command. Try Again!";
    }
  };
});

function getCrowdLevel() {
  const levels = ["🟢 Low", "🟡 Moderate", "🔴 High"];
  document.getElementById("crowdStatus").innerText =
    levels[Math.floor(Math.random() * 3)];
}

getCrowdLevel();
setInterval(getCrowdLevel, 10000); // Refresh every 10 sec

async function getWeather() {
  const response = await fetch(
    `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=<%= listing.location %>`
  );
  const data = await response.json();
  document.getElementById(
    "weatherData"
  ).innerText = `Temp: ${data.current.temp_c}°C | ${data.current.condition.text}`;
}

getWeather();
// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//   container: "map", // container ID
//   center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//   zoom: 11, // starting zoom
// });

// const marker = new mapboxgl.Marker()
//   .setLngLat(listing.geometry.coordinates)
//   .addTo(map);
