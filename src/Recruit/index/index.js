document.addEventListener("DOMContentLoaded", function() {

  // Hero Slider
  const heroSlider = new Swiper('.js-swiper-hero', {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    coverflow: {
      rotate: 20,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    loop: true,
    pagination: {
      el: '.js-swiper-hero-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.js-swiper-hero-button-next',
      prevEl: '.js-swiper-hero-button-prev',
    },
    breakpoints: {
      480: {
        slidesPerView: 2
      },
      768: {
        slidesPerView: 3
      },
      1024: {
        slidesPerView: 4
      },
    }
  });

});