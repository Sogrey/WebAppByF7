/***
 * Cookie 操作
 @ Editor       Sogrey
 @ version      1.0.0
 @ DependOn     jQuery
 @ Date         2017-08-15
 ***/
(function(window) {

	var sogreyCookie = SogreyCookie = {
		editor: 'Sogrey',
		version: '1.0.0',
		date: '2017-08-15',
		helpName: "SogreyCookie APIs",
		help: function() {
			if(typeof(SogreyCommon) == "undefined") return "[404] I'm sorry! jquery-sogrey-common.js was not found！";
			return SogreyCommon._h(apiData);
		}
	}

	function log(object) {
		if(typeof(SogreyCommon) == "undefined") console.log(object);
		else SogreyCommon.log(object);
	}

	function error(object) {
		if(typeof(SogreyCommon) == "undefined") console.error(object);
		else SogreyCommon.error(object);
	}
	//设置 cookie
	SogreyCookie.setCookie = function(key, value) {
		var Days = 30;
		var exp = new Date();
		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
		document.cookie = key + "=" + value + ";expires=" + exp.toGMTString();
	}
	//设置 多个cookie,keys和values分别是“|”分隔额字符串，例如key：id|name ;对应value：1|李雷
	SogreyCookie.setCookies = function(keys, values) {
		var keyArray = new Array();
		var valueArray = new Array();
		keyArray = keys.split("|");
		valueArray = values.split("|");
		if(keyArray.length != valueArray.length) {
			error("设置cookie的key与value个数不匹配")
			return
		}

		for(var i = 0; i < keyArray.length; i++) {
			SogreyCookie.setCookie(keyArray[i], escape(valueArray[i]))
		}
	}
	//读取cookie
	SogreyCookie.getCookie = function(key) {
		var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
		if(arr = document.cookie.match(reg))
			return unescape(arr[2]);
		else
			return null;
	}
	//删除cookie
	SogreyCookie.delCookie = function(key) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = SogreyCookie.getCookie(key);
		if(cval != null)
			document.cookie = key + "=" + cval + ";expires=" + exp.toGMTString();
	}
	var apiData = {
		title: SogreyCookie.helpName,
		version: SogreyCookie.version,
		jqueryVersion: null,
		otherRelyOn: [{
			name: "jquery-sogrey-common.js",
			version: "1.0.0"
			//SogreyCommon.version
		}], //其他依赖项
		field: [
			/*{
						fieldName: "isDebug",
						type: "boolean",
						desc: "true输出日志，false则不"
					}*/
		],
		functions: [{
				funName: "log(object)",
				desc: "log日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			},
			{
				funName: "error(object)",
				desc: "error日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			},
			{
				funName: "SogreyCookie.setCookie(key, value)",
				desc: "设置cookie",
				params: [{
					paramName: "key",
					desc: "cookie 的key"
				}, {
					paramName: "value",
					desc: "cookie 的值"
				}]
			},
			{
				funName: "SogreyCookie.setCookies(keys, values)",
				desc: "设置多个cookie",
				params: [{
					paramName: "keys",
					desc: "cookie 的key ,多个key以“|”分隔，例如key：id|name"
				}, {
					paramName: "values",
					desc: "cookie 的值 ,多个值以“|”分隔,且个数与key须一致，例如对应前面keys 对应value：1|李雷"
				}]
			},
			{
				funName: "SogreyCookie.getCookie(key)",
				desc: "读取cookie，不存在则返回null",
				params: [{
					paramName: "key",
					desc: "cookie 的key"
				}]
			},
			{
				funName: "SogreyCookie.getCookie(key)",
				desc: "删除cookie",
				params: [{
					paramName: "key",
					desc: "cookie 的key"
				}]
			}
		]
	}
	window.sogreyCookie = window.SogreyCookie = SogreyCookie;
})(window);