// const uriUser = 'http://localhost:5291/User';
let uriUser = '/User';
let userRole = '';
let users = [];
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

function goBackToMenu() {
    location.href = "../routing.html"; 
}

// פונקציה לבדוק את הרשאות המשתמש
function checkAuthorize() {
    if(token){
        const payload = JSON.parse(atob(token.split('.')[1]));
        userRole = payload.type;
    }

let userUri = userRole.includes("Admin") ? '/User/GetAll' : '/User/Get';
    fetch(userUri, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayItems(data);
    })
    // .then(() => getItems())
    .catch(error => {
        sessionStorage.setItem("check", error);
        console.log(error);
        location.href = "../routing.html";
    });
}

function displayItems(data) {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';
    const button = document.createElement('button');

    if (data) {
        console.log(data);
        let tr = tBody.insertRow();

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', 'openInput()');
        editButton.setAttribute('onclick', `displayEditForm(${data.userId})`);

        let td1 = tr.insertCell(0);
        let userName = document.createTextNode(data.username);
        td1.appendChild(userName);

        let td2 = tr.insertCell(1);
        let userpass = document.createTextNode(data.password);
        td2.appendChild(userpass);

        let td3 = tr.insertCell(2);
        td3.appendChild(editButton);
    } else {
        console.log('User data is not valid:', data);
    }

    users = data;
}

function displayEditForm(id) {
    const user = Array.isArray(users) ? users : [users];
    const item = user.find(i => i.userId === id)
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('edit-id').value = item.userId;
    document.getElementById('edit-name').value = item.username;
    document.getElementById('edit-password').value = item.password;
    document.getElementById('editForm').style.display = 'block';
}

function updateUser() {
    const itemId = document.getElementById('edit-id').value;
    const username = document.getElementById('edit-name').value.trim();
    const password = document.getElementById('edit-password').value.trim();

    const user = {
        username: username,
        password: password,
        userId: parseInt(itemId, 10),
        email: "",
        type: ""
    };

    fetch(`${uriUser}/${userId}`,  {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(user)
    })
    .then(checkAuthorize)
    // .then(d => displayItems(d))
    .catch(error => console.error(error));
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    setTimeout(() => {
        messageDiv.innerText = '';
    }, 3000);
}


function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function openInput() {
    document.getElementById('editForm').style.display = 'block';
}