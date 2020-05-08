const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
const listRooms = document.querySelector('.rooms-block');
let totalBlockEl = document.querySelector('.total-rooms');
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

    //Montes Claros: lat: -16.737, lng: -43.8647
    [-16.7173189, -43.8674957, 'Montes Claros' ],
    [-16.7176271, -43.883943, 'Montes Claros' ], 
    [-16.7081947, -43.8856271, 'Montes Claros' ],
    [-16.7103526, -43.8781599, 'Montes Claros'],
    [-16.7122845, -43.8744906 , 'Montes Claros'],
    [-16.7107653, -43.8654821, 'Montes Claros' ],
    [-16.6997151, -43.8679461, 'Montes Claros'],
    [-16.6997151, -43.8679461, 'Montes Claros'],

    // BH lat: -19.8157, lng: -43.9542
    [-19.8909193, -43.9577007 , 'Belo Horizonte'],
    [-19.9158165, -43.9518642, 'Belo Horizonte'],
    [-19.9150448, -43.9318603, 'Belo Horizonte'],
    [-19.914722, -43.9293337, 'Belo Horizonte'],
    [-19.9060568, -43.9418274, 'Belo Horizonte'],
    [-19.8905234, -43.9291942, 'Belo Horizonte'],
    [-19.9008987, -43.9291164, 'Belo Horizonte'],
    [-19.885079, -43.9767414, 'Belo Horizonte'],  
    [-19.8767382, -43.9887544, 'Belo Horizonte'],
    [-19.8731841, -43.9775964, 'Belo Horizonte'],
    [-19.8715949, -43.9802679, 'Belo Horizonte'],
    [-19.868236, -43.9813423, 'Belo Horizonte'],

    //SP lat: -23.533773, lng: - 46.625290
    [-23.5815103, -46.6389331, "São Paulo"],
    [-23.578521, -46.5560207, "São Paulo"],
    [-23.5661307, -46.5152082, "São Paulo"],
    [-23.5492347, -46.5339622, "São Paulo"],
    [-23.5464415, -46.5431461, "São Paulo"] 

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
            '<h1>R$' + room.price + ' / noite</h1>' +
            '<div>' + room.name + '</div>' +
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

// Filter by Place 
function filterByPlace(localValue, totalPriceValue) {

    paginationEl.style.display = "none";
    var filtered = allRooms.filter(room => room.place == localValue);
    totalValueEl = filtered.length;
    renderRooms(filtered, totalPriceValue);

}

function calculateDays(e) {
    e.preventDefault();

    var localValue = localEl.value;

    if (localValue == 0 || checkoutEl.value == 0 || checkoutEl.value == 0 || guests.value == 0) {
        console.log("local vazio");
        alert("Preencha todos os campos da busca")

    } else {
        console.log(localValue)

        totalOfDays = Math.floor((Date.parse(checkoutEl.value) - Date.parse(checkinEl.value)) / 86400000);
        var totalPriceValue = totalOfDays * guests.value;

        filterByPlace(localValue, totalPriceValue);

        if (totalValueEl > 0) {
            totalBlockEl.textContent = `Total de ${totalValueEl} acomodações em ${localValue}`;
        } else {
            totalBlockEl.innerHTML = `Nenhuma acomodação encontrada em ${localValue}`;
        }

    }

}

searchBtn.addEventListener('click', calculateDays);

//Pagination
function selectCurrentPage(page) {
    let allLinks = document.querySelectorAll('.pagination a');
    let arrayAllLinks = Array.from(allLinks);

    arrayAllLinks.map(item => {
        item.classList.remove('active');
    });

    let link = document.getElementById(`page-${page}`)
    link.classList.add('active');

    rooms2 = allRooms.slice((page - 1) * itemsForPage, itemsForPage * page);
    renderRooms(rooms2);
}

// Loading
function stopLoading() {
    loadingEl.style.display = "none";
}

// List all Rooms
function renderRooms(rooms2, totalPriceValue = 0) {

    if(rooms2.length == 0) {
        console.log("No room to render Map");
    } else {
        initMap(rooms2);
    }

    const items = rooms2.reduce(
        
        (html, room, index) => { 
            
            var total = '';

            if(totalPriceValue > 0) {
                total = `<div class="room__price__total"> Total de R$ ${room.price * totalPriceValue},00 </div> `;
            }

            return  html +
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
                    <div class="room__price"> R$ ${room.price},00 <span>/noite<span> </div>
                    ${total}
                
                </div>
                `
        }, '');
    
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
                room.place = coordinates[index][2];
            }
            return room;
        })

        selectCurrentPage(1);
        stopLoading();
 
    })
    .catch(err => console.error("Failed retrieving information", err));