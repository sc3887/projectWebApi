// const uriUser = 'http://localhost:5291/User';
let uriUser = '/User';
let userRole = '';
let users = [];
const userId = localStorage.getItem("userId");
const token = localStorage.getItem("token");

function goBackToMenu() {
    location.href = "../routing.html"; 
}
let usersUri = '/User/GetAll';

// פונקציה לבדוק את הרשאות המשתמש
function checkAuthorize() {
    let detailsUri = '/User/Get';
    fetch(detailsUri, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    //פונקציה להצגת פרטי המשתמש
    .then(data => {
        displayItems(data);
    })
    //פונקציה להצגת כל המשתמשים
    .then(getAllUsers())
    .catch(error => {
        sessionStorage.setItem("check", error);
        console.log(error);
        location.href = "../routing.html";
    });
}
//פונקציה להצגת פרטי המשתמש
function displayItems(data) {
    const tBody = document.getElementById('detailsUser');
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

function getAllUsers(){
    let usersUri = '/User/GetAll';
    fetch(usersUri, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayAllUsers(data);
    })
    // .then(() => getItems())
    .catch(error => {
        sessionStorage.setItem("check", error);
        console.log(error);
        location.href = "../routing.html";
    });
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'משתמש' : 'משתמשים';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}
//פונקציה להצגת פרטי כל המשתמשים
function displayAllUsers(data) {
    const tBody = document.getElementById('users');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {
      
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm(${item.userId})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem(${item.userId})`);

        let tr = tBody.insertRow();

        let td1 = tr.insertCell(0);
        let userName = document.createTextNode(item.username);
        td1.appendChild(userName);

        let td2 = tr.insertCell(1);
        let userPassword = document.createTextNode(item.password);
        td2.appendChild(userPassword);

        let td3 = tr.insertCell(2);
        let userEmail = document.createTextNode(item.email);
        td3.appendChild(userEmail);

        let td4 = tr.insertCell(3);
        let userType = document.createTextNode(item.type);
        td4.appendChild(userType);

        let td5 = tr.insertCell(4);
        td5.appendChild(editButton);

        let td6 = tr.insertCell(5);
        td6.appendChild(deleteButton);
    });

    users = data;
}

function displayEditForm(id) {
    const item = users.find((i) => i.userId === id);
    document.getElementById('editForm').style.display = 'block';
    document.getElementById('edit-id').value = item.userId;
    document.getElementById('edit-name').value = item.username;
    document.getElementById('edit-password').value = item.password;
    document.getElementById('edit-email').value = item.email;
    document.getElementById('edit-type').value = item.type;
    document.getElementById('editForm').style.display = 'block';
}

function addItem() {
       const userId = document.getElementById('user-id').value;
       const userName = document.getElementById('user-name').value.trim();
       const userPassword = document.getElementById('user-password').value.trim();
       const userEmail = document.getElementById('user-email').value.trim();
       const userType = document.getElementById('user-type').value.trim();
   
       const newItem = {
           username: userName,
           password: userPassword,
           userId: 0,
        //    userId: parseInt(userId, 10),
           email: userEmail,
           type: userType
       }
   
       fetch(uriUser, {
           method: 'POST',
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${localStorage.getItem("token")}`
           },
           body: JSON.stringify(newItem)
       })
       .then(response => response.json())
       .then(getAllUsers)
       .then(() => {
           userName.value = '';
           userPassword.value = '';
           userId.value = '';
           userEmail.value = '';
           userType.value = '';
           closeAddItem();
       })
    //    .then(showMessage("המשתמש נוסף לרשימת המשתמשים בהצלחה."))
       .catch(error => console.error(error));
    }
   
   function _displayCount(itemCount) {
       const name = (itemCount === 1) ? 'user' : 'users';
   
       document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function updateUser() {
    const itemId = document.getElementById('edit-id').value;
    const username = document.getElementById('edit-name').value.trim();
    const password = document.getElementById('edit-password').value.trim();
    const email = document.getElementById('edit-email').value.trim();
    const type = document.getElementById('edit-type').value.trim();

    const user = {
        username: username,
        password: password,
        userId: parseInt(itemId, 10),
        email: email,
        type: type
    };

    fetch(`${uriUser}/${itemId}`,  {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(user)
    })
    // .then(displayItems())
    .then(getAllUsers)
    .then(() => {
        username.value = '';
        password.value = '';
        itemId.value = '';
        email.value = '';
        type.value = '';
        closeInput();
    })
    .catch(error => console.error(error));
}

function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerText = message;
    setTimeout(() => {
        messageDiv.innerText = '';
    }, 3000);
}


function deleteItem(itemId){
    fetch(`${uriUser}/${itemId}`,  {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(getAllUsers)
    .catch(error => console.error(error));

}


function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function openInput() {
    document.getElementById('editForm').style.display = 'block';
}

function closeAddItem() {
    document.getElementById('addItemForm').style.display = 'none';
}

function displayAddItem(){
    document.getElementById('addItemForm').style.display = 'block';
}