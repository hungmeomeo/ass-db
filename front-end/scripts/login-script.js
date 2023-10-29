document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("login-form");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // You can add your login logic here, e.g., send a request to a server for authentication.
        // For simplicity, we'll just log the values for now.
        console.log("Username: " + username);
        console.log("Password: " + password);
    });
});
