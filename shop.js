const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCartIcon = document.getElementById('close-cart');
const trash = document.getElementById('trash');

cartIcon.addEventListener('click', () => {
    cartSidebar.classList.toggle('hidden');
    loadCart();  // Load cart whenever the cart is opened
});

closeCartIcon.addEventListener('click', () => {
    cartSidebar.classList.add('hidden');
});

trash.addEventListener('click', () => {
    clearCart(); 
});

let cart = {};
let totalPrice = 0;

function addToCart(productName, productPrice, productImage) {
    if (!cart[productName]) {
        cart[productName] = { price: productPrice, quantity: 1, image: productImage };
    } else {
        cart[productName].quantity += 1;
    }

    cartSidebar.classList.remove('hidden');
    updateCart();
    saveCartItem(productName, productPrice, cart[productName].quantity, productImage); 
}

function updateCart() {
    let cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    totalPrice = 0;
    Object.keys(cart).forEach(product => {
        let item = cart[product];
        let li = document.createElement('li');
        li.classList.add('flex', 'justify-between', 'items-center', 'border-b', 'pb-2');

        let productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.classList.add('w-12', 'h-12', 'object-cover', 'mr-4');

        let productInfo = document.createElement('div');
        productInfo.classList.add('flex-1');
        let totalItemPrice = item.price * item.quantity;
        productInfo.innerHTML = `<h3 class="font-bold">${product}</h3>
                                 <p class="text-gray-500">Rp ${item.price.toLocaleString('id-ID')}</p>
                                 <p class="text-gray-500">Total: Rp ${totalItemPrice.toLocaleString('id-ID')}</p>`;

        let quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.value = item.quantity;
        quantityInput.min = '1';
        quantityInput.classList.add('w-12', 'border', 'text-center');
        quantityInput.onchange = function () {
            cart[product].quantity = parseInt(quantityInput.value);
            updateCart();
            saveCartItem(product, item.price, cart[product].quantity, item.image);
        };

        // Append to list item
        li.appendChild(productImage);
        li.appendChild(productInfo);
        li.appendChild(quantityInput);

        cartList.appendChild(li);

        // Update total price with item total (price * quantity)
        totalPrice += item.price * item.quantity;
    });

    document.getElementById('total-price').innerHTML = `Total: Rp ${totalPrice.toLocaleString('id-ID')}`;
}


// save the items
function saveCartItem(productName, productPrice, productQuantity, productImage) {
    localStorage.setItem(`cart_${productName}_price`, productPrice);
    localStorage.setItem(`cart_${productName}_quantity`, productQuantity);
    localStorage.setItem(`cart_${productName}_image`, productImage);
}

function loadCart() {
    cart = {};

    for(let i = 0; i < localStorage.length; i++){
        let key = localStorage.key(i);
    
        if (key.startsWith('cart_') && key.endsWith('_price')) {
            let productName = key.replace('cart_', '').replace('_price', '');
            let productPrice = parseFloat(localStorage.getItem(`cart_${productName}_price`));
            let productQuantity = parseInt(localStorage.getItem(`cart_${productName}_quantity`));
            let productImage = localStorage.getItem(`cart_${productName}_image`);

            cart[productName] = { price: productPrice, quantity: productQuantity, image: productImage };
        }
    }

    updateCart();
}

function clearCart() {
    cart = {};
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cart_')) {
            localStorage.removeItem(key);
        }
    });

    updateCart();
}

// load
window.onload = loadCart;
