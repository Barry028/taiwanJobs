;
(function($) {

  $.TuCore = {

    init: function() {


      $(document).ready(function() {
        // Darkmode
        const darkmodeBtns = document.getElementById("tuChangeMode");
        const darkmode = new JsDarkMode(darkmodeBtns, {
          dark_linearGradient: "#fcf81c,#d5ef0d,#b7ff4a",
          light_linearGradient: "#97e6ff,#1b449c,#006bfc",
        });

        // Go Top
        const scrEl = document.getElementById("tuScrolltop")
        const scrollTop = new JsTuScrolltop(scrEl, {
          offset: 300,
          speed: 100
        });
        // Botostrap Tootltips
        $('[data-toggle="tooltip"]').tooltip();
        // Botostrap Popover
        $('[data-toggle="popover"]').popover();

        // Background Image
        if ($('[data-bg-img-src]').length) {
          $.TuCore.helpers.bgImage($('[data-bg-img-src]'));
        };

        if ($('.js-go-to').length) {
          $.TuCore.components.GoToTop.init('.js-go-to')
        };

        // if ($('#Header').length) {
        //   $.TuCore.components.tuHeader.init($('#Header'), {
        //     headerFixEffect: 'slide',
        //   });
        // }
        // if ($('#navBar').length) {
        //   $.TuCore.components.TuNavigation.init($('#navBar'));
        // }
        //   var handleBtnKeyPress = function (event) {
        //     if (event.key === " " || event.key === "Enter") {
        //       event.preventDefault();
        //       toggleButton(event.target);
        //     }
        //   }

        //   var handleBtnClick = function (event) {
        //     toggleButton(event.target);
        //   }

        //   var toggleButton = function (element) {
        //     var pressed = (element.getAttribute("aria-pressed") === "true");
        //     element.setAttribute("aria-pressed", !pressed);
        //   }

        // const ck_lab = document.querySelectorAll(".check_wrap-label");
        // for (let i = 0; i < ck_lab.length; i++) {
        //   ck_lab[i].addEventListener("keypress", handleBtnKeyPress);
        //   ck_lab[i].addEventListener("click", handleBtnKeyPress);
        // }

      });

      $(window).on('load', function() {

        $.TuCore.helpers.detectIE();

        // paceOptions = {
        //   ajax: false, // disabled
        //   document: false, // disabled
        //   eventLag: false, // disabled
        //   elements: {
        //     selectors: ['']
        //   }
        // };

        // var animation = bodymovin.loadAnimation({
        //   container: document.getElementById('lottie_load'),
        //   renderer: 'canvas',
        //   loop: false,
        //   autoplay: true,
        //   // path: "https://assets10.lottiefiles.com/packages/lf20_aawlikdj.json"
        //   path: 'https://assets4.lottiefiles.com/packages/lf20_j7eupod8.json'
        // });
        // animation.onComplete = function() {
        //   $('#loader').fadeOut();
        // }

      });
    },

    helpers: {

      resize: function(element, callback) {
        var delay = 500;
        var controlTime = 0;
        $(window, element).resize(function() {
          var nowTime = new Date().getTime();
          if (controlTime) {
            setTimeout(function() {
              if (nowTime - controlTime > delay) {
                if (typeof callback == 'function') {
                  controlTime = callback();
                }
              }
            }, delay);
          } else {
            setTimeout(function() {
              if (typeof callback == 'function') {
                controlTime = callback();
              }
            }, delay);
            controlTime++;
          }
        })
      },

      Math: {
        makeid: function(length) {
          var result = '';
          var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          var charactersLength = characters.length;
          for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
          }
          return result;
        },
        sum: function(arr) {
          var sum = 0;
          for (var i = 0; i < arr.length; i++) {
            sum += arr[i];
          };
          return sum;
        },

        countPercentage: function(countArray) {
          var num = eval(countArray.join('+'));
          var resultArray = [];
          for (var i = 0; i < countArray.length; i++) {
            var val = Math.floor((countArray[i] / num) * 100) + "%";
            resultArray.push(val);
          }
          return resultArray;
        },
      },

      // 背景替代圖片 RWD
      bgImage: function(collection) {
        if (!collection || !collection.length) return;
        return collection.each(function(i, el) {

          var $el = $(el),
            bgImageSrc = $el.data('bg-img-src');

          if (bgImageSrc) $el.css('background-image', 'url(' + bgImageSrc + ')');
        });
      },

      // // 吐司彈跳訊息
      // toast: function(txt, type, time) {
      //   var time = isNaN(time) ? 3E3 : time;
      //   var toast = document.createElement('div');
      //   var old_toast = document.getElementsByClassName('tu-toast');
      //   var toast_html =
      //     '<i class="tub-tick-circle" aria-hidden="true">' +
      //     '  <font></font>' +
      //     '  <font></font>' +
      //     '</i>' +
      //     '<font>' + txt + '</font>';

      //   if (old_toast.length != 0) {
      //     document.querySelectorAll(".tu-toast")[0].remove()
      //   }
      //   switch (type) {
      //     case 'success':
      //       toast.className = 'tu-toast float-toast toast--' + type + ' fadeIn';
      //       toast.innerHTML = toast_html;
      //       break;

      //     case 'error':
      //       toast.className = 'tu-toast float-toast toast--' + type + ' fadeIn';
      //       toast.innerHTML = toast_html;
      //       break;

      //     case 'info':
      //       toast.className = 'tu-toast float-toast toast--' + type + ' fadeIn';
      //       toast.innerHTML = toast_html;
      //       break;

      //     case 'warning':
      //       toast.className = 'tu-toast float-toast toast--' + type + ' fadeIn';
      //       toast.innerHTML = toast_html;
      //       break;
      //     case 'help':
      //       toast.className = 'tu-toast float-toast toast--' + type + ' fadeIn';
      //       toast.innerHTML = toast_html;
      //       break;
      //   };

      //   document.body.appendChild(toast);
      //   setTimeout(function() {
      //     toast.classList.remove('fadeIn');
      //     toast.classList.add('fadeOut');
      //   }, time, 1000);
      // },

      // 網頁字體放大 ( 變更 Html FontSize(Rem)
      cFontSize: function(collection, size) {
        if (!collection || !collection.length) return;

        var min = 12;
        var max = 18;
        var html = document.getElementsByTagName('html');

        switch (size) {
          case 'up':
            for (i = 0; i < html.length; i++) {
              var elem = html[0];
              var styles = window.getComputedStyle(elem, null).getPropertyValue('font-size');
              var computedFontSize = window.getComputedStyle(document.getElementsByTagName("html")[0]).fontSize;

              console.log(computedFontSize)

              if (computedFontSize == "16px") {
                elem.className = 'js-font-scale-up-1st';
                $.TuCore.helpers.toast('縮放成功！', 'success', 1500);

              } else if (computedFontSize == "17px") {
                elem.className = 'js-font-scale-up-2nd';
                $.TuCore.helpers.toast('已經縮放到最大！', 'warning', 1500);
              }

              // else {
              //   $.TuCore.helpers.toast('已經縮放到最大！', 'warning', 1500);
              // }
              $.TuCore.helpers.resize($(window));
            };
            break;
          case 'down':
            for (i = 0; i < html.length; i++) {
              var elem = html[0];
              var styles = window.getComputedStyle(elem, null).getPropertyValue('font-size');

              if (elem.style.fontSize) {
                var fontSize = parseFloat(styles);
              } else {
                var fontSize = 16;
              }

              if (fontSize != min) {
                fontSize -= 1;
                elem.style.fontSize = fontSize + 'px';
                $.TuCore.helpers.toast('縮放成功！', 'success', 1500);
              } else {
                $.TuCore.helpers.toast('已經縮放到最小！', 'warning', 1500);
              }
              $.TuCore.helpers.resize($(window));
            };
            break;
          case 'default':
            var elem = html[0];
            var styles = window.getComputedStyle(elem, null).getPropertyValue('font-size');

            if (parseFloat(styles) == 16) {
              $.TuCore.helpers.toast('目前已是預設大小！', 'warning', 1500);
              return false;
            } else {
              var fontSize = 16;
              elem.style.fontSize = fontSize + 'px';
              $.TuCore.helpers.toast('已恢復預設大小！', 'success', 1500);
            }
            $.TuCore.helpers.resize($(window));
            break;
        };

        return this.collection;
      },

      // 判斷 瀏覽器 是否為 IE 以及其版本 
      detectIE: function() {

        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');

        if (msie > 0) {
          // IE 10
          var ieV = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
          document.querySelector('body').className += 'ie ie' + ieV + ' ';

          if (ieV < 9) {
            // IE 9 以下建議使用者升級瀏覽器
            confirm("您的 IE 版本過低，點選【確定】升級，如不升級您將不能正常瀏覽網頁！")
            location.href = "https://support.microsoft.com/zh-tw/help/17621/internet-explorer-downloads";
          }

        }

        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
          // IE 11
          var rv = ua.indexOf('rv:');
          var ieV = parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
          document.querySelector('body').className += 'ie ie' + ieV + ' ';
        }

        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
          // IE 12
          var edgeV = parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
          document.querySelector('body').className += 'edge edge' + edgeV + ' ';
        }
        return false;
      },
    },

    components: {
      // 圖片預先載入
      lazyLoad: function(collection) {

        if (!collection || !collection.length) return;

        var images = document.querySelectorAll('.js-img-lazy');
        var loadImage = function(img) {
          var src = img.getAttribute('data-src');
          var bgImg = /(^|\s)js-img-lazy-bg(\s|$)/;
          if (bgImg.test(img.className)) {
            img.style.backgroundImage = "url('" + src + "')";

          } else {
            img.src = src;
          }

          img.classList.remove('js-img-lazy');
        };

        var callback = function(entries, observer) {
          entries.forEach(function(entry) {
            if (!entry.isIntersecting)
              return;
            loadImage(entry.target);
            observer.unobserve(entry.target);
          });
        };

        var options = {
          root: null,
          rootMargin: '0px',
          threshold: [0]
        };

        var observer = new IntersectionObserver(callback, options);
        images.forEach(function(el) {
          observer.observe(el);
        });
      },
      modal: {}
    },

    charts: {

    },

    settings: {

    },

  };

  $.TuCore.init();

})(jQuery);