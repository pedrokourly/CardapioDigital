const cartCounter = document.getElementById("cart-counter");
const cartContent = document.getElementById("cart-content");

// Função para adicionar item ao carrinho
function addToCart(name, price) {
    // Verifica se o item já existe
    let existingItem = cartContent.querySelector(`[data-name='${name}']`);
    if (existingItem) {
        // Atualiza a quantidade
        let qtySpan = existingItem.querySelector('.cart-qty');
        let qty = parseInt(qtySpan.textContent) + 1;
        qtySpan.textContent = qty;
    } else {
        // Cria um novo elemento para o item
        const item = document.createElement('div');
        item.className = 'cart-item d-flex justify-content-between align-items-center border-bottom py-2';
        item.setAttribute('data-name', name);
        item.innerHTML = `
            <span>${name}</span>
            <div class="d-flex align-items-center gap-2">
                <button class='btn btn-sm btn-outline-secondary decrease-qty' title='Diminuir'>&minus;</button>
                <span class='badge bg-secondary cart-qty'>1</span>
                <button class='btn btn-sm btn-outline-secondary increase-qty' title='Aumentar'>+</button>
                <span class='fw-semibold ms-2'>R$ ${price}</span>
                <button class='btn btn-sm btn-danger ms-2 remove-cart-item' title='Remover'>x</button>
            </div>
        `;
        cartContent.appendChild(item);
        // Evento para remover
        item.querySelector('.remove-cart-item').addEventListener('click', function() {
            item.remove();
            updateCartCounter();
        });
        // Evento para aumentar
        item.querySelector('.increase-qty').addEventListener('click', function() {
            let qtySpan = item.querySelector('.cart-qty');
            qtySpan.textContent = parseInt(qtySpan.textContent) + 1;
            updateCartCounter();
        });
        // Evento para diminuir
        item.querySelector('.decrease-qty').addEventListener('click', function() {
            let qtySpan = item.querySelector('.cart-qty');
            let qty = parseInt(qtySpan.textContent);
            if (qty > 1) {
                qtySpan.textContent = qty - 1;
            } else {
                item.remove();
            }
            updateCartCounter();
        });
    }
    updateCartCounter();
}

function removeFromCart(item, name) {
    let qtySpan = item.querySelector('.cart-qty');
    let qty = parseInt(qtySpan.textContent);
    if (qty > 1) {
        qtySpan.textContent = qty - 1;
    } else {
        item.remove();
    }
    updateCartCounter();
}

function updateCartCounter() {
    // Soma todas as quantidades
    let total = 0;
    let totalValue = 0;
    cartContent.querySelectorAll('.cart-item').forEach(item => {
        const qty = parseInt(item.querySelector('.cart-qty').textContent);
        const priceText = item.querySelector('.fw-semibold').textContent.replace('R$','').replace(',','.').trim();
        const price = parseFloat(priceText);
        total += qty;
        totalValue += qty * price;
    });
    cartCounter.textContent = total === 0 ? 'Vazio' : total;
    // Atualiza o valor total no botão do carrinho
    const cartTotalBtn = document.getElementById('cart-total-btn');
    if (cartTotalBtn) {
        cartTotalBtn.textContent = `Total: R$ ${totalValue.toFixed(2).replace('.', ',')}`;
    }
    // Remove total antigo se existir
    let totalDiv = document.getElementById('cart-total');
    if (totalDiv) totalDiv.remove();
    // Remove mensagem de vazio antiga se existir
    let emptyMsg = document.getElementById('cart-empty-msg');
    if (emptyMsg) emptyMsg.remove();
    // Adiciona o total no final do modal ou mensagem de vazio
    if (total > 0) {
        const totalElement = document.createElement('div');
        totalElement.id = 'cart-total';
        totalElement.className = 'd-flex justify-content-between align-items-center mt-3 border-top pt-2 fw-bold';
        totalElement.innerHTML = `<span>Total</span><span>R$ ${totalValue.toFixed(2).replace('.', ',')}</span>`;
        cartContent.appendChild(totalElement);
    } else {
        const emptyElement = document.createElement('div');
        emptyElement.id = 'cart-empty-msg';
        emptyElement.className = 'text-center text-muted py-4';
        emptyElement.textContent = 'Carrinho vazio';
        cartContent.appendChild(emptyElement);
    }
}

// Adiciona evento aos botões de adicionar ao carrinho
const addCartButtons = document.querySelectorAll('.add-cart');
addCartButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const name = btn.getAttribute('data-name') || btn.closest('.card').querySelector('.card-title').textContent;
        const price = btn.getAttribute('data-price') || btn.closest('.card').querySelector('.card-price p').textContent.replace('R$ ', '').replace(',', '.');
        addToCart(name, price);
    });
});

// Função para esvaziar o carrinho
document.addEventListener('DOMContentLoaded', function() {
    const cartFooter = document.querySelector('.modal-footer');
    if (cartFooter) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'btn btn-danger me-auto';
        clearBtn.textContent = 'Limpar Carrinho';
        clearBtn.addEventListener('click', function() {
            cartContent.innerHTML = '';
            updateCartCounter();
        });
        cartFooter.insertBefore(clearBtn, cartFooter.firstChild);
    }
});
