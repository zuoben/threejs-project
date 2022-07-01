# VR Stream Web Player (VR直播网页播放器)

## 项目介绍

1.利用VR场景作为背景,接入直播视频流,进行在VR场景内观看直播的网页播放器.

2.采用绿幕内容视频+全景背景视频+3D模型前景合成VR场景

3.支持cubemap全景视频与普通全景视频

## 说明博客
 [CSDN BLOG VR视频直播播放器][blog]

## 项目演示

[VR直播网页播放demo http://demo.kidlueng.com][demo] (可在PC/Android/iphone 利用chrome浏览器打开,ios/Android 利用微信也可体验)

PS.本demo地址非长期有效地址,如需演示体验,可联系作者

## 项目相关

本项目基于VR场景构造github项目 [WebVR Boilerplate][wb].

用 three.js 对VR场景进行构造,支持普通全景视频和 [facebook transform][fbtf] 转换 cubemap 视频.

利用 [hls.js][hls] 进行H5内播放直播视频.



## 直播源

本项目现利用 [panda.tv][pd] 获取直播源.调用了部分 [panda.tv][pd] 接口.如有侵权,请联系作者.

因为JS跨域问题,现利用nginx进行反向代理用于访问对应接口及直播源.

部分直播可能有问题.



## 适配平台

本项目可以适配手机,可以在Android/iphone手机的chrome浏览器上进行播放.

在PC端chrome可以流畅播放直播及背景视频. 



 

## nginx反向代理配置

    resolver 114.114.114.114;
    location ~* ^/u/(.*)$ {
        proxy_pass http://$1?$args;
    }
       

### 联系作者:Kid Lueng

 QQ交流群: 241587879(验证信息:VR直播) e-mail:100520140@qq.com

### VR WEB播放器定制

 如需要在本播放器基础上定制特定功能需求(有偿),可联系作者 Kid Lueng

## 相关项目

- [WebVR Boilerplate][wb]: https://github.com/borismus/webvr-boilerplate
- [facebook transform][fbtf]: https://github.com/facebook/transform
- [hls][hls]: https://github.com/dailymotion/hls.js
- [three.js][three.js]: https://threejs.org


[wb]: https://github.com/borismus/webvr-boilerplate
[fbtf]: https://github.com/facebook/transform
[hls]: https://github.com/dailymotion/hls.js
[three.js]: https://threejs.org
[pd]: http://panda.tv
[demo]:http://demo.kidlueng.com
[blog]:http://blog.csdn.net/langhaoben/article/details/70257019

## 鸣谢支持

@龙凤凤舞