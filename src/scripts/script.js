document.addEventListener('DOMContentLoaded', function () {
    // DOM(эл-ты headera)
    const productsContainer = document.querySelector('.products');
    const searchInput = document.querySelector('.header__search-input');
    const cartCount = document.querySelector('.header__cart-count');
    const headerCartButton = document.querySelector('.header__cart-button');

    // DOM(модалка)
    const cartModal = document.querySelector('.cart-modal');
    const cartItemsContainer = document.querySelector('.cart-modal__items');
    const cartTotal = document.querySelector('.cart-modal__total');
    const clearCartBtn = document.querySelector('.cart-modal__clear');



    // Data
    let products = [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];


    // Загрузка товаров с синхронизацией корзины
    async function loadProducts() {
        try {
            const response = await fetch('https://6811cfae3ac96f7119a5a9ef.mockapi.io/api/v1/products/products');
            products = await response.json();
            // Фильтруем корзину оставляя только существующие товары
            const validCart = cart.filter(id =>
                products.some(p => p.id === id)
            );
            if (validCart.length !== cart.length) {
                cart = validCart;
                localStorage.setItem('cart', JSON.stringify(cart))
            }
            renderProducts(products);
            updateCart();
        } catch (error) {
            console.log('Ошибка загрузки товаров: ', error)
        }
    }


    // Создание карточек товаров
    function createProductCard(product) {
        // Основные элементы(создание)
        const card = document.createElement('div');
        card.classList.add('product-card');

        // контейнер для img
        const imgWrapper = document.createElement('div');
        imgWrapper.classList.add('image-wrapper');

        const img = document.createElement('img');
        img.classList.add('product-image');
        img.src = product.image;
        img.alt = product.name;

        const quickView = document.createElement('div');
        quickView.classList.add('product-quick');
      
        const quickViewBtn = document.createElement('button');
        quickViewBtn.classList.add('product-quick-btn');
        quickViewBtn.innerText = 'Быстрый просмотр';

        quickView.appendChild(quickViewBtn);

        imgWrapper.appendChild(img);
        imgWrapper.appendChild(quickView);

        // Добавление цен
        if (product.oldPrice) {
            // если есть старая цена - указать скидку
            const discountPercent = Math.round((1 - product.price / product.oldPrice) * 100);
            const discount = document.createElement('div');
            discount.classList.add('discount');
            discount.textContent = `-${discountPercent}%`;
            imgWrapper.appendChild(discount);
        }


        const info = document.createElement('div');
        info.classList.add('product-info');

        const title = document.createElement('h3');
        title.textContent = product.name;

        const prices = document.createElement('div');
        prices.classList.add('prices')

        const currentPrice = document.createElement('span');
        currentPrice.classList.add('current-price');
        currentPrice.textContent = `${product.price} руб.`;
        prices.appendChild(currentPrice);

        const oldPrice = document.createElement('span');
        oldPrice.classList.add('old-price');
        oldPrice.textContent = `${product.oldPrice} руб.`;
        prices.appendChild(oldPrice);

        // кнопка добавления вкорзину
        const button = document.createElement('button');
        button.classList.add('add-to-cart');
        button.textContent = 'В корзину';
        button.dataset.id = product.id;

        button.addEventListener('click', () => addToCart(product.id));

        // Собрать карточку
        info.append(prices, title, button);
        card.append(imgWrapper, info);

        return card;
    }

    // Отображение товаров
    function renderProducts(productsToRender) {
        // чистим контецнер
        productsContainer.innerHTML = '';
        // добавление товаров
        productsToRender.forEach(product => {
            productsContainer.appendChild(createProductCard(product));
        })
    }

    // Добавление в корзину
    function addToCart(productId) {
        cart.push(productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart()
    }
    // обновление корзины
    function updateCart() {
        //обновляем счетчик
        cartCount.textContent = cart.length;
        cartCount.style.display = cart.length > 0 ? 'flex' : 'none';


        // обновляем список товаров
        cartItemsContainer.innerHTML = '';

        let total = 0;
        // Добавляем каждый товар через createElement

        cart.forEach((productId, index) => {
            const product = products.find(p => p.id === productId);
            if (product) {
                const item = document.createElement('div');
                item.classList.add('cart-modal__item');

                const nameItem = document.createElement('span');
                nameItem.textContent = product.name;

                const priceItem = document.createElement('span');
                priceItem.textContent = `${product.price} руб.`;

                const removeBtn = document.createElement('button');
                removeBtn.classList.add('cart-item__remove');
                removeBtn.innerHTML = 'x';
                removeBtn.dataset.index = index;

                // Обработчик удаления
                removeBtn.addEventListener('click', function () {
                    cart.splice(index, 1); //удаляем товар по индексу
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCart()
                })
                // Собираем структуру
                item.appendChild(nameItem);
                item.appendChild(priceItem);
                item.appendChild(removeBtn);

                // Добавляем в контейнер
                cartItemsContainer.appendChild(item);

                total += product.price;
            }
        });
        cartTotal.textContent = `Итого: ${total} руб.`
    };
    // Очистка корзины
    clearCartBtn.addEventListener('click', function () {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
        cartModal.style.display = 'none';
    });
    // Поиск  товаров
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(product => product.name.toLowerCase().includes(term));
        renderProducts(filtered)
    });

    // открытие корзины (модалки)
    headerCartButton.addEventListener('click', function () {
        cartModal.style.display = 'block';
    })

    //закрытие при клике вне окна
    cartModal.addEventListener('click', function (e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    })
    // запуск
    loadProducts();
})