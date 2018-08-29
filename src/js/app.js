;(function () {

  // 分享文案
  window.activityConfig = {
    imgUrl: 'https://static-ftcms.jd.com/p/files/5b769363a7a433706cdc3d85.png',
    shareUrl: location.href,
    title: '智能客服',
    desc: '惠优企 无忧贴',
    weixinCallback: function () {
    },
  };

  var App = function () {

    this.serverUrl = '//cbp.jdpay.com/open/activity-818';

    // 浏览器视口的高度
    this.clientHeight = document.compatMode == "CSS1Compat" ? windowHeight = document.documentElement.clientHeight :
      windowHeight = document.body.clientHeight
    // 滚动条在Y轴上的滚动距离
    this.scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop || 0
    // 文档的总高度
    this.documentHeight = document.body.scrollHeight || document.documentElement.scrollHeight
    // 滚动buffer
    this.buffer = 50;
  };

  App.prototype = {

    constructor: App,

    init: function () {

      this.attachEvent();
    },

    // 绑定事件
    attachEvent: function () {
      var _this = this;

      // 监听touch事件
      this.handleTouch();

      $(document.body).on('click', '.fixed-submit-btn', function () {
        _this.handlePrevPage();
      });

      $(document.body).on('click', '#submitBtn', function () {
        _this.handleSubmit();
      });
    },

    // 处理模拟滚动
    handleTouch: function () {
      var _this = this;
      var starty;
      var slideStyle = function () {
        return {
          'transform': 'translate3d(0, ' + -1000 + 'px, 0)',
          'transition': 'all 0.2s'
        }
      }
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, { 
        passive: false 
      });
      // 滚动超过buffer时，通过设置transform: translate3d(0, y, 0)来模拟滚动
      $(document).on('touchstart', function (e) {
        console.log('start')
        starty = e.touches[0].pageY
      }).on('touchend', function (e) {
        var change = e.changedTouches[0].pageY - starty
        var secondPage = $('#secondPage').offset().top
        console.log('end')
        if (change < (- _this.buffer)) { 
          // 滑到下一张
          if (starty < secondPage) {
            _this.handleNextPage()
          } else {
            $("#secondPage").css(slideStyle())
            $("#firstPage").css(slideStyle())
          }
        } else if (change > _this.buffer) {
          // 滑到上一张
          if (starty > secondPage) {
            _this.handlePrevPage()
          } else {
            location.reload()
          }
        }
      }).on('touchcancel', function (e) {
        console.log('touchcancel')
      })
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
        'transition': 'all 0.2s'
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
        'transition': 'all 0.2s'
      };
      $("#secondPage").css(style);
      $("#firstPage").css(style);
      $('.fixed-submit-btn').removeClass('fadeOut')
      $('.fixed-submit-btn').addClass('fadeIn')
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
