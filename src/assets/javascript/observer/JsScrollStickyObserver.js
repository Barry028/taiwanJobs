// 對象監聽器 (Just ID) --> 針對單一物件監聽 --> 小封裝 
// const stickyHeading = new JsScrollStickyObserver("jobHeader", {
//   prevElementID: "stickyHrHedaing",
//   stopElementID: "tuFooter",
//   fixedClassName: "sticky-is-fix",
//   stopClassName: "sticky-is-absolute",
//   callback: {
//     rootMargin: '0px 0px 200px 0px',
//     threshold: [1, 0.5, 0]
//   }
// });

const JsStickyBlocks = function(areas, targets) {

  var areas = document.querySelectorAll(areas);
  var targets = document.querySelectorAll(targets);

  if (areas.length === 0) {
    return
  }

  const checkFixed = (targets, area) => {

    const height = [];
    // console.log(targets)
    targets.forEach(target => {
      target.style.paddingTop = '';
      target.style.paddingBottom = '';
      height.push(target.offsetHeight);
    });

    const heightLen = height.length;
    const areaPosi = area.getBoundingClientRect().top;
    const areaHeight = area.clientHeight;
    const endPosi = areaPosi + areaHeight;

    targets.forEach((target, index) => {

      let topHeight = 0;
      if (index === 1) {
        topHeight = height[0];

      } else if (index > 1) {
        topHeight = height.slice(0, index);
        topHeight = topHeight.reduce((a, x) => a + x);
      }
      target.style.paddingTop = topHeight + 'px';

      let bottomHeight = 0;
      if (index !== heightLen - 1) {
        bottomHeight = height.slice(index + 1, heightLen);
        bottomHeight = bottomHeight.reduce((a, x) => a + x);
        target.style.paddingBottom = bottomHeight + 'px';
      }
      let targetHeight = target.clientHeight;
      const parent = target.parentNode;
      const parentPosi = parent.getBoundingClientRect().top;
      const startPosi = parent.getBoundingClientRect().top;
      parent.style.height = '';
      const parentHeight = parent.clientHeight;
      if (targetHeight > parentHeight) {
        // console.log(targetHeight)
        parent.style.height = targetHeight + 'px';
      }
      if (0 > startPosi && targetHeight < endPosi) {
        target.classList.add('is-fix');
        target.style.top = '';
      } else if (0 <= startPosi) {
        target.classList.remove('is-fix');
        target.style.top = '';
      } else {
        target.classList.remove('is-fix');
        topHeight = 0;
        if (index < heightLen - 1) {
          topHeight = height.slice(index + 1, heightLen);
          topHeight = topHeight.reduce((a, x) => a + x);
        }
        target.style.transform = '';
        target.style.top = (areaHeight - ((-areaPosi) - (-parentPosi)) - targetHeight + bottomHeight - topHeight) + 'px';
      }

    });
  }

  areas.forEach(area => {

    if (targets.length > 0) {

      const listener = {
        handleEvent: () => {

          checkFixed(targets, area);
        }
      };
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.addEventListener('scroll', listener, {
              passive: true
            });
          } else {
            window.removeEventListener('scroll', listener, {
              passive: true
            });
          }
        });
      });

      observer.observe(area);


      const resizeObserver = new ResizeObserver(() => {
        checkFixed(targets, area);
      });

      resizeObserver.observe(area);
    }
  });
}


// JsScrollStickyObserver
const JsScrollStickyObserver = function(element, options) {
  const that = this;
  const body = document.getElementsByTagName("BODY")[0];
  // let count = 0;
  // element 不在存退出
  if (typeof element === "undefined" || element === null) {
    return;
  }
  element = document.getElementById(element);

  //////////////////////////////
  // **   defaultOptions   ** //
  //////////////////////////////
  ObserverOptions = {
    root: null,
    rootMargin: '', // 0px 0px -200px 0px
    threshold: ''
  }

  defaultOptions = {
    prevElementID: "",
    stopElementID: "",
    fixedClassName: "is-fix",
    stopClassName: "",
    isSub: false,
    prevFixedID: "",
    callback: options.callback || ObserverOptions,
    resolutionsList: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200
    },
    breakpoint: 'lg',
  }

  options = JsUtils.deepExtend(that, defaultOptions, options);

  let fixedClassName = options.fixedClassName || defaultOptions.fixedClassName;
  let stopClassName = options.stopClassName || defaultOptions.stopClassName;
  let stopElementID = options.stopElementID || defaultOptions.stopElementID;
  let prevElement = document.getElementById(options.prevElementID);
  let stopElement = document.getElementById(stopElementID);

  let isSub = options.isSub || defaultOptions.isSub;
  let prevFixedID = options.prevFixedID || defaultOptions.prevFixedID;

  let listenSelect = prevElement.id;
  let stopSelect = stopElement.id;
  let settings = options.callback || defaultOptions.callback;

  const selector = ['#' + listenSelect, '#' + stopSelect];

  // 不支援 IntersectionObserver 時，改用 getBoundingClientRect 監聽 
  if (!("IntersectionObserver" in window) && !("IntersectionObserverEntry" in window) && !("intersectionRatio" in window.IntersectionObserverEntry.prototype)) {
    const initialCords = element.getBoundingClientRect();
    document.addEventListener('scroll', function() {
      if (window.scrollY >= initialCords.top) {
        let width = prevElement.getBoundingClientRect().width;
        element.classList.add(fixedClassName);
        element.style.width = width + 'px';
        if (window.scrollY === 0) {
          element.style.width = '';
          element.classList.remove(fixedClassName);
        }
      } else {
        element.style.width = '';
        element.classList.remove(fixedClassName);
      }
    });
  }
  // let observer = new IntersectionObserver((entries) => {
  const observer = new IntersectionObserver(function(entries, observer) {

    let footerEntry = entries.find(entry => entry.target.id === stopSelect);
    let elementWidth = prevElement.offsetWidth;
    let listenEntry = entries.find(entry => entry.target.id === listenSelect);

    if (listenEntry && listenEntry.isIntersecting) {
      _destroy()
    } else if (footerEntry && footerEntry.isIntersecting) {
      element.classList.remove(fixedClassName);
      element.classList.add(stopClassName);
      element.style.width = elementWidth + 'px';

      if (isSub === true) {
        let header = document.getElementById(prevFixedID);
        element.style.transform = '';
      }

    } else {
      if (document.documentElement.scrollTop !== 0) {
        element.classList.add(fixedClassName);
        element.classList.remove(stopClassName);
        element.style.width = elementWidth + 'px';

        if (isSub === true) {
          let header = document.getElementById(prevFixedID);
          let headerHeight = header.offsetHeight;
          element.style.transform = "translateY(" + headerHeight + "px)";
        }
      } else if (document.documentElement.scrollTop === 0) {

        _destroy()
      }

      if (window.innerWidth < options.resolutionsList[options.breakpoint]) {
        _destroy()
      }
    }
  }, settings);

  const _destroy = function(selector) {
    element.classList.remove(fixedClassName);
    element.classList.remove(stopClassName);
    element.style.width = '';
    element.style.transform = '';

    observer.unobserve(element);
  };

  const _update = function() {
    let elementWidth = prevElement.offsetWidth;
    element.style.width = elementWidth + 'px';
  };

  const _selector = function(selector) {
    const item = document.querySelectorAll(selector)
    item.forEach(i => observer.observe(i))
  };


  if (Array.isArray(selector)) {
    selector.forEach(_selector)
  } else {
    _selector(selector)
  }
  // [prevElement, stopElement].forEach(function(el) {
  //   observer.observe(el, ObserverOptions);
  // });


  window.addEventListener('resize', JsUtils.throttle(function() {
    if (window.innerWidth < options.resolutionsList[options.breakpoint]) {
      _destroy()
    } else {
      _update()
    }
  }, 200), false);
};