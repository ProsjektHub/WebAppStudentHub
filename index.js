
const urlParams = new URLSearchParams(window.location.search);
const email = urlParams.get('email');
if (email) {
    document.getElementById('userEmail').textContent = email;
}


function fetchEventData() {
// Assuming you're making a GET request to /index.html with the user's email as a query parameter
const userEmail = encodeURIComponent(document.getElementById('userEmail').textContent);
window.location.href = `/index.html?email=${userEmail}`;
}
