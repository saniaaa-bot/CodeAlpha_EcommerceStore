let allProducts = [];

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        allProducts = await response.json();
        displayProducts(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts(products) {
    const container = document.getElementById('product-container');
    container.innerHTML = '';

    if (products.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1; color: #888; font-size: 1.2rem;">No products found. Try a different search.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart('${product._id}', '${product.name}', ${product.price})">Add to Cart</button>
        `;
        container.appendChild(card);
    });
}

function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
    
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = query ? 'block' : 'none';
    }
    
    displayProducts(filtered);
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    const clearBtn = document.getElementById('clearBtn');
    if (clearBtn) {
        clearBtn.style.display = 'none';
    }
    displayProducts(allProducts);
}

document.getElementById('searchInput')?.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') searchProducts();
});

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});