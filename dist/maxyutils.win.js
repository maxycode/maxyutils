var maxyutils = (function () {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var timer = null;
  var scrollToPos = function scrollToPos(opts) {
      var config = {
          pos: 0,
          el: el || "html",
          isVertical: true,
          speed: 6,
          interval: 10
      };
      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) !== "object") {
          if (typeof opts === "number") {
              config.pos = opts;
          } else {
              console.error("scrollToPos: 参数应为大于等于0的数字或对象");
              return;
          }
      }
      if (opts === null) {
          console.error("scrollToPos: 参数应为大于等于0的数字或对象");
          return;
      }
      if ((typeof opts === "undefined" ? "undefined" : _typeof(opts)) === "object" && Object.prototype.toString.call(opts) === "[object Object]") {
          for (var key in config) {
              if (typeof opts[key] !== "undefined") {
                  config[key] = opts[key];
              }
          }
      }
      var pos = config.pos,
          el = config.el,
          isVertical = config.isVertical,
          speed = config.speed,
          interval = config.interval;
      if (typeof pos !== "number" || pos < 0 || isNaN(pos)) {
          console.error("scrollToPos: 滚动参数pos应为大于等于0的数字");
          return;
      }
      if (timer) {
          clearInterval(timer);
          timer = null;
      }
      var rootEle = document.querySelector(el);
      var cliEle = document.documentElement || document.body;
      if (!rootEle) {
          console.error("指定的el不存在");
          return;
      }
      var eleVal = isVertical ? rootEle.offsetHeight : rootEle.offsetWidth;
      var winVal = isVertical ? cliEle.clientHeight : cliEle.clientWidth;
      var maxVal = Math.abs(eleVal - winVal) < 20 ? 0 : eleVal - winVal - 20;
      if (eleVal <= winVal) {
          throw Error("请确认当前传入的内容区高/宽度大于视窗高／宽度（此时才会出现滚动条）");
          return;
      }
      if (pos > maxVal) {
          pos = Math.max(0, maxVal);
      }
      timer = setInterval(function () {
          var scrollOri = isVertical ? window.scrollY : window.scrollX;
          var scrollDis = Math.abs(pos - scrollOri);
          var dis = 0;
          if (scrollDis < speed) {
              window.scrollTo(isVertical ? 0 : pos, isVertical ? pos : 0);
              clearInterval(timer);
              timer = null;
              return;
          }
          dis = Math.floor(scrollDis / speed);
          if (scrollOri > pos) {
              scrollOri -= dis;
          }
          if (scrollOri < pos) {
              scrollOri += dis;
          }
          window.scrollTo(isVertical ? 0 : scrollOri, isVertical ? scrollOri : 0);
      }, interval);
  };

  var ImgLazyload = {
      init: function init(_ref) {
          var _ref$container = _ref.container,
              container = _ref$container === undefined ? "html" : _ref$container,
              _ref$defaultImg = _ref.defaultImg,
              defaultImg = _ref$defaultImg === undefined ? "" : _ref$defaultImg,
              _ref$errorImage = _ref.errorImage,
              errorImage = _ref$errorImage === undefined ? "" : _ref$errorImage,
              _ref$delay = _ref.delay,
              delay = _ref$delay === undefined ? 500 : _ref$delay;
          this.el = document.querySelector(container);
          this.children = [];
          this.defaultImg = defaultImg;
          this.errorImage = errorImage;
          this.delay = delay;
          this.getLazyLoadEls();
          var cliEle = document.documentElement;
          this.wHeight = cliEle.clientHeight;
          this.wWidth = cliEle.clientWidth;
          var cbfn = this.throttle();
          if (window.addEventListener) {
              window.addEventListener("scroll", cbfn, true);
              window.addEventListener("touchmove", cbfn, true);
              window.addEventListener("load", cbfn, true);
          }
      },
      throttle: function throttle() {
          var _this = this;
          var prev = Date.now();
          this.check();
          return function () {
              var now = Date.now();
              if (now - prev > _this.delay) {
                  _this.check();
                  prev = now;
              }
          };
      },
      getLazyLoadEls: function getLazyLoadEls() {
          var eles = this.el.querySelectorAll("*[lazyload]");
          for (var i = 0, len = eles.length; i < len; i++) {
              this.children.push(eles[i]);
              if (this.defaultImg) {
                  this.setImageForEl(eles[i], this.defaultImg);
              }
          }
      },
      setImageForEl: function setImageForEl(el, imgUrl) {
          if (el.nodeType !== 1) return;
          if (typeof el.tagName === "string" && el.tagName.toLowerCase() === "img") {
              el.src = imgUrl;
          } else {
              el.style.backgroundImage = "url(" + (imgUrl || "") + ")";
          }
      },
      checkInView: function checkInView(el) {
          var pos = el.getBoundingClientRect();
          var x = pos.x,
              y = pos.y,
              width = pos.width,
              height = pos.height;
          if (x < this.wWidth && x > -width && y < this.wHeight && y > -height) {
              return true;
          }
          return false;
      },
      check: function check() {
          var _this2 = this;
          this.getLazyLoadEls();
          if (!this.children.length) return;
          this.children.forEach(function (item) {
              if (_this2.checkInView(item)) {
                  _this2.handleElInView(item);
              }
          });
      },
      handleElInView: function handleElInView(el) {
          var _this3 = this;
          if (el.nodeType !== 1) return;
          var imgUrl = el.getAttribute("lazyload");
          if (!imgUrl) return;
          var Img = new Image();
          Img.src = imgUrl;
          el.removeAttribute("lazyload");
          Img.addEventListener("load", function () {
              _this3.setImageForEl(el, imgUrl);
          }, false);
          Img.addEventListener("error", function () {
              if (_this3.errorImage) {
                  _this3.setImageForEl(el, _this3.errorImage);
              }
              if (_this3.defaultImg) {
                  _this3.setImageForEl(el, _this3.defaultImg);
              }
          }, false);
      }
  };

  var index = {
      scrollToPos: scrollToPos,
      ImgLazyload: ImgLazyload
  };

  return index;

}());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4eXV0aWxzLndpbi5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxzL3Njcm9sbFRvUG9zLmpzIiwiLi4vc3JjL3V0aWxzL0ltZ0xhenlsb2FkLmpzIiwiLi4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImxldCB0aW1lciA9IG51bGw7XG5cbi8qKlxuICogW+mhtemdouW5s+a7kea7muWKqOWIsOaMh+WumuS9jee9ru+8iOWkmueUqOS6jui/lOWbnumhtumDqO+8iV1cbiAqIEBwYXJhbSAge1tOdW1iZXIgfHwgT2JqZWN0XX0gb3B0cyBb6YWN572u5Y+C5pWwXVxuICogQG9wdHMg5Li6TnVtYmVy57G75Z6L5pe277yM6buY6K6k5LiK5LiL5rua5Yqo5Yiw5oyH5a6a5L2N572u77yM5LulaHRtbOWFg+e0oOS4uuagueWFg+e0oOiuoeeul+WGheWuueWMuumrmOW6plxuICogQG9wdHMg5Li6T2JqZWN05pe277yM5Y+v5aGr55qE5Y+C5pWw5pyJ77yaXG4gKiBAcG9zIHJlcXVpcmVkIHtOdW1iZXJ9IOa7muWKqOWIsOeahOaMh+WumuS9jee9ru+8iOi3nemhtemdouW3puS+p+aIluiAhei3nemhtumDqOeahOi3neemu++8iVxuICogQGlzVmVydGljYWwgcmVxdWlyZWQge0Jvb2xlYW59IOmAieaLqeS4iuS4i+a7muWKqOi/mOaYr+W3puWPs+a7muWKqCjkuLp0cnVl5pe25LiK5LiL5rua5Yqo77yMZmFsc2Xml7blt6blj7Pmu5rliqjvvIzpu5jorqTkuIrkuIvmu5rliqgpXG4gKiBAZWwge1N0cmluZ30g5oyH5a6a55qEZG9t5YWD57Sg77yM5LiA6Iis5Li6aHRtbCxib2R55oiW6ICFYm9keeS4i+acgOWkluWxgueahGRvbVxuICogQHNwZWVkIHtOdW1iZXJ9IOavj+asoea7muWKqOeahOi3neemu+aYr+ebruWJjea7muWKqOaAu+i3neemu+eahCAxIC8gc3BlZWQs5q2k5YC86LaK5aSn77yM5rua5Yqo6LaK5b+rXG4gKiBAaW50ZXJ2YWwge051bWJlcn0g5a6a5pe25Zmo5omn6KGM6Ze06ZqU44CC6Ze06ZqU6LaK5bCP77yM5rua5Yqo6LaK5b+rIFxuICogQHJldHVybiB7W3VuZGVmaW5lZF19ICAgICAgW+aXoOaEj+S5ie+8jOayoeaciei/lOWbnuWAvF1cbiAqL1xuY29uc3Qgc2Nyb2xsVG9Qb3MgPSBvcHRzID0+IHtcbiAgICAvLyDliJ3lp4vljJbphY3nva5cbiAgICBjb25zdCBjb25maWcgPSB7XG4gICAgICAgIHBvczogMCxcbiAgICAgICAgZWw6IGVsIHx8IFwiaHRtbFwiLFxuICAgICAgICBpc1ZlcnRpY2FsOiB0cnVlLFxuICAgICAgICBzcGVlZDogNixcbiAgICAgICAgaW50ZXJ2YWw6IDEwXG4gICAgfTtcblxuICAgIGlmICh0eXBlb2Ygb3B0cyAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIGNvbmZpZy5wb3MgPSBvcHRzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNjcm9sbFRvUG9zOiDlj4LmlbDlupTkuLrlpKfkuo7nrYnkuo4w55qE5pWw5a2X5oiW5a+56LGhXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfSBcblxuICAgIGlmIChvcHRzID09PSBudWxsKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5Y+C5pWw5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl+aIluWvueixoVwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOWQiOW5tmNvbmZpZ+WSjOS8oOWFpeeahG9wdHNcbiAgICBpZiAodHlwZW9mIG9wdHMgPT09IFwib2JqZWN0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9wdHMpID09PSBcIltvYmplY3QgT2JqZWN0XVwiKSB7XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGNvbmZpZykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBvcHRzW2tleV0gIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgICAgICBjb25maWdba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGxldCB7IHBvcywgZWwsIGlzVmVydGljYWwsIHNwZWVkLCBpbnRlcnZhbCB9ID0gY29uZmlnO1xuXG4gICAgaWYgKHR5cGVvZiBwb3MgIT09IFwibnVtYmVyXCIgfHwgcG9zIDwgMCB8fCBpc05hTihwb3MpKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzY3JvbGxUb1Bvczog5rua5Yqo5Y+C5pWwcG9z5bqU5Li65aSn5LqO562J5LqOMOeahOaVsOWtl1wiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOmHjee9rnRpbWVyXG4gICAgaWYgKHRpbWVyKSB7XG4gICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIpO1xuICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgfVxuXG4gICAgLy8g6I635Y+W5Yiw5qC55YWD57Sg5ZKM6KeG56qX5YWD57SgXG4gICAgbGV0IHJvb3RFbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKTtcbiAgICBsZXQgY2xpRWxlID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50IHx8IGRvY3VtZW50LmJvZHk7XG5cbiAgICAvLyDmoKHpqoxyb290RWxl5piv5ZCm5Li656m6XG4gICAgaWYgKCFyb290RWxlKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCLmjIflrprnmoRlbOS4jeWtmOWcqFwiKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIOiOt+WPluWIsOaguea6kOe0oOeahOWuveaIlumrmFxuICAgIGxldCBlbGVWYWwgPSBpc1ZlcnRpY2FsID8gcm9vdEVsZS5vZmZzZXRIZWlnaHQgOiByb290RWxlLm9mZnNldFdpZHRoO1xuICAgIC8vIOiOt+WPluWIsOinhueql+eahOWuveaIlumrmFxuICAgIGxldCB3aW5WYWwgPSBpc1ZlcnRpY2FsID8gY2xpRWxlLmNsaWVudEhlaWdodCA6IGNsaUVsZS5jbGllbnRXaWR0aDtcbiAgICAvLyDorqHnrpfmu5rliqjnmoTmnIDlpKflgLzvvIzlkIzml7bnlZnlh7oyMOeahOWuieWFqOi3neemu1xuICAgIGxldCBtYXhWYWwgPSBNYXRoLmFicyhlbGVWYWwgLSB3aW5WYWwpIDwgMjAgPyAwIDogZWxlVmFsIC0gd2luVmFsIC0gMjA7XG5cbiAgICAvLyDmr5TovoPlhoXlrrnpq5jvvI/lrr3luqblkozop4bnqpfpq5jvvI/lrr3luqbvvIzlpoLmnpzlhoXlrrnpq5jvvI/lrr3luqbkuI3lpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIzmraTml7bkuI3kvJrlh7rnjrDmu5rliqjmnaHvvIznu5nlh7rmj5DnpLpcbiAgICBpZiAoZWxlVmFsIDw9IHdpblZhbCkge1xuICAgICAgICB0aHJvdyBFcnJvcihcIuivt+ehruiupOW9k+WJjeS8oOWFpeeahOWGheWuueWMuumrmC/lrr3luqblpKfkuo7op4bnqpfpq5jvvI/lrr3luqbvvIjmraTml7bmiY3kvJrlh7rnjrDmu5rliqjmnaHvvIlcIik7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyDlr7nmu5rliqjliLDnmoTkvY3nva5wb3Pov5vooYzlpITnkIZcbiAgICBpZiAocG9zID4gbWF4VmFsKSB7XG4gICAgICAgIHBvcyA9IE1hdGgubWF4KDAsIG1heFZhbCk7XG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgIGxldCBzY3JvbGxPcmkgPSBpc1ZlcnRpY2FsID8gd2luZG93LnNjcm9sbFkgOiB3aW5kb3cuc2Nyb2xsWDtcbiAgICAgICAgbGV0IHNjcm9sbERpcyA9IE1hdGguYWJzKHBvcyAtIHNjcm9sbE9yaSk7XG4gICAgICAgIGxldCBkaXMgPSAwO1xuXG4gICAgICAgIC8vIOWmguaenOa7muWKqOWIsOeJueWumuS9jee9rumZhOi/keS6hlxuICAgICAgICBpZiAoc2Nyb2xsRGlzIDwgc3BlZWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5zY3JvbGxUbyhpc1ZlcnRpY2FsID8gMCA6IHBvcywgaXNWZXJ0aWNhbCA/IHBvcyA6IDApO1xuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aW1lcik7XG4gICAgICAgICAgICB0aW1lciA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyDmr4/mrKHmu5rliqjliankvZnmu5rliqjot53nprvnmoQgMSAvIHNwZWVkXG4gICAgICAgIGRpcyA9IE1hdGguZmxvb3Ioc2Nyb2xsRGlzIC8gc3BlZWQpO1xuICAgICAgICBcbiAgICAgICAgaWYgKHNjcm9sbE9yaSA+IHBvcykge1xuICAgICAgICAgICAgc2Nyb2xsT3JpIC09IGRpcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzY3JvbGxPcmkgPCBwb3MpIHtcbiAgICAgICAgICAgIHNjcm9sbE9yaSArPSBkaXM7XG4gICAgICAgIH1cblxuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oaXNWZXJ0aWNhbCA/IDAgOiBzY3JvbGxPcmksIGlzVmVydGljYWwgPyBzY3JvbGxPcmkgOiAwKTtcbiAgICB9LCBpbnRlcnZhbClcbn1cblxuZXhwb3J0IGRlZmF1bHQgc2Nyb2xsVG9Qb3M7IiwiLyoqXG4gKiDlm77niYfmh5LliqDovb1cbiAqIEBwYXJhbXMgb3B0c1xuICogb3B0cy5jb250YWluZXIg5Y+v6YCJ77yM6buY6K6k5Li6aHRtbO+8jOaMh+WumumcgOimgeaHkuWKoOi9veWbvueJh+WFg+e0oOeahOeItuWuueWZqFxuICogb3B0cy5kZWZhdWx0SW1nIOWPr+mAie+8jOWKoOi9veS5i+WJjem7mOiupOeahOWbvueJh1xuICogb3B0cy5lcnJvckltYWdlIOWPr+mAie+8jOWKoOi9vee9kee7nOWbvueJh+WHuumUmeaXtueahOWbvueJh1xuICogb3B0cy5kZWxheSDmu5rliqjmo4DmtYvnmoTpl7TpmpTvvIjlh73mlbDoioLmtYHvvInjgILmr4/pmpRkZWxheeavq+enkui/m+ihjOS4gOasoWNoZWNr77yM5p2l5Yqg6L295aSE5LqO6KeG56qX5Lit55qE5YWD57Sg5Zu+54mH6LWE5rqQXG4gKi9cbmNvbnN0IEltZ0xhenlsb2FkID0ge1xuICAgIC8vIOazqOWGjOa7muWKqOS6i+S7tlxuICAgIGluaXQoeyBjb250YWluZXIgPSBcImh0bWxcIiwgZGVmYXVsdEltZyA9IFwiXCIsIGVycm9ySW1hZ2UgPSBcIlwiLCBkZWxheSA9IDUwMCB9KSB7XG4gICAgICAgIHRoaXMuZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGNvbnRhaW5lcik7XG4gICAgICAgIC8vIOaUtumbhuWcqGNvbnRhaW5lcuS4i+eahOaHkuWKoOi9veeahOWbvueJh1xuICAgICAgICB0aGlzLmNoaWxkcmVuID0gW107XG4gICAgICAgIHRoaXMuZGVmYXVsdEltZyA9IGRlZmF1bHRJbWc7XG4gICAgICAgIHRoaXMuZXJyb3JJbWFnZSA9IGVycm9ySW1hZ2U7XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5nZXRMYXp5TG9hZEVscygpO1xuXG4gICAgICAgIGNvbnN0IGNsaUVsZSA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgLy8g6I635Y+W6KeG56qX55qE6auY5bqm5ZKM5a695bqmXG4gICAgICAgIHRoaXMud0hlaWdodCA9IGNsaUVsZS5jbGllbnRIZWlnaHQ7XG4gICAgICAgIHRoaXMud1dpZHRoID0gY2xpRWxlLmNsaWVudFdpZHRoO1xuXG4gICAgICAgIGxldCBjYmZuID0gdGhpcy50aHJvdHRsZSgpO1xuICAgICAgICBpZiAod2luZG93LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIGNiZm4sIHRydWUpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgY2JmbiwgdHJ1ZSk7ICAgICAgICAgICAgXG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgY2JmbiwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8g5Ye95pWw6IqC5rWBXG4gICAgdGhyb3R0bGUoKSB7XG4gICAgICAgIGxldCBwcmV2ID0gRGF0ZS5ub3coKTtcbiAgICAgICAgdGhpcy5jaGVjaygpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgbGV0IG5vdyA9IERhdGUubm93KCk7XG4gICAgICAgICAgICBpZiAobm93IC0gcHJldiA+IHRoaXMuZGVsYXkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNoZWNrKCk7XG4gICAgICAgICAgICAgICAgcHJldiA9IG5vdztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyDojrflj5bmiYDmnInluKZsYXp5bG9hZOeahOWxnuaAp+eahGRvbeWFg+e0oFxuICAgIGdldExhenlMb2FkRWxzKCkge1xuICAgICAgICBjb25zdCBlbGVzID0gdGhpcy5lbC5xdWVyeVNlbGVjdG9yQWxsKFwiKltsYXp5bG9hZF1cIik7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsZW4gPSBlbGVzLmxlbmd0aDsgaSA8IGxlbjsgaSArKyApIHtcbiAgICAgICAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChlbGVzW2ldKTtcbiAgICAgICAgICAgIC8vIOWmguaenOaciem7mOiupOWbvueJh++8jOiuvue9rum7mOiupOWbvueJh1xuICAgICAgICAgICAgaWYgKHRoaXMuZGVmYXVsdEltZykge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbGVzW2ldLCB0aGlzLmRlZmF1bHRJbWcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOS4uuWFg+e0oOiuvue9ruWbvueJh1xuICAgIHNldEltYWdlRm9yRWwoZWwsIGltZ1VybCkge1xuICAgICAgICAvLyDlpoLmnpxlbOS4jeaYr+agh+etvizkuI3lpITnkIZcbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG5cbiAgICAgICAgaWYgKHR5cGVvZiBlbC50YWdOYW1lID09PSBcInN0cmluZ1wiICYmIGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gXCJpbWdcIikge1xuICAgICAgICAgICAgZWwuc3JjID0gaW1nVXJsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuc3R5bGUuYmFja2dyb3VuZEltYWdlID0gYHVybCgke2ltZ1VybCB8fCBcIlwifSlgO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIOajgOafpeWNleS4quWFg+e0oOaYr+WQpuWcqOinhueql+S4rVxuICAgIGNoZWNrSW5WaWV3KGVsKSB7XG4gICAgICAgIGNvbnN0IHBvcyA9IGVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBjb25zdCB7IHgsIHksIHdpZHRoLCBoZWlnaHQgfSA9IHBvcztcbiAgICAgICAgLy8g5aaC5p6ceOWcqC13aWR0aOWIsHdXaWR0aOS5i+mXtOW5tuS4lHnlnKgtaGVpZ2h05Yiwd0hlaWdodOS5i+mXtOaXtu+8jOWFg+e0oOWkhOS6juinhueql+S4rVxuICAgICAgICBpZiAoeCA8IHRoaXMud1dpZHRoICYmIHggPiAtd2lkdGggJiYgeSA8IHRoaXMud0hlaWdodCAmJiB5ID4gLWhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSxcblxuICAgIC8vIOmBjeWOhuWtkOWFg+e0oO+8jOWkhOeQhuWcqOinhueql+S4reeahOWFg+e0oFxuICAgIGNoZWNrKCkge1xuICAgICAgICB0aGlzLmdldExhenlMb2FkRWxzKCk7XG4gICAgICAgIGlmICghdGhpcy5jaGlsZHJlbi5sZW5ndGgpIHJldHVybjtcbiAgICAgICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKGl0ZW0gPT4ge1xuICAgICAgICAgICAgLy8g5aaC5p6c5Zyo6KeG56qX5LitIFxuICAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tJblZpZXcoaXRlbSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUVsSW5WaWV3KGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sXG5cbiAgICAvLyDlsIblhYPntKDnmoRsYXp5bG9hZOWxnuaAp+WPluWHuuadpe+8jOeEtuWQjuaWsOW7uuS4gOS4qmltYWdl5a+56LGhXG4gICAgaGFuZGxlRWxJblZpZXcoZWwpIHtcbiAgICAgICAgaWYgKGVsLm5vZGVUeXBlICE9PSAxKSByZXR1cm47XG4gICAgICAgIGNvbnN0IGltZ1VybCA9IGVsLmdldEF0dHJpYnV0ZShcImxhenlsb2FkXCIpO1xuICAgICAgICBpZiAoIWltZ1VybCkgcmV0dXJuO1xuICAgICAgICBjb25zdCBJbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgSW1nLnNyYyA9IGltZ1VybDtcblxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJsYXp5bG9hZFwiKTtcbiAgICAgICAgSW1nLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgaW1nVXJsKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICBcbiAgICAgICAgLy8g5aaC5p6c5Zu+54mH5Yqg6L295aSx6LSl5LqG77yM5bCx5Yqg6L296ZSZ6K+v5Zu+54mH5oiW6buY6K6k5Zu+54mHXG4gICAgICAgIEltZy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JJbWFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0SW1hZ2VGb3JFbChlbCwgdGhpcy5lcnJvckltYWdlKTtcbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICh0aGlzLmRlZmF1bHRJbWcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldEltYWdlRm9yRWwoZWwsIHRoaXMuZGVmYXVsdEltZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIGZhbHNlKTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEltZ0xhenlsb2FkOyIsImltcG9ydCBzY3JvbGxUb1BvcyBmcm9tIFwiLi91dGlscy9zY3JvbGxUb1Bvc1wiO1xuaW1wb3J0IEltZ0xhenlsb2FkIGZyb20gXCIuL3V0aWxzL0ltZ0xhenlsb2FkXCI7XG5cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHNjcm9sbFRvUG9zLFxuICAgIEltZ0xhenlsb2FkXG59Il0sIm5hbWVzIjpbInRpbWVyIiwic2Nyb2xsVG9Qb3MiLCJjb25maWciLCJwb3MiLCJlbCIsImlzVmVydGljYWwiLCJzcGVlZCIsImludGVydmFsIiwib3B0cyIsImNvbnNvbGUiLCJlcnJvciIsIk9iamVjdCIsInByb3RvdHlwZSIsInRvU3RyaW5nIiwiY2FsbCIsImtleSIsImlzTmFOIiwiY2xlYXJJbnRlcnZhbCIsInJvb3RFbGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3IiLCJjbGlFbGUiLCJkb2N1bWVudEVsZW1lbnQiLCJib2R5IiwiZWxlVmFsIiwib2Zmc2V0SGVpZ2h0Iiwib2Zmc2V0V2lkdGgiLCJ3aW5WYWwiLCJjbGllbnRIZWlnaHQiLCJjbGllbnRXaWR0aCIsIm1heFZhbCIsIk1hdGgiLCJhYnMiLCJFcnJvciIsIm1heCIsInNldEludGVydmFsIiwic2Nyb2xsT3JpIiwid2luZG93Iiwic2Nyb2xsWSIsInNjcm9sbFgiLCJzY3JvbGxEaXMiLCJkaXMiLCJzY3JvbGxUbyIsImZsb29yIiwiSW1nTGF6eWxvYWQiLCJpbml0IiwiY29udGFpbmVyIiwiZGVmYXVsdEltZyIsImVycm9ySW1hZ2UiLCJkZWxheSIsImNoaWxkcmVuIiwiZ2V0TGF6eUxvYWRFbHMiLCJ3SGVpZ2h0Iiwid1dpZHRoIiwiY2JmbiIsInRocm90dGxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsInByZXYiLCJEYXRlIiwibm93IiwiY2hlY2siLCJlbGVzIiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW4iLCJsZW5ndGgiLCJwdXNoIiwic2V0SW1hZ2VGb3JFbCIsImltZ1VybCIsIm5vZGVUeXBlIiwidGFnTmFtZSIsInRvTG93ZXJDYXNlIiwic3JjIiwic3R5bGUiLCJiYWNrZ3JvdW5kSW1hZ2UiLCJjaGVja0luVmlldyIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsIngiLCJ5Iiwid2lkdGgiLCJoZWlnaHQiLCJmb3JFYWNoIiwiaXRlbSIsImhhbmRsZUVsSW5WaWV3IiwiZ2V0QXR0cmlidXRlIiwiSW1nIiwiSW1hZ2UiLCJyZW1vdmVBdHRyaWJ1dGUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztFQUFBLElBQUlBLFFBQVEsSUFBWjtFQWNBLElBQU1DLGNBQWMsU0FBZEEsV0FBYyxPQUFRO0VBRXhCLFFBQU1DLFNBQVM7RUFDWEMsYUFBSyxDQURNO0VBRVhDLFlBQUlBLE1BQU0sTUFGQztFQUdYQyxvQkFBWSxJQUhEO0VBSVhDLGVBQU8sQ0FKSTtFQUtYQyxrQkFBVTtFQUxDLEtBQWY7RUFRQSxRQUFJLFFBQU9DLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEIsRUFBOEI7RUFDMUIsWUFBSSxPQUFPQSxJQUFQLEtBQWdCLFFBQXBCLEVBQThCO0VBQzFCTixtQkFBT0MsR0FBUCxHQUFhSyxJQUFiO0VBQ0gsU0FGRCxNQUVPO0VBQ0hDLG9CQUFRQyxLQUFSLENBQWMsOEJBQWQ7RUFDQTtFQUNIO0VBQ0o7RUFFRCxRQUFJRixTQUFTLElBQWIsRUFBbUI7RUFDZkMsZ0JBQVFDLEtBQVIsQ0FBYyw4QkFBZDtFQUNBO0VBQ0g7RUFHRCxRQUFJLFFBQU9GLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBaEIsSUFBNEJHLE9BQU9DLFNBQVAsQ0FBaUJDLFFBQWpCLENBQTBCQyxJQUExQixDQUErQk4sSUFBL0IsTUFBeUMsaUJBQXpFLEVBQTRGO0VBQ3hGLGFBQUss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
