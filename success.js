function toggleMenu() {
    const navLinks = document.querySelector('.navLinks');
    navLinks.classList.toggle('active'); // Toggle visibility of navigation menu when mobile button is clicked
}


document.addEventListener("DOMContentLoaded", () => {
    // Restore cart summary and total from sessionStorage
    const cartBooks = JSON.parse(sessionStorage.getItem("cartBooks")) || [];
    const cartTotal = sessionStorage.getItem("cartTotal") || "0.00";

    // Retrieve last 4 digits of card from localStorage
    const lastFour = localStorage.getItem("cardDigits");

    // DOM Level 3: querySelector retrieves books purchased, total price, and card number
    const bookSummary = document.querySelector("#bookSummary"); 
    const totalDisplay = document.querySelector("#totalDisplay"); 
    const cardNumFeedback = document.querySelector("#cardNumFeedback"); 

    if (cartBooks.length > 0) {
        bookSummary.innerHTML = "<b>Purchased Book(s):</b> " + cartBooks.join(", "); // Show purchased books
    } else {
        bookSummary.textContent = "No books selected."; // Fallback message
    }

    totalDisplay.textContent = `Total Price: £${cartTotal}`; // Show total price

    // Show last 4 digits of card
    if (lastFour) {
        document.getElementById("cardNumFeedback").textContent = 
        "Your credit card number ends in **** **** **** " + lastFour;
        localStorage.removeItem("cardDigits"); // clear after displaying
    }
});