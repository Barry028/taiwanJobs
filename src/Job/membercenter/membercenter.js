document.addEventListener("DOMContentLoaded", function() {



});

$(function() {
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

  // modals areas
  JsCoreComponentsModal.init('#globalArea', {
    size: 'modal-lg modal-setting',
    center: true,
    drag: false,
    animation: 'zoomIn',
    title: '地區選擇 <small class="text-lightgrey font-w-400">切換「地區」分站，尋找在地心儀的工作！</small>',
    body: '<h5>親愛的求職者您好：</h5>' +
      '<p class="mt-8">切換「地區」分站，讓我們提供您更準確的訊息！</p>' +
      '<hr>' +
      '<h6 class="mb-8">當前地區</h6>' +
      '<a href="assets/javascript:;" class="t-area-btn">' +
      '  <small>全台灣</small>' +
      '</a>' +
      '<a href="assets/javascript:;" class="t-area-link" id="">' +
      '   <small>[定位我的位置]</small>' +
      '</a>' +
      '<h6 class="mb-4 mt-16">全台灣</h6>' +
      '<ul class="check_wrap_v1_sm" id="area_list">' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">台北市</small>' +
      '    </label>' +
      '  </li>' +

      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">新北市</small>' +
      '    </label>' +
      '  </li>' +

      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">基隆市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">桃園縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label"  role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">新竹市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label"  role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">新竹縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label"  role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">苗栗縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">台中市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">彰化縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">南投縣</small>' +
      '    </label>' +
      '  </li>' +

      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">雲林縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">嘉義市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">苗栗縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">台中市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">嘉義縣</small>' +
      '    </label>' +
      '  </li>' +

      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">台南市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">高雄市</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">屏東縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">台東縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">花蓮縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">宜蘭縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">澎湖縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">連江縣</small>' +
      '    </label>' +
      '  </li>' +
      '  <li class="check_wrap_item">' +
      '    <label tabindex="0" class="check_wrap-label" role="button" aria-pressed="false">' +
      '      <i class="check_mark"></i>' +
      '      <small class="txt">金門縣</small>' +
      '    </label>' +
      '  </li>' +
      '</ul>'
  })
  // sliders
  (function main_owl() {
    var bigimage = $("#hero-main");
    var thumbs = $("#hero-sub");
    var arrow_lt = '<i class="tub-arrow-left" aria-hidden="true"><font></font><font></font></i>';
    var arrow_rt = '<i class="tub-arrow-right" aria-hidden="true"><font></font><font></font></i>';
    //var totalslides = 10;
    var syncedSecondary = true;

    bigimage
      .owlCarousel({
        items: 1,
        slideSpeed: 10000,
        nav: false,
        autoplay: true,
        dots: false,
        loop: true,
        lazyLoad: true,
        responsiveRefreshRate: 200,
        navText: [arrow_lt, arrow_rt]
      })
      .on("changed.owl.carousel", syncPosition);

    thumbs
      .on("initialized.owl.carousel", function() {
        thumbs
          .find(".owl-item")
          .eq(0)
          .addClass("current");
      })
      .owlCarousel({
        items: 4,
        dots: false,
        nav: true,
        navText: [arrow_lt, arrow_rt],
        smartSpeed: 200,
        slideSpeed: 5000,
        slideBy: 4,
        responsiveRefreshRate: 100
      })
      .on("changed.owl.carousel", syncPosition2);

    function syncPosition(el) {
      var count = el.item.count - 1;
      var current = Math.round(el.item.index - el.item.count / 2 - 0.5);

      if (current < 0) {
        current = count;
      }
      if (current > count) {
        current = 0;
      }
      //to this
      thumbs
        .find(".owl-item")
        .removeClass("current")
        .eq(current)
        .addClass("current");
      var onscreen = thumbs.find(".owl-item.active").length - 1;
      var start = thumbs
        .find(".owl-item.active")
        .first()
        .index();
      var end = thumbs
        .find(".owl-item.active")
        .last()
        .index();

      if (current > end) {
        thumbs.data("owl.carousel").to(current, 100, true);
      }
      if (current < start) {
        thumbs.data("owl.carousel").to(current - onscreen, 100, true);
      }
    }

    function syncPosition2(el) {
      if (syncedSecondary) {
        var number = el.item.index;
        bigimage.data("owl.carousel").to(number, 100, true);
      }
    }

    thumbs.on("click", ".owl-item", function(e) {
      e.preventDefault();
      var number = $(this).index();
      bigimage.data("owl.carousel").to(number, 300, true);
    });
  })();

  // modals
  JsCoreComponentsModal.init('#AccesskeyInfo', {
    size: 'modal-lg',
    center: true,
    drag: false,
    animation: 'zoomIn',
    title: '快速鍵使用說明',
    body: '<p>&nbsp;&nbsp;&nbsp;本網站設計原則，網站的主要內容分為下列幾個區塊：<br>&nbsp;&nbsp;&nbsp;1. 上方功能區塊、2. 中央內容區塊。<br><br>&nbsp;&nbsp;&nbsp;本網站的快速鍵﹝Accesskey﹞設定如下：<br>&nbsp;</p><ul><li>&nbsp;&nbsp;&nbsp;Alt+U：上方功能區塊，包括回前導頁、網站導覽、新手上路等。</li><li>&nbsp;&nbsp;&nbsp;Alt+C：中央內容區塊，為本頁主要內容區。</li><li>&nbsp;&nbsp;&nbsp;如果您的瀏覽器是Firefox，快速鍵的使用方法是 Shift+Alt+(快速鍵字母)，例如 Shift+Alt+C會跳至網頁中央區塊，以此類推。</li></ul>'
  })
});