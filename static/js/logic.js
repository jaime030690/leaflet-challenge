var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

// list colors for overlay
var colors = [
  "#FF0000",
  "#FF5700",
  "#FFC100",
  "#D4FF00",
  "#6AFF00",
  "#00FF00",
]

var limits = [
  0,
  1,
  2,
  3,
  4,
  5
]

//read in data
d3.json(url, function(data){
    console.log(data);
    createMap(data.features);
});

// function creates fill color 
function circleFill(mag) {
  if (mag >= 5) {
    return colors[0];
  }
  else if (mag >= 4) {
    return colors[1];
  }
  else if (mag >= 3) {
    return colors[2];
  }
  else if (mag >= 2) {
    return colors[3];
  }
  else if (mag >= 1) {
    return colors[4];
  }
  else {
    return colors[5];
  }
}

//function builds the map
function createMap(usgsData) {

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5,
  });

  // add map base layer
  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  }).addTo(myMap);

  // loop thru data to add markers
  for (var i = 0; i < usgsData.length; i ++) {

    var mag = usgsData[i].properties.mag;

    var location = [usgsData[i].geometry.coordinates[1], usgsData[i].geometry.coordinates[0]];

    var color = circleFill(mag);

    L.circle(location, {
      fillOpacity: 0.75,
      color: "white",
      fillColor: color,
      radius: mag * 25000
    }).bindPopup("<h3>" + usgsData[i].properties.title + "</h3>").addTo(myMap);
  }    

  // create legend
  var legend = L.control({position: "bottomright"});

  legend.onAdd = function() {

    var div = L.DomUtil.create("div", "info legend");

    var labels = [];

    var legendInfo = "<h1>Magnitude</h1>" +
      "<div class=\"labels\">" + 
        "<div class=\"min\">" + limits[0] + "</div>" + 
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" + 
      "</div>";
    
    div.innerHTML = legendInfo;
    
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[colors.length - index - 1] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";

    return div;

  }

  console.log(legend);

  legend.addTo(myMap);

}