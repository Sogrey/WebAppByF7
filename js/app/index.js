// Determine theme depending on device
var isAndroid = Framework7.prototype.device.android === true;
var isIos = Framework7.prototype.device.ios === true;

// Set Template7 global devices flags
Template7.global = {
	android: isAndroid,
	ios: isIos
};
if(isAndroid || isIos) {
	$("body").css("max-width", "100%")
}
// Initialize your app
var myApp = new Framework7({
	tapHold: true, //enable tap hold events
	fastClicks: true,
	animatePages: true,
	modalTitle: 'GL WebGL BIM Engine', //	Default title for modals (Alert, Confirm, Prompt)
	modalButtonOk: '确定', //	Default text for modal's "OK" button
	modalButtonCancel: '取消', //	Default text for modal's "Cancel" button
	modalPreloaderTitle: '加载中... ', //	Default text for preloader modal
	modalCloseByOutside: false, //	Enable/disable ability to close modal (Alert, Confirm, Prompt) by clicking outside of modal (on modal's overlay)
	actionsCloseByOutside: true, //	The same as previous but for Action Sheet modal
	popupCloseByOutside: true, //The same as previous but for Popup modal
	modalUsernamePlaceholder: '用户名', //	Place holder text for username input in Login Modal
	modalPasswordPlaceholder: '密码', //	Place holder text for password input in Login and Password Modals
	modalStack: true, //	This feature doesn't allow to open multiple modals at the same time, and will automatically open next modal when you close the current one. Such behavior is similar to browser native alerts

	smartSelectOpenIn: 'page', //	Specify default way of how Smart Select should be opened. Can be 'page', 'popup' or 'picker'
	smartSelectBackText: '返回', //	Default back link text for Smart Select's page navbar
	smartSelectPopupCloseText: '关闭', //	Default close link text for Smart Select's popup navbar
	smartSelectPickerCloseText: '完成', //	Default close link text for Smart Select's picker toolbar
	smartSelectSearchbar: false, //	Set to true if you want to enable Search Bar for all Smart Selects
	smartSelectBackOnSelect: false, //If enabled then smart select page will be automatically closed after user picks any option
	hideNavbarOnPageScroll: false, //Set to true and Navbar will be hidden automatically on page scroll down, and become visible on scroll up
	hideToolbarOnPageScroll: false, //Set to true and Toolbar will be hidden automatically on page scroll down, and become visible on scroll up
	hideTabbarOnPageScroll: false, //Set to true and Tab bar will be hidden automatically on page scroll down, and become visible on scroll up. Note that this is only for Tab Bar app layout, otherwise use hideToolbarOnPageScroll
	showBarsOnPageScrollEnd: true, //Set to true to show hidden Navbar and Toolbar when scrolling reaches end of the page
	showBarsOnPageScrollTop: true, //Set to false and bars will not become visible when you scroll page to top everytime. They will become visible only on the most top scroll position, in the beginning of the page
	scrollTopOnNavbarClick: false
});

// Export selectors engine
var $$ = Dom7;

// Add views
var view1 = myApp.addView('#view-1', {
	dynamicNavbar: true,
	domCache: true //enable inline pages
});
var view2 = myApp.addView('#view-2', {
	// Because we use fixed-through navbar we can enable dynamic navbar
	dynamicNavbar: true,
	domCache: false //enable inline pages
});
var view3 = myApp.addView('#view-3');
var view4 = myApp.addView('#view-4', {
	dynamicNavbar: true,
	domCache: false //enable inline pages
});
//view1.router.loadPage('./pages/activity/activityList.html');
function plusReady() {
	//http://www.html5plus.org/doc/zh_cn/navigator.html#plus.navigator.setStatusBarBackground
	plus.navigator.setStatusBarBackground('#0072F7');
	plus.screen.lockOrientation("portrait-primary");
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener('plusready', plusReady, false);
}
window.onload = function onload() {
	initIndex()
}
//myApp.onPageAfterAnimation("index-1", function(page) {
//	SogreyCommon.log("首页")
//	initIndex()
//});
//myApp.onPageInit("view-1", function(page){
//	initIndex()
//});
function initIndex() {
	var app = angular.module('view-1', []);
	app.controller('view1Controller', function($scope, $http) {
		$http.get("./json/index.json")
			.then(function(result) {
				SogreyCommon.log(result)
				if(result.data.result != 1) {
					myApp.alert('请求失败，请重试...', '请求异常');
					return;
				}
				$scope.project_name = result.data.data.project_name
				$scope.project_section = result.data.data.project_section
				$scope.organization = result.data.data.organization
				$scope.userInfo = result.data.data.userInfo
				$scope.hasTodo = !result.data.data.hasTodo
				$scope.todos = result.data.data.todos
				$scope.hasActivity = !result.data.data.hasActivity
				$scope.activitise = result.data.data.activitise
			});
	}); {
		option = {
			title: {
				text: '某站点用户访问来源',
				subtext: '纯属虚构',
				x: 'center'
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				orient: 'vertical',
				left: 'left',
				data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
			},
			series: [{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				center: ['50%', '60%'],
				data: [{
						value: 335,
						name: '直接访问'
					},
					{
						value: 310,
						name: '邮件营销'
					},
					{
						value: 234,
						name: '联盟广告'
					},
					{
						value: 135,
						name: '视频广告'
					},
					{
						value: 1548,
						name: '搜索引擎'
					}
				],
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				}
			}]
		};
		$("#bt").html("")
		var bt = echarts.init(document.getElementById('bt'));
		bt.setOption(option);
	} {
		var colors = ['#5793f3', '#d14a61', '#675bba'];

		option = {
			color: colors,

			tooltip: {
				trigger: 'none',
				axisPointer: {
					type: 'cross'
				}
			},
			legend: {
				data: ['2015 降水量', '2016 降水量']
			},
			grid: {
				top: 70,
				bottom: 50
			},
			xAxis: [{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						onZero: false,
						lineStyle: {
							color: colors[1]
						}
					},
					axisPointer: {
						label: {
							formatter: function(params) {
								return '降水量  ' + params.value +
									(params.seriesData.length ? '：' + params.seriesData[0].data : '');
							}
						}
					},
					data: ["2016-1", "2016-2", "2016-3", "2016-4", "2016-5", "2016-6", "2016-7", "2016-8", "2016-9", "2016-10", "2016-11", "2016-12"]
				},
				{
					type: 'category',
					axisTick: {
						alignWithLabel: true
					},
					axisLine: {
						onZero: false,
						lineStyle: {
							color: colors[0]
						}
					},
					axisPointer: {
						label: {
							formatter: function(params) {
								return '降水量  ' + params.value +
									(params.seriesData.length ? '：' + params.seriesData[0].data : '');
							}
						}
					},
					data: ["2015-1", "2015-2", "2015-3", "2015-4", "2015-5", "2015-6", "2015-7", "2015-8", "2015-9", "2015-10", "2015-11", "2015-12"]
				}
			],
			yAxis: [{
				type: 'value'
			}],
			series: [{
					name: '2015 降水量',
					type: 'line',
					xAxisIndex: 1,
					smooth: true,
					data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
				},
				{
					name: '2016 降水量',
					type: 'line',
					smooth: true,
					data: [3.9, 5.9, 11.1, 18.7, 48.3, 69.2, 231.6, 46.6, 55.4, 18.4, 10.3, 0.7]
				}
			]
		};
		$("#zxt").html("")
		var zxt = echarts.init(document.getElementById('zxt'));
		zxt.setOption(option);
	}
}

//活动列表
myApp.onPageAfterAnimation("activityList", function(page) {
	SogreyCommon.log("活动列表")
	sendParams(page.url)
	include("js/app/pages/index/activityList.js")
});
myApp.onPageBack("activityList", function(page) {
	SogreyCommon.log("退出活动列表")
	removeJs("js/app/pages/index/activityList.js")
});

//$$(document).on("pageInit", "#activityList", function(e, id, page) {
//	var pageData = e.detail.page;
//	sendParams(pageData.url)
//
//	//加载动态列表
//	$$.getJSON("./json/activityList.json", function(result) {
//		SogreyCommon.log("activityList data")
//		SogreyCommon.log(result)
//		$("#activityList ul").html("")
//		if(result.result == 1) { //请求成功
//			if(result.data.hasActivity) { //有数据
//				if(result.data.activitise.length > 0)
//					for(var i = 0; i < result.data.activitise.length; i++) {
//						SogreyCommon.log(result.data.activitise[i].id + ">>" + result.data.activitise[i].title)
//						var htmlLi = '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>' + result.data.activitise[i].title + '</div></div></a></li>';
//						$("#activityList ul").append(htmlLi)
//					}
//			} else {
//				Toast("暂无数据", 2345, 'success top');
//				$("#activityList ul").html('<li class="item-content"><a href="javascript:;"><div class="item-inner"><div class="item-title">暂无数据</div></div></a></li>')
//			}
//		} else { //请求失败
//			Toast(result.msg, 2345, 'success top');
//			$("#activityList ul").html('<li class="item-content"><a href="javascript:;"><div class="item-inner"><div class="item-title">' + result.msg + '</div></div></a></li>')
//		}
//
//		// Loading flag
//		var loading = false;
//		// Last loaded index
//		var lastIndex = $$('.list-block li').length;
//		// Max items to load
//		var maxItems = 60;
//		// Append items per load
//		var itemsPerLoad = 20;
//		// Attach 'infinite' event handler
//		$$('.infinite-scroll').on('infinite', function() {
//			// Exit, if loading in progress
//			if(loading) return;
//			// Set loading flag
//			loading = true;
//			// Emulate 1s loading
//			setTimeout(function() {
//				// Reset loading flag
//				loading = false;
//				if(lastIndex >= maxItems) {
//					// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
//					myApp.detachInfiniteScroll($$('.infinite-scroll'));
//					// Remove preloader
//					$$('.infinite-scroll-preloader').remove();
//					return;
//				}
//				// Generate new items HTML
//				var html = '';
//				for(var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
//					html += '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>新数据哦</div></div></a></li>';
//				}
//				// Append new items
//				$$('#activityList .list-block ul').append(html);
//				// Update last loaded index
//				lastIndex = $$('.list-block li').length;
//			}, 1000);
//		});
//
//		// Pull to refresh content
//		var ptrContent = $$('#activityList .pull-to-refresh-content');
//
//		// Add 'refresh' listener on it
//		ptrContent.on('refresh', function(e) {
//			// Emulate 2s loading
//			setTimeout(function() {
//				// List item html
//				var itemHTML = '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>下拉刷新的新数据哦</div></div></a></li>';
//				// Prepend new list element
//				ptrContent.find('ul').prepend(itemHTML);
//				// When loading done, we need to reset it
//				myApp.pullToRefreshDone();
//			}, 2000);
//		});
//	})
//})
//动态内容
myApp.onPageAfterAnimation("activityContent", function(page) {
	SogreyCommon.log("动态内容")
	sendParams(page.url)
	include("js/app/pages/index/activityContent.js")
});
myApp.onPageBack("activityContent", function(page) {
	SogreyCommon.log("退出动态内容")
	removeJs("js/app/pages/index/activityContent.js")
});
//$$(document).on("pageInit", "#activityContent", function(e, id, page) {
//	SogreyCommon.log("动态详情")
//	var pageData = e.detail.page;
//	sendParams(pageData.url)
//
//	//- Two groups
//	$$('.menuActivityContent').on('click', function() {
//		SogreyCommon.log("menuActivityContent click")
//		var buttons1 = [{
//				text: '点赞',
//				bold: true
//			},
//			{
//				text: '分享',
//				bold: true
//			},
//			{
//				text: '收藏',
//				bold: true
//			}
//		];
//		var buttons2 = [{
//			text: 'Cancel',
//			color: 'red'
//		}];
//		var groups = [buttons1, buttons2];
//		myApp.actions(groups);
//	});
//	//加载动态列表
//	$$.getJSON("./json/activityContent.json", function(result) {
//		SogreyCommon.log(result);
//		if(result.result == 1) {
//			SogreyCommon.log("动态的Id=" + result.data.activityId)
//			$("#activityContentBody").html(result.data.activityContent)
//		} else {
//			Toast(result.msg, 2345, 'success top');
//			$("#activityContentBody").html(result.msg);
//		}
//	})
//})
//进度计划
myApp.onPageAfterAnimation("scheduledPlans", function(page) {
	SogreyCommon.log("进度计划")
	sendParams(page.url)
	include("js/app/pages/apps/ScheduledMng/scheduledPlan.js")
});
myApp.onPageBack("scheduledPlans", function(page) {
	SogreyCommon.log("退出进度计划")
	removeJs("js/app/pages/apps/ScheduledMng/scheduledPlan.js")
});

//$$(document).on("pageInit", "#scheduledPlans", function(e, id, page) {
//	SogreyCommon.log("进度计划1")
//	var pageData = e.detail.page;
//	sendParams(pageData.url)
//
//	include("js/app/pages/apps/ScheduledMng/scheduledPlan.js")
//
//});
//填报历史
//$$(document).on("pageInit", "#sceduledPlanHistory", function(e, id, page) {
//	SogreyCommon.log("填报历史")
////	var pageData = e.detail.page;
////	sendParams(pageData.url)	
//});
//http://docs.framework7.cn/Index/page_callbacks.html
//myApp.onPageBeforeInit("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageBeforeInit")
//});
//myApp.onPageInit("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageInit")
//});
//myApp.onPageReinit("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageReinit")
//});
//myApp.onPageBeforeAnimation("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageBeforeAnimation")
//});
myApp.onPageAfterAnimation("sceduledPlanHistory", function(page) {
	SogreyCommon.log("填报历史")

	sendParams(page.url)
	include("js/app/pages/apps/ScheduledMng/scheduledPlanHistory.js")
});
//myApp.onPageBeforeRemove("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageBeforeRemove")
//});
myApp.onPageBack("sceduledPlanHistory", function(page) {
	SogreyCommon.log("退出填报历史")
	removeJs("js/app/pages/apps/ScheduledMng/scheduledPlanHistory.js")
});
//myApp.onPageAfterBack("sceduledPlanHistory", function(page){
//	SogreyCommon.log("sceduledPlanHistory>onPageAfterBack")
//});

//进度填报
myApp.onPageAfterAnimation("scheduledPlanEdit", function(page) {
	SogreyCommon.log("进度填报")
	sendParams(page.url)
	$(".views>.toolbar").hide()
	$("#scheduledPlanEdit .page-content").css("padding-bottom", "0px")

	include("js/plugins/RangeSlider/RangeSlider.js")
	includeCss("js/plugins/RangeSlider/RangeSlider.css")
	include("js/app/pages/apps/ScheduledMng/scheduledPlanEdit.js")
});
//		$$(document).on("pageInit", "#scheduledPlanEdit", function(e, id, page) {
//			SogreyCommon.log("进度填报")
//			var pageData = e.detail.page;
//			sendParams(pageData.url)
//			//	SogreyCommon.log(pageData.query)
//			$(".views>.toolbar").hide()
//			$("#scheduledPlanEdit .page-content").css("padding-bottom", "0px")
//
//			include("js/plugins/RangeSlider/RangeSlider.js")
//			includeCss("js/plugins/RangeSlider/RangeSlider.css")
//			include("js/app/pages/apps/ScheduledMng/scheduledPlanEdit.js")
//		});
myApp.onPageBack("scheduledPlanEdit", function(page) {
	SogreyCommon.log("退出进度填报")
	$(".views>.toolbar").show()

	removeJs("js/plugins/RangeSlider/RangeSlider.js")
	removeJs("js/app/pages/apps/ScheduledMng/scheduledPlanEdit.js")
});
//		$$(document).on("pageBack", "#scheduledPlanEdit", function(e, id, page) {
//			SogreyCommon.log("退出进度填报")
//			var pageData = e.detail.page;
//
//			$(".views>.toolbar").show()
//		});
//下载管理
myApp.onPageAfterAnimation("downloader", function(page) {
	SogreyCommon.log("下载管理")
	sendParams(page.url)
});
//		$$(document).on("pageInit", "#downloader", function(e, id, page) {
//			SogreyCommon.log("下载管理")
//			var pageData = e.detail.page;
//			sendParams(pageData.url)
//
//			//	include("js/app/pages/settings/downloader.js")
//
//		});

//活动列表
// 方式1：通过页面回调 (推荐):
//myApp.onPageInit('activityList', function(page) {
//	myApp.alert('"动态列表加载完毕!');
//	SogreyCommon.log("来到【活动列表界面】")
//	//	var appActivityList = angular.module('view-activityList', []);
//	//	SogreyCommon.log(appActivityList)
//	//	appActivityList.controller('activityListController', function($scope, $http) {
//	//		SogreyCommon.log("activityListController")
//	//		$http.get("../../json/activityList.json")
//	//			.then(function(result) {
//	//				SogreyCommon.log(result)
//	//				if(result.data.result != 1) {
//	//					myApp.alert('请求失败，请重试...', '请求异常');
//	//					return;
//	//				}
//	//				$scope.hasActivity = result.data.data.hasActivity
//	//				$scope.activitise = result.data.data.activitise
//	//			});
//	//	});
//	app.controller('activityListController', function($scope, $http) {
//		$http.get("./json/activityList.json")
//			.success(function(result) {
//				SogreyCommon.log(result)
//				SogreyCommon.log(result.data.hasActivity)
//				$scope.hasActivity1 = result.data.hasActivity
//				$scope.activitise1 = result.data.activitise
//			});
//	});
//
//	//	$$.getJSON("./json/activityList.json", function(result) {
//	//		SogreyCommon.log(result)
//	//		SogreyCommon.log(result.data.hasActivity)
//	//
//	//		//		var appActivityList = angular.module('view-activityList', []);
//	//		//		appActivityList.controller('activityListController', function($scope, $http) {
//	//		//			SogreyCommon.log(result.data.data.hasActivity)
//	//		//			$scope.hasActivity = result.data.data.hasActivity
//	//		//			$scope.activitise = result.data.data.activitise
//	//		//		})
//	//		//		SogreyCommon.log(appActivityList)
//	//		app.controller('activityListController', function($scope) {
//	//			SogreyCommon.log("activityListController")
//	//			SogreyCommon.log($scope)
//	//			$scope.hasActivity = result.data.hasActivity
//	//			$scope.activitise = result.data.activitise
//	//		});
//	//		//		app.directive("activityListController", function() {
//	//		//			SogreyCommon.log("XXXXX")
//	//		//			return {
//	//		//				hasActivity : result.data.data.hasActivity,
//	//		//				activitise :result.data.data.activitise
//	//		//			}
//	//		////			$scope.hasActivity = result.data.data.hasActivity
//	//		////			$scope.activitise = result.data.data.activitise
//	//		//		});
//	//	});
//
//});

//http://framework7.taobao.org/tutorials/maintain-both-ios-and-material-themes-in-single-app.html#.WR_ldtx96Cg

//// Determine theme depending on device
//var isAndroid = Framework7.prototype.device.android === true;
//var isIos = Framework7.prototype.device.ios === true;
// 
//// Set Template7 global devices flags
//Template7.global = {
//  android: isAndroid,
//  ios: isIos
//};
// 
//// Define Dom7
//var $$ = Dom7;
// 
//// Add CSS Styles
//if (isAndroid) {
//  $$('head').append(
//      '<link rel="stylesheet" href="./css/framework7.material.min.css">' +
//      '<link rel="stylesheet" href="./css/framework7.material.colors.min.css">' +
//      '<link rel="stylesheet" href="./css/my-app.css">'
//  );
//}
//else {
//  $$('head').append(
//      '<link rel="stylesheet" href="./css/framework7.ios.min.css">' +
//      '<link rel="stylesheet" href="./css/framework7.ios.colors.min.css">' +
//      '<link rel="stylesheet" href="./css/my-app.css">'
//  );
//}
// 
//// Change Through navbar layout to Fixed
//if (isAndroid) {
//  // Change class
//  $$('.view.navbar-through').removeClass('navbar-through').addClass('navbar-fixed');
//  // And move Navbar into Page
//  $$('.view .navbar').prependTo('.view .page');
//}
// 
//// Init App
//var myApp = new Framework7({
//  // Enable Material theme for Android device only
//  material: isAndroid ? true : false,
//  // Enable Template7 pages
//  template7Pages: true
//});
// 
//// Add views
//var view1 = myApp.addView('#view-1');
//var view2 = myApp.addView('#view-2', {
//  // Because we use fixed-through navbar we can enable dynamic navbar
//  dynamicNavbar: true
//});
//var view3 = myApp.addView('#view-3');
//var view4 = myApp.addView('#view-4');