$$('.menuActivityContent').on('click', function() {
	SogreyCommon.log("menuActivityContent click")
	var buttons1 = [{
			text: '点赞',
			bold: true
		},
		{
			text: '分享',
			bold: true
		},
		{
			text: '收藏',
			bold: true
		}
	];
	var buttons2 = [{
		text: 'Cancel',
		color: 'red'
	}];
	var groups = [buttons1, buttons2];
	myApp.actions(groups);
});
//加载动态列表
$$.getJSON("./json/activityContent.json", function(result) {
	SogreyCommon.log(result);
	if(result.result == 1) {
		SogreyCommon.log("动态的Id=" + result.data.activityId)
		$("#activityContentBody").html(result.data.activityContent)
	} else {
		Toast(result.msg, 2345, 'success top');
		$("#activityContentBody").html(result.msg);
	}
})