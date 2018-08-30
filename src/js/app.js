;(function () {

  // 分享文案
  window.activityConfig = {
    imgUrl: 'https://static-ftcms.jd.com/p/files/5b87b533b26d47706d23638b.jpg',
    shareUrl: location.href,
    title: '京东票据 — 惠优企 无忧贴',
    desc: '京东金融推出的专业的票据融资服务平台',
    weixinCallback: function () {
    },
  };

  var App = function () {

    this.serverUrl = '//cbp.jdpay.com/open/activity-818';
    this.timer = null;
    // 浏览器视口的高度
    this.clientHeight = document.compatMode == "CSS1Compat" ? windowHeight = document.documentElement.clientHeight :
      windowHeight = document.body.clientHeight
    // 文档的总高度
    this.documentHeight = document.body.scrollHeight || document.documentElement.scrollHeight
    // 滑动buffer
    this.slidebuffer = 8;
    // 滚动buffer
    this.buffer = 80;
  };

  App.prototype = {

    constructor: App,

    init: function () {
      this.scrollToTop()
      this.attachEvent()
    },
    // 滚动条在Y轴上的滚动距离
    scrollTop: function () {
      return document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
    },
    scrollToTop: function () {
      document.body.scrollTop = document.documentElement.scrollTop = window.pageYOffset = 0
    },
    // 绑定事件
    attachEvent: function () {
      var _this = this;
      var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

      document.addEventListener('DOMContentLoaded', _this.onBeforeScrollStart())
      
      // 监听touch事件
      this.handleTouch()

      $('.fixed-submit-btn').on('click', function () {
        _this.handlePrevPage()
      })

      $('#submitBtn').on('click', function () {
        _this.handleSubmit()
      })

      document.body.addEventListener(resizeEvt, function () {
        console.log('resize')
      })
      document.body.addEventListener('focusin', function () {
        
      });
      document.body.addEventListener('focusout', function () {
        console.log('focusout')
        _this.scrollToTop()
      });
    },
    onBeforeScrollStart: function () {
      /* var target = e.target;
      while (target.nodeType != 1) target = target.parentNode;
      if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
      e.preventDefault(); */
      [].slice.call(document.querySelectorAll('input, select, button')).forEach(function (el) {
        el.addEventListener(('ontouchstart' in window) ? 'touchstart' : 'mousedown', function (e) {
          e.stopPropagation();
        })
        el.addEventListener(('ontouchend' in window) ? 'touchend' : 'mousedown', function (e) {
          e.stopPropagation();
        })
      })
    }, 
    // 处理模拟滚动
    handleTouch: function () {
      var _this = this;
      var firstPage = 0;
      var starty;
      document.body.addEventListener('touchstart', function (e) {
        e.preventDefault()
        console.log('start')
        starty = e.touches[0].pageY
        firstPage = $('#firstPage').offset().top
      }, { passive: false });
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault()
        console.log('move')
        var y = e.touches[0].pageY
        var change = y - starty
        var secondPage = $('#secondPage').offset().top
        if ((y > secondPage) && (change < -_this.slidebuffer)) {
          _this.handleScroll(firstPage + change - 100)
        } else if ((Math.abs(change) > _this.slidebuffer) && (Math.abs(change) <= _this.buffer)) {
          _this.handleFlexSlide(firstPage + change)
        } else {
          clearTimeout(_this.timer)
        }
      }, { passive: false });
      document.body.addEventListener('touchend', function (e) {
        e.preventDefault()
        var change = e.changedTouches[0].pageY - starty
        var secondPage = $('#secondPage').offset().top
        console.log(change)
        if ((starty > secondPage) && (change < -_this.slidebuffer)) {
          _this.handleScroll(firstPage + change - 100)
          // _this.throttle(_this.handleScroll(firstPage + change - 100), 100, 200)
        } else if ((starty < secondPage) && (change < -_this.buffer)) {
          // 滑到下一张
          _this.handleNextPage()
        } else if (change > _this.buffer) {
          // 滑到上一张
          _this.handlePrevPage()
        } else {
          clearTimeout(_this.timer)
          _this.timer = setTimeout(function () {
            _this.handleFlexSlide(firstPage)            
          }, 300);
        }
      }, { passive: false });
    },

    // 提交信息
    handleSubmit: function () {
      var _this = this;

      //Todo 根据storage记录判断是否有重复提交

      var mobile = $('#mobile').val();
      if (!/^1(3[0-9]|4[57]|5[0-35-9]|7[0678]|8[0-9])\d{8}$/.test(mobile)) {
        return alert('请输入正确的手机号');
      }
      $('#submitBtn').attr('disabled', 'disabled')

      window.jsonpCallback = function (res) {
        if (res.code === '0') {
          alert('提交成功');

          //Todo 记录到storage，防止重复提交

          //Todo 埋点示例
          _this.trackEvent('activity_submit_success', mobile);

          location.reload()
        }
      };

      this.jsonpSubmit({ telephone: mobile, callback: 'jsonpCallback' });
    },

    // 上一页
    handlePrevPage: function () {
      var style = {
        'transform': 'translate3d(0, 0, 0)',
        'transition': 'all 300ms cubic-bezier(.1, .57, .1, 1)',
        '-webkit-transition': 'all 300ms cubic-bezier(.1, .57, .1, 1)'
      };
      $("#secondPage").css(style)
      $("#firstPage").css(style)
      $('.fixed-submit-btn').removeClass('fadeIn')
      $('.fixed-submit-btn').addClass('fadeOut')
    },
    // 下一页
    handleNextPage: function () {
      var style = {
        'transform': 'translate3d(0, -' + this.clientHeight + 'px, 0)',
        'transition': 'all 300ms cubic-bezier(.1, .57, .1, 1)',
        '-webkit-transition': 'all 300ms cubic-bezier(.1, .57, .1, 1)'
      };
      $("#secondPage").css(style);
      $("#firstPage").css(style);
      $('.fixed-submit-btn').removeClass('fadeOut')
      $('.fixed-submit-btn').addClass('fadeIn')
    },
    // 滚动
    handleScroll: function (y) {
      var distance = (y < -988) ? -988 : y
      var style = {
        'transition': 'translate3d 200ms cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        '-webkit-transition': 'translate3d 200ms cubic-bezier(0.390, 0.575, 0.565, 1.000)',
        'transform': 'translate3d(0, ' + distance + 'px, 0)',
      }
      $("#secondPage").css(style);
      $("#firstPage").css(style);
    },
    // 弹性滑动
    handleFlexSlide: function (y) {
      var distance = (y < -988) ? -988 : y
      var style = {
        'transition': 'translate3d 1s cubic-bezier(.1, .57, .1, 1)',
        '-webkit-transition': 'translate3d 1s cubic-bezier(.1, .57, .1, 1)',
        'transform': 'translate3d(0, ' + distance + 'px, 0)',
      }
      $("#secondPage").css(style);
      $("#firstPage").css(style);
    },
    throttle: function (fn, wait, time) {
      var previous = null; //记录上一次运行的时间
      var timer = null;

      return function () {
        var now = +new Date();

        if (!previous) previous = now;
        //当上一次执行的时间与当前的时间差大于设置的执行间隔时长的话，就主动执行一次
        if (now - previous > time) {
          clearTimeout(timer);
          fn();
          previous = now;// 执行函数后，马上记录当前时间
        } else {
          clearTimeout(timer);
          timer = setTimeout(function () {
            fn();
          }, wait);
        }
      }
    },
    // 构造jsonp请求
    jsonpSubmit: function (data) {
      var dataStr = '';
      for (var i in data) {
        if (dataStr) {
          dataStr += '&' + i + '=' + encodeURIComponent(data[i]);
        } else {
          dataStr += '?' + i + '=' + encodeURIComponent(data[i]);
        }
      }
      var script = document.createElement('script');
      script.src = this.serverUrl + dataStr;
      script.async = 'async';
      document.head.appendChild(script);
    },

    // 自定义事件埋点
    trackEvent: function (eid, epv) {
      if (window.MtaH5) {
        MtaH5.clickStat(eid, epv);
      }
    },
  };

  var app = new App();
  app.init();

})();
