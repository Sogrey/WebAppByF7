var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;
if(isAndroid || isIos) {
	$("body").css("max-width", "100%")
}

/**获取参数*/
Request = {
	GetQueryString: function(item) {
		var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
		return svalue ? svalue[1] : '';
	}
}
/**loading*/
function showPreloader(msg) {
	var htmlLoadWin = "<div class=\"floatLoadingWinContent\">\
                                <link href=\"css/animation.css\" rel=\"stylesheet\" />\
                                <style>\
                                    .floatLoadingWin { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); color: #fff; font-size: 0.8rem; text-align: center;z-index: 99999; }\
                            .loadingBox { position: relative; top: 50%; margin-top: -35px; width: 50%; left: 25%; }\
                            .svg_icon { animation: myfirst 4s linear infinite; -moz-animation: myfirst 4s linear infinite; -webkit-animation: myfirst 4s linear infinite; -o-animation: myfirst 4s linear infinite; }\
                            </style>\
                            <div class=\"floatLoadingWin\">\
                                <div class=\"loadingBox\">\
                                    <div>\
                                        <div class=\"svg_icon\">\
                                            <svg t=\"1498099237011\" class=\"icon\" style=\"\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1001\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"48\" height=\"48\">\
                                                <defs>\
                                                    <style type=\"text/css\"></style>\
                                                </defs><path d=\"M843.307 742.24c0 3.217 2.607 5.824 5.824 5.824s5.824-2.607 5.824-5.824a5.823 5.823 0 0 0-5.824-5.824 5.823 5.823 0 0 0-5.824 5.824zM714.731 874.912c0 6.398 5.186 11.584 11.584 11.584s11.584-5.186 11.584-11.584-5.186-11.584-11.584-11.584-11.584 5.186-11.584 11.584zM541.419 943.2c0 9.614 7.794 17.408 17.408 17.408s17.408-7.794 17.408-17.408-7.794-17.408-17.408-17.408-17.408 7.794-17.408 17.408z m-186.56-9.152c0 12.795 10.373 23.168 23.168 23.168s23.168-10.373 23.168-23.168-10.373-23.168-23.168-23.168-23.168 10.373-23.168 23.168zM189.355 849.12c0 16.012 12.98 28.992 28.992 28.992s28.992-12.98 28.992-28.992-12.98-28.992-28.992-28.992-28.992 12.98-28.992 28.992zM74.731 704.736c0 19.228 15.588 34.816 34.816 34.816s34.816-15.588 34.816-34.816-15.588-34.816-34.816-34.816-34.816 15.588-34.816 34.816z m-43.008-177.28c0 22.41 18.166 40.576 40.576 40.576s40.576-18.166 40.576-40.576-18.166-40.576-40.576-40.576-40.576 18.166-40.576 40.576z m35.392-176.128c0 25.626 20.774 46.4 46.4 46.4s46.4-20.774 46.4-46.4c0-25.626-20.774-46.4-46.4-46.4-25.626 0-46.4 20.774-46.4 46.4z m106.176-142.016c0 28.843 23.381 52.224 52.224 52.224s52.224-23.381 52.224-52.224c0-28.843-23.381-52.224-52.224-52.224-28.843 0-52.224 23.381-52.224 52.224z m155.904-81.344c0 32.024 25.96 57.984 57.984 57.984s57.984-25.96 57.984-57.984-25.96-57.984-57.984-57.984-57.984 25.96-57.984 57.984z m175.104-5.056c0 35.24 28.568 63.808 63.808 63.808s63.808-28.568 63.808-63.808c0-35.24-28.568-63.808-63.808-63.808-35.24 0-63.808 28.568-63.808 63.808z m160.32 72.128c0 38.421 31.147 69.568 69.568 69.568s69.568-31.147 69.568-69.568-31.147-69.568-69.568-69.568-69.568 31.147-69.568 69.568z m113.92 135.488c0 41.638 33.754 75.392 75.392 75.392s75.392-33.754 75.392-75.392-33.754-75.392-75.392-75.392-75.392 33.754-75.392 75.392z m45.312 175.488c0 44.854 36.362 81.216 81.216 81.216s81.216-36.362 81.216-81.216c0-44.854-36.362-81.216-81.216-81.216-44.854 0-81.216 36.362-81.216 81.216z\" p-id=\"1002\" fill=\"#ffffff\"></path></svg></div>\
                                    </div>\
                                    <div><span>" + msg + "</span></div>\
                                </div>\
                            </div>\
                        </div>"

	jQuery("body").append(htmlLoadWin)
}
/**隐藏*/
function hidePreloader() {
	jQuery(".floatLoadingWinContent").remove()
}

function Toast(msg) {
	Toast(msg, 1000)
}
//自定义弹框
function Toast(msg, duration) {
	duration = isNaN(duration) ? 3000 : duration;
	var m = document.createElement('div');
	m.innerHTML = msg;
	m.style.cssText = "width: 60%;min-width: 150px;margin: auto;max-width: 384px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: absolute;top: 40%;left: 50%;margin-left: -30%; z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
	document.body.appendChild(m);
	setTimeout(function() {
		var d = 0.5;
		m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
		m.style.opacity = '0';
		setTimeout(function() {
			document.body.removeChild(m)
		}, d * 1000);
	}, duration);
}
//引入第三方js,path是第三方js路径
function include(path) {
	include(path, null)
}

function include(path, data) {
	var a = document.createElement("script");
	a.type = "text/javascript";
	a.src = path;
	if(data != null)
		a.id = data;
	var body = document.getElementsByTagName("body")[0];
	$("body").find("script[src='" + path + "']").remove()
	body.appendChild(a);
}

function removeJs(path) {
	$("body").find("script[src='" + path + "']").remove()
}

//传参  class = ParamsData 数据  id = 数据(key=value)
function sendParams(url) {
	var a = document.createElement("script");
	a.type = "text/javascript";
	$(a).addClass("ParamsData")
	a.id = url;
	var body = document.getElementsByTagName("body")[0];
	$("body").find("script.ParamsData").remove()
	body.appendChild(a);
}

function includeCss(path) {

	var link = document.createElement('link');
	link.href = path;
	link.rel = 'stylesheet';
	link.type = 'text/css';

	var head = document.getElementsByTagName("head")[0];
	head.appendChild(link);
}
//判断当前字符串是否以str开始 先判断是否存在function是避免和js原生方法冲突，自定义方法的效率不如原生的高
if(typeof String.prototype.startsWith != 'function') {
	String.prototype.startsWith = function(str) {
		return this.slice(0, str.length) == str;
	};
}
//判断当前字符串是否以str结束
if(typeof String.prototype.endsWith != 'function') {
	String.prototype.endsWith = function(str) {
		return this.slice(-str.length) == str;
	};
}

function plusReady() {

	// 隐藏滚动条
	plus.webview.currentWebview().setStyle({
		scrollIndicator: 'none'
	});
	// Android处理返回键
	plus.key.addEventListener('backbutton', function() {
		if($(".modal-overlay.modal-overlay-visible + .popover").length > 0 ||
			$(".popover + .modal-overlay.modal-overlay-visible").length > 0) { //popover
			$(".modal-overlay-visible").click()
		} else if($(".popup:visible").length > 0) { //弹窗popup
			$(".popup:visible .navbar .navbar-on-center .left a span").click()
		} else if($(".view.active").find(".navbar .navbar-on-center .left a span").length > 0) { //当前view 一般只有一个
			$(".view.active").find(".navbar .navbar-on-center .left a span").click()
		} else {
			var url = window.location.href;
			if(url.endsWith("index.html") || url.endsWith("splash.html") || url.endsWith("guide.html")) {
				if(confirm('确认要退出程序？', '退出')) {
					plus.runtime.quit();
				}
			} else {
				history.go(-1)
			}

		}
	}, false);

	//获取原始窗口的高度
	var originalHeight = document.documentElement.clientHeight || document.body.clientHeight;

	window.onresize = function() {

		//软键盘弹起与隐藏  都会引起窗口的高度发生变化
		var resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;

		if(resizeHeight * 1 < originalHeight * 1) { //resizeHeight<originalHeight证明窗口被挤压了

			plus.webview.currentWebview().setStyle({
				height: originalHeight
			});

		}
	}

	//	compatibleAdjust();
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}

///http://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/114