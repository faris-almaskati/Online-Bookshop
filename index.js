function toggleMenu() {
    const navLinks = document.querySelector('.navLinks');
    navLinks.classList.toggle('active');     // Toggle visibility of navigation menu when mobile button is clicked
}
// DOM Level 2: querySelectorAll retrieves all checkboxes with class 'bookSelect'
const checkboxes = document.querySelectorAll('.bookSelect'); 
// DOM Level 2: querySelector retrieves the total price display element
const totalDisplay = document.querySelector('#totalPrice');

let selectedBooks = []; // Array to store selected book titles
let total = 0; // Counter for total price

// Restore saved state on page load
window.addEventListener('DOMContentLoaded', () => {
  selectedBooks = JSON.parse(sessionStorage.getItem('cartBooks')) || [];
  total = parseFloat(sessionStorage.getItem('cartTotal')) || 0;

  // Update display
  totalDisplay.textContent = `Total: £${total.toFixed(2)}`;

  // Re-check boxes that were previously selected
  checkboxes.forEach(cb => {
    if (selectedBooks.includes(cb.dataset.title)) {
      cb.checked = true;
    }
  });
});

checkboxes.forEach(cb => { 
    // DOM Level 2: addEventListener attaches 'change' event to each checkbox
    cb.addEventListener('change', () => {
        // DOM Level 3: dataset API retrieves custom data-* attributes from the checkbox element
        const title = cb.dataset.title;
        const price = parseFloat(cb.dataset.price); // Convert string to number

        if (cb.checked) {
          selectedBooks.push(title); // Add book to array
          total += price; // Increment the total
        } else {
          selectedBooks = selectedBooks.filter(b => b !== title); // Remove book from array
          total -= price; // Decrement the total
        }

        total = Math.max(0, total); // Prevent negative totals due to floating point math

        // DOM Level 2: update textContent of total price element
        totalDisplay.textContent = `Total: £${total.toFixed(2)}`;

        // Store selected books and total price in sessionStorage
        sessionStorage.setItem('cartBooks', JSON.stringify(selectedBooks));
        sessionStorage.setItem('cartTotal', total.toFixed(2));
    });
});
