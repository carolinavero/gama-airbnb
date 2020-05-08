const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
const listRooms = document.querySelector('.rooms-block');
let totalValueEl = document.querySelector('.total-rooms__value');
let countRooms = 0;
let allRooms = [];
var rooms2 = [];

const paginationEl = document.querySelector('.pagination');
let itemsForPage = 8;
let currentPage = 1;

const checkinEl = document.querySelector('#checkin');
const checkoutEl = document.querySelector('#checkout');
const searchBtn = document.querySelector('#search');
let totalOfDays = 0;

const localEl = document.querySelector("#place");
const mapEl = document.querySelector(".map");
const loadingEl = document.querySelector(".loading");
const showMapButton = document.querySelector(".show-map");

// 25 places
var coordinates = [

    //Montes Claros
    [-16.7173189, -43.8674957 ],
    [-16.7176271, -43.883943 ], 
    [-16.7081947, -43.8856271 ],
    [-16.7103526, -43.8781599],
    [-16.7122845, -43.8744906 ],
    [-16.7107653, -43.8654821 ],
    [-16.6997151, -43.8679461],
    [-16.6997151, -43.8679461],

    // BH
    [-19.8909193, -43.9577007 ],
    [-19.9158165, -43.9518642],
    [-19.9150448, -43.9318603],
    [-19.914722, -43.9293337],
    [-19.9060568, -43.9418274],
    [-19.8905234, -43.9291942],
    [-19.9008987, -43.9291164],
    [-19.885079, -43.9767414],  
    [-19.8767382, -43.9887544],
    [-19.8731841, -43.9775964],
    [-19.8715949, -43.9802679],
    [-19.868236, -43.9813423],

    //SP
    [-23.5815103, -46.6389331],
    [-23.578521, -46.5560207],
    [-23.5661307, -46.5152082],
    [-23.5492347, -46.5339622],
    [-23.5464415, -46.5431461] 

];

// Google Maps
function showMap() {
    mapEl.classList.toggle('showing');
    listRooms.classList.toggle('rooms-with-map');

    if(mapEl.classList.contains('showing')) {
        showMapButton.textContent = "Ocultar mapa";
    } else {
        showMapButton.textContent = "Exibir mapa";
    }
}

var infowindow;
function initMap(rooms2) {

    var map;

    // Show/Hide map iframe
    var center = { lat: rooms2[0].lat, lng: rooms2[0].lng };
    var mapOptions = {
        zoom: 14,
        center: center
    };

    map = new google.maps.Map(mapEl, mapOptions);
    infowindow = new google.maps.InfoWindow();
    
    setMarkers(map, rooms2);
}

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;

// Adds markers to the map
function setMarkers(map, rooms2) {

    var shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: 'poly'
    };
    
    for (var i = 0; i < rooms2.length; i++) {

        var room = rooms2[i];

        var contentString =
            '<div id="content">' +
            '<h1 id="firstHeading" class="firstHeading">R$' + room.price + '</h1>' +
            '<div id="bodyContent">' + room.name +
            '</div>' +
            '</div>'; 

        infowindow.setContent(contentString);
        
        var marker = new google.maps.Marker({
            position: { lat: room.lat, lng: room.lng },
            map: map,
            shape: shape,
            label: labels[labelIndex++ % labels.length],
        
        });
        attachContent(marker, contentString);
    }    

    function attachContent(marker, contentString) {
        
        marker.addListener('click', function () {
            infowindow.setContent(contentString);
            infowindow.open(map, this) 
        });
    }    
        
}


var totalPrice = document.querySelector('.room__total__price');


function calculateDays(e) {
    e.preventDefault();

    totalOfDays = Math.floor((Date.parse(checkoutEl.value) - Date.parse(checkinEl.value)) / 86400000); 
    var totalPriceValue = totalOfDays * guests.value;

    //console.log('values typed ', totalOfDays, localEl.value, guests.value, totalPriceValue )
    return totalPriceValue;

    // calcular total pra cada room
}

searchBtn.addEventListener('click', calculateDays);


//Pagination
function selectCurrentPage(page) {
    let allLinks = document.querySelectorAll('.pagination a');
    let arrayAllLinks = Array.from(allLinks);

    arrayAllLinks.map(item => {
        item.classList.remove('active');
    })

    let link = document.getElementById(`page-${page}`)
    link.classList.add('active');
}

// Loading
function stopLoading() {
    loadingEl.style.display = "none";
}

// List all Rooms
function renderRooms(page) {

    selectCurrentPage(page);
    
    rooms2 = allRooms.slice((page - 1) * itemsForPage, itemsForPage * page);
    //console.log("rooms", rooms2);
    initMap(rooms2);

    const items = rooms2.reduce(

        (html, room, index) => html +
            `
            <div class="room">
                <div class="room__image-block">
                    <a href="javascript:void(0)">
                        <img class="room__image" src="${room.photo}" />
                    </a>
                </div>
                <div class="room__type"> ${room.property_type} </div>
                <div class="room__name"> 
                    <a href="javascript:void(0)">
                    ${room.name} 
                    </a>
                </div>
                <div class="room__price"> R$${room.price},00 <span>/noite<span> </div>
                <div class="room__price__total"> Total de R$,00 </div>
            
            </div>
            `, ''
    )
    
    listRooms.innerHTML = '';
    listRooms.insertAdjacentHTML('beforeend', items);  
    
}

// API
fetch(url)
    .then(resp => resp.json())
    .then(rooms => {
        
        countRooms = rooms.length;
        totalValueEl.textContent = countRooms; 

        var numberOfPages = Math.round(countRooms / itemsForPage);
        allRooms = rooms;

        // Set coordinates
        allRooms = allRooms.map((room, index) => {
            if(coordinates[index]) {
                room.lat = coordinates[index][0];
                room.lng = coordinates[index][1];
            }
            return room;
        })

        renderRooms(1);
        stopLoading();
 
    })
    .catch(err => console.error("Failed retrieving information", err));