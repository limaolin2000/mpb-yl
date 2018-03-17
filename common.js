var flag1=true,flag2=true,flag3=true,flag4=true,flag5=true,flag6=true,flag7=true,flag8=true,flag9=true,flag10=true;
var flag11=true,flag12=true,flag13=true,flag14=true;
//var resetflag=true;
var personDataId;
var enterpriseDataId;
var chamDataId;
var layerIndex;//进度条
function initWidget(area) {
  /* Widget minimize */
  if (area == undefined) area = '';
  $(area + ' .wminimize').click(function(e){
    e.preventDefault();
    var $wcontent = $(this).parent().parent().next('.widget-content');
    if($wcontent.is(':visible')) 
    {
      $(this).children('i').removeClass('chevron-up');
      $(this).children('i').addClass('chevron-down');
    }
    else 
    {
      $(this).children('i').removeClass('chevron-down');
      $(this).children('i').addClass('chevron-up');
    }            
    $wcontent.slideToggle(300);
  }); 
  
	/* Widget close */
	$(area + ' .wclose').click(function(e){
	  e.preventDefault();
	  var $wbox = $(this).parent().parent().parent();
	  $wbox.hide(100);
	});
}

/**Form数据加载**/
function loadData(form, data){
	for(var name in data){
		var val = data[name];
		val = convertDateNoHour(val);
		$('input[name="'+name+'"][type="text"]', form).val(val);
		$('input[name="'+name+'"][type="number"]', form).val(val);
		$('textarea[name="'+name+'"]', form).val(val);
		$('select[name="'+name+'"]', form).val(val);
	}
}

function initDicForElement(typecode,info,element,firstLineUnuse) {
	// console.log(typecode);
	var dicHtml;
	$.ajax({
		type: "POST",
		async: false,
		url: basePath+"mvc/dictionary/getDictionaryByType",
		data:{
			typecode:typecode
		},
		dataType: "json",
		success: function(data){
			if(firstLineUnuse){
                // dicHtml = '<option value="" disabled>'+info+'</option>';
			}else{
                dicHtml = '<option value="" selected>'+info+'</option>';
			}

			var dicList = data.object;
			for(var i=0; i<dicList.length; i++ ){
				dicHtml += ('<option value="'+dicList[i].code+'">' + dicList[i].name + '</option>');
			}
			element.html(dicHtml);
            // $(element).empty();
			// $(element).append(dicHtml);
		}
	});
	return dicHtml;
}

function initDicToMap(typecode,info,dicMap,firstLineUnuse) {
	// console.log(typecode);
	var dicHtml;
	$.ajax({
		type: "POST",
		async: false,
		url: basePath+"mvc/dictionary/getDictionaryByType",
		data:{
			typecode:typecode
		},
		dataType: "json",
		success: function(data){
            if(firstLineUnuse){
                dicHtml = '<option value="" disabled>'+info+'</option>';
            }else{
                dicHtml = '<option value="" selected>'+info+'</option>';
            }
			var dicList = data.object;
			for(var i=0; i<dicList.length; i++ ){
				dicHtml += ('<option value="'+dicList[i].code+'">' + dicList[i].name + '</option>');
				if (dicMap) dicMap[dicList[i].code] = dicList[i].name;
			}
		}
	});
	return dicHtml;
}

function initDicToRadio(typecode,name,element) {
	var dicHtml;
	$.ajax({
		type: "POST",
		async: false,
		url: basePath+"mvc/dictionary/getDictionaryByType",
		data:{
			typecode:typecode
		},
		dataType: "json",
		success: function(data){
			dicHtml = '';
			var dicList = data.object;
			for(var i=0; i<dicList.length; i++ ){ 
				dicHtml += ('<input type="radio" name="'+name+'"   value="'+dicList[i].code+'" title="'+dicList[i].name+'"    />');
			}
			//element.html(dicHtml);
            $(element).empty();
			$(element).append(dicHtml);
		}
	});
	return dicHtml;
}

function initDicToCheckbox(typecode,name,element) {
	var dicHtml;
	$.ajax({
		type: "POST",
		async: false,
		url: basePath+"mvc/dictionary/getDictionaryByType",
		data:{
			typecode:typecode
		},
		dataType: "json",
		success: function(data){
			dicHtml = '';
			var dicList = data.object;
			for(var i=0; i<dicList.length; i++ ){
				if((userZzid!="0-0" && dicList[i].name=="知名度高企业家") || (userZzid!="0-0" && dicList[i].name=="影响力大企业家") || (userZzid!="0-0" && dicList[i].name=="代表性强企业家")){}
				else{
					dicHtml += ('<input type="checkbox" lay-skin="primary"  name="'+name+'"   value="'+dicList[i].code+'" title="'+dicList[i].name+'"    />');
				}			
			}
      $(element).empty();
			$(element).append(dicHtml);
		}
	});
	return dicHtml;
}




function changeCheckbox(){
		var status = $("#zxsfkq").is(':checked');
		if(status){
            layui.layer.confirm("点击“空缺”后，将清空已填写的信息，确定空缺？" ,{icon: 1,btn: ['确定','取消'],cancel:function(){$("#zxsfkq").prop("checked",false);}},
				function (index){
            		ryid = "";
					//清空元素
					$("input:not(#zxsfkq)").val("");
					$(".ldlxbm").val("");
					//清空所有职务信息
					$("#tableGsl").empty();
					$("#tableRd").empty();
					$("#tableZf").empty();
					$("#tableZx").empty();
					zwParamList = {};
					//$(".wminimize").hide();

					$(".btn:not(#submitAll)").hide();
					$(".form-control").prop("readonly",true);
					$("select").prop("disabled",true);
					$("input:not(#zxsfkq)").prop("disabled",true);
                    layui.layer.close(index);
				},
				function (index){
                    $("#zxsfkq").prop("checked",false);
                    // layui.layer.close(index);
				});

		}else{
			// $(".wminimize").show();
			$(".btn:not(#reTypeinLeader)").show();
			$(".form-control").prop("readonly",false);
			$("select").prop("disabled",false);
			$("input").prop("disabled",false);
		}

}

function resetInput(){
	flag1=flag2=flag3=flag4=flag5=flag6=flag7=flag8=flag9=flag10=flag11=flag12=flag13=flag14=true;	
	$(".resetcss").css("border-color","#ccc");
	ryid = "";
	$("input").val("");
	$("select").val("");
	$("#tableGsl").empty();
	$("#tableRd").empty();
	$("#tableZf").empty();
	$("#tableZx").empty();
	zwParamList = {};
	$('#chooseLeader').show();
	$('#leaderName').prop("readonly",false);
}
function closeWindow(){
	parent.closeLayer();
}
function closeLayer() {
	layui.layer.close(layer.index);
}
function showDetailWin(title,url,onEnd){
	var height=$(document).height()-20;
	var width=$(document).width()-20;
	layer.open({
        title:[title,'background-color:#36a9e1;color:white;font-size:20px;font-family:微软雅黑;text-align:center;font-weight: bold;'],
        type:2,
        closeBtn:1,
        move:false,
        area:['98%','98%'],
		content:url,
		success:function(){},
		end:function() {if(onEnd) onEnd();}
	});
}

function modifyLayuiArea(index,height){
	layer.style(index,{
		height:height
	});
}	

function setBtxx(){
    $(".btxx").each(function(index){
        $(".btxx").eq(index).html($(".btxx").eq(index).html() + "<span style = 'color:red'>*</span>");
    });
}

function setPageBtxx(pageId){
	$("#"+pageId+" .btxx").each(function(index){
		$("#"+pageId+" .btxx").eq(index).html($("#"+pageId+" .btxx").eq(index).html() + "<span style = 'color:red'>*</span>");
	});
}


function jyBtxNull(){
	var hasNull = false;
	$(".btx").each(function(index){
		if(!($(".btx").eq(index).is(':visible'))) {return true};
		var a = $(".btx").eq(index).val();
		//alert($(".btx").eq(index).attr('name')+'-------------------'+a);
		if(typeof(a) == 'undifined' || typeof(a) == 'null' || a=='' || a==null){
			hasNull = true;
			return false;
		}
	});
	return hasNull;
}

function jyBtxFormNull(formName){
	var hasNull = false;
	$("#"+formName).find('.btx').each(function(index){
		if(!($("#"+formName).find('.btx').eq(index).is(':visible'))) {return true};
		var a = $("#"+formName).find('.btx').eq(index).val();
		if(typeof(a) == 'undifined' || typeof(a) == 'null' || a=='' || a==null){
			hasNull = true;
			return false;
		}
	});
	return hasNull;
}

function getAllZws(){
    $.ajax({
        type: "POST",
        async: false,
        url: basePath+"mvc/dictionary/getAllZw",
        data:{
        },
        dataType: "json",
        success: function(data){
            zwDic = data.object;
        }
    });
    return zwDic;

}
function reLoad(){
	location.reload();
}
//统计导出excel文件
function exportExcel(){
	var src = basePath+"mvc/org/exportToExcel";
//	if(listData.join(",") == ""){
//		layui.layer.alert('请先统计出要导出的数据！',{icon: 2});
//		return;
//	}
	var oForm = $("<form method='post' enctype='multipart/form-data;charset=utf-8'><input type='hidden' name='values' value='"+listData.join(",")+"'/><input type='hidden' name='fileName' value='"
		+encodeURI(exportTitle)+"'/><input type='hidden' name='length' value='"+titleData.length+"'/></form>")
	oForm.attr("action",src);
	oForm.appendTo("body").submit().remove();
//	var elesrc = basePath+"mvc/org/exportToExcel?values="+listData+"&fileName="+exportTitle+"&length="+titleData.length;
//	var ele = document.createElement("iframe");
//	ele.src = elesrc;
//	ele.style.display = "none";
//	document.body.appendChild(ele);
}

function borderNormal(ele){
//	flag=true;
	$(ele).css("border-color","#ccc");
}
//正则 验证手机号，固定电话，邮箱
function testPhoneNum(ele){
	var reg = /^1[3|4|5|7|8][0-9]{9}$/;
	if($(ele).val() == ""){
		flag1=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag1=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag1=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的手机号！',{icon: 2});
	}
}
function testTelephoneNum(ele){
	var reg = /^(\(0\d{2,3}\)|\(0\d{2,3}\)-|\d{3,4}-|\s)?\d{7,8}$/;
	if($(ele).val() == ""){
		flag2=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag2=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag2=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的电话号码！',{icon: 2});
	}
}
function testEmail(ele){
	var reg = /^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z0-9_-]{2,5}$/;
	if($(ele).val() == ""){
		flag3=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag3=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag3=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的邮箱！',{icon: 2});
	}
}

function idCard(ele){
	var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
	if($(ele).val() == ""){
		flag4=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag4=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag4=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的身份证号！',{icon: 2});
	}
}

function uRL(ele){
	var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/|)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
	if($(ele).val() == ""){
		flag5=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag5=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag5=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的网址！',{icon: 2});
	}
}

function QQ(ele){
	var reg =/^[1-9][0-9]{4,14}$/;
	if($(ele).val() == ""){
		flag6=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag6=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag6=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的QQ！',{icon: 2});
	}
}

function postcord(ele){
	var reg = /^[1-9][0-9]{5}$/;
	if($(ele).val() == ""){
		flag7=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag7=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag7=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的邮编！',{icon: 2});
	}
}

function weiXIN(ele){
	var reg = /^[a-zA-Z\d_]{5,}$/;
	if($(ele).val() == ""){
		flag8=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag8=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag8=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的微信！',{icon: 2});
	}
}
//传真
function fax(ele){
	var reg = /^(\d{3,4}-)?\d{7,8}$/;
	if($(ele).val() == ""){
		flag9=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag9=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag9=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的传真！',{icon: 2});
	}
}

//年份 个人荣誉
function year(ele){
	var reg = /^(20[12][0-9]|2030)+((,|，)+(20[12][0-9]|2030))*$/;
	if($(ele).val() == ""){
		flag10=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag10=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag10=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入一个或多个2010~2030范围内的年份，以逗号隔开，勿以逗号结尾！',{icon: 2});
	}
}
//年份
function year2(ele){
	var reg = /^(20[12][0-9]|2030)+$/;
	if($(ele).val() == ""){
		flag11=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag11=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag11=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的年份,范围为2010~2030！',{icon: 2});
	}
}


//数量(资金万元)
function number(ele){
	var reg = /^\d+(\.\d{1,2})?$/;
	if($(ele).val() == ""){
		flag12=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag12=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag12=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的非负数值，小数点最多保留两位！',{icon: 2});
	}
}

//数量(人数)
function number3(ele){
	var reg = /^(0|[1-9]\d*)$/;
	if($(ele).val() == ""){
		flag13=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag13=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag13=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入正确的非负整数！',{icon: 2});
	}
}

//百分比  0~100
function number2(ele){
	var reg = /^(\d{1,2}(\.\d{1,2})?|100)$/;
	if($(ele).val() == ""){
		flag14=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag14=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag14=false;
		$(ele).css("border-color","red");
		layui.layer.alert('请输入0~100的数值，小数点最多保留两位！',{icon: 2});
	}
}

//1-99
function number4(ele){
	var reg = /^[1-9][0-9]{0,1}$/;
	if($(ele).val() == ""){
		flag13=true;
		return;
	}
	if(reg.test($(ele).val())){
		flag13=true;
		$(ele).css("border-color","#ccc");
	}else{
		flag13=false;
		$(ele).css("border-color","red");
		
		layui.layer.alert('代表大会届别必须大于0，小于100！',{icon: 2},function(){$(ele).val('');layer.close(layer.index);});
	}
}
function testReg(){
	if(flag1&&flag2&&flag3&&flag4&&flag5&&flag6&&flag7&&flag8&&flag9&&flag10&&flag11&&flag12&&flag13&&flag14){
		return true;
	}else{
		return false;
	}
}

function convertDateNoHour(val){
	var reg1 = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
	var reg2 = /^[0-9]{4}\/[0-9]{2}\/[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
	if(reg1.test(val) || reg2.test(val)){
		if(val.indexOf('00:00:00')>0){
			return val = val.substring(0,10);
		}else{
			return val;
		}
	}else{
		return val;
	}
}

function repetitiveYear(thisYear,yearEle,otherValue,otherEle){
	var result = false;
	yearEle.each(function(index){
        if(yearEle.eq(index).val() === thisYear){
        	if((typeof(otherValue) !== 'undefined' && otherEle.eq(index).val() === otherValue) || typeof(otherValue) === 'undefined'){
                layui.layer.alert('该年份已录入过了',{icon: 2});
                result = true;
                return false;
			}
        }
    });
	return result;
}


//判断选中荣誉时，年份是否输入
function grRynfNull(){
	var nfNull = false;
	$("#nfbt").find("input[type='checkbox']").each(function(index){
		if($("#nfbt").find("input[type='checkbox']").eq(index).is(':checked')){
			var a = $(this).siblings("input[type='text']").val();
			if(a == ""){
				nfNull = true;
				return true;
			}
		}
		
	});
	return nfNull;	
}

function resetForm(formName)
{
	$("#"+formName)[0].reset();
	$(".layui-anim-scaleSpring",$("#"+formName)).removeClass("layui-anim-scaleSpring")
	$(".layui-form-radioed",$("#"+formName)).removeClass("layui-form-radioed")
	$('.layui-form-onswitch',$("#"+formName)).children("em").html('否');
	$('.layui-form-onswitch',$("#"+formName)).removeClass('layui-form-onswitch');
}
function resetTable(tableName)
{
	$("#"+tableName).empty();
}
//将字符转换成HTMLENtites，以对抗XSS
function htmlEncode(str){
			var hex = new Array('0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f');
			var preecsape = str;
			var escaped = '';
			for(var i = 0; i < preecsape.length; i++){
				var p = preecsape.charAt(i);
				escaped = escaped + escapeChatx(p);
			}
			return escaped;
			function escapeChatx(original){
				var found = true;
				var thechar = original.charCodeAt(0);
				switch(thechar){
					case 10: return "<br/>"; break;
					case 32: return "&nbsp;"; break;
					case 34: return "&quot;"; break;
					case 38: return "&amp;"; break;
					case 39: return "&#x27;"; break;
					case 47: return "&#x2F;"; break;
					case 60: return "&lt;"; break;
					case 62: return "&gt;"; break;
					case 162: return "&cent;"; break;
					case 192: return "&Agrave;"; break;
					case 193: return "&Aacute;"; break;
					case 194: return "&Acirc;"; break;
					case 195: return "&Atilde;"; break;
					case 196: return "&Auml;"; break;
					case 197: return "&Aring;"; break;
					case 198: return "&AElig;"; break;
					case 199: return "&Ccedil;"; break;
					case 200: return "&Egrave;"; break;
					case 201: return "&Eacute;"; break;
					case 202: return "&Ecirc;"; break;
					case 203: return "&Euml;"; break;
					case 204: return "&Igrave;"; break;
					case 205: return "&Iacute;"; break;
					case 206: return "&Icirc;"; break;
					case 207: return "&Iuml;"; break;
					case 208: return "&ETH;"; break;
					case 209: return "&Ntilde;"; break;
					case 210: return "&Ograve;"; break;
					case 211: return "&Oacute;"; break;
					case 212: return "&Ocirc;"; break;
					case 213: return "&Otilde;"; break;
					case 214: return "&Ouml;"; break;
					case 216: return "&Oslash;"; break;
					case 217: return "&Ugrave;"; break;
					case 218: return "&Uacute;"; break;
					case 219: return "&Ucirc;"; break;
					case 220: return "&Uuml;"; break;
					case 221: return "&Yacute;"; break;
					case 222: return "&THORN;"; break;
					case 224: return "&agrave;"; break;
					case 223: return "&szlig;"; break;
					case 225: return "&aacute;"; break;
					case 226: return "&acirc;"; break;
					case 227: return "&atilde;"; break;
					case 228: return "&auml;"; break;
					case 229: return "&aring;"; break;
					case 230: return "&aelig;"; break;
					case 231: return "&ccedil;"; break;
					case 232: return "&egrave;"; break;
					case 233: return "&eacute;"; break;
					case 234: return "&ecirc;"; break;
					case 235: return "&euml;"; break;
					case 236: return "&igrave;"; break;
					case 237: return "&iacute;"; break;
					case 238: return "&icirc;"; break;
					case 239: return "&iuml;"; break;
					case 240: return "&eth;"; break;
					case 241: return "&ntilde;"; break;
					case 242: return "&ograve;"; break;
					case 243: return "&oacute;"; break;
					case 244: return "&ocirc;"; break;
					case 245: return "&otilde;"; break;
					case 246: return "&ouml;"; break;
					case 248: return "&oslash;"; break;
					case 249: return "&ugrave;"; break;
					case 250: return "&uacute;"; break;
					case 251: return "&ucirc;"; break;
					case 252: return "&uuml;"; break;
					case 253: return "&yacute;"; break;
					case 254: return "&thorn;"; break;
					case 255: return "&yuml;"; break;
					case '\r':  break;
					default:
						found = false;
						break;
				}
				if(!found){
					if(thechar > 127){
						var c = thechar;
						var a4 = c % 16;
						c = Math.floor(c/16);
						var a3 = c % 16;
						c = Math.floor(c/16);
						var a2 = c % 16;
						c = Math.floor(c/16);
						var a1 = c % 16;
						return "&#X"+hex[a1]+hex[a2]+hex[a3]+hex[a4]+";";
					}else{
						return original;
					}
				}
			}
		}