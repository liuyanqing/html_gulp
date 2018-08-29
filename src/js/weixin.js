window.__wxReady = false;
function weixin(config){
    window.jsonpcallback= function (res) {
        wx.config({
            debug:false,
            appId:res.data.appId,
            timestamp:res.data.timestamp,
            nonceStr:res.data.nonceStr,
            signature:res.data.signature,
            jsApiList:['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ']
        });
        wx.ready(function () {
            setShareInfo();
            __wxReady = true;
        });
    };
    function sendJsonp(){
        var params={url:config.params.url,callback:config.params.callback},
            codeSearch= function (params) {
                var str='';
                for(var i in params){
                    if(str){
                        str+='&'+i+'='+encodeURIComponent(params[i]);
                    }else{
                        str+='?'+i+'='+encodeURIComponent(params[i]);
                    }
                }
                return str;
            },
            script=null;
        script=document.createElement('script');
        script.src=config.url+codeSearch(params);
        script.async='async';
        document.head.appendChild(script);
    }
    function setShareInfo() {
        wx.onMenuShareTimeline({
            title:config.params.title,
            link:config.params.url,
            imgUrl:config.params.imgUrl,
            success: function () {
                config.params.successCallBack && config.params.successCallBack('timeline')
            },
            cancel: function () {
            }
        });
        wx.onMenuShareAppMessage({
            title: config.params.title,
            desc: config.params.desc,
            link: config.params.url,
            imgUrl:config.params.imgUrl,
            type: '',
            dataUrl: '',
            success: function () {
                config.params.successCallBack && config.params.successCallBack('appmessage')
            },
            cancel: function () {}
        });
        wx.onMenuShareQQ({
            title: config.params.title,
            desc: config.params.desc,
            link: config.params.url,
            imgUrl: config.params.imgUrl,
            success: function () {
                config.params.successCallBack && config.params.successCallBack('qq')
            },
            cancel: function () {}
        });
    }

    __wxReady ? setShareInfo() : sendJsonp();
}