  // JsYoutubeThumb API Youtube 截圖
  const JsYoutubeThumb = (function() {

    var video, results;

    return {

      init: function(elems, size) {
        return JsYoutubeThumb.getThumb(elems, size);

      },

      getThumb: function(elems, size, url) {
        var url = document.querySelectorAll(elems)[0].getAttribute('href');

        if (url === null) {
          return ''
        }
        size = (size === null) ? 'big' : size;
        results = url.match('[\\?&]v=([^&#]*)');
        video = (results === null) ? url : results[1];

        if (size === 'small') {
          return JsYoutubeThumb.setThumb('http://img.youtube.com/vi/' + video + '/2.jpg', elems)
        }
        return JsYoutubeThumb.setThumb('http://img.youtube.com/vi/' + video + '/0.jpg', elems)
      },

      setThumb: function(url, elems) {
        return JsUtils.each(document.querySelectorAll(elems), function(event) {
          event.children[0].src = url;
        })
      }
    };
  }());

  // Collects 收藏按鈕
  const CoreCollects = function CoreCollects(elements) {
    const collects = document.querySelectorAll(elements);
    return JsUtils.each(collects, function(element) {
      element.addEventListener('click', function(event) {
        event.preventDefault();
        console.log(event.target)
        console.log(event.target.nodeName)
        if (event.target.nodeName === 'BUTTON' || event.target.nodeName === 'A') {
          if (!event.target.classList.contains('active')) {
            event.target.classList.add('active');
            JsToast('收藏成功！', 'success', 1500);
          } else {
            event.target.classList.remove('active');
            JsToast('已取消收藏', 'error', 1500);
          }
        }
      });
    });
  };

  // Separated 數字三位一撇
  const CoreSeparated = function CoreSeparated(elements) {
    const nums = document.querySelectorAll(elements);
    return JsUtils.each(nums, function(element) {
      let newVal = JsUtils.numOfComma(element.textContent);
      element.innerHTML = newVal;
    });
  };

  // Toast 吐司訊息
  // JsToast('成功訊息～', 'success', 1500);
  // JsToast(); --> 預設執行是載入中 Loading ... 
  const JsToast = function(txt, type, duration) {
    ///////////////////////////////
    // **  Private variables  ** //
    ///////////////////////////////
    const that = this;
    const body = document.getElementsByTagName("BODY")[0];
    let timer;
    // Default Options
    var defaultOptions = {
      txt: "加載中 ...",
      type: "default",
      duration: 3000
    };
    duration = isNaN(duration) ? defaultOptions.duration : duration;
    txt = txt || defaultOptions.txt;
    type = type || defaultOptions.type;

    JsUtils.throttleTime(timer, function() {
      var toast = document.createElement("div");
      toast.id = "toast";
      var toast_id = document.getElementById("toast");

      if (toast_id) toast_id.remove();

      let successIcon =
        '<path d="M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10Z" opacity=".4"/>' +
        '<path d="M11 16a1 1 0 0 1-1-1l-3-2a1 1 0 0 1 1-2l3 3 5-5a1 1 0 0 1 1 1l-6 5a1 1 0 0 1 0 1Z"/>';
      let errorIcon =
        '<path d="M15 2H9a3 3 0 0 0-2 1L3 7a3 3 0 0 0-1 2v6a3 3 0 0 0 1 2l4 4a3 3 0 0 0 2 1h6a3 3 0 0 0 2-1l4-4a3 3 0 0 0 1-2V9a3 3 0 0 0-1-2l-4-4a3 3 0 0 0-2-1Z" opacity=".4"/>' +
        '<path d="m13 12 3-3a1 1 0 0 0-1-1l-3 3-3-3a1 1 0 0 0-1 1l3 3-3 3a1 1 0 0 0 0 1 1 1 0 0 0 1 0l3-3 3 3a1 1 0 0 0 1 0 1 1 0 0 0 0-1Z"/>';
      let infoIcon =
        '<path d="M2 13V7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v7a5 5 0 0 1-5 5h-1a1 1 0 0 0-1 0l-2 2a1 1 0 0 1-2 0l-2-2H7a5 5 0 0 1-5-5Z" opacity=".4"/>' +
        '<path d="M15 11a1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1Zm-4 0a1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1Zm-4 0a1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1Z"/>';
      let warnIcon =
        '<path d="M11 2a2 2 0 0 1 2 0l2 2a2 2 0 0 0 1 0h2a2 2 0 0 1 2 2v2a2 2 0 0 0 0 1l2 2a2 2 0 0 1 0 2l-2 2a2 2 0 0 0 0 1v2a2 2 0 0 1-2 2h-2a2 2 0 0 0-1 0l-2 2a2 2 0 0 1-2 0l-2-2a2 2 0 0 0-1 0H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-1l-2-2a2 2 0 0 1 0-2l2-2a2 2 0 0 0 0-1V6a2 2 0 0 1 2-2h2a2 2 0 0 0 1 0Z" opacity=".4"/>' +
        '<path d="M11 16a1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1Zm0-3V8a1 1 0 0 1 1-1 1 1 0 0 1 1 1v5a1 1 0 0 1-1 1 1 1 0 0 1-1-1Z"/>';
      var helpIcon =
        '<path d="M17 18h-4l-4 3a1 1 0 0 1-2 0v-3a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5v6a5 5 0 0 1-5 5Z" opacity=".4"/>' +
        '<path d="M11 14a1 1 0 0 1 1-1 1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1Zm0-3a2 2 0 0 1 1-2h1a1 1 0 0 0-1-1 1 1 0 0 0-1 1 1 1 0 0 1-1 0 2 2 0 0 1 2-3 2 2 0 0 1 2 3 2 2 0 0 1-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1-1-1Z"/>';
      let load =
        '<path d="M20 5a15 15 0 1 0 0 30 15 15 0 0 0 0-30zm0 27a12 12 0 1 1 0-24 12 12 0 0 1 0 24z" opacity=".24"/>' +
        '<path d="m26 10 2-3-8-2v3l6 2z">' +
        '  <animateTransform attributeName="transform" attributeType="xml" dur="0.8s" from="0 20 20" repeatCount="indefinite" to="360 20 20" type="rotate"/>' +
        "</path>";
      let text = "<strong>" + txt + "</strong>";

      switch (type) {
        case "success":
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg viewBox="0 0 24 24">' +
            '   <g fill="currentColor">' + successIcon + '</g>' +
            '</svg>' +
            text;
          break;

        case "error":
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg viewBox="0 0 24 24"><g fill="currentColor">' +
            errorIcon +
            "</g></svg>" +
            text;
          break;

        case "info":
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg viewBox="0 0 24 24"><g fill="currentColor">' +
            infoIcon +
            "</g></svg>" +
            text;
          break;

        case "warning":
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg viewBox="0 0 24 24"><g fill="currentColor">' +
            warnIcon +
            "</g></svg>" +
            text;
          break;

        case "help":
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg viewBox="0 0 24 24"><g fill="currentColor">' +
            helpIcon +
            "</g></svg>" +
            text;
          break;

        default:
          toast.className = "t-toast t-float-toast t-toast--" + type + " toastIn";
          toast.innerHTML =
            '<svg xml:space="preserve" viewBox="0 0 40 40"><g fill="currentColor">' +
            load +
            "</g></svg>" +
            text;
          break;
      }

      document.body.appendChild(toast);

      setTimeout(function() {
        toast.classList.remove("toastIn");
        toast.classList.add("toastOut", "t-visibility-hidden");
      }, duration);

    }, 250);
  }




  document.addEventListener("DOMContentLoaded", function() {

    // Modal areas
    const globalArea = new JsCoreComponentsModal({
      id: 'globalArea',
      size: 'lg modal-setting',
      center: true,
      scrollable: false,
      close: false,
      center: true,
      defaultButton: false,
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

    // Modal
    const accesskeyInfo = new JsCoreComponentsModal({
      id: 'accesskeyInfo',
      size: 'lg modal-setting',
      center: true,
      scrollable: false,
      close: false,
      center: true,
      defaultButton: false,
      animation: 'zoomIn',
      title: '快速鍵使用說明',
      body: '<p>&nbsp;&nbsp;&nbsp;本網站設計原則，網站的主要內容分為下列幾個區塊：<br>&nbsp;&nbsp;&nbsp;1. 上方功能區塊、2. 中央內容區塊。<br><br>&nbsp;&nbsp;&nbsp;本網站的快速鍵﹝Accesskey﹞設定如下：<br>&nbsp;</p><ul><li>&nbsp;&nbsp;&nbsp;Alt+U：上方功能區塊，包括回前導頁、網站導覽、新手上路等。</li><li>&nbsp;&nbsp;&nbsp;Alt+C：中央內容區塊，為本頁主要內容區。</li><li>&nbsp;&nbsp;&nbsp;如果您的瀏覽器是Firefox，快速鍵的使用方法是 Shift+Alt+(快速鍵字母)，例如 Shift+Alt+C會跳至網頁中央區塊，以此類推。</li></ul>'
    })


    // const tuHeader = new JsHeader('tuHeader',{
    //   // subFixedID: '',
    //   fixClass: 'is-fix',
    //   hideClass: 'is-hide',
    //   showClass: 'is-show',
    //   showDelay: 100,
    // });

    // // Darkmode
    // const darkmodeBtns = document.getElementById("tuChangeMode");
    // const darkmode = new JsDarkMode(darkmodeBtns, {
    //   dark_linearGradient: "#fcf81c,#d5ef0d,#b7ff4a",
    //   light_linearGradient: "#97e6ff,#1b449c,#006bfc",
    // });

    // // Go Top
    // const scrEl = document.getElementById("tuScrolltop")
    // const scrollTop = new JsTuScrolltop(scrEl, {
    //   offset: 300,
    //   speed: 100
    // });

    // setTimeout(function() {}, 2000)
    // // imagesLazyLoad 
    // const imagesLazyLoad = JsImagesLazyLoad("img[data-src]");
    // // JsImagePlaceholder("img.js-placeholder",{
    // //   bgColor: '#d7d3dc',
    // //   textColor: '#52406b'
    // // });

    const tuHeader = new JsHeader('tuHeader', {
      subFixedID: 'tuJobFilter',
      fixClass: 'is-fix',
      hideClass: 'is-hide',
      showClass: 'is-show',
      showDelay: 100,
      ignorePageElID: 'detailHeader'
    });

    const CorpLogo = new JsImagePlaceholder(".js-placeholder", {
      bgColor: '#d2d3d9',
      textColor: '#4b5166'
    });

    let stars = CoreCollects('.t-btn-fav');
    let moneys = CoreSeparated('[data-separated]');

    // Tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl)
    })


  });

  window.addEventListener("load", function(event) {

  });