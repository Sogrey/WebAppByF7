upload.addEventListener('change', function() {
	var upload = document.getElementById('upload'); //每次要动态获取
	var file = upload.files[0];
	console.log(file.size);

	//解决上传相同文件不触发onchange事件  
	var clone = upload.cloneNode(true);
	clone.onchange = arguments.callee; //克隆不会复制动态绑定事件
	clone.value = '';
	upload.parentNode.replaceChild(clone, upload);
}, false);