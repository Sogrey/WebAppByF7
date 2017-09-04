var downloadTaskMap = {}

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
		if(!dtask) {
			return;
		}
//		SogreyCommon.log("下载任务状态：" + task.state)
		switch(task.state) {
			case 1: // 开始
				//				SogreyCommon.toast("开始下载...");
				downloadProgress(dtask.url, -1, -1)
				break;
			case 2: // 已连接到服务器
				//				SogreyCommon.toast("链接到服务器...");
				downloadProgress(dtask.url, -1, -2)
				break;
			case 3: // 已接收到数据
				//				SogreyCommon.toast("下载数据更新:");
				//				SogreyCommon.toast(task.downloadedSize + "/" + task.totalSize);
				downloadProgress(dtask.url, task.downloadedSize, task.totalSize)
				break;
			case 4: // 下载完成
				SogreyCommon.toast("下载完成！");
				//				SogreyCommon.toast(task.totalSize);
				downloadProgress(dtask.url, task.totalSize, task.totalSize)
				break;
		}
	});
//	SogreyCommon.toast("创建下载任务成功！");

	downloadTaskMap[url] = dtask;
}

function startDownloadTask(url) {
	//	try {
	SogreyCommon.toast(url);
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

function bytesToSize(bytes) {
	if(bytes === 0) return '0 B';
	var k = 1024;
	sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	i = Math.floor(Math.log(bytes) / Math.log(k));
	return Math.round(100.00 * (bytes / Math.pow(k, i))) / 100 + '' + sizes[i]; //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
}

function downloadProgress(url, downloadedSize, totalSize) {
	$parentLi = $(".downloadList ul li[data-url=" + url + "]")
	$sProgress = $($parentLi).find(".sProgress")
	$sPre = $($parentLi).find(".sPre")

	if(downloadedSize == -1) {
		$($sPre).html("0%")
		$($sProgress).html("正在请求...")
		if(totalSize == -2) {
			$($sProgress).html("准备下载...")
		}
		return
	}
	var sPer = Math.round(downloadedSize * 10000.00 / totalSize) / 100
	var downloadedSizeStr = bytesToSize(downloadedSize),
		totalSizeStr = bytesToSize(totalSize);
	$($sPre).html(sPre + "%")
	$($sProgress).html(downloadedSizeStr + "/" + totalSizeStr)
	if(downloadedSize == totalSize) //下载完成
	{
		$($sPre).html("下载完成")
		$($sProgress).html(totalSizeStr)
//		SogreyCommon.log(downloadedSize + "/" + totalSize)
		setBtnsStatus(downloadStatus.done, $($sProgress))
	}
}