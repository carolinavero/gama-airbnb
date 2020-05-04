const listRooms = document.querySelector('.rooms-block');
const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
var countRooms = 0;

const paginationEl = document.querySelector('.pagination');
let currentPage = 1;
let rows = 9;

fetch(url)
    .then(resp => resp.json())
    .then(rooms => {
        const items = rooms.reduce(

            (html, room, index) => html + 
            `
            <div class="room">
                <div class="room__image-block"><img class="room__image" src="${room.photo}" /></div>
                <div class="room__type"> ${room.property_type} </div>
                <div class="room__name"> ${room.name} </div>
                <div class="room__price"> R$${room.price},00 </div>
            </div>
            `, '' 
            
            )

            listRooms.insertAdjacentHTML('beforeend', items);
    })