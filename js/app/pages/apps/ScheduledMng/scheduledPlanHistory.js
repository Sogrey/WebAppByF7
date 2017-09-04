//
//$(document).on('click', '#scheduledPlanHistoryList ul li', function(event) {
//	SogreyCommon.toast($(this).html())
//	view2.router.loadPage('pages/apps/ScheduleMng/demo.html');
//	event.stopPropagation();
//});

//console.log("hid="+SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"),"pid",-1))  
var pid = SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"), "pid", '-1')
SogreyWebsql.queryCallback("planSubmitHistory", "localId!=?", "-1", function(rows) {

//	SogreyCommon.log(rows);

	var htmlLis = "";

	if(typeof(rows) != "undefined" && rows.length > 0) {
		for(var i = 0; i < rows.length; i++) {
			var hid = rows[i].localId
			var title = rows[i].title
			var reportTime = rows[i].reportTime
			var rate = rows[i].rate
			var status = rows[i].status
			var statusStr = rows[i].status == "0" ? "未同步" : "已同步"
			var syncClass = rows[i].status == "0" ? "Unsynchronized" : ""
			//componentIds:"123,321"
			//delayCase:"延期原因"
			//reportTime:"2017-08-29"
			//endTime:"2017-08-11"
			//endTimeAsPlanned:"2017-08-25"
			//files:""
			//id:"001"
			//images:""
			//localId:"0010"
			//pId:"12"
			//rate:"35%"
			//remark:"备注"
			//startTime:"2017-08-01"
			//startTimeAsPlanned:"2017-08-01"
			//status:"0"
			//stopWorkingCase:"阻工原因"
			//title:"青岛扎道路项目"
			//videos:""

			var htmlLi = '<li><a href="pages/apps/ScheduleMng/scheduledPlanEdit.html?hid=' + hid + '&pid=' + pid + '&status=' + status + '"><div><div class="scheduledPlanHistoryListItemTitle overflow_ellipsis">' + title + '</div><div class="scheduledPlanHistoryListItemInfo"><span>提报时间：' + reportTime + '</span><span>完成率：' + rate + '</span><span class="' + syncClass + '">' + statusStr + '</span></div></div></a></li>';

			htmlLis += htmlLi
		}
	}

	$("#scheduledPlanHistoryList ul").html(htmlLis)

})