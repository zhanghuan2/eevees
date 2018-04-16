
class EeveePageController {
  constructor() {
    this.beforeRender();
    this.bindEvent();
  }
  beforeRender(){
    this.url = "";
    this.type = "";
  }
  /**
   * 渲染装修页面
   * @parqam
   * 1、pageID,
   * 2、code
   * */
  //渲染网站list
  renderList() {
  
  }
  //创建站点
  creatWeb(cls) {
    let param = $(cls).getData({
      'ignore':'ign-cls'
    });
    let $tbody = this.$el.find('.choose-url-list').find('tbody');
    let hbs = `<tr>
            <td>${param.name}</td>
            <td>${param.domain}</td>
            <td>--</td>
            <td class="td-operation" data-url="${param.domain}">
              <a href="javascript:;" class="js-release-site" id="110" data-toggle="confirm" data-title="你确定发布此商品?" data-content="确认发布？发布后站点下所有页面的改动都将生效。也可以选择进入装修界面后发布单个页面而非整个站点。" data-event="confirm:release-site">发布站点</a>&nbsp;
              <a href="/eevees/sites?type=${this.type}&link=${param.domain}" target="_blank">装修</a>&nbsp;
              <a href="javascript:;" class="js-sites-config-edit">修改</a>&nbsp;
              <a href="javascript:;" id="110" data-toggle="confirm" data-title="您确定删除吗?" data-content="删除之后无法恢复,确定删除吗?" data-event="confirm:delete-site">删除</a>&nbsp;
            </td>
          </tr>`
    $tbody.append(hbs);
  }
  bindEvent(){
    //选择装修方式
    this.$el.on('click','.choose-page .eevee-block-btn',(e)=>{
      let $tar = $(e.target);
      this.type = $tar.hasClass('net-eevees') ? 'net' : 'web';
      $('.choose-page').addClass('hide');
      this.renderList();
      $('.choose-url-list').removeClass('hide');
    });
    this.$el.on('click','.choose-url-list .js-sites-new',(e)=>{
      let that = this;
      ZCY.utils.modal({
        button:["取消","确认"], //按钮文案
        templateUrl:"zcyEvE/controller/templates/webConfig",   //自定义模板路径
        title:'站点配置',
        cls:"zcyEvE-modal-webConfig",                                 // 自定义class
        confirm:function(m){                             //确认的callback
          that.creatWeb('.zcyEvE-modal-webConfig');
          m.modal('hide');
        },afterRander:function(m,target){                 //弹出框渲染成功后的callback
          $('.zcyEvE-modal-webConfig').find('select').selectric();
        }
      });
    
    });
  }
}
module.exports = EeveePageController;
