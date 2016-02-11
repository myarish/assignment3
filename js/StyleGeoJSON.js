// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var subwayLinesGeoJSON;
var neighborhoodsGeoJSON;
var pawnShopsGeoJSON;
var NYC_election_districtsGeoJSON; 


// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
$.getJSON( "geojson/MTA_subway_lines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

    // style for subway lines
    var subwayStyle = {
        "color": "#a5a5a5",
        "weight": 2,
        "opacity": 0.80
    };

    // function that binds popup data to subway lines
    var subwayClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.Line);
    }

    // using L.geojson add subway lines to map
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});

// let's add election districts data
$.getJSON( "geojson/NYC_election_districts.geojson", function( data ) {
    var nycElectionDistrict = data;

    console.log(data);

    var nycElectionDistrictStyle = function (feature){
        var value = feature.properties.ElectDist;

        var fillColor = null;
        if(value >= 0 && value <=10000){
            fillColor = "#fee5d9";
        }
        if(value >10000 && value <=20000){
            fillColor = "#fcbba1";
        }
        if(value >20000 && value<=30000){
            fillColor = "#fc9272";
        }
        if(value > 30000 && value <=40000){
            fillColor = "#fb6a4a";
        }
        if(value > 40000 && value <=50000) { 
            fillColor = "#de2d26";
        }
        if(value > 50000) { 
            fillColor = "#a50f15";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var MedHouIncoClick = function (feature, layer) {
        var average = feature.properties.ElectDist;
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Election District:</strong> " + feature.properties.ElectDist + "<br />");
    }

    NYC_election_districtsGeoJSON = L.geoJson(nycElectionDistrict, {
        style: nycElectionDistrictStyle,
        onEachFeature: MedHouIncoClick
    }).addTo(map);

    // create layer controls
    createLayerControls(); 
});


// let's add pawn shops data
$.getJSON( "geojson/NYC_PawnShop_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var pawnShops = data;

    // pawn shop dots
    var pawnShopPointToLayer = function (feature, latlng){
        var pawnShopMarker = L.circle(latlng, 100, {
            stroke: false,
            fillColor: '#2ca25f',
            fillOpacity: 1
        });
        
        return pawnShopMarker;  
    }

    var pawnShopClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Name:</strong> " + feature.properties.BUSINESS_N + "<br /><strong>Address:</strong> " + feature.properties.ADDRESS);
    }

    pawnShopsGeoJSON = L.geoJson(pawnShops, {
        pointToLayer: pawnShopPointToLayer,
        onEachFeature: pawnShopClick
    }).addTo(map);


});


// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    // neighborhood choropleth map
    // let's use % in Unemployment to color the neighborhood map
    var UnempRateStyle = function (feature){
        var value = feature.properties.UnempRate;
        var fillColor = null;
        if(value >= 0 && value <=0.05){
            fillColor = "#fee5d9";
        }
        if(value >0.05 && value <=0.1){
            fillColor = "#fcbba1";
        }
        if(value >0.1 && value<=0.15){
            fillColor = "#fc9272";
        }
        if(value > 0.15 && value <=0.2){
            fillColor = "#fb6a4a";
        }
        if(value > 0.2 && value <=0.25) { 
            fillColor = "#de2d26";
        }
        if(value > 0.25) { 
            fillColor = "#a50f15";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var UnempRateClick = function (feature, layer) {
        var percent = feature.properties.UnempRate * 100;
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Unemployment Percent: </strong>" + percent + "%");
    }

    // neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
    //     style: UnempRateStyle,
    //     onEachFeature: UnempRateClick
    // }).addTo(map);



});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Pawn Shops": pawnShopsGeoJSON,
        "Election Districts": NYC_election_districtsGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}







