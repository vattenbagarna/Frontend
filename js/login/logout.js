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

addEventListener("DOMContentLoaded", () => {
    logout();
});
