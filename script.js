// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('nav-active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Menu Filtering
const categoryButtons = document.querySelectorAll('.category-btn');
const menuItems = document.querySelectorAll('.menu-item');

categoryButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const category = button.getAttribute('data-category');
        
        menuItems.forEach(item => {
            if (category === 'all' || item.getAttribute('data-category') === category) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Order System
const orderButtons = document.querySelectorAll('.order-btn');
const selectedItems = document.getElementById('selectedItems');
const totalAmount = document.getElementById('totalAmount');
const orderForm = document.getElementById('orderForm');

let cart = [];
let total = 0;

orderButtons.forEach(button => {
    button.addEventListener('click', () => {
        const menuItem = button.closest('.menu-item');
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseInt(menuItem.querySelector('.price').textContent.replace(/[^\d]/g, ''));
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === itemName);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: itemName,
                price: itemPrice,
                quantity: 1
            });
        }
        
        updateCart();
    });
});

function updateCart() {
    // Clear selected items
    selectedItems.innerHTML = '';
    total = 0;
    
    // Add items to cart display
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
            <button class="remove-item" data-name="${item.name}">×</button>
        `;
        
        selectedItems.appendChild(itemElement);
    });
    
    // Update total amount
    totalAmount.textContent = 'Rp ' + total.toLocaleString('id-ID');
    
    // Add event listeners to remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const itemName = button.getAttribute('data-name');
            cart = cart.filter(item => item.name !== itemName);
            updateCart();
        });
    });
}

// Form Submission
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
        alert('Please add items to your order first!');
        return;
    }
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    
    // Format cart items for WhatsApp message
    const cartItems = cart.map(item => 
        `- ${item.name} x${item.quantity} (Rp ${(item.price * item.quantity).toLocaleString('id-ID')})`
    ).join('\n');
    
    // Tambahkan catatan jika ada
    const notesSection = notes ? `*Catatan:*%0A${notes}%0A%0A` : '';

    // Create WhatsApp message
    const whatsappMessage = `*Pesanan Baru dari Website Manda Food*%0A%0A
*Detail Pelanggan:*%0A
Nama: ${name}%0A
Telepon: ${phone}%0A
Alamat: ${address}%0A%0A
*Item Pesanan:*%0A${cartItems}%0A%0A
${notesSection}*Total Pembayaran:* Rp ${total.toLocaleString('id-ID')}`;
    
    // WhatsApp Business number (replace with your actual WhatsApp number)
    const whatsappNumber = '6285877779140'; // Format: kode negara + nomor tanpa + atau spasi
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    alert('Terima kasih atas pesanan Anda! Anda akan diarahkan ke WhatsApp untuk menyelesaikan pesanan Anda.');
    
    // Reset form and cart
    orderForm.reset();
    cart = [];
    updateCart();
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        }
    });
}); 