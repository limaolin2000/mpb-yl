<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page import="com.cetc28.member.login.dto.OnlineUser" %>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";

	String userId = "";
	String userName = "";
	String orgId = "";
	String orgName = "";
	OnlineUser onlineUser = (OnlineUser)session.getAttribute("Member.onlineUser");
	if(onlineUser != null){
		userId = onlineUser.getUserId();
		userName = onlineUser.getUserName();
		orgId = onlineUser.getOrgId();
		orgName = onlineUser.getOrgName();
	} else {
		userId = request.getParameter("userId");
		userName = request.getParameter("userName");
		orgId = request.getParameter("orgId");
		orgName = request.getParameter("orgName");
	}
	String view = request.getParameter("committeeMemberView");
%>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta charset="utf-8">
	<!-- Title and other stuffs -->
	<title>会员组织管理系统</title> 
	<meta name="keywords" content="会员组织管理系统" />
	<meta name="description" content="会员组织管理系统" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="author" content="">
	<!-- Stylesheets -->
	<link rel="stylesheet" href="../bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="<%=basePath%>/general/zTree/css/metroStyle/metroStyle.css">
	<link rel="stylesheet" href="../general/layui/css/layui.css"> 
	<link rel="stylesheet" href="../general/css/general.css"> 
	
	<!-- Font awesome icon -->
	<link rel="stylesheet" href="../bootstrap/css/font-awesome.css">

	<!-- JS -->
	<script src="../jquery/jquery-1.12.4.min.js"></script> <!-- jQuery -->
	<script src="../jquery/jquery.form.js"></script>
	<script src="../bootstrap/js/bootstrap.min.js"></script> <!-- Bootstrap -->
	<script src="../general/zTree/js/jquery.ztree.core.min.js"></script>
	<script src="../general/layui/layui.js"></script>
	<script src="../general/js/json2.js"></script>
	<script src="../general/js/region.js"></script>
	<script src="../general/js/common.js"></script>
	<script src="<%=basePath%>/system/orgManage/js/orgMenu.js"></script>
	<script src="../general/js/pagetable.js"></script>
	<script src="../general/js/jquery.placeholder.min.js"></script>
	<script src="../person/committeeMemberList.js"></script>
	
	<!-- STYLE -->
	<style>
		#menuContent {
			border:1px #ccc solid;
		}
		.form-group{
	  		margin-bottom:12px!important ;
	  		padding: 0 10px;
	  	}
	  	h2{
			background-color: #3588CC;
			color: white;
			padding: 8px 0;
		}
	</style>
</head>
<body>
	<!--[if lt IE 9]>
	<script src="<%=basePath%>/general/js/html5shiv.min.js"></script>
	<script src="<%=basePath%>/general/js/respond.min.js"></script>
	<![endif]-->
	<div class="container-fluid" style="padding: 0;">
		<h2>&nbsp;&nbsp;查询条件</h2>
		<div class="row form-inline" style="padding:15px 0 2px 0;margin: 0 0 10px 0;border:1px solid gainsboro">
			<div class="form-group">
				<input type="text" class="form-control" placeholder="选择所属工商联" maxlength="32" id="ssgsl" readonly onclick=showorgInputMenu()>
			</div>
			<div class="form-group">
				<input type="type" id="jieBie"  class="form-control" placeholder="输入代表大会届别" onfocus="borderNormal(this)" onblur="number4(this)"  style="width:200px;" />
			</div>
			<div class="form-group">
				<div>
					<select class="form-control" id="chdblx" style="width: 100%;"></select>
				</div>
			</div>
			<div class="form-group">
				<div>
					<select class="form-control" id="chsf" style="width: 100%;"></select>
				</div>
			</div>
			<div class="form-group">
				<div>
					<select class="form-control" id="status" style="width: 100%;">
						<option value = '1' selected>增替补</option>
						<option value = '2'>免职</option>
						<option value = '3'>撤销</option>
					</select>
				</div>
			</div>

			<div class="form-group">
				<div class="input-group">
					<input type="text" class="form-control" placeholder="输入人员姓名检索" maxlength="32" id="searchName"/>
					<span class="input-group-btn">
						<button type="button" class="btn btn-info" onclick="searchZcw()"><span class="glyphicon glyphicon-search"></span><span> 查询</span></button>
					</span>
				</div>
			</div>
			<div class="form-group" style="padding: 0;">
				<button type="button" class="btn btn-warning" onclick="reset()" style="margin: 0 8px;"><span class="glyphicon glyphicon-refresh"></span><span> 重置</span></button>
				<button type="button" id="addBtn" style="float: right;display:none;margin: 0 8px;" class="btn btn-success" onclick="addZcw()"><span class="glyphicon glyphicon-plus"></span>
					<span> 录入参会人员</span>
				</button>
			</div>
			<div class="form-group" style="text-align: center;">

			</div>
		</div>
		<div id="zcwGrid" style="padding-top: 10px;"></div>
	</div>
	<div id="menuContent" class="menuContent" style="display:none; position: absolute;background:white;z-index:3">
		<ul id="orgTree" class="ztree" style="margin-top:0; width:320px;"></ul>
	</div>
</body>
<script>
	var basePath = "<%=basePath%>";

	var ztreeType = '1';
	var userId = "<%=userId%>";
	var userName = "<%=userName%>";
	var userZzid = "<%=orgId%>";
	var userZzmc = "<%=orgName%>";
	var view = "<%=view%>";
	var genderMap = {};
	var nationMap = {};
	var zzmmMap = {};
	var sflbMap = {};

	layui.use(['element', 'form', 'layer'],function() {
		$("#chsf").html(initDicToMap('DBDHCHSF','请选择参会身份',sflbMap));
		initDicForElement('GRFL','请选择参会代表类型',$("#chdblx"));
		$('input[placeholder]').placeholder();
		if(view!='true'){
			$("#addBtn").css("display","block");
		}
		initDicToMap('XB','请选择性别',genderMap);
		initDicToMap('MZ','请选择民族',nationMap);
		initDicToMap('ZZMM','请选择政治面貌',zzmmMap);


		$('#ssgsl').css('background','white');
		orgCode = userZzid;
		orgName = userZzmc;
		$("#ssgsl").val(userZzmc);
		readOrgTree($('#ssgsl'),userZzid);
		searchZcw();
	});
</script>
</html>