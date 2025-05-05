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
})