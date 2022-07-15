$(document).ready(function(){
    $(".meta").animate({top:'0px'});
    $(".reade_more").animate({top:'0px'});

    $("#test-editormd-view").animate({top:'0px'});
    $(".nearby").animate({top:'0px'});

    $(".socolor").click(function(){
        $("div.c").toggle();
    });
    var fixHeigh = document.getElementById("header").offsetHeight;
    window.onscroll = function(){
        if (document.documentElement.scrollTop > fixHeigh||document.body.scrollTop> fixHeigh){
            $(".back2top").show(); 
            $(".fixed").show();
            $(".placard").hide();             
        }
        else{
            $(".back2top").hide();
            $(".fixed").hide(); 
            $(".placard").show();
        }
    };
    $(".back2top").click(function(){
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
    });

    
    $("li.undefined").click(function(){
        localStorage.removeItem('color_style');
        $('.color-style').remove();
        if(localStorage.color_style) $('head').append("<style class='color-style'>" + localStorage.color_style + "</style>");
    });
    $("li.sepia").click(function(){
        localStorage.setItem("color_style", ".nearby{box-shadow: 0 1px 0 #b38a60,0 -1px 0 #b38a60;}.nearby div.aligntop a:hover,.content-foot a:hover,.nearby div.alignbottom a:hover{color:#704214}.editormd-html-preview{background:#f3eacb;color:#704214}.markdown-body a {color:#b38a60}.markdown-body a:hover {color:#704214}.menu .menu-item a.current-menu-item {color:#704214;}.article-title h2:hover{color:#361e07}.fixed{box-shadow:0 2px 3px #a98c511a}body,.fullname,.article-title,.fixed-title,.fixed, h2,.content-foot{background:#f3eacb;color:#704214}.menu .menu-item a:hover{color:#704214}.menu .menu-item a,a{color: #b38a60; }.menu .menu-item a:after{background: #b38a60;}.placard,.content-foot a,footer .time,.fixed-menus .menu .menu-item{color:#a98c51}.infos:before,.infos:after{background: #eae0be;}span.page-numbers,a.page-numbers{box-shadow: 0 0 0 1px #a98c51 inset;background:#f3eacb;color:#a98c51;}span.current,a.page-numbers:hover{background: #704214;color:white}")
        $('.color-style').remove();
        if(localStorage.color_style) $('head').append("<style class='color-style'>" + localStorage.color_style + "</style>");
    });
    $("li.night").click(function(){
        localStorage.setItem("color_style", ".editormd-html-preview{background:#1c1f2b;color:#bdcadb}.nearby{box-shadow: 0 1px 0 #393f56,0 -1px 0 #393f56;}.nearby div.aligntop a:hover,.content-foot a:hover,.nearby div.alignbottom a:hover{color:#bdcadb}.markdown-body a {color:#666e8e}.markdown-body a:hover {color:#bdcadb}.menu .menu-item a.current-menu-item {color:#bdcadb;}.article-title h2:hover{color:white}.fixed{box-shadow:0 2px 3px rgba(0,0,0,0.2)}body,.fullname,.article-title,.fixed-title,.fixed, h2,.content-foot{background:#1c1f2b;color:#bdcadb}.menu .menu-item a:hover{color:#bdcadb}.menu .menu-item a,a{color: #666e8e; }.menu .menu-item a:after{background: #666e8e;}.placard,.content-foot a,footer .time,.fixed-menus .menu .menu-item{color:#666e8e}.infos:before,.infos:after{background: #393f56;}span.page-numbers,a.page-numbers{box-shadow:none;background:#393f56;color:#bdcadb;}span.current,a.page-numbers:hover{background: #666e8e;color:#bdcadb;}.setting_tool a,.setting_tool div{background: #393f56;color: #bdcadb}")
        $('.color-style').remove();
        if(localStorage.color_style) $('head').append("<style class='color-style'>" + localStorage.color_style + "</style>");
    });
    $("li.serif").click(function(){
        localStorage.setItem("font_style","body{font-family:serif;}.markdown-body{font-family:serif;}")
        $('.font-style').remove();
        if(localStorage.font_style) $('head').append("<style class='font-style'>" + localStorage.font_style + "</style>");
    });
    $("li.sans").click(function(){
        localStorage.removeItem('font_style');
        $('.font-style').remove();
        if(localStorage.font_style) $('head').append("<style class='font-style'>" + localStorage.font_style + "</style>");
    });
});