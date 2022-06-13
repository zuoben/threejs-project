function base64Encode(e) {
    var t;
    t = encodeURIComponent(e);
    t = window.btoa(t);
    return t
}

var h5vSDK = h5vSDK || {};
if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", h5vSDK.initf, false)
} else if (/WebKit/i.test(navigator.userAgent)) {
    var _timer = setInterval(function () {
        if (/loaded|complete/.test(document.readyState)) {
            clearInterval(_timer);
            h5vSDK.initf()
        }
    }, 50)
} else {
    window.onload = function (e) {
        h5vSDK.initf()
    }
}
h5vSDK = {
    isUploading: false, isPrivateMode: false, wx_ext_mode: "0", data: new Object, cloneObject: function (e) {
        if (typeof e != "object") return e;
        var t = {};
        if (e.constructor == Array) t = [];
        for (var n in e) {
            t[n] = h5vSDK.cloneObject(e[n])
        }
        return t
    }, parseURLParam: function (e) {
        var t = new Object;
        if ((a = e.indexOf("?")) != -1) {
            var n = e.substr(a + 1);
            var i = n.split("&");
            for (var a = 0; a < i.length; a++) {
                var r = i[a].split("=");
                t[r[0]] = r[1]
            }
        }
        return t
    }, hasValue: function (e) {
        if (e == undefined || e == null || e == "" || e == "undefined" || e == "null") {
            return false
        }
        return true
    }, setCookie: function (e, t) {
        var n = 365;
        var i = new Date;
        i.setTime(i.getTime() + n * 24 * 60 * 60 * 1e3);
        try {
            document.cookie = e + "=" + encodeURIComponent(t) + ";expires=" + i.toGMTString() + ";path=/"
        } catch (e) {
        }
    }, getCookie: function (e) {
        try {
            var t = document.cookie.match(new RegExp("(^| )" + e + "=([^;]*)(;|$)"))
        } catch (e) {
            return null
        }
        if (t != null) {
            return decodeURIComponent(t[2])
        } else {
            return null
        }
    }, delCookie: function (e) {
        var t = new Date;
        t.setTime(t.getTime() - 1);
        var n = h5vSDK.getCookie(e);
        try {
            if (n != null) document.cookie = e + "=" + n + ";expires=" + t.toGMTString()
        } catch (e) {
        }
    }, initConfig: function () {
        try {
            window.localStorage.setItem("isPrivateMode", "1");
            window.localStorage.removeItem("isPrivateMode");
            h5vSDK.isPrivateMode = false
        } catch (e) {
            h5vSDK.isPrivateMode = true
        }
    }, setConfig: function (e, t) {
        try {
            var n = window.localStorage;
            if (n == null || this.isPrivateMode) {
                h5vSDK.setCookie(e, t)
            } else {
                n.setItem(e, t)
            }
        } catch (e) {
        }
    }, getConfig: function (e) {
        try {
            var t = window.localStorage;
            if (t == null) {
                return h5vSDK.getCookie(e)
            } else {
                return t.getItem(e)
            }
        } catch (e) {
            return null
        }
    }, delConfig: function (e) {
        try {
            var t = window.localStorage;
            if (t == null) {
                return h5vSDK.delCookie(e)
            } else {
                return t.removeItem(e)
            }
        } catch (e) {
        }
    }, event: function (e, t) {
        if (t == null) t = true;
        if (h5vSDK.data.eventinfo == null) h5vSDK.data.eventinfo = new Object;
        if (!h5vSDK.data.eventinfo[e]) h5vSDK.data.eventinfo[e] = [];
        h5vSDK.data.eventinfo[e].push(Math.floor((new Date).getTime() / 1e3));
        if (t) {
            h5vSDK.trySendData()
        }
    }, groupevent: function (e, t, n, i) {
        return h5vSDK.event(e + "." + t + "." + n, i)
    }, sendUserData: function (e, t) {
        if (t == null) t = "default";
        if (h5vSDK.data.userdata == null) {
            h5vSDK.data.userdata = {};
            h5vSDK.data.userdata[t] = []
        } else {
            if (h5vSDK.data.userdata[t] == null) h5vSDK.data.userdata[t] = []
        }
        h5vSDK.data.userdata[t].push(e);
        h5vSDK.trySendData()
    }, sendUserTags: function (e, t) {
        if (!e instanceof Array) {
            e = [e]
        }
        if (h5vSDK.data.usertags == null) {
            h5vSDK.data.usertags = {data: []}
        }
        h5vSDK.data.usertags.replace = t;
        if (t) h5vSDK.data.usertags.data = [];
        h5vSDK.data.usertags.data = h5vSDK.data.usertags.data.concat(e);
        h5vSDK.trySendData()
    }, getOS: function () {
        if (h5vSDK.hasValue(navigator)) {
            var e = navigator.userAgent
        }
        var t = null;
        if (/iPad|iPod|iPhone/i.test(e)) {
            t = "iOS"
        } else if (/Android/i.test(e)) {
            t = "Android"
        } else if (/Macintosh/i.test(e)) {
            t = "Mac"
        } else if (/Windows/i.test(e)) {
            t = "Win"
        } else {
            t = "Unknown"
        }
        return t
    }, getBrand: function () {
        if (h5vSDK.hasValue(navigator)) {
            var e = navigator.userAgent
        }
        var t = null;
        if (/iPad|iPod|iPhone/i.test(e)) {
            t = "Apple"
        } else if (/HUAWEI|HONOR/i.test(e)) {
            t = "Huawei"
        } else if (/HM|RedMi|MI/i.test(e)) {
            t = "Xiaomi"
        } else if (/GT-|SM-|SCH-/i.test(e)) {
            t = "Samsung"
        } else if (/VIVO/i.test(e)) {
            t = "Vivo"
        } else if (/MX[45678]/i.test(e)) {
            t = "Meizu"
        } else if (/OPPO/i.test(e)) {
            t = "Oppo"
        } else if (/ASUS/i.test(e)) {
            t = "Asus"
        } else if (/HTC/i.test(e)) {
            t = "HTC"
        } else if (/Lenovo/i.test(e)) {
            t = "Lenovo"
        } else if (/MeituM/i.test(e)) {
            t = "Meitu"
        } else if (/ZTE/i.test(e)) {
            t = "ZTE"
        } else if (/NEXUS/i.test(e)) {
            t = "NEXUS"
        } else {
            t = "Unknown"
        }
        return t
    }, getNetType: function () {
        if (h5vSDK.hasValue(navigator)) {
            var e = navigator.userAgent
        }
        var t = null;
        if (/NetType/.test(e)) {
            t = e.match(/NetType\/(\S*)/)[1]
        }
        return t
    }, getUA: function () {
        if (h5vSDK.hasValue(navigator)) {
            var e = navigator.userAgent
        }
        return e
    }, getApp: function () {
        if (h5vSDK.hasValue(navigator)) {
            var e = navigator.userAgent
        }
        var t = null;
        if (/(MicroMessenger)/i.test(e)) {
            t = "WX"
        } else if (/(MiuiBrowser)/i.test(e)) {
            t = "MiuiBrowser"
        } else if (/(chrome)/i.test(e) || /(crios)/i.test(e)) {
            t = "Chrome"
        } else if (/(ucbrowser)/i.test(e)) {
            t = "UC"
        } else if (/(sogoumobileBrowser)/i.test(e)) {
            t = "Sogou"
        } else if (/(liebaofast)/i.test(e)) {
            t = "LieBao"
        } else if (/(MQQBrowser)/i.test(e)) {
            t = "QQ"
        } else if (/(safari)/i.test(e)) {
            t = "Safari"
        } else if (/(firefox)/i.test(e)) {
            t = "Firefox"
        } else {
            t = "Others"
        }
        return t
    }, genUUID: function (e, t) {
        var n = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
        var i = [], a;
        t = t || n.length;
        if (e) {
            for (a = 0; a < e; a++) i[a] = n[0 | Math.random() * t]
        } else {
            var r;
            i[8] = i[13] = i[18] = i[23] = "-";
            i[14] = "4";
            for (a = 0; a < 36; a++) {
                if (!i[a]) {
                    r = 0 | Math.random() * 16;
                    i[a] = n[a == 19 ? r & 3 | 8 : r]
                }
            }
        }
        return i.join("")
    }, getUID: function () {
        var e = h5vSDK.getConfig("h5vUID");
        if (h5vSDK.hasValue(e)) return e;
        e = h5vSDK.genUUID();
        h5vSDK.setConfig("h5vUID", e);
        return e
    }, GetQueryString: function (e) {
        var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
        var n = window.location.search.substr(1).match(t);
        if (n != null) return decodeURIComponent(n[2]);
        return null
    }, getWXID: function () {
        var e = new Object;
        var t = null;
        var n = h5vSDK.getConfig("wxid");
        if (h5vSDK.hasValue(n)) {
            e["openid"] = n;
            return {wx: e}
        } else {
            n = h5vSDK.GetQueryString("wxid");
            if (h5vSDK.hasValue(n)) {
                h5vSDK.setConfig("wxid", n);
                e["openid"] = n;
                t = h5vSDK.GetQueryString("h5vuid");
                return {wx: e, uid: t}
            } else {
                var i = "//www.sucaim.com/h5vcallback.php?h5vcb=" + encodeURIComponent(location.href);
                var a = encodeURIComponent(i);
                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=yoursappid&redirect_uri=" + a + "&response_type=code&scope=snsapi_base&state=#wechat_redirect"
            }
        }
    }, getWXUserInfo: function () {
        var user = new Object;
        var wxid = h5vSDK.getConfig("wxuser.wxid");
        var uid = null;
        if (h5vSDK.hasValue(wxid)) {
            user.openid = wxid;
            user.nickname = h5vSDK.getConfig("wxuser.nickname");
            user.sex = h5vSDK.getConfig("wxuser.sex");
            user.country = h5vSDK.getConfig("wxuser.country");
            user.province = h5vSDK.getConfig("wxuser.province");
            user.city = h5vSDK.getConfig("wxuser.city");
            user.headimgurl = h5vSDK.getConfig("wxuser.headimgurl");
            user.unionid = h5vSDK.getConfig("wxuser.unionid");
            return {wx: user}
        } else {
            var struser = h5vSDK.GetQueryString("userinfo");
            var user = eval("(" + decodeURIComponent(struser) + ")");
            if (h5vSDK.hasValue(user)) {
                h5vSDK.setConfig("wxuser.wxid", user.openid);
                h5vSDK.setConfig("wxuser.nickname", user.nickname);
                h5vSDK.setConfig("wxuser.sex", user.sex);
                h5vSDK.setConfig("wxuser.country", user.country);
                h5vSDK.setConfig("wxuser.province", user.province);
                h5vSDK.setConfig("wxuser.city", user.city);
                h5vSDK.setConfig("wxuser.headimgurl", user.headimgurl);
                h5vSDK.setConfig("wxuser.unionid", user.unionid);
                uid = h5vSDK.GetQueryString("h5vuid");
                return {wx: user, uid: uid}
            } else {
                var callback = "//www.sucaim.com/h5vcallback.php?h5vcb=" + encodeURIComponent(location.href);
                var encodeurl = encodeURIComponent(callback);
                location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=yoursappid&redirect_uri=" + encodeurl + "&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect"
            }
        }
    }, getWXInfo: function (e) {
        if (e == "base") {
            return h5vSDK.getWXID()
        } else if (e == "userinfo") {
            return h5vSDK.getWXUserInfo()
        } else {
            return {wx: null}
        }
    }, getShareUrl: function (e) {
        if (!h5vSDK.hasValue(h5vSDK.data.userinfo.uid) || !h5vSDK.hasValue(h5vSDK.data.targetinfo.sl)) {
            h5vSDK.initCollectData()
        }
        if (!h5vSDK.hasValue(e)) e = location.href;
        if (h5vSDK.hasValue(h5vSDK.data.userinfo.uid)) {
            e = e.replace(new RegExp("suid=[^&]*&?"), "").replace(/(&*$)/g, "");
            e = e.replace(new RegExp("sl=[^&]*&?"), "").replace(/(&*$)/g, "");
            e = e.replace(new RegExp("userinfo=[^&]*&?"), "").replace(/(&*$)/g, "");
            e = e.replace(new RegExp("wxid=[^&]*&?"), "").replace(/(&*$)/g, "");
            if (e[e.length - 1] == "?") e = e.substr(0, e.length - 1);
            e = e + (e.indexOf("?") != -1 ? "&" : "?") + "suid=" + h5vSDK.data.userinfo.uid + "&sl=" + h5vSDK.data.targetinfo.sl;
            return e
        } else {
            return e
        }
    }, share: function (e) {
        h5vSDK.event("share_" + e, true)
    }, generateSend: function () {
        var e = h5vSDK.data;
        h5vSDK.data = {
            sid: h5vSDK.data.sid,
            userinfo: {uid: h5vSDK.data.userinfo.uid},
            targetinfo: {tid: h5vSDK.data.targetinfo.tid, cid: h5vSDK.data.targetinfo.cid}
        };
        return base64Encode(JSON.stringify(e))
    }, sendData: function () {
        h5vSDK.isUploading = true;
        var e = h5vSDK.generateSend();
        var t = "//www.sucaim.com/udata.php?" + e;
        var n = document.createElement("script");
        n.type = "text/javascript";
        n.src = t;
        n.onload = function () {
            h5vSDK.isUploading = false
        };
        n.onerror = function () {
            h5vSDK.isUploading = false
        };
        document.body.appendChild(n)
    }, trySendData: function () {
        if (h5vSDK.isUploading) {
            setTimeout("h5vSDK.trySendData()", 5e3);
            return
        } else {
            h5vSDK.sendData()
        }
    }, collectTarget: function (e) {
        if (e == null) e = h5vSDK.parseURLParam(document.getElementById("h5vSDK").src);
        var t = h5vSDK.parseURLParam(window.location.href);
        var n = new Object;
        var i = null;
        n.url = window.location.href;
        var a = n.url.indexOf("?");
        if (h5vSDK.hasValue(e["tid"])) {
            n.tid = e["tid"]
        } else {
            n.tid = a != -1 ? n.url.substring(0, a) : n.url
        }
        if (h5vSDK.hasValue(t["suid"])) {
            n.suid = t["suid"];
            if (h5vSDK.hasValue(t["sl"])) {
                n.sl = parseInt(t["sl"]) + 1
            } else {
                n.sl = 1
            }
        } else {
            n.sl = 0
        }
        if (h5vSDK.hasValue(t["cid"])) n.cid = t["cid"];
        if (h5vSDK.hasValue(t["from"]) && h5vSDK.hasValue(t["isappinstalled"])) {
            n.wxfrom = t["from"]
        }
        n.referrer = document.referrer;
        n.title = document.title;
        if (document.getElementsByTagName("meta")["Keywords"] != null) n.keyword = document.getElementsByTagName("meta")["Keywords"].content;
        return n
    }, collectUser: function (e) {
        if (e == null) e = h5vSDK.parseURLParam(document.getElementById("h5vSDK").src);
        var t = new Object;
        t.os = h5vSDK.getOS();
        t.app = h5vSDK.getApp();
        t.nettype = h5vSDK.getNetType();
        t.screen = window.screen.width + "*" + window.screen.height;
        t.brand = h5vSDK.getBrand();
        t.extInfos = new Object;
        h5vSDK.wx_ext_mode = e["wx_ext"];
        var n = h5vSDK.getWXInfo(h5vSDK.wx_ext_mode);
        t.extInfos["wx"] = n.wx;
        if (h5vSDK.hasValue(n.uid)) {
            t.uid = n.uid;
            h5vSDK.setConfig("h5vUID", t.uid)
        } else {
            t.uid = h5vSDK.getUID()
        }
        return t
    }, initCollectData: function () {
        var e = h5vSDK.parseURLParam(document.getElementById("h5vSDK").src);
        h5vSDK.data.sid = e["sid"];
        h5vSDK.data.userinfo = h5vSDK.collectUser(e);
        h5vSDK.data.targetinfo = h5vSDK.collectTarget(e)
    }, init: function () {
        h5vSDK.initConfig();
        h5vSDK.initCollectData();
        setTimeout(function () {
            h5vSDK.event("PV", true)
        }, 100)
    }
};
h5vSDK.initf = h5vSDK.init();