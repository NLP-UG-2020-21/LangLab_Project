const navToogleBtn = document.querySelector('.header-nav__hamburger-toggle');
const header = document.querySelector('.header');

navToogleBtn.addEventListener('click', () => {
    header.classList.toggle('header--active');
    navToogleBtn.classList.toggle('header-nav__hamburger-toggle--active');
});

window.addEventListener('resize', () => {
    header.classList.remove('header--active');
    navToogleBtn.classList.remove('header-nav__hamburger-toggle--active');
});
