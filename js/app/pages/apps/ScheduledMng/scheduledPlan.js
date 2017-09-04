var planListScreenType = 1 //默认日计划1 周计划7 旬计划10 月计划30

var $body = $("body");
$(document).on('click', '#id_scheduledPlanList ul li>a.item-link', function(event) {
	//	SogreyCommon.toast($(this).attr("data-url"))
	if(typeof($(this).attr("data-url")) != "undefined" && $(this).attr("data-url") != "") {
		view2.router.loadPage($(this).attr("data-url"));
		//	var pid = $($(this).parents('#id_scheduledPlanList ul li')[0]).attr("id")
		//	view2.router.loadPage('pages/apps/ScheduleMng/scheduledPlanEdit.html?hid=0&pid=' + pid);
	}

	/*else {
		var pid = $($(this).parents("li")[0]).attr("id")
		getDatas("planList30", "pid=?", pid, "#" + pid + ">.accordion-item-content>.childList>ul")
	}*/
	event.stopPropagation();
	return false
});
$(document).on('click', '.listItem>.item-rate', function(event) {
	//	SogreyCommon.toast($(this).html())
	var pid = $($(this).parents("li")[0]).attr("id")
	view2.router.loadPage('pages/apps/ScheduleMng/sceduledPlanHistory.html?pid=' + pid);
	event.stopPropagation();
	return false
});

//获取日期 今天传0昨天-1明天1
function GetDateStr(AddDayCount) {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期 
	var y = dd.getFullYear();
	var m = dd.getMonth() + 1; //获取当前月份的日期 
	var d = dd.getDate();
	return /*y + "-" +*/ m + "-" + d;
}
//本周是本月第几周
var getMonthWeek = function(a, b, c) {
	/*  
	a = d = 当前日期  
	b = 6 - w = 当前周的还有几天过完(不算今天)  
	a + b 的和在除以7 就是当天是当前月份的第几周  
	*/
	var date = new Date(a, parseInt(b) - 1, c),
		w = date.getDay(),
		d = date.getDate();
	return Math.ceil((d + 6 - w) / 7);
};
//切换 月计划/周计划/旬计划/日计划
$(document).on('click', '.popover-plan-links .list-block ul li a', function(event) {
	$(this).parents("li").siblings("li").removeClass("active")
	$(this).parents("li").addClass("active")
	var dataType = $(this).attr("data-type")
	planListScreenType = dataType
	//	console.log(dataType)
	settabsHtml(dataType)
});

function settabsHtml(dataType) {
	var tabButtonsRow = $("#scheduledPlans .subnavbar.tab_tabbar .buttons-row")
	var tab1_type = -1, //过去
		tab2_type = 0, //当下
		tab3_type = 1; //未来

	var tab1_name = "过去15天",
		tab2_name = "今天(" + GetDateStr(0) + ")",
		tab3_name = "未来15天";

	var selectedTab = 2 //默认选中中间，第二个

	var $planType = $(".planType")
	$($planType).attr("data-type", dataType)
	switch(parseInt(dataType)) {
		case 30: //月计划
			{
				$($planType).html("月计划")
				var today = new Date(); //获取当前时间 
				var m = today.getMonth() + 1;

				//				tab1_type = -30
				//				tab2_type = 0
				//				tab3_type = 30
				tab1_name = (m - 1) + "月"
				tab2_name = "本月(" + m + "月)"
				tab3_name = (m + 1) + "月"
			}
			break;
		case 10: //旬计划
			{
				$($planType).html("旬计划")
				//				tab1_type = -10
				//				tab2_type = 0
				//				tab3_type = 10
				tab1_name = "上旬"
				tab2_name = "中旬"
				tab3_name = "下旬"

				var today = new Date(); //获取当前时间 
				var d = today.getDate();
				if(d < 11) selectedTab = 1
				else if(d < 21) selectedTab = 2
				else selectedTab = 3
			}
			break;
		case 7: //周计划
			{
				$($planType).html("周计划")
				var today = new Date(); //获取当前时间 
				var y = today.getFullYear();
				var m = today.getMonth() + 1;
				var d = today.getDate();

				//				tab1_type = -7
				//				tab2_type = 0
				//				tab3_type = 7
				tab1_name = "上周"
				tab2_name = "本周(第" + getMonthWeek(y, m, d) + "周)"
				tab3_name = "下周"
			}
			break;
		case 1: //日计划
			{
				$($planType).html("日计划")
				//				tab1_type = -15
				//				tab2_type = 0
				//				tab3_type = 15
				tab1_name = "过去15天"
				tab2_name = "今天(" + GetDateStr(0) + ")"
				tab3_name = "未来15天"
			}
			break;
		default:
			break;
	}
	$(".modal-overlay-visible").click()
	$(".modal-overlay-visible").click()
	var html = '<a href="#tab1" data-type="' + tab1_type + '" class="button">' + tab1_name + '</a>' +
		'<a href="#tab2" data-type="' + tab2_type + '" class="button">' + tab2_name + '</a>' +
		'<a href="#tab3" data-type="' + tab3_type + '" class="button">' + tab3_name + '</a>';

	$("#scheduledPlans .subnavbar.tab_tabbar .buttons-row").html(html)
	$("#scheduledPlans .subnavbar.tab_tabbar .buttons-row a:nth-of-type(" + selectedTab + ")").addClass("active")
	$(".tab_tabbar .buttons-row a.button").on("click", function() {
		if(!$(this).hasClass("active")) {
			$(this).siblings().removeClass("active");
			$(this).addClass("active");

			//			SogreyCommon.toast($("#scheduledPlans .subnavbar.tab_tabbar .buttons-row a.active").attr("data-type"))
			//getDatas("planList30", "id!=?", "''")
			//TODO  获取相应数据
		}
	})
	//dataType  30月计划 10旬计划 7周计划 1日计划
	//	var tabType = $("#scheduledPlans .subnavbar.tab_tabbar .buttons-row a.active").attr("data-type")
	//tab1_type = -1,//过去
	//		tab2_type = 0,//当下
	//		tab3_type = 1;//未来

	//TODO 获取相应数据
}

function getDatas(tableName, args, values) {
	var $scheduledPlanList = $("#id_scheduledPlanList>ul")
	SogreyWebsql.queryCallback(tableName, args, values, function(rows) {
		$($scheduledPlanList).html("")
		//				SogreyCommon.log(rows)
		var dataOrder = new Array()

		if(rows && rows.length > 0) {
			var array = new Array()
			for(var i = 0; i < rows.length; i++) {
//				console.log(rows[i])
				array.push(rows[i])
			}
			//			SogreyCommon.log(array)
			//			SogreyCommon.log(toTree(array))
			//			SogreyCommon.log(JSON.stringify(array))
			//			toTree(JSON.stringify(array))
			
			
//			var val = [];
	//	 删除 所有 children,以防止多次调用
//	array.forEach(function(item) {
////		console.log(item)
//		delete item.children;
//	});
//console.log(rows)
//console.log(array[0].title)
//	for (row in rows) {
//		console.log(rows.0)
//		console.log(row.children)
//		delete row.children;
//	}
	// 将数据存储为 以 id 为 KEY 的 map 索引数据列
//	var map = {};
//	rows.forEach(function(item) {
//		map[item.id] = item;
//	});
//	//        console.log(map);
//	rows.forEach(function(item) {
//		// 以当前遍历项，的pid,去map对象中找到索引的id
//		var parent = map[item.pId];
//		// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
//		if(parent) {
//			(parent.children || (parent.children = [])).push(item);
//		} else {
//			//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
//			val.push(item);
//		}
//	});
//	var html = createPlanListHtml(val)
	

			var html = createPlanListHtml(toTree(array))
			//			//var html = new treeMenu(rows).init("00");
			//			//			var html = '<li id="01" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划01</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul><li id="11" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划11</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul><li id="12345" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划12345</div><div class="item-time">01-03~12-31</div><div class="item-rate">20%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li></ul></div></div></li><li id="12" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划12</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="13" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划13</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="14" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划14</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="15" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划15</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li></ul></div></div></li><li id="02" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划02</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul><li id="21" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划21</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="22" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划22</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="23" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划23</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="24" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划24</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="25" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划25</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li></ul></div></div></li><li id="03" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划03</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul><li id="31" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划31</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="32" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划32</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="33" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划33</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="34" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划34</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li><li id="35" class="accordion-item"><a href="#"class="item-link item-content"><div class="item-inner listItem item-nochildren"><div class="item-title overflow_ellipsis">青海扎道路工程计划35</div><div class="item-time">01-03~12-31</div><div class="item-rate">40%</div></div></a><div class="accordion-item-content"><div class="list-block childList"><ul></ul></div></div></li></ul></div></div></li>';
			$($scheduledPlanList).html(html)
			var $childList = $(".childList")
			for(var i = 0; i < $childList.length; i++) {
				if($($($childList[i]).find("ul")[0]).children("li").length > 0) { //没有子集
					$($($childList[i]).parents(".accordion-item-content")[0]).siblings("a.item-link").find(".listItem").removeClass("item-nochildren")
				} else {
					var id = $($($childList[i]).parents("li")[0]).attr("id")
					$($($childList[i]).parents(".accordion-item-content")[0]).siblings("a.item-link").attr("data-url", "pages/apps/ScheduleMng/scheduledPlanEdit.html?hid=0&pid=" + id)
				}
			}
		}
	});
}
$(function() {
	settabsHtml(planListScreenType)
	getDatas("planList30", "id!=?", "''")
})

function createPlanListHtml(dataArray) {

	var html = ""
	for(var i = 0; i < dataArray.length; i++) {
		var id = dataArray[i].id
		var title = dataArray[i].title
		var time = dataArray[i].startTimePlan.substr(dataArray[i].startTimePlan.indexOf("-") + 1, dataArray[i].startTimePlan.length) + "~" +
			dataArray[i].endTimePlan.substr(dataArray[i].endTimePlan.indexOf("-") + 1, dataArray[i].endTimePlan.length)
		var pre = dataArray[i].completePer
		var childrenHtml = ""
		if(typeof(dataArray[i].children) != "undefined" && dataArray[i].children.length > 0) {
			childrenHtml = createPlanListHtml(dataArray[i].children)
		}

		html += '<li id="' + id + '" class="accordion-item">' +
			'<a href="#"class="item-link item-content">' +
			'<div class="item-inner listItem item-nochildren">' +
			'<div class="item-title overflow_ellipsis">' + title + '</div>' +
			'<div class="item-time">' + time + '</div>' +
			'<div class="item-rate">' + pre + '%</div>' +
			'</div>' +
			'</a>' +
			'<div class="accordion-item-content">' +
			'<div class="list-block childList">' +
			'<ul>' +

			childrenHtml +

			'</ul>' +
			'</div>' +
			'</div>' +
			'</li>';
	}
	return html;

}

//var zNodes=[
//{id:0,pId:-1,name:"Aaaa"},
//  {id:1,pId:0,name:"A"},
//  {id:11,pId:1,name:"A1"},
//  {id:12,pId:1,name:"A2"},
//  {id:13,pId:1,name:"A3"},
//  {id:2,pId:0,name:"B"},
//  {id:21,pId:2,name:"B1"},
//  {id:22,pId:2,name:"B2"},
//  {id:23,pId:2,name:"B3"},
//  {id:3,pId:0,name:"C"},
//  {id:31,pId:3,name:"C1"},
//  {id:32,pId:3,name:"C2"},
//  {id:33,pId:3,name:"C3"},
//  {id:34,pId:31,name:"x"},
//  {id:35,pId:31,name:"y"},  
//  {id:36,pId:31,name:"z"},
//  {id:37,pId:36,name:"z1123"} ,
//  {id:38,pId:37,name:"z123123123"}   
//];

function treeMenu(a) {
	this.tree = a || [];
	this.groups = {};
};
treeMenu.prototype = {
	init: function(pid) {
		this.group();
		return this.getDom(this.groups[pid]);
	},
	group: function() {
		//		console.log(this.tree.length)
		//		console.log(this.tree)
		//		console.log(JSON.stringify(this.tree))
		for(var i = 0; i < this.tree.length; i++) {
			if(this.groups[this.tree[i].pId]) {
				this.groups[this.tree[i].pId].push(this.tree[i]);
			} else {
				this.groups[this.tree[i].pId] = [];
				this.groups[this.tree[i].pId].push(this.tree[i]);
			}
		}
	},
	getDom: function(a) {
		if(!a) {
			return ''
		}

		var html = ""
		for(var i = 0; i < a.length; i++) {
			var id = a[i].id
			var title = a[i].title
			var time = a[i].startTimePlan.substr(a[i].startTimePlan.indexOf("-") + 1, a[i].startTimePlan.length) + "~" +
				a[i].endTimePlan.substr(a[i].endTimePlan.indexOf("-") + 1, a[i].endTimePlan.length)
			var pre = a[i].completePer

			html += '<li id="' + id + '" class="accordion-item">' +
				'<a href="#"class="item-link item-content">' +
				'<div class="item-inner listItem item-nochildren">' +
				'<div class="item-title overflow_ellipsis">' + title + '</div>' +
				'<div class="item-time">' + time + '</div>' +
				'<div class="item-rate">' + pre + '%</div>' +
				'</div>' +
				'</a>' +
				'<div class="accordion-item-content">' +
				'<div class="list-block childList">' +
				'<ul>' +
				this.getDom(this.groups[a[i].id]) +
				'</ul>' +
				'</div>' +
				'</div>' +
				'</li>';
		}
		return html;
	}
};
//var html=new treeMenu(zNodes).init(0);
//alert(html);
//http://www.cnblogs.com/azhqiang/p/4169534.html

//http://blog.csdn.net/benbenchong_ok/article/details/53337365

///////////////////////////////////////////////////////////

function toTree(data) {
	var val = [];
	//	 删除 所有 children,以防止多次调用
	data.forEach(function(item) {
//		console.log(item)
		delete item.children;
	});
	// 将数据存储为 以 id 为 KEY 的 map 索引数据列
	var map = {};
	data.forEach(function(item) {
		map[item.id] = item;
	});
	//        console.log(map);
	data.forEach(function(item) {
		// 以当前遍历项，的pid,去map对象中找到索引的id
		var parent = map[item.pId];
		// 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
		if(parent) {
			(parent.children || (parent.children = [])).push(item);
		} else {
			//如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
			val.push(item);
		}
	});
	return val;
}
//  console.log(toTree(data))