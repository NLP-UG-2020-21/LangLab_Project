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

const switchCheckbox = document.querySelector('.footer__dark-checkbox');
const isDarkTheme = localStorage.getItem('darkTheme');
if (isDarkTheme) {
    switchCheckbox.checked = isDarkTheme === 'true';
}
if (isDarkTheme === 'true') {
    document.body.classList.add('dark-theme');
} else {
    document.body.classList.remove('dark-theme');
}
switchCheckbox.addEventListener('change', (ev) => {
    localStorage.setItem('darkTheme', ev.target.checked);
    if (ev.target.checked) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
});
