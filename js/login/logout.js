/**
 * logout - Destroys local storage token and redirect user to login page
 *
 * @returns {void}
 */
let logout = () => {
    let logout = document.getElementById('logout');

    logout.addEventListener('click', () => {
        localStorage.removeItem('token');
        document.location.href = "index.html";
    });
};

/**
* setUsername - Sets the username for logged in user in the navbar
*/
let setUsername = () => {
    let userName = document.getElementById('userName');

    userName.innerHTML = localStorage.getItem("username");
    userName.style = "display: flex; align-items:center;";
};

addEventListener("DOMContentLoaded", () => {
    setUsername();
    logout();
});
