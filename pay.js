// Run code when page loads or is shown again
function clearCardForm() {
    // Reset card details form for security
    const cardForm = document.querySelector('#cardDetails');
    if (cardForm && typeof cardForm.reset === 'function') {
        cardForm.reset(); // Reset card details
    } else {
        // Clear inputs manually if not a <form>
        document.querySelector('#cardNumber').value = "";
        document.querySelector('#expMonth').value = "";
        document.querySelector('#expYear').value = "";
        document.querySelector('#securityCode').value = "";
    }

    // Restore cart summary and total from sessionStorage
    const cartBooks = JSON.parse(sessionStorage.getItem('cartBooks')) || [];
    const cartTotal = sessionStorage.getItem('cartTotal') || "0.00";

    // DOM Level 3: querySelector retrieves cart summary and total
    const cartSummary = document.querySelector('#cartSummary');
    const totalDisplay = document.querySelector('#totalDisplay');

    if (cartBooks.length > 0) {
        cartSummary.innerHTML = "<b>Selected Book(s):</b> " + cartBooks.join(", "); // Show selected books
    } else {
        cartSummary.innerHTML = "<p>No books selected.</p>"; // Fallback message
    }

    totalDisplay.textContent = `Total Price: £${cartTotal}`; // Update total price display
}

// Attach to both events so it runs on refresh and back navigation
window.addEventListener('DOMContentLoaded', clearCardForm);
window.addEventListener('pageshow', clearCardForm);

function toggleMenu() {
    const navLinks = document.querySelector('.navLinks');
    // Toggle visibility of navigation menu when mobile button is clicked
    navLinks.classList.toggle('active');
}

// DOM Level 2: add event listener to the "Continue" button
document.querySelector('.continueButton').addEventListener('click', function(e) {
    e.preventDefault();

    // Cart validation: block payment if no books selected
    const cartBooks = JSON.parse(sessionStorage.getItem('cartBooks')) || [];
    const cartTotal = parseFloat(sessionStorage.getItem('cartTotal')) || 0;

    if (!cartBooks || cartBooks.length === 0) {
        alert("You must select at least one book before making a payment.");
        return; // Stop here if cart is empty
    }
    
    // DOM Level 3: retrieve card detail input values using querySelector
    const cardNumber = document.querySelector('#cardNumber').value.trim();
    const expMonth   = document.querySelector('#expMonth').value;
    const expYear    = document.querySelector('#expYear').value;
    const cvv        = document.querySelector('#securityCode').value.trim();

    // Validation: ensure all fields are entered
    if (!cardNumber && !expMonth && !expYear && !cvv) {
        alert("Please enter your card details.");
        return;
    }

    // Validation: card number must match regex for 16 digits and start with 51–55
    if (cardNumber.length !== 16 || !/^(51|52|53|54|55)/.test(cardNumber)) {
        alert("Invalid MasterCard number.");
        return;
    }
    
    const today = new Date();
    const expDate = new Date(expYear, expMonth - 1); // Subtract 1 becuase month index is zero-based
    
    // Validation: expiry date must be after today's date
    if (expDate < today) {
        alert("Card is expired.");
        return;
    }
    
    // Validation: CVV must match regex for 3–4 digits (0–9)
    if (!/^[0-9]{3,4}$/.test(cvv)) {
        alert("Invalid CVV.");
        return;
    }

    // Send card details to server for verification
    fetch("https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard", {
        method: "POST", // POST request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            master_card: cardNumber,
            exp_year: parseInt(expYear),
            exp_month: parseInt(expMonth),
            cvv_code: cvv
        })
    })

    .then(res => res.json())
    .then(data => {
        alert(data.message); // Show server response to user ("Thank you" message)
        localStorage.setItem("cardDigits", cardNumber.slice(-4)); // Save last 4 digits for success page
        window.location.href = "success.html"; // Redirect to the success page
        })
        // Catch any errors from fetch or JSON parsing
        .catch(err => {
            alert("Error processing payment. Please try again."); // User feedback
            console.error(err); // Developer debugging info
        })
});