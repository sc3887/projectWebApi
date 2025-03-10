// const uriIceCream = 'http://localhost:5291/iceCream';
const uriIceCream = '/iceCream';

let iceCreams = [];

function goBackToMenu() {
    location.href = "../routing.html"; 
}


function checkAuthorize(){
    fetch(uriIceCream, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(r => console.log(r))
    .then(getItems)
    .catch(error => {
        sessionStorage.setItem("check", error);
        console.log(error);
        location.href = "../login.html"
    })
}

function getItems() {
    // const userId = localStorage.getItem("userId");
    fetch(uriIceCream, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response => response.json())
    .then(data => displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    // const iceId = data.length+1;
    const iceName = document.getElementById('ice-name');
    const icePrice = document.getElementById('ice-price');
    const iceExtras = document.getElementById('ice-extras');
    const iceMilky = document.getElementById('ice-milky');

    const newItem = {
        // id: iceId,
        name: iceName.value.trim(),
        price: icePrice.value,
        extras: iceExtras.checked,
        milky: iceMilky.checked
    }

    fetch(uriIceCream, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(newItem)
    }) 
    .then(response => response.json())
    .then(() => {
        getItems();
        iceName.value = '';
        icePrice.value = '';
        iceExtras.checked = false;
        iceMilky.checked = false;
        closeAddItem();
    })
    .then(showMessage("המוצר נוסף לרשימת המוצרים שלך בהצלחה."))
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'IceCream' : 'IceCreams kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function displayItems(data) {
    const tBody = document.getElementById('iceCreams');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
        let extrasCheckbox = document.createElement('input');
        extrasCheckbox.type = 'checkbox';
        extrasCheckbox.disabled = true;
        extrasCheckbox.checked = item.extras;

        let milkyCheckbox = document.createElement('input');
        milkyCheckbox.type = 'checkbox';
        milkyCheckbox.disabled = true;
        milkyCheckbox.checked = item.milky;

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        td1.appendChild(extrasCheckbox);

        let td2 = tr.insertCell(1);
        td2.appendChild(milkyCheckbox);

        let td3 = tr.insertCell(2);
        let iceCreamName = document.createTextNode(item.name);
        td3.appendChild(iceCreamName);

        let td4 = tr.insertCell(2);
        let iceCreamPrice = document.createTextNode(item.price);
        td4.appendChild(iceCreamPrice);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    iceCreams = data;
}

function displayEditForm(id) {
    document.getElementById('editForm').style.display = 'block';
    const item = iceCreams.find(item => item.id === id);

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-price').value = item.price;
    document.getElementById('edit-extras').checked = item.extras;
    document.getElementById('edit-milky').checked = item.milky;
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        price: document.getElementById('edit-price').value,
        extras: document.getElementById('edit-extras').checked,
        milky: document.getElementById('edit-milky').checked,
    };
    // fetch(`${uriIceCream}/${itemId}`, {
    fetch(`${uriIceCream}/${item.id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(item)
        })
        .then(() => getItems())
        .then(showMessage("עדכון המוצר הסתיים בהצלחה."))
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function deleteItem(itemId) {
    const item = iceCreams.find(item => item.id === itemId);

    fetch(`${uriIceCream}/${itemId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(item)
    })
    .then(() => getItems())
    .then(showMessage("המוצר הוסר מרשימת המוצרים שלך בהצלחה."))
    .catch(error => console.error('Unable to update item.', error));
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function closeAdd() {
    document.getElementById('addItemForm').style.display = 'none';
}

function displayAddItem() {
    document.getElementById('addItemForm').style.display = 'block';
}

function closeAddItem() {
    document.getElementById('addItemForm').style.display = 'none';
}
// //////////////////////////////
// הצגת ההודעה
function showMessage(message) {
    document.getElementById('current-message').innerText  = message;
    document.getElementById('overlay').style.display = 'flex';
    }
    
    // הסתרת ההודעה
    function closeMessage() {
    document.getElementById('overlay').style.display = 'none';
    }
    
    // הוספת מאזין לאירוע כפתור סגירה
    document.getElementById('close-message').addEventListener('click', closeMessage);
    