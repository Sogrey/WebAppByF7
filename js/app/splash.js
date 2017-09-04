//var myApp = new Framework7();
//
//var $$ = Dom7;
//
//$$('.open-login-screen').on('click', function() {
//	myApp.loginScreen();
//});
//$(document).on('click', '.goto-login', function() {
//	myApp.showPreloader('正在登录...')
////	showPreloader('正在登录...')
//	setTimeout(function() {
////		hidePreloader();
////		myApp.showPreloader('登录成功，正在跳转...')
//		Toast('登录成功，正在跳转...', 2345, 'success top');
//		setTimeout(function() {
//			window.location.href = "index.html"
//		}, 1000);
//	}, 2000);
//});
//$(document).ready(function(){
//SogreyCookie.setCookies("id|name","001|Sogrey")
//});

//////////////////////////////////////new 

/*jslint browser: true*/
/*global console, Framework7, angular, Dom7*/

var myapp = myapp || {};

myapp.init = (function() {
	'use strict';

	var exports = {};

	document.addEventListener("DOMContentLoaded", function(event) {
		// Initialize app
		var fw7App = new Framework7(),
			fw7ViewOptions = {
				dynamicNavbar: true,
				domCache: true
			},
			mainView = fw7App.addView('.view-main', fw7ViewOptions),
			$$ = Dom7;
		SogreyWebsql.queryCallback("keyValue", "key=?", "isLogin", function(rows) {
			if(rows.length > 0 && rows.item(0).value == "1") {
				//第二次打开
				$(".div_loginbtn input.button").attr("disabled", "disabled")
				$(".div_loginbtn input.button").val("正在登录...")
				setTimeout(function() {
					window.location.href = "index.html"
				}, 1000);
			} else {
				//第一次打开app
				var ipc = new myapp.pages.IndexPageController(fw7App, $$);
			}
		})

		$$('.open-login-screen').on('click', function() {
			fw7App.loginScreen();
		});
		$(document).on('click', '.goto-login', function() {
			fw7App.showPreloader('正在登录...')
			//	showPreloader('正在登录...')
			setTimeout(function() {
				//		hidePreloader();
				//		fw7App.showPreloader('登录成功，正在跳转...')
				Toast('登录成功，正在跳转...', 2345, 'success top');
				setTimeout(function() {
					window.location.href = "index.html"
				}, 1000);
			}, 2000);
		});
	});
	return exports;
}());