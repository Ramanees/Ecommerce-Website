// Mobile navigation toggle
const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar) {
    bar.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (close) {
    close.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
        console.error('Error saving cart to localStorage:', error);
        alert('Unable to save cart. Please try again later.');
    }
}

// Redirect to sproduct.html when clicking on product image or description
document.querySelectorAll('.pro').forEach(product => {
    const image = product.querySelector('img');
    const des = product.querySelector('.des');
    const productName = product.querySelector('.des h5').innerText;
    const productPrice = parseFloat(product.querySelector('.des h4').innerText.replace('$', ''));
    const productImage = image.src;

    const redirectToProductPage = () => {
        const url = `sproduct.html?image=${encodeURIComponent(productImage)}&name=${encodeURIComponent(productName)}&price=${productPrice}`;
        window.location.href = url;
    };

    // Add click event to image and description, but not the "Add to Cart" button
    image.addEventListener('click', redirectToProductPage);
    des.addEventListener('click', redirectToProductPage);
});

// Add to Cart for Shop Page (products with .add-to-cart icon)
document.querySelectorAll('.add-to-cart').forEach(button => {
    try {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent the click from triggering the product redirection
            const productElement = button.closest('.pro');
            const productImage = productElement.querySelector('img').src;
            const productName = productElement.querySelector('.des h5').innerText;
            const productPrice = parseFloat(productElement.querySelector('.des h4').innerText.replace('$', ''));
            const sizeSelect = productElement.querySelector('.size-select-shop');
            const selectedSize = sizeSelect ? sizeSelect.value : null;

            // Validate size selection
            if (!selectedSize || selectedSize === 'Select Size') {
                alert('Please select a size before adding to cart.');
                return;
            }

            const existingProduct = cart.find(item => item.name === productName && item.size === selectedSize);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1,
                    size: selectedSize
                });
            }

            saveCart();
            alert(`${productName} (Size: ${selectedSize}) has been added to your cart!`);
        });
    } catch (error) {
        console.error('Error attaching Add to Cart event listener for shop page:', error);
    }
});

// Add to Cart for Single Product Page (sproduct.html)
const addToCartButton = document.getElementById('add-to-cart-btn');
if (addToCartButton) {
    console.log('Add to Cart button found on sproduct.html');
    try {
        addToCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add to Cart button clicked');
            const productImage = document.getElementById('MainImg').src;
            const productName = document.querySelector('#prodetails .single-pro-details h4').innerText;
            const productPrice = parseFloat(document.querySelector('#prodetails .single-pro-details h2').innerText.replace('$', ''));
            const quantity = parseInt(document.getElementById('quantity-input').value);
            const sizeSelect = document.getElementById('size-select');
            const selectedSize = sizeSelect ? sizeSelect.value : null;

            // Validate size selection
            if (!selectedSize || selectedSize === 'Select Size') {
                alert('Please select a size before adding to cart.');
                return;
            }

            // Validate quantity
            if (quantity < 1) {
                alert('Please select a valid quantity (at least 1).');
                return;
            }

            // Check if the product with the same name AND size already exists in the cart
            const existingProduct = cart.find(item => item.name === productName && item.size === selectedSize);
            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.push({
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: quantity,
                    size: selectedSize
                });
            }

            saveCart();
            alert(`${productName} (Size: ${selectedSize}) has been added to your cart!`);
        });
    } catch (error) {
        console.error('Error attaching Add to Cart event listener:', error);
    }
} else {
    console.log('Add to Cart button not found on this page');
}

// Populate Cart Table (for cart.html)
function populateCartTable() {
    const cartTableBody = document.querySelector('#cart tbody');
    if (!cartTableBody) return;

    cartTableBody.innerHTML = '';

    if (cart.length === 0) {
        cartTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center;">Your cart is empty.</td></tr>';
    } else {
        cart.forEach((item, index) => {
            const row = document.createElement('tr');
            const itemSize = item.size || 'N/A'; // Default to 'N/A' if size is undefined
            row.innerHTML = `
                <td><a href="#" class="remove" data-index="${index}"><i class="far fa-times-circle"></i></a></td>
                <td><img src="${item.image}" alt="${item.name}" style="width: 70px;"></td>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${itemSize}</td>
                <td><input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}"></td>
                <td>$${(item.price * item.quantity).toFixed(2)}</td>
            `;
            cartTableBody.appendChild(row);
        });
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalElement = document.querySelector('#cart-total');
    if (totalElement) {
        totalElement.innerText = total.toFixed(2);
    }

    const totalFinalElement = document.querySelector('#cart-total-final');
    if (totalFinalElement) {
        totalFinalElement.innerText = total.toFixed(2);
    }

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const index = button.getAttribute('data-index');
            cart.splice(index, 1);
            saveCart();
            populateCartTable();
        });
    });

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = input.getAttribute('data-index');
            const newQuantity = parseInt(input.value);
            if (newQuantity < 1) {
                input.value = 1;
                return;
            }
            cart[index].quantity = newQuantity;
            saveCart();
            populateCartTable();
        });
    });
}

document.addEventListener('DOMContentLoaded', populateCartTable);

// Login and Registration functionality
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

function updateLoginUI() {
    const loginIcon = document.getElementById('login-icon');
    const logoutIcon = document.getElementById('logout-icon');
    const mobileLoginIcon = document.getElementById('mobile-login-icon');

    if (isLoggedIn) {
        loginIcon.style.display = 'none';
        logoutIcon.style.display = 'block';
        mobileLoginIcon.style.display = 'none';
    } else {
        loginIcon.style.display = 'block';
        logoutIcon.style.display = 'none';
        mobileLoginIcon.style.display = 'block';
    }
}

const loginPopup = document.getElementById('login-popup');
const loginIcon = document.getElementById('login-icon');
const mobileLoginIcon = document.getElementById('mobile-login-icon');
const closePopup = document.querySelector('.close-popup');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerError = document.getElementById('register-error');

if (loginIcon) {
    loginIcon.addEventListener('click', (e) => {
        e.preventDefault();
        loginPopup.style.display = 'flex';
        document.getElementById('login-error').style.display = 'none';
        showLoginForm();
    });
}

if (mobileLoginIcon) {
    mobileLoginIcon.addEventListener('click', (e) => {
        e.preventDefault();
        loginPopup.style.display = 'flex';
        document.getElementById('login-error').style.display = 'none';
        showLoginForm();
    });
}

// Footer Sign In link to trigger login popup
const footerSignIn = document.getElementById('footer-signin');
if (footerSignIn) {
    footerSignIn.addEventListener('click', (e) => {
        e.preventDefault();
        loginPopup.style.display = 'flex';
        document.getElementById('login-error').style.display = 'none';
        showLoginForm();
    });
}

if (closePopup) {
    closePopup.addEventListener('click', () => {
        loginPopup.style.display = 'none';
        document.getElementById('login-error').style.display = 'none';
        registerError.style.display = 'none';
        showLoginForm();
    });
}

function showLoginForm() {
    document.querySelectorAll('#popup-title')[0].textContent = 'Login';
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.querySelectorAll('#popup-title')[0].style.display = 'block';
    document.querySelectorAll('#popup-title')[1].style.display = 'none';
}

function showRegisterForm() {
    document.querySelectorAll('#popup-title')[1].textContent = 'Register now';
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.querySelectorAll('#popup-title')[0].style.display = 'none';
    document.querySelectorAll('#popup-title')[1].style.display = 'block';
}

const registerLink = document.getElementById('register-link');
if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        showRegisterForm();
        document.getElementById('login-error').style.display = 'none';
        registerError.style.display = 'none';
    });
}

const loginError = document.getElementById('login-error');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Attempting login for:', username);
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Login response:', data);

            if (data.success) {
                isLoggedIn = true;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('username', data.user.username);
                loginPopup.style.display = 'none';
                loginError.style.display = 'none';
                updateLoginUI();
                alert('Login successful!');
            } else {
                loginError.style.display = 'block';
                loginError.innerText = data.message;
            }
        } catch (error) {
            console.error('Login fetch error:', error);
            loginError.style.display = 'block';
            loginError.innerText = 'Network error: Unable to connect to server. Please try again.';
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;
        const email = document.getElementById('reg-email')?.value;

        try {
            console.log('Attempting registration for:', username);
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, email })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Registration response:', data);

            if (data.success) {
                showLoginForm();
                registerError.style.display = 'none';
                alert('Registration successful! Please log in.');
            } else {
                registerError.style.display = 'block';
                registerError.innerText = data.message;
            }
        } catch (error) {
            console.error('Registration fetch error:', error);
            registerError.style.display = 'block';
            registerError.innerText = 'Network error: Unable to connect to server. Please try again.';
        }
    });
}

const logoutIcon = document.getElementById('logout-icon');
if (logoutIcon) {
    logoutIcon.addEventListener('click', (e) => {
        e.preventDefault();
        isLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        updateLoginUI();
        alert('You have been logged out.');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateLoginUI();
    fetch('http://localhost:3000/api/health')
        .then(response => response.json())
        .then(data => console.log('Server health check:', data))
        .catch(error => console.error('Health check failed:', error));
});

const checkoutButton = document.querySelector('#cart-totals button');
if (checkoutButton) {
    checkoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            alert('Please log in to proceed to checkout.');
            loginPopup.style.display = 'flex';
            showLoginForm();
        } else {
            alert('Proceeding to checkout...');
            // Add checkout logic here
        }
    });
}