/***
 @ Editor       Sogrey
 @ version      1.0.1
 @ DependOn     jQuery
 @ Date         2017-08-15
 ***/
(function(window, $) {

	var $ = $ ? $ : jQuery;
	var _colSuffix = "Index"

	var sogreyWebsql = SogreyWebsql = {
		editor: 'Sogrey',
		version: '1.0.1',
		date: '2017-08-15',
		upDate: '2017-08-25',
		jQueryVersion: $.fn.jquery,
		helpName: "SogreyWebsql APIs",
		help: function() {
			if(typeof(SogreyCommon) == "undefined") return "[404] I'm sorry! jquery-sogrey-common.js was not found！";
			return SogreyCommon._h(apiData);
		}
	}

	function log(object) {
		if(typeof(SogreyCommon) == "undefined") console.log(object);
		else SogreyCommon.log(object);
	}

	function error(object) {
		if(typeof(SogreyCommon) == "undefined") console.error(object);
		else SogreyCommon.error(object);
	}
	//打开/创建数据库
	SogreyWebsql.openDatabase = function(dbName, dbVersion, desc, size, callback) {
		if(null == callback) {
			return openDatabase(dbName, dbVersion, desc, size);
		} else {
			return openDatabase(dbName, dbVersion, desc, size, callback);
		}
	}
	//打开/创建数据库（使用配置）
	SogreyWebsql.openDatabaseWithDBData = function() {
		return SogreyWebsql.openDatabase(DBData.DBName, DBData.DBVersion, DBData.desc, 2 * 1024 * 1024, null);
	}
	//打开/创建数据库（使用配置 , 待回调）
	SogreyWebsql.openDatabaseWithDBDataCallback = function(callback) {
		return SogreyWebsql.openDatabase(DBData.DBName, DBData.DBVersion, DBData.desc, 2 * 1024 * 1024, callback);
	}
	//创建表
	SogreyWebsql.createTableWithDBData = function() {
		return SogreyWebsql.createTableWithDBDataCallback(null)
	}
	//创建表
	SogreyWebsql.createTableWithDBDataCallback = function(callback) {
		var db = SogreyWebsql.openDatabaseWithDBData()
		db.transaction(function(tx) {
			for(var i = 0; i < DBData.db.length; i++) {
				var cols = ""
				var colsArray = new Array(); //定义一数组 
				colsArray = DBData.db[i].cols.split("|"); //字符分割 
				for(var j = 0; j < colsArray.length; j++) {
					cols += colsArray[j]
					if(j < colsArray.length - 1) {
						cols += ","
					}
				}
				tx.executeSql('CREATE TABLE IF NOT EXISTS ' + DBData.db[i].tableName + ' (' + DBData.db[i].keyPath + ' unique, ' + cols + ')');
			}
			if(typeof(callback) === "function") {
				callback(tx)
			}
		});
		return db
	}
	//插入数据
	SogreyWebsql.insert = function(tableName, dataMap) {
		//		var key1 = '动态key1';
		//		var key2 = '动态key2';
		//		var map = {};
		//		map[key1] = 1;
		//		map[key2] = 2;
		//
		//		console.log(map[key1]); //结果是1.
		//		console.log(map[key2]); //结果是2.
		//
		//		//如果遍历map
		//		for(var prop in map) {
		//			if(map.hasOwnProperty(prop)) {
		//				console.log('key is ' + prop + ' and value is' + map[prop]);
		//			}
		//		}

		var keys = "",
			keysWhere = "";
		var values = "",
			valuesWhere = "";
		var key = SogreyWebsql.getKeyPathByTableName(tableName)
		var value = dataMap[key]
		for(var prop in dataMap) {

			if(dataMap.hasOwnProperty(prop)) {
				//log('key is ' + prop + ' and value is' + dataMap[prop]);
				keys += "'" + prop + "',"
				values += "'" + dataMap[prop] + "',"
				if(prop == key) {
					continue;
				}
				keysWhere += "" + prop + "|"
				valuesWhere += "'" + dataMap[prop] + "'|"
			}
		}
		keys = keys.substr(0, keys.length - 1)
		values = values.substr(0, values.length - 1)
		keysWhere = keysWhere.substr(0, keysWhere.length - 1)
		valuesWhere = valuesWhere.substr(0, valuesWhere.length - 1)

		SogreyWebsql.isExists(tableName, key + "=?", value, function(result) {
			if(result) {
				//				SogreyCommon.log("数据已存在-更新")
				//update
				//				SogreyCommon.log(tableName)
				//				SogreyCommon.log(keysWhere)
				//				SogreyCommon.log(valuesWhere)
				//				SogreyCommon.log(key)
				//				SogreyCommon.log("'" + value + "'")
				SogreyWebsql.update(tableName, keysWhere, valuesWhere, key, "'" + value + "'")
			} else {
				//insert
				SogreyWebsql.createTableWithDBDataCallback(function(tx) {
					//					log('INSERT INTO ' + tableName + ' (' + keys + ') VALUES (' + values + ')')
					tx.executeSql('INSERT INTO ' + tableName + ' (' + keys + ') VALUES (' + values + ')');
				})
				/*INSERT INTO planList ('id','pid','guid','title','startTimePlan','endTimePlan','startTime','endTime','completePer') 
				VALUES ('28','123','36','青海扎道路项目计划-28','2017.01.01','2017.01.21','2017.01.03','2017.01.31','20')*/
			}
		})

	}
	//数据库插入对象
	SogreyWebsql.insertObj = function(tableName, obj) {
		var map = {};
		for(var name in obj) {
			map[name] = obj[name] + "";
		}
		SogreyWebsql.insert(tableName, map)
	}
	SogreyWebsql.insertArray = function(tableName, array) {
		if(array.constructor === Array) { //数组
			for(var i = 0; i < array.length; i++) {
				SogreyWebsql.insertObj(tableName, array[i])
			}
		}
	}
	//删除数据
	SogreyWebsql.delete = function(tableName, whereArg, whereValue) {
		whereArg = " WHERE " + whereArg
		if(whereArg == "" || typeof(whereValue) == "undefined")
			whereArg = ""
		var whereValueArray = []
		if(whereValue != "" && typeof(whereValue) != "undefined")
			whereValueArray = whereValue.split("|")
		SogreyWebsql.executeSql('DELETE FROM ' + tableName + whereArg, whereValueArray)
	}
	//删除全部
	SogreyWebsql.deleteAll = function(tableName) {
		SogreyWebsql.executeSql('DELETE FROM ' + tableName, [])
	}
	//更新数据
	SogreyWebsql.update = function(tableName, setArg, setValue, whereArg, whereValue) {
		//log(setArg)
		//log(whereArg)
		//log(whereValue)
		//id|pid|guid|title|startTimePlan|endTimePlan|startTime|endTime|completePer
		//id
		//'31'|'001'|'148'|'青海扎道路项目计划-31'|'2017.01.01'|'2017.01.21'|'2017.01.03'|'2017.01.31'|'20'|'31'

		var setArgSql = ""
		var whereArgSql = ""

		var setArgArray = setArg.split("|")
		var setValueArray = setValue.split("|")
		var whereArgArray = whereArg.split("|")
		var whereValueArray = whereValue.split("|")

		for(var i = 0; i < setArgArray.length; i++) {
			setArgSql += setArgArray[i] + "=" + setValueArray[i] + ","
		}
		for(var i = 0; i < whereArgArray.length; i++) {
			whereArgSql += whereArgArray[i] + "=" + whereValueArray[i] + ","
		}

		setArgSql = setArgSql.substr(0, setArgSql.length - 1)
		whereArgSql = whereArgSql.substr(0, whereArgSql.length - 1)

		var sql = "UPDATE " + tableName + " SET " + setArgSql + " WHERE " + whereArgSql;
		log(sql)
		//		var db = SogreyWebsql.createTableWithDBData()
		//		db.transaction(function(tx) {
		//			//			UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值
		//
		//			//UPDATE planList SET id='15', pid='12345678', guid='123431', title='hahah' ,completePer='40' WHERE id='15'
		//			//			tx.executeSql("UPDATE planList SET id='15', pid='007', guid='ooo', title='yoyoyo' ,completePer='40' WHERE id='15'",[], function(tx1, results) {
		//			//				console.log(results)
		//			//			}, null);
		//			//			UPDATE planList SET pid='001',guid='148',title='青海扎道路项目计划-31',startTimePlan='2017.01.01',endTimePlan='2017.01.21',startTime='2017.01.03',endTime='2017.01.31',completePer='20' WHERE id='31'
		//			tx.executeSql(sql, [], function(tx1, results) {
		//				console.log(results)
		//			}, null);
		//		});
		SogreyWebsql.executeSql(sql, [])
	}
	//查询数据
	SogreyWebsql.query = function(tableName, whereArg, whereValue) {
		SogreyWebsql.queryCallback(tableName, whereArg, whereValue, null)
	}
	//查询数据
	SogreyWebsql.queryCallback = function(tableName, whereArg, whereValue, callback) {
		whereArg = " where " + whereArg
		if(whereArg == "" || typeof(whereValue) == "undefined")
			whereArg = ""
		var whereValueArray = []
		if(whereValue != "" && typeof(whereValue) != "undefined")
			whereValueArray = whereValue.split("|")

		var db = SogreyWebsql.createTableWithDBData()
		db.transaction(function(tx) {
			//					tx.executeSql('SELECT * FROM ' + tableName + whereArg, whereValueArray, function(tx1, results) {
			//				//				log(results)
			//				//				
			//				//				var html =(typeof(results.rows)=="SQLResultSetRowList")+"<br/>"+ "查询到" + results.rows.length + "条数据<br/>"
			//				//				for(i = 0; i < results.rows.length; i++) {
			//				//					html += "<p><b>" + results.rows.item(i).id + " - " + results.rows.item(i).name + " - " + results.rows.item(i).desc + "</b></p><br/>";
			//				//				}
			//				//				html +=JSON.stringify(results.rows)+"<br/>"
			//				//				html +=results.rows.item(1).name+"<br/>"
			//				//				html +=JSON.parse(JSON.stringify(results.rows)); 
			//				//				$("#result").html(html)
			//						if(typeof(callback) == "function") {
			//							callback(results.rows);
			//						}
			//					}, null);
			//				});
			SogreyWebsql.executeSqlCallback('SELECT * FROM ' + tableName + whereArg, whereValueArray, callback)
		});
	}
	//查询是否已存在
	SogreyWebsql.isExists = function(tableName, whereArg, whereValue, callback) {
		SogreyWebsql.queryCallback(tableName, whereArg, whereValue, function(rows) {
			if(typeof(callback) == "function") {
				if(rows.length > 0) {
					callback(true)
				} else {
					callback(false)
				}
			}
		});
	}
	SogreyWebsql.getKeyPathByTableName = function(tableName) {
		if(DBData && DBData.db && DBData.db.length > 0) {
			for(var i = 0; i < DBData.db.length; i++) {
				if(DBData.db[i].tableName === tableName) {
					return DBData.db[i].keyPath
				}
			}
		}
		return null
	}
	//执行sql
	SogreyWebsql.executeSql = function(sql, whereArg) {
		SogreyWebsql.executeSqlCallback(sql, whereArg, null)
	}
	SogreyWebsql.executeSqlCallback = function(sql, whereArg, callback) {
		var db = SogreyWebsql.createTableWithDBData()
		db.transaction(function(tx) {
			//			UPDATE 表名称 SET 列名称 = 新值 WHERE 列名称 = 某值

			//UPDATE planList SET id='15', pid='12345678', guid='123431', title='hahah' ,completePer='40' WHERE id='15'
			//			tx.executeSql("UPDATE planList SET id='15', pid='007', guid='ooo', title='yoyoyo' ,completePer='40' WHERE id='15'",[], function(tx1, results) {
			//				console.log(results)
			//			}, null);
			//			UPDATE planList SET pid='001',guid='148',title='青海扎道路项目计划-31',startTimePlan='2017.01.01',endTimePlan='2017.01.21',startTime='2017.01.03',endTime='2017.01.31',completePer='20' WHERE id='31'
			tx.executeSql(sql, whereArg, function(tx1, results) {
				if(typeof(callback) == "function")
					callback(results.rows)
			}, null);
		});
	}
	var apiData = {
		title: SogreyWebsql.helpName,
		version: SogreyWebsql.version,
		jqueryVersion: SogreyWebsql.jQueryVersion,
		otherRelyOn: [{
			name: "jquery-sogrey-common.js",
			version: "1.0.0"
			//SogreyCommon.version
		}], //其他依赖项
		field: [
			/*{
						fieldName: "isDebug",
						type: "boolean",
						desc: "true输出日志，false则不"
					}*/
		],
		functions: [{
				funName: "log(object)",
				desc: "log日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			},
			{
				funName: "error(object)",
				desc: "error日志输出",
				params: [{
					paramName: "object",
					desc: "object对象，可以是字符串"
				}]
			},
			{
				funName: "SogreyWebsql.openDatabase(dbName, dbVersion, desc, size,callback)",
				desc: "打开数据库，不存在则创建",
				params: [{
					paramName: "dbName",
					desc: "数据库名"
				}, {
					paramName: "dbVersion",
					desc: "数据库版本号"
				}, {
					paramName: "desc",
					desc: "描述"
				}, {
					paramName: "size",
					desc: "数据库大小"
				}, {
					paramName: "callback",
					desc: "[可选]创建回调会在创建数据库后被调用"
				}]
			},
			{
				funName: "SogreyWebsql.openDatabaseWithDBData()",
				desc: "使用配置打开数据库，不存在则创建",
				params: []
			},
			{
				funName: "SogreyWebsql.openDatabaseWithDBDataCallback(callback)",
				desc: "打开数据库，不存在则创建，带回调",
				params: [{
					paramName: "callback",
					desc: "创建回调会在创建数据库后被调用"
				}]
			},
			{
				funName: "SogreyWebsql.createTableWithDBData()",
				desc: "创建表,需配置DBData.db字段",
				params: []
			},
			{
				funName: "SogreyWebsql.createTableWithDBDataCallback(callback)",
				desc: "创建表,需配置DBData.db字段",
				params: [{
					paramName: "callback",
					desc: "创建回调会在创建表后被调用"
				}]
			},
			{
				funName: "SogreyWebsql.insert(tableName, dataMap)",
				desc: "向表tableName中插入数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "dataMap",
					desc: "要插入的数据；dataMap是个map,定义参考 ：\n                   var key = '动态key';\n                   var map = {};\n                   map[key1] = 'value';"
				}]
			},
			{
				funName: "SogreyWebsql.insertObj(tableName, obj)",
				desc: "向表tableName中插入单数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "obj",
					desc: "要插入的数据对象，会自动读取该对象的所有字段属性及对应属性值成列，进行插入数据"
				}]
			},
			{
				funName: "SogreyWebsql.insertArray(tableName, array)",
				desc: "向表tableName中插入一组数据，数组",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "array",
					desc: "要插入的数据对象数组，会自动读取该对象的所有字段属性及对应属性值成列，进行插入数据"
				}]
			},
			{
				funName: "SogreyWebsql.delete(tableName, whereArg, whereValue)",
				desc: "删除tableName中数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "whereArg",
					desc: "删除条件；例如 'id=? and name=?' "
				}, {
					paramName: "whereValue",
					desc: "删除条件中替换?的值('|'分割);例如 '1|李雷' "
				}]
			},
			{
				funName: "SogreyWebsql.deleteAll(tableName)",
				desc: "删除tableName中全部数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}]
			},
			{
				funName: "SogreyWebsql.update(tableName, setArg,setValue, whereArg, whereValue)",
				desc: "更新tableName中数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "setArg",
					desc: "要更新的新数据字段名"
				}, {
					paramName: "setValue",
					desc: "要更新的新数据值"
				}, {
					paramName: "whereArg",
					desc: "要更新的条件；例如 'id=?' "
				}, {
					paramName: "whereValue",
					desc: "要更新的条件中替换?的值('|'分割);例如 '李雷|1' "
				}]
			},
			{
				funName: "SogreyWebsql.query(tableName, whereArg, whereValue)",
				desc: "查询tableName中数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "whereArg",
					desc: "查询条件；例如 'id=? and name=?' "
				}, {
					paramName: "whereValue",
					desc: "查询条件中中替换?的值('|'分割);例如 '李雷|1' "
				}]
			},
			{
				funName: "SogreyWebsql.queryCallback(tableName, whereArg, whereValue, callback)",
				desc: "查询tableName中数据",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "whereArg",
					desc: "查询条件；例如 'id=? and name=?' "
				}, {
					paramName: "whereValue",
					desc: "查询条件中中替换?的值('|'分割);例如 '李雷|1' "
				}, {
					paramName: "callback",
					desc: "查询回调"
				}]
			},
			{
				funName: "SogreyWebsql.isExists(tableName, whereArg, whereValue, callback)",
				desc: "检查指定条件下数据是否已存在",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}, {
					paramName: "whereArg",
					desc: "查询条件；例如 'id=? and name=?' "
				}, {
					paramName: "whereValue",
					desc: "查询条件中中替换?的值('|'分割);例如 '李雷|1' "
				}, {
					paramName: "callback",
					desc: "回调函数 function ,其携带参数 为boolean 型，true已存在，false不存在 "
				}]
			},
			{
				funName: "SogreyWebsql.getKeyPathByTableName(tableName)",
				desc: "检查指定表的主键key",
				params: [{
					paramName: "tableName",
					desc: "表名"
				}]
			},
			{
				funName: "SogreyWebsql.executeSql(sql,whereArg)",
				desc: "执行sql语句",
				params: [{
					paramName: "sql",
					desc: "sql语句"
				}, {
					paramName: "whereArg",
					desc: "替换sql语句中?的值，是个数组"
				}]
			},
			{
				funName: "SogreyWebsql.executeSqlCallback(sql,whereArg,callback)",
				desc: "执行sql语句",
				params: [{
					paramName: "sql",
					desc: "sql语句"
				}, {
					paramName: "whereArg",
					desc: "替换sql语句中?的值，是个数组"
				}, {
					paramName: "callback",
					desc: "执行回调，其参数是查询结果，rows 是数组，lenght长度"
				}]
			}
		]
	}
	//数据库表结构
	var DBData = {
		DBName: "GLWebGLBIMEngine",
		DBVersion: 1,
		desc: "Bim 5D webapp 数据库",
		db: [{
			tableName: "users", //表名
			keyPath: "userId", //主键
			cols: "userName" //除主键外其他字段列名
		}, {
			tableName: "baseData", //表名
			keyPath: "id",
			cols: "name|desc" //字段列名
		}, {
			tableName: "keyValue", //表名
			keyPath: "key",
			cols: "value" //字段列名
		}, {
			tableName: "planList30", //月计划表名
			keyPath: "id",
			cols: "pId|guid|title|startTimePlan|endTimePlan|startTime|endTime|completePer|componentID" //字段列名
		}, {
			tableName: "planList10", //旬计划表名
			keyPath: "id",
			cols: "pId|guid|title|startTimePlan|endTimePlan|startTime|endTime|completePer|componentID" //字段列名
		}, {
			tableName: "planList7", //周计划表名
			keyPath: "id",
			cols: "pId|guid|title|startTimePlan|endTimePlan|startTime|endTime|completePer|componentID" //字段列名
		}, {
			tableName: "planList1", //日计划表名
			keyPath: "id",
			cols: "pId|guid|title|startTimePlan|endTimePlan|startTime|endTime|completePer|componentID" //字段列名
		}, {
			tableName: "planSubmitHistory", //日志提交历史记录
			keyPath: "localId", //本地ID，同步后有网络ID；同步下来的数据 本地ID与网络ID一致
			cols: "id|pId|title|reportTime|startTime|endTime|startTimeAsPlanned|endTimeAsPlanned|rate|stopWorkingCase|delayCase|images|videos|files|remark|componentIds|status" //字段列名   status-同步状态 0-未同步 1-已同步
		}]
	}
	window.sogreyWebsql = window.SogreyWebsql = SogreyWebsql;
})(window, jQuery);

//http://www.runoob.com/html/html5-web-sql.html