document.querySelector('.contact__form').addEventListener('submit', (ev) => {
    ev.preventDefault();
    const name = document.querySelector('.contact__input--name').value;
    const email = document.querySelector('.contact__input--email').value;
    const msg = document.querySelector('.contact__input--message').value;
    window.open(`mailto:test@test.test?subject=${name}&body=${msg}`, '_self');
});
