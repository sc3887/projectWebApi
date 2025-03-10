// const uriLogin = "http://localhost:5291/login";
const uriLogin = "/login";

const dom = {
    name: document.getElementById("userName"),
    password: document.getElementById("password")
}

function usersRouter(){
    if(localStorage.getItem("link") === "false")
        location.href = "../user.html";
    else
        location.href = "../admin.html";
}

function product(){
    location.href = "../index.html";

}

function login(event){
    event.preventDefault();
    const user = 
    {
        Username: dom.name.value,
        Password: dom.password.value,
        UserId: 0,
        Email: "",
        Type: ""
    }

        fetch(uriLogin, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
    })
    .then((response) =>
        response.json()
    )
    .then((res) => {
        console.log(res.status);
        if (res.status == 400 || res.status == 401)
            //להעביר לדף של התחברות משתמש חדש
            showMessage("שם משתמש או סיסמא שגויים!");
        else {
            // if (dom.name.value === "yossi" && dom.password.value === "passYossi1")
            if (res.type === "Admin"){
                localStorage.setItem("link", "true");
            }
            else{
                localStorage.setItem("link", false);
            }
            localStorage.setItem("token", res.token);
            localStorage.setItem("userId", res.id);
            // location.href = "../index.html";
            location.href = "../routing.html";
        }
    })
    .catch(error => console.error('Unable to add item.', error));

}

function logOut(){
    localStorage.setItem("link", null);
    localStorage.setItem("token", null);
    localStorage.setItem("userId", null);
    location.href = "../login.html";
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
    var b = document.getElementById('close-message');
    // הוספת מאזין לאירוע כפתור סגירה
    document.getElementById('close-message').addEventListener('click', closeMessage);
    