const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
const listRooms = document.querySelector('.rooms-block');
let totalValueEl = document.querySelector('.total-rooms__value');
let countRooms = 0;
let allRooms = [];

const paginationEl = document.querySelector('.pagination');
let itemsForPage = 9;
let currentPage = 1;

const checkinEl = document.querySelector('#checkin');
const checkoutEl = document.querySelector('#checkout');
const searchBtn = document.querySelector('#search');
let totalOfDays = 0;

const localEl = document.querySelector("#place").value;
const loadingEl = document.querySelector(".loading");

const coordinates = [
    { lat: -16.7173189, lng: -43.8674957 },
    { lat: -16.7176271, lng: -43.883943 }, 
    { lat: -19.9027026, lng: -44.03409 },
    { lat: -19.8658673, lng: -43.9886409 },
    { lat: -19.9087794, lng: -43.9491789 },
    { lat: -23.5522443, lng: -46.6027126 },
    { lat: -23.5210831, lng: -46.697813 },
    { lat: -23.5898876, lng: -46.610609 },
    { lat: -23.6216616, lng: -46.6485891 },
]
console.log(coordinates)

// Create the script tag, set the appropriate attributes
var script = document.createElement('script');
script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAzQP-A8wu0zs7iLPH5XOyLyyTLPtO1FpY&callback=initMap';
script.defer = true;
script.async = true;

// Attach your callback function to the `window` object
window.initMap = function () {
    // JS API is loaded and available
};

// Append the 'script' element to 'head'
document.head.appendChild(script);


function initMap(lat, lng) {
    var pinMap = { lat: coordinates.lat, lng: coordinates.lng };
    console.log("pin", pinMap)

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: pinMap
    });

    var marker = new google.maps.Marker({
        position: pinMap,
        map: map
    });
    
}





function calculateTotalHost(totalOfDays, hostPrice) {
    return totalOfDays * hostPrice;
}

function renderSelectedRoom(index){
  
    var coords = coordinates[index];
    var roomSelected = allRooms[index];
    let { name, property_type, price, photo } = roomSelected;
    //roomSelected = [...roomSelected, ...coords];
    console.log("dentro do render selected", roomSelected, coords)

    let currentMap = initMap(coords.lat, coords.lng);
    console.log("mapa...", currentMap)

    let itemResult = 
        `
        <div class="room-details">
            <h2>${roomSelected.name} </h2>
            <div class="room-details__content">
                <div class="room__type"> ${roomSelected.property_type} </div>
                <div class="room__price"> R$${roomSelected.price},00 </div>
            </div>
            <div class="room-details__content">
                <img class="room__image" src="${roomSelected.photo}" />

                <div>
                    <div id="map">${currentMap}</div>
                </div>

            </div>
        </div>
                    
        `;

    listRooms.innerHTML = '';
    listRooms.innerHTML = itemResult;
}

function calculateDays(e) {
    e.preventDefault();

    let teste = localEl.value;
    totalOfDays = Math.floor((Date.parse(checkoutEl.value) - Date.parse(checkinEl.value)) / 86400000); 
    console.log('total days and place typed ', totalOfDays, teste)
    return totalOfDays;
}

searchBtn.addEventListener('click', calculateDays);

function selectCurrentPage(page) {
    let allLinks = document.querySelectorAll('.pagination a');
    let arrayAllLinks = Array.from(allLinks);

    arrayAllLinks.map(item => {
        item.classList.remove('active');
    })

    let link = document.getElementById(`page-${page}`)
    link.classList.add('active');
}

function renderRooms(page) {

    selectCurrentPage(page);

    const rooms2 = allRooms.slice((page - 1) * itemsForPage, itemsForPage * page);
    console.log(rooms2)
    const items = rooms2.reduce(

        (html, room, index) => html +
            `
            <div class="room">
                <div class="room__image-block">
                    <a href="javascript:void(0)" onclick="renderSelectedRoom(${index})">
                        <img class="room__image" src="${room.photo}" />
                    </a>
                </div>
                <div class="room__type"> ${room.property_type} </div>
                <div class="room__name"> 
                    <a href="javascript:void(0)" onclick="renderSelectedRoom(${index})">
                    ${room.name} 
                    </a>
                </div>
                <div class="room__price"> R$${room.price},00 </div>
            </div>
            `, ''
    )
    
    listRooms.innerHTML = '';
    listRooms.insertAdjacentHTML('beforeend', items);  
    
}
function stopLoading(){
    loadingEl.style.display = "none";
}

fetch(url)
    .then(resp => resp.json())
    .then(rooms => {
        
        countRooms = rooms.length;
        totalValueEl.textContent = countRooms; 

        var numberOfPages = Math.round(countRooms / itemsForPage);
        allRooms = rooms;

        renderRooms(1);
        stopLoading();
 
    })
    .catch(err => console.error("Failed retrieving information", err));