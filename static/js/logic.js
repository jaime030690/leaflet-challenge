var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(url, function(data){
    console.log(data);
    createFeatures(data.features);
});


// function creates popups for each earthquake
function createFeatures(usgsData) {

    var circles = [];

    for (var i = 0; i < usgsData; i++) {

      var coordinates = [
        usgsData[i].geometry.coordinates[0],
        usgsData[i].geometry.coordinates[1]
      ]

      var magnitude = usgsData.properties.mag;

      circles.push(
        L.circle(coordinates, {
          fillOpacity: 0.75,
          color: function(magnitude) {
            if 
          }
        })
      )
    }
    
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>"  + feature.properties.title + "</h3><hr><p>Timestamp: " + new Date(feature.properties.time) + "</p>");
      
    }

    var earthquakes = L.geoJSON(usgsData, {
        onEachFeature: onEachFeature,
        style: f => circleProperties(f)
    });

    createMap(earthquakes);
}

//function builds the
function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.dark",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Street Map": streetmap,
      "Dark Map": darkmap
    };
  
    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        39.50, -98.35
      ],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  }