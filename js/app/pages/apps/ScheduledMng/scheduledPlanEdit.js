var $body = $("body");
var medias = new Array(); //图片视频列表
var mediasFilePath = new Array();
var otherFilePath = new Array(); //其他附件不可预览
var minRate = 0 //已完成的百分比
var scheduledPlanPid = "0",
	scheduledPlanHid = "0", //scheduledPlanPid 填报的计划ID ；从历史记录过来会带过来历史记录ID，0默认新建
	historyStatus = "0"; //提报历史状态 0 未同步 1已同步
// H5 plus事件处理
function plusReady() {
	// 获取摄像头目录对象
	plus.io.resolveLocalFileSystemURL("_doc/", function(entry) {

		//		entry.getDirectory( "camera", {create:true}, function ( dir ) {
		//			gentry = dir;
		//			updateHistory();
		//		}, function ( e ) {
		//			SogreyCommon.toast( "Get directory \"camera\" failed: "+e.message );
		//		} );
		//		SogreyCommon.toast("Resolve \"_doc/\" success!!!! ");
	}, function(e) {
		//		SogreyCommon.toast("Resolve \"_doc/\" failed: " + e.message);
	});
}
if(window.plus) {
	plusReady();
} else {
	document.addEventListener("plusready", plusReady, false);
}

$(function() {
	scheduledPlanPid = SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"), "pid", "0")
	scheduledPlanHid = SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"), "hid", "0")
	historyStatus = SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"), "status", "0")

	initViews()

	$body.off('click', '.filesSelected ul li div>div.btnEdit i.ic_edit');
	$body.off('click', '.filesSelected ul li div>div.btnEdit i.ic_delete');
	$body.off('click', '.filesSelected ul li div>img.picReview');
	$body.off('click', '.list-block .item-title.label+.item-input a.deleteFile');
	$body.off('click', '.submitHistoryList .list-block ul li a');
	$body.off('click', '.popup-submit-btns .buttonSave');
	$body.off('click', '.filePics ul li:nth-last-of-type(1) .addMediaFile img')
	$body.off('click', '.fileVideos ul li:nth-last-of-type(1) .addMediaFile img')

	$body.on('click', '.filesSelected ul li div>div.btnEdit i.ic_edit', function() {
		var desc = $(this).parents(".filesSelected ul li").find(".desc")[0]
		var url = $($(this).parents(".filesSelected ul li").find("img.picReview")[0]).attr("data-url")
		myApp.prompt('<p>' + $(desc).html() + '</p><p>你可以在此修改备注</p>', '添加备注', function(value) {
			$(desc).html(value)
			for(var i = 0; i < medias.length; i++) {
				if(typeof(medias[i].url) != "undefined" && medias[i].url != "" && medias[i].url == url) {
					medias[i].caption = value
				}
				if(typeof(medias[i].html) != "undefined" && medias[i].html != "" && medias[i].html.indexOf(url) > -1) {
					medias[i].caption = value
				}
			}
		});
	});
	$body.on('click', '.filesSelected ul li div>div.btnEdit i.ic_delete', function() {
		$item = $(this).parents(".filesSelected ul li");
		var dataUrl = ""
		if($($item).find("img.picReview").length == 0) { //其他文件
			dataUrl = $($($item).find("span.desc")[0]).attr("data-url")
			myApp.confirm('确定要删除此附件?', "删除", function() {
				var index = 0
				for(var i = 0; i < otherFilePath.length; i++) {
					if(typeof(otherFilePath[i]) != "undefined" && otherFilePath[i] != "" && otherFilePath[i] == dataUrl) {
						index = i
						break;
					}
				}
				otherFilePath.splice(index, 1);
				$($item).remove()
			}, function() {});
		} else { //图片视频媒体文件
			dataUrl = $($($item).find("img.picReview")[0]).attr("data-url")

			myApp.confirm('确定要删除此附件?', "删除",
				function() {
					var index = 0
					for(var i = 0; i < medias.length; i++) {
						if(typeof(medias[i].url) != "undefined" && medias[i].url != "" && medias[i].url == dataUrl) {
							index = i
						}
						if(typeof(medias[i].html) != "undefined" && medias[i].html != "" && medias[i].html.indexOf(dataUrl) > -1) {
							index = i
						}
					}
					medias.splice(index, 1);
					$($item).remove()
					//测试删除
					if(isAndroid) {
						try {
							myApp.alert("删除文件？" + dataUrl)
							var File = plus.android.importClass("java.io.File");
							var file = new File(dataUrl)
							plus.android.importClass(file);
							myApp.alert("文件存在？" + file.exists())
							myApp.alert("是文件？" + file.isFile())
							if(file.exists() && file.isFile()) {
								file.delete()
								myApp.alert("文件删除")
							} else {
								myApp.alert("删除失败")
							}
						} catch(e) {
							myApp.alert(e.message)
						}
					}
				},
				function() {}
			);
		}

	});
	$body.on('click', '.fileList ul li div>img.picReview', function() {
		//		var dataUrl = $(this).attr("data-url")
		//		displayFile(dataUrl, $(this).parents(".fileList ul li").find(".desc").html())
	});
	$body.on('click', '.list-block .item-title.label+.item-input a.deleteFile', function() {
		$parengLi = $(this).parents('.list-block ul li')
		if($parengLi.hasClass("statusDelete")) {
			$(this).html("删除")
			$parengLi.removeClass("statusDelete")
			$(this).parents(".item-content").siblings(".filesSelected").find(".btnEdit .ic_edit").show()
			$(this).parents(".item-content").siblings(".filesSelected").find(".btnEdit .ic_delete").hide()
		} else {
			$(this).html("完成")
			$parengLi.addClass("statusDelete")
			$(this).parents(".item-content").siblings(".filesSelected").find(".btnEdit .ic_edit").hide()
			$(this).parents(".item-content").siblings(".filesSelected").find(".btnEdit .ic_delete").css("display", "block")
		}
	});
	$body.on('click', '.submitHistoryList .list-block ul li a', function() {
		scheduledPlanHid = $(this).parents('.submitHistoryList .list-block ul li').attr("id")
		historyStatus = $(this).parents('.submitHistoryList .list-block ul li').attr("data-status")
		$($(this).parents('.submitHistoryList .list-block ul li')[0]).siblings("li").removeClass("current")
		$($(this).parents('.submitHistoryList .list-block ul li')[0]).addClass("current")
		initViews()
		refreshFormData()
	});
	$body.on('click', '.popup-submit-btns .buttonSave', function() {
		//保存本地
		saveLocaltion()
		//提交网络
	});

	$body.on('click', '.filePics ul li:nth-last-of-type(1) .addMediaFile img', function() {
		var buttons1 = [{
				text: '选择照片',
				label: true
			},
			{
				text: '拍照',
				bold: true,
				onClick: function() {
					getImage();
				}
			},
			{
				text: '从图库选取',
				bold: true,
				onClick: function() {
					galleryFilter("image")
				}
			}
		];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});
	$body.on('click', '.fileVideos ul li:nth-last-of-type(1) .addMediaFile img', function() {
		var buttons1 = [{
				text: '选择视频',
				label: true
			},
			{
				text: '拍摄',
				bold: true,
				onClick: function() {
					getVideo();
				}
			},
			{
				text: '从视频库选取',
				bold: true,
				onClick: function() {
					galleryFilter("video")
				}
			}
		];
		var buttons2 = [{
			text: '取消',
			color: 'red'
		}];
		var groups = [buttons1, buttons2];
		myApp.actions(groups);
	});

	$("#input_startTime").change(function() {
		$("#input_endTime").attr("min", $(this).val())
	});
	$("#input_endTime").change(function() {
		if($("#input_startTime").val() == "") {
			$(this).val("")
			SogreyCommon.toast("请先选择开始时间")
			return
		}
	});
	initHistoryDatas();
	refreshFormData();
});

function initViews() {
	$(".planedittip").show()
	$(".planeditBtns a.button").html("提报日志")
	$(".popup-submit .popup-submit-btns .buttons-row").html('<a href="#" class="button buttonSave active">保存</a><a href="#" class="button close-popup">取消</a>')
	$(".popup-submit .popup-submit-content").removeClass("disable")
	$(".popup-submit .popup-submit-content input").removeAttr("disabled")
	$(".popup-submit .popup-submit-content textarea").removeAttr("disabled")
	$(".filesSelected .btnEdit").show()
	$(".deleteFile").show()
	$(".divfileOthers").show()
	$(".addMediaFile").show()
	$(".lable_uploadVideo").html("上传视频")
	$(".lable_uploadPics").html("上传图片")
	$(".lable_uploadFiles").html("上传附件")
	if(scheduledPlanHid != "0" && historyStatus != "0") { //历史 不可编辑
		$(".planedittip").hide()
		$(".planeditBtns a.button").html("查看日志")
		$(".popup-submit .popup-submit-btns .buttons-row a:nth-of-type(2)").html("关闭")
		$(".popup-submit .popup-submit-btns .buttons-row a:nth-of-type(1)").remove()
		$(".popup-submit .popup-submit-content").addClass("disable")
		$(".popup-submit .popup-submit-content.disable input").prop("disabled", "disabled")
		$(".popup-submit .popup-submit-content.disable textarea").prop("disabled", "disabled")
		$(".filesSelected .btnEdit").hide()
		$(".deleteFile").hide()
		$(".divfileOthers").hide()
		$(".addMediaFile").hide()
		$(".lable_uploadVideo").html("视频")
		$(".lable_uploadPics").html("图片")
		$(".lable_uploadFiles").html("附件")
	}
}
//历史记录
function initHistoryDatas() {

	SogreyWebsql.queryCallback("planSubmitHistory", "localId!=?", "-1", function(rows) {

		//		SogreyCommon.log(rows);

		var htmlLis = "";

		if(typeof(rows) != "undefined" && rows.length > 0) {
			for(var i = 0; i < rows.length; i++) {
				var hid = rows[i].localId
				var isCurrentClass = scheduledPlanHid == hid ? "current" : ""
				var title = rows[i].title
				var reportTime = rows[i].reportTime
				var rate = rows[i].rate
				var status = rows[i].status == "0" ? "未同步" : "已同步"
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

				var htmlLi = '<li id="' + hid + '" class="' + isCurrentClass + '" data-status="' + rows[i].status + '"><a class="close-popover" href="#"><div><span class="title overflow_ellipsis">' + title + '</span><span>[当前]</span></div><div>时间：' + reportTime + '</div><div><span>完成百分比：' + rate + '</span><span class="more">详情</span></div></a></li>';

				htmlLis += htmlLi
			}
			htmlLis += '<li class="nomore"><div class="">已加载全部</div></li>'
		}else{
			htmlLis += '<li class="nomore"><div class="">暂无数据</div></li>'
		}
		$(".submitHistoryList ul").html(htmlLis)
	})
}

function refreshFormData() {
	//恢复历史提报内容
	if(scheduledPlanHid != "0") {
		SogreyWebsql.queryCallback("planSubmitHistory", "localId=?", scheduledPlanHid, function(rows) {
			//			SogreyCommon.log(rows);
			if(typeof(rows) != "undefined" && rows.length > 0) {
				SogreyCommon.log(rows[0]);

				scheduledPlanPid = rows[0].pId
				scheduledPlanHid = rows[0].localId
				historyStatus = rows[0].status

				var rate = rows[0].rate
				minRate = parseInt(rate.replace("%", ""));
				var startTime = rows[0].startTime
				var endTime = rows[0].endTime
				var stopWorkingCase = rows[0].stopWorkingCase
				var delayCase = rows[0].delayCase
				var remarks = rows[0].remark
				var files = rows[0].files
				var images = rows[0].images
				var videos = rows[0].videos
				$popupSubmitContent = $(".popup-submit .popup-submit-content")
				$(".RangeSlider>input[type=range]").val(minRate);
				$(".RangeSlider>input[type=range]").css("background-size", minRate + "% 100%")
				$(".RangeSlider>span").html($(".RangeSlider>input[type=range]").val() + "%")
				$("#input_startTime").val(startTime)
				$("#input_endTime").val(endTime)
				$("#input_endTime").attr("min", startTime)
				$("#input_stopWorkingCase").val(stopWorkingCase)
				$("#input_delayCase").val(delayCase)
				$("#txt_Remarks").val(remarks)

				medias = new Array(); //图片视频列表
				mediasFilePath = new Array();
				otherFilePath = new Array(); //其他附件不可预览

				initfilesListHtml(0)
				if(typeof(images) != "undefined" && images != "" && images != "[]") {
					var imagesArray = JSON.parse(images);
					if(typeof(imagesArray) != "undefined" && imagesArray instanceof Array) {
						for(var i = 0; i < imagesArray.length; i++) {
							var url = imagesArray[i].url
							var desc = name = imagesArray[i].desc
							createItem(url, 0, desc) //图片
						}
					}
				}
				initfilesListHtml(1)
				if(typeof(videos) != "undefined" && videos != "" && videos != "[]") {
					var videosArray = JSON.parse(videos);
					if(typeof(videosArray) != "undefined" && videosArray instanceof Array) {
						for(var i = 0; i < videosArray.length; i++) {
							var url = videosArray[i].url
							var desc = name = videosArray[i].desc
							createItem(url, 1, desc) //视频
						}
					}
				}
				initfilesListHtml(2)
				if(typeof(files) != "undefined" && files != "" && files != "[]") {
					var filesArray = JSON.parse(files);
					if(typeof(filesArray) != "undefined" && filesArray instanceof Array) {
						for(var i = 0; i < filesArray.length; i++) {
							var url = filesArray[i].url
							var desc = name = filesArray[i].desc
							createItem(url, 2, desc) //文档
						}
					}
				}

			}
		})
	}
}

function getFormData() {
	var title = "青岛扎道路项目工程施工一期一段"
	var pId = scheduledPlanPid
	var reportTime = new Date().format("yyyy-MM-dd")
	var startTime = $("#input_startTime").val()
	var endTime = $("#input_endTime").val()
	var startTimeAsPlanned = ""
	var endTimeAsPlanned = ""
	var rate = $(".RangeSlider>input[type=range]").val() + "%"
	var stopWorkingCase = $("#input_stopWorkingCase").val()
	var delayCase = $("#input_delayCase").val()
	var remark = $("#txt_Remarks").val()
	var componentIds = "" //构件ID  需要在模型上选择  ","间隔
	var images = ""
	var $picsList = $(".filePics ul li")
	if($($picsList).length > 0) {
		var imagesArray = new Array()
		for(var i = 0; i < $($picsList).length; i++) {
			var url = $($($($picsList)[i]).find("img.picReview")[0]).attr("data-url"),
				desc = $($($($picsList)[i]).find(".desc")[0]).html()
			if(typeof(url) != "undefined" && url != "") {
				var pic = {
					url: url,
					desc: desc
				}
				imagesArray.push(pic)
			}
		}
		images = JSON.stringify(imagesArray)
	}

	var videos = ""
	var $videosList = $(".fileVideos ul li")
	if($($videosList).length > 0) {
		var videosArray = new Array()
		for(var i = 0; i < $($videosList).length; i++) {
			var url = $($($($videosList)[i]).find("img.picReview")[0]).attr("data-url"),
				desc = $($($($videosList)[i]).find(".desc")[0]).html()
			if(typeof(url) != "undefined" && url != "") {
				var pic = {
					url: url,
					desc: desc
				}
				videosArray.push(pic)
			}
		}
		videos = JSON.stringify(videosArray)
	}
	var files = ""
	var $filesList = $(".fileOthers ul li")
	if($($filesList).length > 0) {
		var filesArray = new Array()
		for(var i = 0; i < $($filesList).length; i++) {
			var url = $($($($filesList)[i]).find(".desc")[0]).attr("data-url"),
				desc = $($($($filesList)[i]).find(".desc")[0]).html()
			if(typeof(url) != "undefined" && url != "") {
				var pic = {
					url: url,
					desc: desc
				}
				filesArray.push(pic)
			}
		}
		files = JSON.stringify(filesArray)
	}
	var planSubmitHistory = {
		localId: scheduledPlanHid == "0" ? scheduledPlanHid = "tmp" + new Date().valueOf() : scheduledPlanHid, //本地ID，同步后有网络ID；同步下来的数据 本地ID与网络ID一致
		id: '000001',
		pId: pId,
		title: title,
		reportTime: reportTime,
		startTime: startTime,
		endTime: endTime,
		startTimeAsPlanned: startTimeAsPlanned,
		endTimeAsPlanned: endTimeAsPlanned,
		rate: rate,
		stopWorkingCase: stopWorkingCase,
		delayCase: delayCase,
		images: images,
		videos: videos,
		files: files,
		remark: remark,
		componentIds: componentIds,
		status: "0" //状态默认0 未同步  同步之后更新为1
	}
	SogreyCommon.log(planSubmitHistory)
	SogreyWebsql.insertObj("planSubmitHistory", planSubmitHistory)

	setTimeout(function() {
		initHistoryDatas()
	}, 1000);

}

function saveLocaltion() {
	SogreyCommon.log("正在提交...")

	getFormData()
}

// 显示文件
function displayFile(dataUrl, name) {
	var myPhotoBrowserPopupDark = myApp.photoBrowser({
		photos: medias,
		/*[{
				html: '<iframe src="//www.youtube.com/embed/lmc21V-zBq0?list=PLpj0FBQgLGEr3mtZ5BTwtmSwF1dkPrPRM" frameborder="0" allowfullscreen></iframe>',
				caption: 'Woodkid - Run Boy Run (Official HD Video)'
			},
			{
				url: 'http://lorempixel.com/1024/1024/sports/2/',
				caption: 'Second Caption Text'
			},
			{
				url: 'http://lorempixel.com/1024/1024/sports/3/',
			},
		],*/
		theme: 'dark',
		type: 'standalone',
		ofText: '/',
		backLinkText: '返回'
	});

	var index = -1;

	for(var i = 0; i < medias.length; i++) {
		if(typeof(medias[i].url) != "undefined" && medias[i].url != "" && medias[i].url == dataUrl) {
			index = i
		} else
		if(typeof(medias[i].html) != "undefined" && medias[i].html != "" && medias[i].html.indexOf(dataUrl) > -1) {
			index = i
		}
	}
	if(index > -1)
		myPhotoBrowserPopupDark.open(index);
	else
		myPhotoBrowserPopupDark.open();
}

function getFiles(ele) {
	//	myApp.alert($(ele).val())
	if(isAndroid) {
		try {
			var Intent = plus.android.importClass("android.content.Intent");
			var Activity = plus.android.importClass("android.app.Activity");
			var Uri = plus.android.importClass("android.net.Uri");

			var intent = new Intent(Intent.ACTION_GET_CONTENT);
			//			intent.setType("application/msword"); //doc
			//			intent.setType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"); //docx
			//			intent.setType("application/rtf"); //rtf
			//			intent.setType("application/vnd.ms-excel"); //xls
			//			intent.setType("application/x-excel"); //xls
			//			intent.setType("application/vnd.ms-powerpoint"); //ppt
			//			intent.setType("application/vnd.openxmlformats-officedocument.presentationml.presentation"); //pptx
			//			intent.setType("application/vnd.ms-powerpoint"); //pps
			//			intent.setType("application/vnd.openxmlformats-officedocument.presentationml.slideshow"); //ppsx
			//			intent.setType("application/pdf"); //pdf
			//			intent.setType("application/octet-stream"); //rar
			//			intent.setType("application/x-zip-compressed"); //zip
			//			intent.setType("audio/mpeg"); //.mp3 .mp2 .mpe .mpeg .mpg
			//			intent.setType("text/plain"); //txt

			//			intent.setType("application/msword;application/vnd.openxmlformats-officedocument.wordprocessingml.document;application/rtf;application/vnd.ms-excel;application/x-excel;application/vnd.ms-powerpoint;application/vnd.openxmlformats-officedocument.presentationml.presentation;application/vnd.ms-powerpoint;application/vnd.openxmlformats-officedocument.presentationml.slideshow;application/pdf;application/octet-stream;application/x-zip-compressed;audio/mpeg;text/plain"); 
			intent.setType("application/*");
			intent.addCategory(Intent.CATEGORY_OPENABLE);
			var main = plus.android.runtimeMainActivity();
			main.onActivityResult = function(requestCode, resultCode, data) {
				if(resultCode == Activity.RESULT_OK) {
					if(requestCode == 1) {
						try {
							var resultString = "";
							var context = main;
							plus.android.importClass(data);
							var contactData = data.getData();
							var resolver = context.getContentResolver();
							plus.android.importClass(resolver);
							var cursor = resolver.query(contactData, new Array("_data", "_size", "mime_type", "duration", "title", "_display_name", "description"), null, null, null);
							plus.android.importClass(cursor);
							//myApp.alert(cursor.getCount() + "条数据")
							cursor.moveToFirst();
							//myApp.alert("_data="+cursor.getString(0))//url
							//myApp.alert("_size="+cursor.getString(1))
							//myApp.alert("mime_type="+cursor.getString(2))
							//myApp.alert("duration="+cursor.getString(3))
							//myApp.alert("title="+cursor.getString(4))
							//myApp.alert("_display_name="+cursor.getString(5))
							//myApp.alert("description="+cursor.getString(6))

							var filePath = cursor.getString(0)
							if(typeof(filePath) != "undefined" && filePath != "") {
								createItem(filePath, 2, "")
							}
							cursor.close();
						} catch(e) {
							//myApp.alert("e " + e.message)
						}
					}
				}
			}
			main.startActivityForResult(intent, 1);
		} catch(e) {
			myApp.alert(e.message)
		}
	}
	if(isIos) {
		myApp.alert("紧张开发中...")
	}
}
//
//function displayImage(dataUrl) {
//	//	var Intent = plus.android.importClass("android.content.Intent");
//	//	var Uri = plus.android.importClass("android.net.Uri");
//	//	var main = plus.android.runtimeMainActivity();
//	//	var intent = new Intent(Intent.ACTION_VIEW);
//	//	var uri = Uri.parse(dataUrl);
//	//	intent.setDataAndType(uri, "image/*");
//	//	main.startActivity(intent);
//	//	if(isAndroid) {
//	var Intent = plus.android.importClass("android.content.Intent");
//	var Uri = plus.android.importClass("android.net.Uri");
//	var main = plus.android.runtimeMainActivity();
//	var intent = new Intent(Intent.ACTION_VIEW);
//	//Uri mUri = Uri.parse("file://" + picFile.getPath());Android3.0以后最好不要通过该方法，存在一些小Bug
//	intent.setDataAndType(Uri.fromFile(dataUrl), "image/*");
//	main.startActivity(intent);
//	//	}
//	//	if(isIos) {
//	//
//	//	}
//}
//
//function displayVideo(dataUrl) {
//	//	var Intent = plus.android.importClass("android.content.Intent");
//	//	var Uri = plus.android.importClass("android.net.Uri");
//	//	var main = plus.android.runtimeMainActivity();
//	//	var intent = new Intent(Intent.ACTION_VIEW);
//	//	var uri = Uri.parse(dataUrl);
//	//	intent.setDataAndType(uri, "video/*");
//	//	main.startActivity(intent);
//	//	if(isAndroid) {
//	var Intent = plus.android.importClass("android.content.Intent");
//	var Uri = plus.android.importClass("android.net.Uri");
//	var main = plus.android.runtimeMainActivity();
//	var intent = new Intent(Intent.ACTION_VIEW);
//	//Uri mUri = Uri.parse("file://" + picFile.getPath());Android3.0以后最好不要通过该方法，存在一些小Bug
//	intent.setDataAndType(Uri.fromFile(dataUrl), "video/*");
//	main.startActivity(intent);
//	//	}
//	//	if(isIos) {
//	//
//	//	}
//}

var change = function($input) {
	/*内容可自行定义*/
	if($input.value < minRate) {
		$(".RangeSlider>input[type=range]").val(minRate);
		$(".RangeSlider>input[type=range]").css("background-size", minRate + "% 100%")
	}
	SogreyCommon.log($input.value);
	$(".RangeSlider>span").html($input.value + "%")
}

$('input[type=range]').RangeSlider({
	min: 0,
	max: 100,
	value: 0,
	step: 1,
	callback: change
});

// 拍照
function getImage() {
	var cmr = plus.camera.getCamera();
	cmr.captureImage(function(path) {
		//		SogreyCommon.toast("成功：" + path);
		//		plus.gallery.save( path );
		//		createItem(path, 0,"");
		plus.io.resolveLocalFileSystemURL(path, function(entry) {
			createItem(entry, 0, "");
		}, function(e) {
			SogreyCommon.toast("读取拍照文件错误：" + e.message);
		});
	}, function(e) {
		SogreyCommon.toast("失败：" + e.message);
	}, {
		filename: "_doc/pictures/",
		index: 1
	});
}
// 录像
function getVideo() {
	var cmr = plus.camera.getCamera();
	cmr.startVideoCapture(function(p) {
		//		SogreyCommon.toast("成功：" + p);
		plus.io.resolveLocalFileSystemURL(p, function(entry) {
			createItem(entry, 1, "");
		}, function(e) {
			SogreyCommon.toast("读取录像文件错误：" + e.message);
		});
	}, function(e) {
		SogreyCommon.toast("失败：" + e.message);
	}, {
		filename: "_doc/videos/",
		index: i
	});
}

// 从相册中选择指定类型文件：filter - 图片文件（“image”）、视频文件（“video”）或所有文件（“none”），默认值为“image”
function galleryFilter(filter) {
	var type = 0;
	if(filter == "image") type = 0;
	else if(filter == "video") type = 1;
	else type = 2;
	// 从相册中选择图片
	//	console.log("从相册中选择图片:");
	plus.gallery.pick(function(path) {
		//		SogreyCommon.toast(path);
		createItem(path, type, "")
	}, function(e) {
		SogreyCommon.toast("取消选择");
	}, {
		filter: filter
	});
}
//数组插入数据到指定位置
Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};
// 添加播放项
function createItem(entry, type, desc) {
	var url = "",
		name = "";
	if(typeof(entry) == "string") {
		url = entry
		otherFilePath.push(url)
		if(entry.indexOf("/") > -1) //如果包含有"/"号 从最后一个"/"号+1的位置开始截取字符串
		{
			name = entry.substring(entry.lastIndexOf("/") + 1, entry.length);
		} else {
			name = entry;
		}
	} else {
		url = entry.toLocalURL()
		name = entry.name
		mediasFilePath.push(url)
	}
	if(typeof(desc) != "undefined" && desc != "") {
		name = desc
	}
	var mediaObject = {}

	switch(type) {
		case 0: //图片
			{
				var html = '<li><div><img class="picReview lazy lazy-fadein" src="' + url + '" data-url="' + url + '" /><p class="desc">' + name + '</p><div class="btnEdit"><i class="ic_edit"></i><i class="ic_delete"></i></div></div></li>'
				$(".filePics ul li").eq($(".filePics ul li").length - 1).before(html)

				mediaObject.url = url
				mediaObject.caption = name
				mediaObject.type = "pic"
				var index = -1
				for(var i = 0; i < medias.length; i++) {
					if(medias[i].type === "video") index = i
				}
				if(index > -1) {
					medias.insert(index, mediaObject);
				} else {
					medias.push(mediaObject)
				}
			}
			break;
		case 1: //视频
			{
				var html = '<li><div><img class="picReview lazy lazy-fadein" src="./img/icon_video.png" data-url="' + url + '" /><p class="desc">' + name + '</p><div class="btnEdit"><i class="ic_edit"></i><i class="ic_delete"></i></div></div></li>'
				$(".fileVideos ul li").eq($(".fileVideos ul li").length - 1).before(html)

				mediaObject.html = '<iframe src="' + url + '" frameborder="0" allowfullscreen></iframe>',
				mediaObject.caption = name
				mediaObject.type = "video"
				medias.push(mediaObject)
			}
			break;
		case 2: //其他
			{
				var html = '<li><div><div class="overflow_ellipsis"><i class="f7-icons">document_text_fill</i><span class="desc" data-url="' + url + '">' + name + '</span></div><div class="btnEdit"><i class="ic_edit"></i><i class="ic_delete"></i></div></div></li>'

				$(".fileOthers ul").append(html)
			}
			break;
		default:
			break;
	}
}

function initfilesListHtml(type) {
	switch(type) {
		case 0: //图片
			{
				var liAdd = '<li><div class="addMediaFile"><img src="./img/icon_addFile.png" /><p class="desc"></p></div></li>'
				$(".filePics ul").html(liAdd)
			}
			break;
		case 1: //视频
			{
				var liAdd = '<li><div class="addMediaFile"><img src="./img/icon_addFile.png" /><p class="desc"></p></div></li>'
				$(".fileVideos ul").html(liAdd)
			}
			break;
		case 2: //文档
			{
				var liAdd = '<li><div class="addMediaFile"><img src="./img/icon_addFile.png" /><p class="desc"></p></div></li>'
				$(".fileOthers ul").html("")
			}
			break;
		default:
			break;
	}
}

//  http://blog.csdn.net/zhuming3834/article/details/51582055