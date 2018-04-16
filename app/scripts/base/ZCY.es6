window.ZCY = {};
ZCY.utils = (function(){
  var _modalId = 0;
  var _ModalTemplate = "";
  
  function _modal(){
    var param = arguments[0];
    var type = param.type || "normal";
    //获取模态框外层基础模板
    if(!_ModalTemplate)
      _ModalTemplate = Handlebars.templates["templates/modal"];
    var btn = [];
    //设置默认按钮文字
    if(param.button){
      btn = param.button;
    }
    var tempData = {
      title   :  param.title||"提示",
      btn1    :  (btn)[0] || "取消",
      btn2    :  (btn)[1] || "确定",
      cls     :  param.cls || "",
      type    :  type,
      content :  param.content || ["确认此操作吗？"],
      id      :  ++_modalId
    };
    //获取模态框dom节点
    var $modalDom = $(_ModalTemplate(tempData));
    //获取模态框body 自定义内容
    var html;
    if(param.templateUrl){
      var data = param.data || {};
      var templates =  Handlebars.templates[param.templateUrl];
      html = templates(data);
    }
    if(param.html){
      html  = param.html;
    }
    //将自定义 body内容嵌入到模态框中
    html && $modalDom.find(".modal-body").html(html);
    //当模态框不是normal时 内容填入
    if(!html && param.content.length>0 && type!="normal"){
      $modalDom.find(".modal-body .info-title").html(param.content[0]||"");
      type =="second" ?
        $modalDom.find(".modal-body .second-content").html(param.content[1]||"") :
        $modalDom.find(".modal-body .info-content").html(param.content[1]||"");
    }
    $("#modal-id-"+tempData.id).length == 0 && $('body').append($modalDom[0].outerHTML);
    
    var $modal = $("#modal-id-"+tempData.id);
    $modal.modal('show');
    
    //绑定按钮事件
    $modal.find(".modal-footer button").unbind("click.ZCY").bind("click.ZCY",function(){
      if($(this).hasClass("btn-cancel")){
        $.isFunction(param.cancel) ? param.cancel($modal) : $modal.modal('hide');
      }else{
        $.isFunction(param.confirm) ? param.confirm($modal) : $modal.modal('hide');
      }
    });
    //加载弹框show后的事件
    $.isFunction(param.afterRander) && param.afterRander($modal,"#modal-id-"+tempData.id);
    
    //二次弹框 CheckBox 选择时 按钮disabled 控制
    if(type=="second"){
      $("#modal-id-"+tempData.id).find(".second-checkbox").on("change.zcy",function(){
        if($(this).is(":checked")){
          $("#modal-id-"+tempData.id).find(".btn-success").removeAttr("disabled");
        }else{
          $("#modal-id-"+tempData.id).find(".btn-success").attr("disabled",true);
        }
      })
    }
    
    return {
      dom:$("#modal-id-"+tempData.id),
      modal:$modal
    };
  }
  
  function _getData(){
    var $tar = $(arguments[0]).find("[name]");
    var result = {};
    var config = arguments[1] || {};
    $.each($tar,function(i,v){
      var $dom = $(this);
      var _pop = $dom.attr("name");
      if($dom.hasClass(config.ignore)){
        return true;
      }
      var value="";
      
      if($dom.is("input")){
        if($dom.hasClass(config.money)){
        
        }else if($dom.hasClass(config["date-sec"])){
        
        }else{
          result[_pop] = $dom.val();
        }
        
      }else if($dom.is("select")){
        result[_pop] = $dom.val();
        result[_pop+"text"] = $dom.find("option:selected").text();
      }
      
    })
    return result;
  }
  
  $.fn.getData = function(){
    return _getData($(this),arguments[0]);
    
  };
  
  return {
    modal:function () {
      return _modal.apply(this,arguments);
    }
    
    
  }
  
  
  
})();