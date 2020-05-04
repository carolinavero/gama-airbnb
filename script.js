const listRooms = document.querySelector('.rooms-block');
const url = 'https://api.sheety.co/30b6e400-9023-4a15-8e6c-16aa4e3b1e72';
var countRooms = 0;

fetch(url)
    .then(resp => resp.json())
    .then(rooms => {
        const items = rooms.reduce(

            (html, room, index) => html + 
            `
            <div class="room">
                <img class="room__image" src="${room.photo}" />
                <div class="room__type"> ${room.property_type} </div>
                <div class="room__name"> ${room.name} </div>
                <div class="room__price"> ${room.price} </div>
            </div>
            `, '' 
            
            )

            listRooms.insertAdjacentHTML('beforeend', items);
    })