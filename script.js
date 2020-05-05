const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
const listRooms = document.querySelector('.rooms-block');
let totalValueEl = document.querySelector('.total-rooms__value');
let countRooms = 0;
let allRooms = [];

const paginationEl = document.querySelector('.pagination');
let itemsForPage = 9;
let currentPage = 1;

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
    const items = rooms2.reduce(

        (html, room) => html +
            `
            <div class="room">
                <div class="room__image-block"><img class="room__image" src="${room.photo}" /></div>
                <div class="room__type"> ${room.property_type} </div>
                <div class="room__name"> ${room.name} </div>
                <div class="room__price"> R$${room.price},00 </div>
            </div>
            `, ''
    )

    listRooms.innerHTML = '';
    listRooms.insertAdjacentHTML('beforeend', items);  
}

fetch(url)
    .then(resp => resp.json())
    .then(rooms => {
        
        countRooms = rooms.length;
        totalValueEl.textContent = countRooms; 

        var numberOfPages = Math.round(countRooms / itemsForPage);
        allRooms = rooms;

        renderRooms(1);
 
    })