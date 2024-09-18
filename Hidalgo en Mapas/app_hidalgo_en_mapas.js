// Inicializar el mapa
var map = L.map('map').setView([20.091, -98.762], 8);  // Coordenadas de Hidalgo

// Agregar capas de fondo
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Capa de polígonos (agrega tu capa shapefile convertida a GeoJSON)
var geojsonLayer = L.geoJson(hidalgo_municipios, {
    style: function(feature) {
        return { color: '#b51700', fillOpacity: 0.7 };
    }
}).addTo(map);
