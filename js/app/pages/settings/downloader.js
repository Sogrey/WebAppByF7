var $body = $("body")
$(function() {
	//获取参数
	//	scheduledPlanHid = SogreyCommon.GetQueryStringByUrl($(".ParamsData").attr("id"), "id", "0")

	$body.off('click', '.downloaderItem_btns button.button.btnDownload');
	$body.off('click', '.downloaderItem_btns button.button.btnPause');
	$body.off('click', '.downloaderItem_btns button.button.btnResume');
	$body.off('click', '.downloaderItem_btns button.button.btnDone');
	$body.off('click', '.downloadList ul li .swipeout-actions-right a.btnDelete');

	$body.on('click', '.downloaderItem_btns button.button.btnDownload', function() {
		//		var title = $($($(this).parents(".downloaderItem_btns")[0]).siblings(".downloaderItem_progress").find(".downloaderItem_title")).html()

		setBtnsStatus(downloadStatus.download, $(this))

	});
	$body.on('click', '.downloaderItem_btns button.button.btnPause', function() {
		setBtnsStatus(downloadStatus.pause, $(this))
	});
	$body.on('click', '.downloaderItem_btns button.button.btnResume', function() {
		setBtnsStatus(downloadStatus.resume, $(this))
	});
	$body.on('click', '.downloaderItem_btns button.button.btnDone', function() {
		setBtnsStatus(downloadStatus.done, $(this))
	});
	$body.on('click', '.downloadList ul li .swipeout-actions-right a.btnDelete', function() {
		var url = $(this).parents(".downloadList ul li").attr("data-url")
		cancelDownloadTask(url)
		$(this).parents('.downloadList ul li').remove()
	});

});

$(".popover_downloader a.list-button").on("click", function() {
	myApp.alert("下载：" + $(this).html(), "提示")
})
var downloadStatus = {
	download: 0,
	pause: 1,
	resume: 2,
	done: 3
}
//下载状态  - 与【下载】按钮文字呼应
function setBtnsStatus(status, ele) {
	$parentLi = $(ele).parents('.downloadList ul li');
	var url = $($parentLi).attr("data-url")

	$($parentLi).find('.downloaderItem_btns button.button').hide();
	$btnDownload = $($parentLi).find('.downloaderItem_btns button.button.btnDownload');
	$btnPause = $($parentLi).find('.downloaderItem_btns button.button.btnPause');
	$btnResume = $($parentLi).find('.downloaderItem_btns button.button.btnResume');
	$btnDone = $($parentLi).find('.downloaderItem_btns button.button.btnDone');

	$sProgress = $($parentLi).find('.sProgressInfo .sProgress');

	switch(status) {
		case downloadStatus.download: //下载
			{
				startDownloadTask(url)
				$($btnPause).show()
				$($sProgress).html("排队中...")
			}
			break;
		case downloadStatus.pause: //暂停
			{
				pauseDownloadTask(url)
				$($btnResume).show()
			}
			break;
		case downloadStatus.resume: //继续下载
			{
				resumeDownloadTask(url)
				$($btnPause).show()
			}
			break;
		case downloadStatus.done: //下载完成
			{
				$($btnDone).show()
			}
			break;
		default:
			break;
	}
}

function getUrl(ele) {
	return $($(ele).parents(".downloadList ul li")[0]).attr("data-url")
}

function bytesToSize(bytes) {
	if(bytes === 0) return '0 B';
	var k = 1024;
	sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round(100.00 * (bytes / Math.pow(k, i))) / 100 + '' + sizes[i]; //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
}

var timestamp = 0

function downloadProgress(url, downloadedSize, totalSize) {
	if(isPause) return
	var timer = (new Date()).valueOf();
	if(timestamp == 0) timestamp = timer;
	else {
		if(timer - timestamp < 1000) return;
	}
	$parentLi = $(".downloadList ul li[data-url='" + url + "']")
	$sProgress = $($parentLi).find(".sProgress")
	$sPre = $($parentLi).find(".sPre")
	$sProjectProgress = $($parentLi).find(".projectProgress")
	$sProgressbar = $($parentLi).find(".projectProgress .loader-container")

	if(downloadedSize == -1) {
		$($sPre).html("0%")
		$($sProgress).html("正在请求...")
		if(totalSize == -2) {
			$($sProgress).html("准备下载...")
		}
		return
	}
	var sPre = Math.round(downloadedSize * 10000.00 / totalSize) / 100
	var downloadedSizeStr = bytesToSize(downloadedSize),
		totalSizeStr = bytesToSize(totalSize);
	$($sPre).html(sPre + "%")
	$($sProgress).html(downloadedSizeStr + "/" + totalSizeStr)
	$($sProgressbar).css("width", (sPre < 2 ? 2 : sPre) + "%")
	if(downloadedSize == totalSize) //下载完成
	{
		$($sPre).html("下载完成")
		$($sProgress).html(totalSizeStr)
		$($sProjectProgress).hide()
		//		SogreyCommon.log(downloadedSize + "/" + totalSize)
		setBtnsStatus(downloadStatus.done, $($sProgress))
	}
}
//downloadProgress("https://qd.myapp.com/myapp/qqteam/AndroidQQ/mobileqq_android.apk", -1, -1)
////////////////////////////////////////////////////////
/////////////    下载管理器
////////////////////////////////////////////////////////

var downloadTaskMap = {}
var isPause = false

function createDownloadTask(url) {
	if(typeof(url) == "undefined" || url == "") {
		SogreyCommon.toast("下载路径有误");
		downloadTaskMap[url] = null;
		return;
	}

	var dtask = downloadTaskMap[url]
	if(dtask) {
		//		SogreyCommon.toast("下载任务已创建！");
		return;
	}
	//	var url = url; // 'https://qd.myapp.com/myapp/qqteam/AndroidQQ/mobileqq_android.apk';
	var options = {
		method: "GET"
	};
	dtask = plus.downloader.createDownload(url, options);
	dtask.addEventListener("statechanged", function(task, status) {
		if(!task) {
			return;
		}
		//		SogreyCommon.log("下载任务状态：" + task.state)
		switch(task.state) {
			case 1: // 开始
				//				SogreyCommon.toast("开始下载...");
				downloadProgress(task.url, -1, -1)
				break;
			case 2: // 已连接到服务器
				//				SogreyCommon.toast("链接到服务器...");
				downloadProgress(task.url, -1, -2)
				break;
			case 3: // 已接收到数据
				//				SogreyCommon.toast("下载数据更新:");
				//				SogreyCommon.toast(task.downloadedSize + "/" + task.totalSize);
				downloadProgress(task.url, task.downloadedSize, task.totalSize)
				break;
			case 4: // 下载完成
				SogreyCommon.toast("下载完成！");
				//				SogreyCommon.toast(task.totalSize);
				downloadProgress(task.url, task.totalSize, task.totalSize)
				break;
		}
	});
	//	SogreyCommon.toast("创建下载任务成功！");

	downloadTaskMap[url] = dtask;
}

function startDownloadTask(url) {
	//	try {
	//	SogreyCommon.toast(url);
	var dtask = downloadTaskMap[url]
	if(!dtask) {
		//		SogreyCommon.toast("请先创建下载任务！");
		createDownloadTask(url)
		dtask = downloadTaskMap[url]
	}
	if(dtask) {
		dtask.start();
	}
	//	} catch(e) {
	//		SogreyCommon.toast(e.message);
	//	}
}
// 暂停下载任务
function pauseDownloadTask(url) {
	var dtask = downloadTaskMap[url]
	if(dtask) {
		dtask.pause();
		isPause = true
		//		SogreyCommon.toast("暂停下载！");
	}
}
// 恢复下载任务
function resumeDownloadTask(url) {
	var dtask = downloadTaskMap[url]
	if(dtask) {
		dtask.resume();
		//		SogreyCommon.toast("恢复下载！");
	}
}

function cancelDownloadTask(url) {
	var dtask = downloadTaskMap[url]
	if(dtask) {
		dtask.abort();
		dtask = null;
		//		SogreyCommon.toast("取消下载任务！");
	}
}

function clearDownloadTask() {

}

function startAll() {
	plus.downloader.startAll();
}