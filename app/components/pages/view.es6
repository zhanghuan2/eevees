const eevee = require('zcyEvE/ZCYeevee');
const server = require('zcyEvE/server');
let mask = Handlebars.templates['zcyEvE/controller/templates/mask'];
let selectTemplates = Handlebars.templates['zcyEvE/controller/templates/select'];
let selectCommp = Handlebars.templates['zcyEvE/controller/templates/selectCommp'];
let changeRegx = Handlebars.templates['zcyEvE/controller/templates/changeRegx'];
let changepageTemplates = Handlebars.templates['zcyEvE/controller/templates/changePage'];
let part = Handlebars.templates['zcyEvE/controller/templates/part'];
let compsetTemplates = Handlebars.templates['zcyEvE/controller/templates/compSet'];

let rightPart = Handlebars.templates['zcyEvE/controller/templates/rightPart'];



class EeveePageController {
  constructor() {
    this.beforeRender();
    this.render();
    this.bindEvent();
  }
  beforeRender(){
    this.page = 'search';
    this.disCode = '339900';
    this.hall = '';
    this.config = eevee.getBaseCfg();
    this.pageBox = this.$el.find('.ZCY-eevee-row-page');
    //保存数据
    this.tempjson = [];
    //发布数据
    this.data = {};
    this.index=null;
    this.name=null;
  }
  render(){
    let param = {
      'pageId': this.page,
      'district':this.disCode,
      'hall':this.hall
    };
    this.renderPage(param);
  }
  /**
   * 渲染装修页面
   * @parqam
   * 1、pageID,
   * 2、code
   * */
  renderPage(p){
    //TODO
    this.param = p;
    this.data = this.pageBox.data('json');
    this.tempjson = this.data.templateJson.slice(0);
    server.getWC().then((d)=>{
      this.$el.find('.side-content').html(rightPart(d));
    });
    server.getCommon().then((d)=>{
      this.area = d;
    });

  }

  bindEvent(){
    //组件hover事件
    this.$el.on('mouseover mouseout','.eevee-col-box',(e)=>{
      if (e.type == "mouseover") {
        this.mouseover(e)
      } else if (e.type == "mouseout") {
        this.mouseout(e)
      }
      e.preventDefault();
      e.stopPropagation();
    });
    //边框hover事件
    this.$el.on('mouseover mouseout','.eevee-grids,.eevee-col-row',(e)=>{
      let $tar = $(e.target);
      if (e.type == "mouseover") {
        $tar.addClass('hover-evt');
      } else if (e.type == "mouseout") {
        $tar.removeClass('hover-evt');
      }
    });
    //边框点击事件
    this.$el.on('click','.eevee-grids,.eevee-col-row',(e)=>{
      this.clickEvent(e);
    });

    //点击组件进行设置
    this.$el.on('click','.eevee-col-box',(e)=>{
      this.index = $(e.target).closest('.eevee-grids').data('index');
      this.name = $(e.currentTarget).data('name');
      this.clickEvent(e);
    });
    //页面选择
    this.$el.on('change','.controller-main input',(e)=>{
      this.setValue(e);
    });
    this.$el.on('click','.controller-box .h1-logo img',()=>{
      this.$el.find('.controller-box').addClass('upaction');
    });
    this.$el.on('click','.controller-right a',(e)=>{
      let $tar = $(e.target);
      $tar.hasClass('repComp') ? this.repComp() : this.deleComp();
    });
    //保存、发布
    this.$el.on('click','button,a.evt',(e)=>{
      let $tar = $(e.target);
      if($tar.hasClass('js-page-release')){
        this.submit();
      }else if($tar.hasClass('js-page-save')){
        this.saveComp();
      }
    });
    this.$el.on('click','.controller-tabs li',(e)=>{
      let $tar = $(e.target);
      $tar.hasClass('addLi') ? this.newRegx():this.changeTabs(e);
    });
    this.$el.on('click','.addRow',(e)=>{
      this.addLine();
    });

    //new event
    this.$el.on('click','button.js-page-show',()=>{
      this.$el.find('.comps-set').addClass('hide');
      this.$el.find('.body-content').toggleClass('body-showRight');
    });
    this.$el.on('click','button.addpage',()=>{
      this.addPage();
    });
    this.$el.find('.left-menu').on('click','ul.menu-li li',(e)=>{
      let $tar = $(e.target);
      if($tar.hasClass('active'))return;
      if($tar.hasClass('addLi')){
        this.addLi();
      }else{
        this.$el.find('.left-menu ul.menu-li li').removeClass('active');
        $tar.addClass('active');
        let id = $tar.data('pageid');
        this.renderHall(id);
      }
    });

    this.$el.on('click','.addAllComps',(e)=>{
      this.addAllCompsModal();

    });
    this.$el.on('click','.deleComs',(e)=>{
      this.deleComp();

    });
    this.$el.on('click','.setRouter',(e)=>{
      this.setRouter();
    });


  }
  setRouter(){
    let that = this;
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/setRouter",   //自定义模板路径
      title:'新增页面',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        m.close();
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
        $('.zcyEvE-modal').on('click','.addTD a', function () {
          that.addTD();
        })
      }
    });
  }
  addTD(){
    let html = `<tr>
          <td>
            作用大厅：
          </td>
          <td>
            <input type="text" name="pageid" />
          </td>
          <td>
            作用页面：
          </td>
          <td>
            <input type="text" name="pageid" />
          </td>
          <td>
            unless Page：
          </td>
          <td>
            <input type="text" name="pageid" />
          </td>
          <td class="addTD">
            <a>➕</a>
          </td>
        </tr>`;
    $('.zcyEvE-modal').find('tbody').find('.addTD').addClass('hide');
    $('.zcyEvE-modal').find('tbody').append(html);
  }
  addAllCompsModal(){
    let that = this;
    let cfg = this.config.comp;//changepageTemplates
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/changeAllComp",   //自定义模板路径
      data:cfg,
      title:'新增页面',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        let param = $('.zcyEvE-modal').find('table').getData({});
        that.addAllComp(param);
        m.close();
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    });
  }
  addAllComp(d){
    let rootPath = this.config.basePath;
    let path = rootPath+'/'+d.coms+'/view';
    let temp = Handlebars.templates[path];
    let fn = false;
    this.$el.find('.click-evt .eevee-col-row').append(`<div class="eevee-col-box">${temp()}</div>`);
    try{
      fn = require(path);
    }catch(e){
      console.log(e);
    }
    fn && new fn($);
  }
  addLine(){
    let html = `<div class="eevee-clu-line-index0 eevee-grids" style="min-height:30px">
                    <div class="eevee-col-row"></div>
                  </div>`;
    this.$el.find('.click-evt').after(html);
  }
  addPage(){
    let that = this;
    let cfg = this.config.page;//changepageTemplates
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/changePage",   //自定义模板路径
      data:cfg,
      title:'新增页面',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        let param = $('.zcyEvE-modal').find('table').getData({});
        that.changePage(param);
        m.close();
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    });

  }
  changePage(param){
    let li = `<li class="show-title" title="" data-shopid="">
      <div class="page-title">${param.pageid}</div>
      <div><a>${param.href}</a></div>
      <div title="${param.discode}"><span>适配区划：</span><span class="discode">${param.discode}</span></div>
    </li>`;
    this.$el.find('.side-content ul').append(li);

    this.showTemplate(param.coms);
  }
  showTemplate(d){
    if(d){
      eevee.renderPage({page:2},this.pageBox);
    } else {
      let html = `<div class="eevee-clu-line-index0 eevee-grids" style="min-height:30px">
                    <div class="eevee-col-row"></div>
                  </div>`
      this.pageBox.html(html);
    }
  }

  renderHall(){
    this.$el.find('.side-content').html(rightPart());
  }
  addLi(){
    let that = this;
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/changeRegx",   //自定义模板路径
      title:'大厅配置',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        let param = $('.zcyEvE-modal').find('table').getData({});
        that.changeRegx(param);
        m.close();
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    })
  }


  changeTabs(e){
    let $tar = $(e.target);
    if($tar.hasClass('active'))return;
  }
  newRegx(){
    let that = this;
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/changeRegx",   //自定义模板路径
      title:'区划配置',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        let val = $('.zcyEvE-modal').find('input[name=newregx]').val();
        if(val){
          that.changeRegx(val)
        }
        m.close();
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    })
  }
  changeRegx(v){
    let litemp = `<li class="active">${v.hallname}</li>`;
    this.$el.find('.addLi').before(litemp);
  }
  repComp(){
    let $tar = this.$el.find('.comp-selected');
    let that = this;
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/changeComp",   //自定义模板路径
      data:that.cfg.comp, //自定义模板的数据，
      title:'组件列表',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        let key = $('.zcyEvE-modal').find('select option:selected').html();
        let param = eevee.createHtml({name:key});
        that.$el.find('.comp-selected').replaceWith(param.content());
        m.close();
      },
      afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    })

  }
  deleComp(){
    let $tar = this.$el.find('.comp-selected');
    $tar.remove();
  }
  submit(a){
    let param = this.param;

  }
  saveComp(){
    let obj = this.tempjson[this.index].insert.comps;
    let saveData = this.getSaveData();
    $.each(obj,(i,v)=>{
      if(v.name == this.name){
        v.css = saveData.css;
        v.data = saveData.data;
      }
    });
    console.log(this.tempjson);
  }
  getSaveData(){
    let $tar = this.$el.find('.comps-set');
    let $css = $tar.find('form.cssform').find('.setdom');
    let $data = $tar.find('form.dataform').find('.setdom');
    let cssData = this.getCompsCommonData($css);
    let commonData = this.getCompsCommonData($data);
    return {
      css:cssData,
      data:commonData
    }
  }
  getCompsCommonData($dom){
    let result = {};
    $.each($dom,(i,v)=>{
      let key = $(v).attr('name');
      if($(v).is('input[type=text]')){
        result[key] = $(v).val();
      }else if($(v).is('input[type=radio]')){
        $(v).is(':checked') && (result[key] = $(v).val());
      }
    });
    return result
  }
  mouseover(e){
    let $tar = $(e.currentTarget);
    $tar.addClass('hover-evt');
    $tar.find('.controller-mask').length ==0 ? $tar.append(mask()) : $tar.find('.controller-mask').removeClass('hide');
  }
  mouseout(e){
    let $tar = $(e.currentTarget);
    $tar.find('.controller-mask').addClass('hide');
  }
  clickEvent(e){
    let $tar = $(e.currentTarget);
    $('.click-evt').removeClass('click-evt');
    $('#rowPage').find('.comp-selected').removeClass('comp-selected');
    if($tar.hasClass('eevee-col-box')){
      let result = this.clickCompEvent($tar);
      this.$el.find('.comps-set').html(compsetTemplates(result));
      $tar.addClass('comp-selected');
    }else{
      this.$el.find('.comps-set').html(compsetTemplates({type:'line'}));
      $tar.addClass('click-evt');
    }
    this.$el.find('.comps-set').removeClass('hide');
    this.$el.find('.body-content').addClass('body-showRight');
    this.current = $tar;



    e.preventDefault();
    e.stopPropagation();
    //let path = $tar.data('compPath');

    //let config = require(`${path}/config`);
    //if(!config) return;
    //let data = eevee.getConfig(config.defaultParam);
    //this.$el.find('.controller-main').html(part(data));
  }
  clickCompEvent (t){
    let $tar = t;
    let path = $tar.data('compath');

    let config = require(`${path}/config`);
    if(!config) return {};
    let result = eevee.getConfig(config.defaultParam);
    let param = {
      'width': t.width(),
      'height': t.height()
    };
    let json = $tar.data('json');
    let cssobj = json.css || {};
    let dataobj = json.data || {};
    let defaultobj = {};
    defaultobj.css = this.compareArr(result.css,cssobj);
    defaultobj.data = this.compareArr(result.data,dataobj);
    return $.extend(defaultobj,param);
  }
  changeConfig(obj){
    let result = [];
    for(let pop in obj){
      let temp = {};
      temp.name = pop;
      temp.defaultValue = obj[pop];
      result.push(temp)
    }
  }
  compareArr(arr1,obj){
    let result = [];
    $.each(arr1,(i,v)=>{
      let temp = v;
      let key = temp.name;
      if(obj[key]){
        temp.defaultValue = obj[key];
      }
      result.push(temp);
    });
    return result
  }
  setValue(e){
    let $tar = $(e.target);
    let name = $tar.attr('name');
    let value = $tar.val();
    this.current.css(name,value);
  }
}
module.exports = EeveePageController;
