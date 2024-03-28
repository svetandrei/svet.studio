const {ValidateForm} = require('./modules/validateForm.js');
/**
 * Search open/close
 * @type {Element}
 */
let btnSearch = document.querySelector('.btn-search');
let closeSearch = document.querySelectorAll('.search__close');

btnSearch.addEventListener('click', function (){
  if (!this.classList.contains('active')) {
    document.querySelector('.header__search-mob').classList.add('active');
    this.classList.add('active');
    document.querySelector('.header__nav').classList.remove('header__nav-active');
  }
});

closeSearch.forEach((close) => {
  close.addEventListener('click', function (){
    btnSearch.classList.remove('active');
    document.querySelector('.header__search-mob').classList.remove('active');
  });
});


/**
 * Burger menu
 * @type {Element}
 */
let burger = document.querySelector('.burger');
let closeMenu = document.querySelector('.nav__close');

let hMenu = document.querySelector('.header__nav');
let mm = gsap.matchMedia();

// add a media query. When it matches, the associated function will run
mm.add("(max-width: 768px)", (context) => {
  let menu = gsap.timeline();
    menu.to(".nav__close", {
      opacity: 0,
      duration: 0.2,
    })
    menu.to(".nav__menu", {
      opacity: 0,
      duration: 0.5,
      y: 20,
    })
    menu.to(".nav__phone", {
      opacity: 0,
      duration: 0.4,
    })

  burger.addEventListener('click', () => {
    if (!hMenu.classList.contains('active')) {
      hMenu.classList.add('active');
      gsap.to(".header__open", { duration: 0, display: 'flex'});
      menu.reversed(!menu.reversed())
    }
    document.body.classList.toggle('stop-scroll');
  });

  closeMenu.addEventListener('click', function (){
    if (hMenu.classList.contains('active')) {
      gsap.to(".header__open", { duration: 0.5, display: 'none'});
      menu.reversed(!menu.reversed());
      setTimeout(() => {
        hMenu.classList.remove('active')
      }, 500);
    }

  });

});

/**
 * Close block of Map
 * @type {Element}
 */
let closeMap = document.querySelector('button.contacts__map-btn');

closeMap.addEventListener('click', function () {
  this.parentNode.style.display = 'none';
});


new ValidateForm().actionForm();
