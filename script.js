'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScroll = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Scroll View More -> 


btnScroll.addEventListener('click', (e) => {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  // console.log('Current scroll (X/Y)', window.pageXOffset, pageYOffset);
  // console.log("View Port ", document.documentElement.clientHeight, document.documentElement.clientWidth);

  // Quick Scroll 
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // Smooth Scroll 
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: "smooth",
  // });

  // Modern Way -> 
  section1.scrollIntoView({
    behavior: "smooth"
  });

});

// Page Navigation -->

// Not efficient code --
// document.querySelectorAll('.nav__link').forEach(function (node) {
//   node.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({
//       behavior: "smooth"
//     })
//   })
// });

// Event deligation --> better solution

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  // console.log(e.target);

  // Class check --
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({
      behavior: 'smooth',
    });
  }
});

// Tab Component ->



tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('operations__tab')) {
    const clicked = e.target.closest('.operations__tab');


    // active tab --> move up
    tabs.forEach(tab => {
      tab.classList.remove('operations__tab--active');
    })
    clicked.classList.add('operations__tab--active');

    // Activate the content area --> 
    document.querySelectorAll('.operations__content').forEach(tabCon => tabCon.classList.remove('operations__content--active'))
    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
  }

});


// Menu fade animation -> (with event-delegation)
// mouseenter == mouseover except that mouseenter doesn't bubble hence cannot be used here---

// const fadeHandler = (e, opacity) => {
const fadeHandler = function (e) {

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    // siblings.forEach(el => {

    //   el.style.opacity = 1;
    // });

    siblings.forEach(el => {
      if (el !== link) {
        el.style.opacity = this;
      }
    });
    logo.style.opacity = this;
  }
}


// nav.addEventListener('mouseover', e => fadeHandler(e, 0.5));
nav.addEventListener('mouseover', fadeHandler.bind(0.5));


// nav.addEventListener('mouseout', e => fadeHandler(e, 1));
nav.addEventListener('mouseout', fadeHandler.bind(1));

// Sticky Navigation -> 

// OLD and inefficent way -->
// const intialcoord = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   // console.log(window.scrollY);
//   if (window.scrollY > intialcoord.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// new intersection API 

// 

// observer.observe(section1);

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect();
// console.log(navHeight);

const stickNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

const headerObserver = new IntersectionObserver(stickNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight.height}px`
});

headerObserver.observe(header);

// Section fade-in

const allSection = document.querySelectorAll('.section');

const revealSecObserver = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (entry.isIntersecting) {
    entry.target.classList.remove('section--hidden');
    // else entry.target.classList.add('section--hidden');
    observer.unobserve(entry.target);
  }

}

const sectionObserver = new IntersectionObserver(revealSecObserver, {
  root: null,
  threshold: .15,
});

allSection.forEach((section) => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy-Load Images

const imgTargets = document.querySelectorAll('img[data-src]');


const loadImg = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);
  // guard clause -->
  if (!entry.isIntersecting) return

  // Replace src (lazy-img) with data-src (orignal)
  entry.target.src = entry.target.dataset.src;

  // entry.target.classList.remove('lazy-img');
  // when javascript finishes loading the img (original) on the screen it emits load event.. which we can listen to

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);

};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));


// Slider Images --->

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const buttonLeft = document.querySelector('.slider__btn--left');
const buttonRight = document.querySelector('.slider__btn--right');
let currentSlide = 0;
const maxSlide = slides.length

// Testing-->>
slider.style.transform = 'scale(0.3) translateX(-800px)'
slider.style.overflow = 'visible'

// 0%, 100%, 200%, 300%

const translateSlides = (slide) => {
  slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`);
}

translateSlides(0);

const nextSlide = () => {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {

    currentSlide++;
  }
  // -100% 0% 100% 200% ... Shift right-->
  translateSlides(currentSlide);
}

const prevSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  // -100% 0% 100% 200% ... Shift right-->
  translateSlides(currentSlide);
}


// Next Slide -->>
buttonRight.addEventListener('click', nextSlide);
buttonLeft.addEventListener('click', prevSlide);



















// // Event -->
// const randomInt = (min, max) => Math.floor((Math.random() * (max - min + 1)) + min);

// const randomColor = () => `rgb(${randomInt(0, 255)}, ${randomInt(0, 255)}, ${randomInt(0, 255)})`

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINK", e.target, e.currentTarget);

//   // // Stop Propogation
//   // e.stopPropagation();


// });


// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log("LINKS", e.target, e.currentTarget);

// });


// document.querySelector('.nav').addEventListener('click', function (e) {

//   this.style.backgroundColor = randomColor();
//   console.log("NAV", e.target, e.currentTarget);

// }, true);

