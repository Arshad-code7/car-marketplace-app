const car = [{
    image : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzRyk_ABuNnwav_w49wcr6RVyLn2g28bPPkg&s",
    make : "Volkswagen",
    model : "Golf",
    year : 2026,
    color : "Red",
    priceUsd : 40000,
    finalPrice : 0,
    savedPrice : 0
},
    {
        image : "https://images.dealer.com/ddc/vehicles/2026/BMW/M2/Coupe/color/Alpine%20White-300-232,237,234-640-en_US.jpg",
        make : "BMW",
        model : "M2",
        year : 2026,
        color : "White",
        priceUsd : 69000,
        finalPrice : 0,
        savedPrice : 0
    },
    {
        image : "https://cache4.arabwheels.ae/system/car_generation_pictures/25064/original/Cover.?1729746873",
        make : "Mercedes Benz",
        model : "S-Class",
        year : 2026,
        color : "Black",
        priceUsd : 11900,
        finalPrice : 0,
        savedPrice : 0 
    },
    {
        
        image: "https://imgcdn.zigwheels.ph/large/gallery/color/35/1806/audi-r8-v10-plus-color-835231.jpg",
        make: "Audi",
        model: "R8",
        year: 2026,
        color: "Blue",
        priceUsd: 150000

    }
];

let cart = [];

let currentCar = null;

const clearCartBtn = document.getElementById("clear-cart");
const allCarCard = document.getElementById("cars-container");
const dName = document.getElementById("d-name");
const dModel = document.getElementById("d-model");
const dYear = document.getElementById("d-year");
const dColor = document.getElementById("d-color");
const dPrice = document.getElementById("d-price");
const dImage = document.getElementById("d-image");
const discountInput = document.getElementById("discount-input");
const applyBtn = document.getElementById("apply-btn");
const dFinal = document.getElementById("d-final");
const dSaved = document.getElementById("d-saved");
const errorMsg = document.getElementById("error-msg");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("search");

renderCars(car);
selectCar(0);

function renderCars(filteredCars) {
    allCarCard.innerHTML = "";

    filteredCars.forEach((carItem) => {
        const originalIndex = car.findIndex(c => c.model === carItem.model);

        allCarCard.innerHTML += `
            <div onclick="selectCar(${originalIndex})"
            class="bg-white shadow-lg rounded-xl p-4 w-full sm:w-60 cursor-pointer hover:scale-105 transition">
                
                <img src="${carItem.image}" 
                class="w-full h-40 object-cover rounded-lg mb-3">

                <h2 class="text-lg font-bold">
                    ${carItem.make} ${carItem.model}
                </h2>

                <p class="text-gray-600">
                    Year: ${carItem.year}
                </p>

                <p class="text-gray-800 font-semibold">
                    $${carItem.priceUsd}
                </p>

                <button onclick="addToCart(${originalIndex}); event.stopPropagation()"
                class="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg transition">
                    Add to Cart
                </button>

            </div>
        `;
    });
}

function selectCar(index) {
    const selected = car[index];
    currentCar = selected; // ⭐ important

    const card = document.getElementById("selected-car");

    card.style.opacity = 0;
    card.style.transform = "translateY(10px)";

    setTimeout(() => {
        dImage.src = selected.image;
        dName.innerText = `Name: ${selected.make}`;
        dModel.innerText = `Model: ${selected.model}`;
        dYear.innerText = `Year: ${selected.year}`;
        dColor.innerText = `Color: ${selected.color}`;
        dPrice.innerText = `Price: $${selected.priceUsd}`;

        // reset old values
        dFinal.innerText = "";
        dSaved.innerText = "";
        errorMsg.innerText = "";
        discountInput.value = "";

        card.style.opacity = 1;
        card.style.transform = "translateY(0)";
    }, 200);
}

applyBtn.addEventListener("click", () => {
    const value = discountInput.value;

    if (!currentCar) return;

    if (value === "") {
        errorMsg.innerText = "Enter a discount";
        return;
    }

    if (value < 0 || value > 100) {
        errorMsg.innerText = "Enter value between 0–100";
        return;
    }

    errorMsg.innerText = "";

    const finalPrice = currentCar.priceUsd * (1 - value / 100);
    const saved = currentCar.priceUsd - finalPrice;

    dFinal.innerText = `Final Price: $${finalPrice.toFixed(2)}`;
    dSaved.innerText = `You Saved: $${saved.toFixed(2)}`;
});

function addToCart(index) {
    const selected = car[index];

    const existing = cart.find(item => item.model === selected.model);

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...selected, qty: 1 });
    }

    updateCartUI();

    // toast (optional)
    const toast = document.getElementById("toast");
    if (toast) {
        toast.innerText = "Added to cart!";
        toast.style.opacity = 1;

        setTimeout(() => {
            toast.style.opacity = 0;
        }, 1500);
    }
}

function renderCart() {
    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        cartItems.innerHTML += `
            <div class="flex justify-between bg-white p-2 rounded shadow cursor-pointer">
                <span>${item.make} ${item.model}</span>
                <button onclick="removeFromCart(${index})"
                class="text-red-500 font-bold">X</button>
            </div>
        `;
    });
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center text-gray-500 py-4">
                🛒 Your cart is empty
            </div>
        `;
        cartCount.innerText = "Cart: 0";
        cartTotal.innerText = "";
        return;
    }

    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.priceUsd * item.qty;

        cartItems.innerHTML += `
            <div class="flex justify-between items-center bg-white p-3 rounded shadow">
                
                <div>
                    <p class="font-semibold">${item.make} ${item.model}</p>
                    <p class="text-sm text-gray-500">Qty: ${item.qty}</p>
                </div>

                <div class="flex items-center gap-2">
                    <button onclick="decreaseQty(${index})"
                    class="px-2 bg-gray-200 rounded">-</button>

                    <button onclick="increaseQty(${index})"
                    class="px-2 bg-gray-200 rounded">+</button>

                    <button onclick="removeFromCart(${index})"
                    class="text-red-500 font-bold">X</button>
                </div>

            </div>
        `;
    });

    cartCount.innerText = `Cart: ${cart.length}`;
    cartTotal.innerText = `Total: $${total.toLocaleString()}`;
}

function increaseQty(index) {
    cart[index].qty += 1;
    updateCartUI();
}

function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function decreaseQty(index) {
    if (cart[index].qty > 1) {
        cart[index].qty -= 1;
    } else {
        cart.splice(index, 1);
    }
    updateCartUI();
}

clearCartBtn.addEventListener("click", () => {
    cart = [];          // empty cart
    updateCartUI();     // refresh UI
});

searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();

    const filtered = car.filter(item => 
        item.make.toLowerCase().includes(value) ||
        item.model.toLowerCase().includes(value)
    );

    renderCars(filtered);
});

