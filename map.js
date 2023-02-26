const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const state = urlParams.get('state');

//capture geolocation from user
const successCallback = (position) => {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    let geolocationQ = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;

    fetch(geolocationQ).then(response => response.json()).then(data => { 

        if(state){
            mapGenState(latitude, longitude, state)
        } else {
            mapGenDefault(latitude,longitude, data.postcode)}
         })
}
    
    const errorCallback = (error) => {
    console.log(error);
    };
    
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

function mapGenState(latitude, longitude, state) {

    var map = L.map('map')

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    fetch('./stateCoords.json').then((response) => response.json()).then((json) => {
        
        let url = `https://developer.nrel.gov/api/alt-fuel-stations/v1.json?state=${state}&fuel_type=ELEC&api_key=o4lBmdpQU49LBZa9KP8VOd3qcybIPN9L0olJ2ygK&limit=200`;

        fetch(url)
        .then(response => response.json()).then(data => {
            data.fuel_stations.forEach(station => {
                if(station.fuel_type_code === "ELEC"){
                L.marker([station.latitude, station.longitude]).addTo(map).bindPopup(station.station_name)}
        })
        })

    map.setView([Number(json[state][0]), Number(json[state][1])], 6);})

}

function mapGenDefault(latitude,longitude,postalCode) {


    var map = L.map('map')

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);


    let url = `https://developer.nrel.gov/api/alt-fuel-stations/v1.json?zip=${postalCode}&fuel_type=ELEC&api_key=o4lBmdpQU49LBZa9KP8VOd3qcybIPN9L0olJ2ygK&limit=200`;

    fetch(url)
    .then(response => response.json()).then(data => {
        data.fuel_stations.forEach(station => {
            if(station.fuel_type_code === "ELEC"){
            L.marker([station.latitude, station.longitude]).addTo(map).bindPopup(station.station_name)}
    })
    })

    map.setView([Number(latitude), Number(longitude)], 10);

}