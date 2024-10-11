var map = L.map('map').setView([19.8, -96], 9);

var tiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
	zoom: 9
}).addTo(map);
function getColor_aptitud(value) {
    return value <= 0.0315556597 ? 'transparent' :  // este es importante. Transparente significa imposible legalmente según SEMARNAT
           value <= 0.160311 ? 'rgb(255, 0, 0)' :  // Rojo
           value <= 0.278896 ? 'rgb(255, 64, 0)' :  // naranjoso
           value <= 0.439625 ? 'rgb(255, 128, 0)' :  // Amarillo-rojo
           value <= 0.647246 ? 'rgb(255, 192, 0)' :  // amarillo
           value <= 0.902241 ? 'rgb(255, 255, 0)' :  // ..
           value <= 1.248267 ? 'rgb(192, 255, 0)' :  
           value <= 1.717819 ? 'rgb(128, 255, 0)' :  
           value <= 2.354996 ? 'rgb(64, 255, 0)' :  
           'rgb(0, 255, 0)'; //máxima aptitud
}
var geojsonLayer = L.geoJson(Aptitud_relleno_sanitario_suavizado, {
    style: function(feature) {
        return { weight:0,fillOpacity: 0.6,fillColor:getColor_aptitud(feature.properties.Value_Max) };
    }
}).addTo(map);
var geojsonLayer = L.geoJson(hidalgo_municipios, {
    style: function(feature) {
        return { color: 'brown', fillOpacity: 0.1 };
    },
    onEachFeature:onEachFeature,
}).addTo(map);
map.fitBounds(geojsonLayer.getBounds())
/* Buscador local */
var controlSearch = new L.Control.Search({
    position:'bottomleft',		
    layer: geojsonLayer,
    initial: false,
    marker: false,
    zoom: 12,
    propertyName: 'NOM_MUN',
});
controlSearch.addTo(map)
/*---*/
/*Información Hover*/

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        fillOpacity: 0.7
    });

    info.update(layer.feature.properties);
}

function resetHighlight(e) {
    geojsonLayer.resetStyle();
    localidades.resetStyle();
    localidades_rur.resetStyle();
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
    this._div = L.DomUtil.create('div', 'info_tablero_indicadores'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    
    this._div.innerHTML = 
    props?'<h4>' + 'Municipio: '+props.NOM_MUN+'</h4>'+(props.NOMGEO_x?('Localidad: '+props.NOMGEO_x):'')+(props.POB1?'<br>'+'Población: '+props.POB1:''):'';
};

info.addTo(map);
/*---*/
localidades=L.geoJson(localidades_poligonos, {
    style: function(feature) {
        return { weight:0,fillColor: 'blue'/*Los poligonos deberían rellenarse según su población */, fillOpacity: 0.4 };
    },
    onEachFeature: onEachFeature,
}).addTo(map);
localidades_rur=L.geoJson(localidades_puntos, {
    pointToLayer: function (feature, latlng) {

        return L.circleMarker(latlng, {
            radius: 0.5,  // Tamaño pequeño para evitar saturación
            color: 'purple',
            fillOpacity: 0.6
        });
    },
    onEachFeature: onEachFeature,
}).addTo(map);

/*var url_to_geotiff_file = "mapas_relleno_sanitario/Aptitud_relleno_sanitario.tiff"

fetch(url_to_geotiff_file)
  .then(res => res.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {    
      const min = Math.round(georaster.mins[0])
      const max = Math.round(georaster.maxs[0])
      const rainbow = new Rainbow()
      rainbow.setNumberRange(min < 0 ? 0 : min, max,20)
      rainbow.setSpectrum('red', 'yellow','green')

      const layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 1,
        pixelValuesToColorFn: vals => vals[0] <= 0 ? null : '#' + rainbow.colourAt(Math.round(vals[0])),
        resolution: 512 // optional parameter for adjusting display resolution
      }).addTo(map)

      map.fitBounds(layer.getBounds())
    })
  })*/
/*legend*/
  var elem = document.createElement("img");
  elem.src = 'mapas_relleno_sanitario/Simbología de aptitud.png';
  elem.setAttribute("height", "300px");
  elem.setAttribute("width", "100px");
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "symbology_by_image");
    div.appendChild(elem)
    return div;
  };
  legend.addTo(map);
  /*---*/
