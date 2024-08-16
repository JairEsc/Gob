var bounds = L.latLngBounds(
    L.latLng(32.71865357039013, -86.71040527988355), // Coordenada suroeste
    L.latLng(14.532098369766466, -118.3651143522829)  // Coordenada noreste
  );
var map = L.map('map',{
    maxBounds: bounds,        // Establecer los límites máximos
    maxBoundsViscosity: 1.0
}).fitBounds(bounds);
L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_background/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 4,
	maxZoom: 15,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
}).addTo(map);

function style_ent(feature) {
    return {
        fillColor: getColor(feature.properties.CVEGEO),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.4
    };
}
poligonos_map = L.geoJson(mexico, {
    style: style_ent,
    onEachFeature: onEachFeature,
}).addTo(map)
map.fitBounds(poligonos_map.getBounds());
var ultimo_seleccionado='Hidalgo'

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });

    layer.bringToFront();
    info.update(layer.feature.properties);
    B.myVariable =e.target.feature.properties.NOMGEO;
}

function resetHighlight(e) {
    poligonos_map.resetStyle();
    info.update();
}
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
    });
}
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = 
    '<h4>' +  (props ?
        props.NOMGEO ? props.NOMGEO+"<br />"
        : props.NOMGEO+'</h4>': ' ');
};

info.addTo(map);

var B = {};

Object.defineProperty(B, 'myVariable', {
    set: function(value) {
        this._myVariable = value;
        this.onChange(value);
    },
    get: function() {
        return this._myVariable;
    }
});

window.addEventListener("dataUpdated", function(event) {
    console.log(event)
    /*let updatedData = event.detail.indexedEstados;
    mexico.features.forEach((feature, index) => {
        if (index < updatedData.length) {
          feature.properties.CVEGEO = updatedData[index];
        }
      });
    poligonos_map.resetStyle();*/
    
    /*let updatedData = event.detail.dataList;

    let jsonData = {}; // Tu variable tipo JSON

    // Modificar jsonData con los valores de updatedData
    updatedData.forEach((value, index) => {
        jsonData[index] = value; // Ejemplo de modificación
    });

    // Ejecutar el bloque de código necesario con jsonData
    console.log("jsonData actualizado:", jsonData);
    
    // Aquí puedes incluir el código para actualizar el mapa de Leaflet*/
});
