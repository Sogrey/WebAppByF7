/***
 @ Editor       Sogrey
 @ version      1.0.0
 @ DependOn     jQuery
 @ Date         2017-08-15
 ***/
(function(window, $) {

	var $ = $ ? $ : jQuery;
	var isDebug = true;

	var sogreyCommon = SogreyCommon = {
		editor: 'Sogrey',
		version: '1.0.0',
		date: '2017-08-15',
		jQueryVersion: $.fn.jquery,
		helpName: "SogreyCommon APIs",
		help: function() {
			return SogreyCommon._h(apiData);
		}
	}
	try {
		window.console && window.console.log && (console.log("欢迎使用\n"), console.log("获取帮助,键入  %c SogreyXXX.help()  其中SogreyXXX是你要查看的js全局变量名", "color:red"))
	} catch(e) {}

	//js插件版本信息、字段、方法api帮助信息展示
	SogreyCommon._h = function(apiData) {
		var helpStr = apiData.title + "\n版本号：" + apiData.version + "\n";
		helpStr += apiData.jqueryVersion == null ? "" : "依赖jquery版本：" + apiData.jqueryVersion + "\n";
		helpStr += "\n其他依赖JS：\n";
		if(apiData.otherRelyOn && apiData.otherRelyOn.length > 0) {
			for(var i = 0; i < apiData.otherRelyOn.length; i++) {
				helpStr += "[" + (i + 1) + "]" + apiData.otherRelyOn[i].name + "  版本号：" + apiData.otherRelyOn[i].version + "\n";
			}
		} else {
			helpStr += "    暂无其他依赖。\n";
		}

		helpStr += "\n成员变量:\n\n";
		if(apiData.field && apiData.field.length > 0) {
			for(var i = 0; i < apiData.field.length; i++) {
				helpStr += "[" + (i + 1) + "] " + apiData.field[i].fieldName + " - " + apiData.field[i].type + " ; " + apiData.field[i].desc + "\n";
			}
		} else {
			helpStr += "    暂无成员变量。\n\n";
		}

		helpStr += "\n成员函数:\n\n"
		helpStr += getFunctions(apiData.functions, helpStr)
		return helpStr;
	}

	function getFunctions(functions) {
		var helpStr = "";
		if(functions && functions.length > 0) {
			for(var i = 0; i < functions.length; i++) {
				if(functions[i].isObject) {
					helpStr += "\n【" + functions[i].funName + "】 - " + functions[i].desc + "\n";
					helpStr += getFunctions(functions[i].functions, helpStr)
				} else {
					var params = "无";
					if(functions[i].params.length > 0) {
						params = "";
						for(var j = 0; j < functions[i].params.length; j++) {
							params += functions[i].params[j].paramName + "-" + functions[i].params[j].desc;
							if(j < functions[i].params.length - 1) params += ",";
						}
					}
					helpStr += "[" + (i + 1) + "] " + functions[i].funName + " - " + functions[i].desc + ";  参数：" + params + "\n";
				}
			}
		} else {
			helpStr += "    暂无成员函数。\n\n";
		}
		return helpStr
	}
	// 去除字符串的首尾的空格
	SogreyCommon.trim = function(str) {
		return str.replace(/(^\s*)|(\s*$)/g, "");
	}
	//判断字符串是否为空，返回true说明为空
	SogreyCommon.isEmpty = function(s) {
		return SogreyCommon.JTrim(s) == "";
	}
	//log 日志输出
	SogreyCommon.log = function(str) {
		if(isDebug)
			console.log(str)
	}
	//错误 日志输出
	SogreyCommon.error = function(str) {
		if(isDebug)
			console.error(str)
	}
	//吐司，默认1s
	SogreyCommon.toast = function(msg) {
		SogreyCommon.toastWidthDuration(msg, 1000)
	}
	//吐司
	SogreyCommon.toastWidthDuration = function(msg, duration) {
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

	/**获取参数*/
	SogreyCommon.GetQueryString = function(key, defaultValue) {
		var svalue = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
		return svalue ? svalue[1] : defaultValue;
	}
	SogreyCommon.GetQueryStringByUrl = function(url, key, defaultValue) {
		var svalue = url.match(new RegExp("[\?\&]" + key + "=([^\&]*)(\&?)", "i"));
		return svalue ? svalue[1] : defaultValue;
	}
	//比较两个日期大小. 例：2014-10-24(yyyy-MM-dd) ;前者大于后者返回true 否则返回false
	SogreyCommon.dateCompare = function(startDate, endDate) {
		var aStart = startDate.split('-'); //转成成数组，分别为年，月，日，下同  
		var aEnd = endDate.split('-');
		var startDateTemp = aStart[0] + "/" + aStart[1] + "/" + aStart[2];
		var endDateTemp = aEnd[0] + "/" + aEnd[1] + "/" + aEnd[2];
		if(startDateTemp > endDateTemp)
			return true;
		else
			return false;
	}
	//计算两个日期之间的天数  
	SogreyCommon.dateDiff = function(date1, date2) {
		var type1 = typeof date1,
			type2 = typeof date2;
		if(type1 == 'string')
			date1 = SogreyCommon.stringToTime(date1);
		else if(date1.getTime)
			date1 = date1.getTime();
		if(type2 == 'string')
			date2 = SogreyCommon.stringToTime(date2);
		else if(date2.getTime)
			date2 = date2.getTime();
		return(date2 - date1) / 1000 / 60 / 60 / 24; //除1000是毫秒，不加是秒   
	}
	//字符串转成Time(dateDiff)所需方法    (yyyy-MM-dd HH:mm:ss)
	SogreyCommon.stringToTime = function(string) {
		var f = string.split(' ', 2);
		var d = (f[0] ? f[0] : '').split('-', 3);
		var t = (f[1] ? f[1] : '').split(':', 3);
		return(new Date(
			parseInt(d[0], 10) || null,
			(parseInt(d[1], 10) || 1) - 1,
			parseInt(d[2], 10) || null,
			parseInt(t[0], 10) || null,
			parseInt(t[1], 10) || null,
			parseInt(t[2], 10) || null)).getTime();
	}
	//显示当前系统日期（跑起来的时间） 例：2014年10月26日17:8:57   星期天
	SogreyCommon.showtime = function() {
		// 获取当前时间对象  
		var day = new Date();
		var yeas = day.getFullYear(); // 获取年份  
		var month = day.getMonth(); // 获取月份，值在0--11之间  
		var days = day.getDate(); // 获取每个月的第几天  
		var hours = day.getHours(); // 获取当前的小时  
		var minutes = day.getMinutes(); // 获取当前的分钟  
		var seconds = day.getSeconds(); // 获取当前的时间秒  
		var week = day.getDay(); // 获取当前的星期值在0--6之间  
		// alert(week);  
		var weeks = null;
		if(week == 1) {
			weeks = "星期一";
		} else if(week == 2) {
			weeks = "星期二";
		} else if(week == 3) {
			weeks = "星期三";
		} else if(week == 4) {
			weeks = "星期四";
		} else if(week == 5) {
			weeks = "星期五";
		} else if(week == 6) {
			weeks = "星期六";
		} else if(week == 0) { // 0代表的是星期天  
			weeks = "星期天";
		}
		// 将日期显示在前台  
		return yeas + "年" + (month + 1) + "月" + days + "日" + hours + ":" + minutes + ":" + seconds + "\t\t\t" + weeks;
	}

	//格式化当前系统时间   例如 返回当前年月日格式为：2016-04-08而不是2016-4-8  new Date().format.("yyyy-MM-dd");  
	Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month   
			"d+": this.getDate(), //day   
			"h+": this.getHours(), //hour   
			"m+": this.getMinutes(), //minute   
			"s+": this.getSeconds(), //second   
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter   
			"S": this.getMilliseconds() //millisecond   
		}

		if(/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for(var k in o) {
			if(new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}

		return format;
	}
	//正则匹配
	SogreyCommon.pattern = {
		//是否匹配
		isMatched: function(pattern, str) {
			var result = str.match(pattern);
			if(result == null) return false;
			return true;
		}
	}

	var apiData = {
		title: SogreyCommon.helpName,
		version: SogreyCommon.version,
		jqueryVersion: SogreyCommon.jQueryVersion,
		otherRelyOn: [
			/*{
						name:"jquery-sogrey-common.js",
						version:"1.0.0"
					}*/
		], //其他依赖项
		field: [{
			fieldName: "isDebug",
			type: "boolean",
			desc: "true输出日志，false则不.正式发布时改为false"
		}],
		functions: [{
				funName: "SogreyCommon._h(apiData)",
				desc: "js插件版本信息、字段、方法api帮助信息展示，使用JS插件全局变量名+.help()方法调用即可查询该js信息，例如本js可使用  SogreyCommon.help() ，当然前提是js插件是按照固定的方式配置了api信息，外部js无需调用本方法",
				params: [{
					paramName: "apiData",
					desc: "api配置"
				}]
			}, {
				funName: "SogreyCommon.trim(s)",
				desc: "去除字符串的首尾的空格",
				params: [{
					paramName: "s",
					desc: "输入的字符串"
				}]
			},
			{
				funName: "SogreyCommon.isEmpty(s)",
				desc: "判断字符串是否为空，返回true说明为空",
				params: [{
					paramName: "s",
					desc: "输入的字符串"
				}]
			},
			{
				funName: "SogreyCommon.log(object)",
				desc: "log日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			},
			{
				funName: "SogreyCommon.error(object)",
				desc: "error日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			}, {
				funName: "SogreyCommon.toast(msg)",
				desc: "吐司Toast,默认持续一秒钟",
				params: [{
					paramName: "msg",
					desc: "要展示的信息文本"
				}]
			}, {
				funName: "SogreyCommon.toastWidthDuration(msg, duration)",
				desc: "吐司Toast",
				params: [{
					paramName: "msg",
					desc: "要展示的信息文本"
				}, {
					paramName: "duration",
					desc: "持续展示时间，单位豪秒"
				}]
			}, {
					funName: "SogreyCommon.pattern.isMatched(pattern, str)",
					desc: "正则表达式匹配   是否匹配",
					params: [{
						paramName: "pattern",
						desc: "匹配规则"
					}, {
						paramName: "str",
						desc: "要匹配的字符串"
					}]
			}, {
				funName: "SogreyCommon.GetQueryString(key,defaultValue)",
				desc: "获取当前页参数，地址栏地址?后面的 key=value,结果返回value",
				params: [{
					paramName: "key",
					desc: "参数名key"
				}, {
					paramName: "defaultValue",
					desc: "默认值"
				}]
			}, {
				funName: "SogreyCommon.GetQueryStringByUrl(url,key,defaultValue)",
				desc: "获取指url参数，地址栏地址?后面的 key=value,结果返回value",
				params: [{
					paramName: "url",
					desc: "目标url"
				}, {
					paramName: "key",
					desc: "参数名key"
				}, {
					paramName: "defaultValue",
					desc: "默认值"
				}]
			}, {
				funName: "SogreyCommon.dateCompare(startDate, endDate)",
				desc: "比较两个日期大小. 例：2014-10-24(yyyy-MM-dd) ;前者大于后者返回true 否则返回false",
				params: [{
					paramName: "startDate",
					desc: "日期一（yyyy-MM-dd）"
				}, {
					paramName: "endDate",
					desc: "日期二（yyyy-MM-dd）"
				}]
			}, {
				funName: "SogreyCommon.dateDiff(date1, date2)",
				desc: "计算两个日期之间的天数",
				params: [{
					paramName: "date1",
					desc: "日期一（yyyy-MM-dd HH:mm:ss）"
				}, {
					paramName: "date2",
					desc: "日期二（yyyy-MM-dd HH:mm:ss）"
				}]
			}, {
				funName: "SogreyCommon.stringToTime(string)",
				desc: "字符串转成Time(dateDiff)所需方法  ",
				params: [{
					paramName: "string",
					desc: "要转成time的日期时间字符串(yyyy-MM-dd HH:mm:ss)"
				}]
			}, {
				funName: "SogreyCommon.showtime()",
				desc: "显示当前系统日期（跑起来的时间） 例：2014年10月26日17:8:57   星期天 ",
				params: []
			}, {
				funName: "Date.format(format) ",
				desc: "格式化当前系统时间   例如 返回当前年月日格式为：2016-04-08而不是2016-4-8  使用：new Date().format('yyyy-MM-dd')",
				params: [{
					paramName: "format",
					desc: "要格式化成的格式"
				}]
			}

		]
	}

	window.sogreyCommon = window.SogreyCommon = SogreyCommon;
})(window, jQuery);