const uri = '/iceCream';
let iceCreams = [];

function getItems() {
    fetch(uri)
    .then(response => response.json())
    .then(data => displayItems(data))
    .catch(error => console.error('Unable to get items.', error));
}

function addItem() {
    // const iceId = data.length+1;
    const iceName = document.getElementById('ice-name');
    const icePrice = document.getElementById('ice-price');
    const iceExtra = document.getElementById('ice-extras');
    const iceMilky = document.getElementById('ice-milky');
    const newItem = {
        // id: iceId,
        name: iceName.value.trim(),
        price: icePrice.value,
        extras: iceExtra.checked,
        milky: iceMilky.checked
    }
    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
    })
    .then(response => response.json())
    .then(() => {
        getItems();
        iceName.value = '';
        icePrice.value = '';
        iceExtra.checked = false;
        iceMilky.checked = false;
    })  
    .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
            method: 'DELETE'
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = iceCreams.find(item => item.id === id);

    document.getElementById('edit-name').value = item.name;
    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-isExtra').checked = item.extras;
    document.getElementById('edit-isMilki').checked = item.milky;
    document.getElementById('edit-price').value = item.price; 
    document.getElementById('editForm').style.display = 'block';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'IceCream' : 'IceCreams kinds';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        id: parseInt(itemId, 10),
        name: document.getElementById('edit-name').value.trim(),
        price: document.getElementById('edit-price').value,
        extras: document.getElementById('edit-isExtra').checked,
        milky: document.getElementById('edit-isMilki').checked
    };

    fetch(`${uri}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}


function closeInput() {
    document.getElementById('editForm').style.display = 'none';
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
        extrasCheckbox.checked = item.extrasCheckbox;

        let milkyCheckbox = document.createElement('input');
        milkyCheckbox.type = 'checkbox';
        milkyCheckbox.disabled = true;
        milkyCheckbox.checked = item.milkyCheckbox;

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
        let textNode = document.createTextNode(item.name);
        td3.appendChild(textNode);

        let td4 = tr.insertCell(3);
        let textNode2 = document.createTextNode(item.price);
        td4.appendChild(textNode2);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    iceCreams = data; // הוסף שורה זו

}

function displayAddItem() {
    document.getElementById('addItemForm').style.display = 'block';
}