//加载动态列表
$$.getJSON("./json/activityList.json", function(result) {
	SogreyCommon.log("activityList data")
	SogreyCommon.log(result)
	$("#activityList ul").html("")
	if(result.result == 1) { //请求成功
		if(result.data.hasActivity) { //有数据
			if(result.data.activitise.length > 0)
				for(var i = 0; i < result.data.activitise.length; i++) {
					SogreyCommon.log(result.data.activitise[i].id + ">>" + result.data.activitise[i].title)
					var htmlLi = '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>' + result.data.activitise[i].title + '</div></div></a></li>';
					$("#activityList ul").append(htmlLi)
				}
		} else {
			Toast("暂无数据", 2345, 'success top');
			$("#activityList ul").html('<li class="item-content"><a href="javascript:;"><div class="item-inner"><div class="item-title">暂无数据</div></div></a></li>')
		}
	} else { //请求失败
		Toast(result.msg, 2345, 'success top');
		$("#activityList ul").html('<li class="item-content"><a href="javascript:;"><div class="item-inner"><div class="item-title">' + result.msg + '</div></div></a></li>')
	}

	// Loading flag
	var loading = false;
	// Last loaded index
	var lastIndex = $$('.list-block li').length;
	// Max items to load
	var maxItems = 60;
	// Append items per load
	var itemsPerLoad = 20;
	// Attach 'infinite' event handler
	$$('.infinite-scroll').on('infinite', function() {
		// Exit, if loading in progress
		if(loading) return;
		// Set loading flag
		loading = true;
		// Emulate 1s loading
		setTimeout(function() {
			// Reset loading flag
			loading = false;
			if(lastIndex >= maxItems) {
				// Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
				myApp.detachInfiniteScroll($$('.infinite-scroll'));
				// Remove preloader
				$$('.infinite-scroll-preloader').remove();
				return;
			}
			// Generate new items HTML
			var html = '';
			for(var i = lastIndex + 1; i <= lastIndex + itemsPerLoad; i++) {
				html += '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>新数据哦</div></div></a></li>';
			}
			// Append new items
			$$('#activityList .list-block ul').append(html);
			// Update last loaded index
			lastIndex = $$('.list-block li').length;
		}, 1000);
	});

	// Pull to refresh content
	var ptrContent = $$('#activityList .pull-to-refresh-content');

	// Add 'refresh' listener on it
	ptrContent.on('refresh', function(e) {
		// Emulate 2s loading
		setTimeout(function() {
			// List item html
			var itemHTML = '<li class="item-content"><a id="act.id" href="./pages/activity/activityContent.html"><div class="item-inner"><div class="item-title"><span>&#8226;</span>下拉刷新的新数据哦</div></div></a></li>';
			// Prepend new list element
			ptrContent.find('ul').prepend(itemHTML);
			// When loading done, we need to reset it
			myApp.pullToRefreshDone();
		}, 2000);
	});
})