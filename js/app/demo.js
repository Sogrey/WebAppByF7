//$("#demoButton1").on("click",function(){
//	console.log("ccc")
//	SogreyCommon.toast("demoButton1")
//})
//$("#demoButton2").on("click",function(){
//	SogreyCommon.toast("demoButton2")
//})
//$("#demoButton3").on("click",function(){
//	SogreyCommon.toast("demoButton3")
//})
//$('.bodyContent').on('click', '#demoButton1', function() {
//	SogreyCommon.log($(this).html())
//	SogreyWebsql.createTableWithDBData()
//});
//$('.bodyContent').on('click', '#demoButton2', function() {
//	SogreyCommon.log($(this).html())
//	var key1 = 'id';
//	var key2 = 'name';
//	var key3 = 'desc';
//	var map = {};
////	map[key1] = '1';
////	map[key2] = '李雷';
////	map[key3] = '李雷 name';
////	SogreyWebsql.insrert("baseData", map)
//	map[key1] = '2';
//	map[key2] = '韩梅梅';
//	map[key3] = '韩梅梅 name';
//	SogreyWebsql.insrert("baseData", map)
//});
//$('.bodyContent').on('click', '#demoButton3', function() {
//	SogreyCommon.log($(this).html())
//	SogreyWebsql.query("baseData")
//});

function insertPlansList() {
	var planList30 = new Array()

	var planItem30 = {}

	for(var i = 0; i < 3; i++) {
		planItem30 = {
			id: "0" + (i + 1),
			pId: "00",
			guid: "123",
			title: "青海扎道路工程计划" + "0" + (i + 1),
			startTimePlan: "2017-01-03",
			endTimePlan: "2017-12-31",
			startTime: "2017-01-03",
			endTime: "2017-01-20",
			completePer: "40",
			componentID: "7213,7832"
		}
		planList30.push(planItem30)

		for(var j = 0; j < 5; j++) {
			planItem30 = {
				id: (i + 1) + "" + (j + 1),
				pId: "0" + (i + 1),
				guid: "123",
				title: "青海扎道路工程计划" + (i + 1) + "" + (j + 1),
				startTimePlan: "2017-01-03",
				endTimePlan: "2017-12-31",
				startTime: "2017-01-03",
				endTime: "2017-01-20",
				completePer: "40",
				componentID: "7213,7832"
			}
			planList30.push(planItem30)
		}
	}

	planItem30 = {
		id: "12345",
		pId: "11",
		guid: "123",
		title: "青海扎道路工程计划12345",
		startTimePlan: "2017-01-03",
		endTimePlan: "2017-12-31",
		startTime: "2017-01-03",
		endTime: "2017-01-20",
		completePer: "20",
		componentID: "7213,7832"
	}
	planList30.push(planItem30)
	SogreyWebsql.insertArray("planList30", planList30)
}

function insertHisotry() {
	//提报历史
	var planSibmitHistoryArray = new Array()

	for(var i = 0; i < 15; i++) {
		var planSibmitHistory = {
			localId: "001" + i, //本地ID，同步后有网络ID；同步下来的数据 本地ID与网络ID一致
			id: "001" + i,
			pId: "12",
			title: "青岛扎道路项目工程施工一期一段",
			reportTime: "2017-08-29",
			startTime: "2017-08-" + ((i + 1 < 10) ? "0" + (i + 1) : (i + 1)),
			endTime: "2017-08-" + (i + 11),
			startTimeAsPlanned: "2017-08-01",
			endTimeAsPlanned: "2017-08-25",
			rate: "53%",
			stopWorkingCase: "阻工原因",
			delayCase: "延期原因",
			images: "",
			videos: "",
			files: "",
			remark: "备注",
			componentIds: "123,321",
			status: "" + (i % 3 == 0 ? 0 : 1)
		}
		planSibmitHistoryArray.push(planSibmitHistory)
	}
	SogreyWebsql.insertArray("planSubmitHistory", planSibmitHistoryArray)
}

// 创建并显示新窗口
function createWebview() {
	if(window.plus) {
		var styles = {};
		// 在Android5以上设备，如果默认没有开启硬件加速，则强制设置开启
		if(!plus.webview.defaultHardwareAccelerated() && parseInt(plus.os.version) >= 5) {
			styles.hardwareAccelerated = true;
		}
		var w = plus.webview.create('http://117.34.109.119:9001/', 'BIM', styles);
		plus.webview.show(w); // 显示窗口
	} else {
		document.addEventListener('plusready', plusReady, false);
	}
}