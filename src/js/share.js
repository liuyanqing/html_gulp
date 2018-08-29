/**
 * @ Dsec:
 * @ Author: lizhiyang1
 * @ Date: 2018/8/18
 */

(function () {

  var onBridgeReady = function () {
    //分享给好友
    WeixinJSBridge.on('menu:share:appmessage',
      function (argv) {
        WeixinJSBridge.invoke('sendAppMessage', {
            'appid': '',
            'img_url': activityConfig.imgUrl,
            'img_width': '120',
            'img_height': '120',
            'link': activityConfig.shareUrl,
            'desc': activityConfig.desc,
            'title': activityConfig.title,
          },
          function (res) {
            (activityConfig.weixinCallback)();
          });
      });
    //分享到朋友圈
    WeixinJSBridge.on('menu:share:timeline',
      function (argv) {
        WeixinJSBridge.invoke('shareTimeline', {
            'appid': '',
            'img_url': activityConfig.imgUrl,
            'img_width': '120',
            'img_height': '120',
            'link': activityConfig.shareUrl,
            'desc': activityConfig.desc,
            'title': activityConfig.title,
          },
          function (res) {
            (activityConfig.weixinCallback)();
          });
      });
  };

  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
    }
  } else {
    onBridgeReady();
  }

})();


