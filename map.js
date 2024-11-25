// Initialize the map
var map = L.map('map').setView([56.8796, 24.6032], 7); // Centered on Latvia

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define the projection for EPSG:3059
proj4.defs("EPSG:3059","+proj=tmerc +lat_0=0 +lon_0=24 +k=0.9996 +x_0=500000 +y_0=-6000000 +ellps=GRS80 +units=m +no_defs");

// Load the JSON data
fetch('http://localhost:8000/geomap.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        data.features.forEach(feature => {
                var coordinates = feature.geometry.coordinates;
                // Convert coordinates from EPSG:3059 to EPSG:4326
                var latlng = proj4('EPSG:3059', 'EPSG:4326', coordinates);
                var placename = feature.properties.PLACENAME;
                var placesubty = feature.properties.PLACESUBTY;
                var reg_code = feature.properties.REG_CODE;
                var lvm_distri = feature.properties.LVM_DISTRI;
                var blockkey = feature.properties.BLOCKKEY;
                var marker = L.marker([latlng[1], latlng[0]]).addTo(map);
                marker.bindPopup(`
                    <b>${placename}</b><br>
                    Numurs: ${placesubty}<br>
                    Kods: ${reg_code}<br>
                    LVM_Distrikts: ${lvm_distri}<br>
                    BlokaKods: ${blockkey}
                `);
        });
    })
    .catch(error => console.error('Error loading the JSON data:', error));