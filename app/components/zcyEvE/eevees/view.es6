const eevee = require('zcyEvE/ZCYeevee');
const server = require('zcyEvE/server');
let mask = Handlebars.templates['zcyEvE/controller/templates/mask'];
let selectTemplates = Handlebars.templates['zcyEvE/controller/templates/select'];
let selectCommp = Handlebars.templates['zcyEvE/controller/templates/selectCommp'];
let changeRegx = Handlebars.templates['zcyEvE/controller/templates/changeRegx'];
let changepageTemplates = Handlebars.templates['zcyEvE/controller/templates/changePage'];
let part = Handlebars.templates['zcyEvE/controller/templates/part'];
let reviewPage = Handlebars.templates['zcyEvE/controller/templates/reviewPage'];
let compsetTemplates = Handlebars.templates['zcyEvE/controller/templates/compSet'];

let rightPart = Handlebars.templates['zcyEvE/controller/templates/rightPart'];
let compsSetRightPart = Handlebars.templates['zcyEvE/controller/templates/compsSetRightPart'];




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
    this.$con = this.$el.find('.body-content');
    //保存数据
    this.tempjson = [];
    //发布数据
    this.data = {};
    this.index=null;
    this.name=null;
    this.url = "";
    this.type = "";
    this.drag = false;
    this.position = {};
    this.lineArr = [];
    this.lineMap = {};
    this.lineIndex = 0;
    this.scroll = {x:0,y:0};
    this.mouseE = "";
  }
  render(){
    let param = {
      'pageId': this.page,
      'district':this.url
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
    this.tempjson = this.data._DATA_.templateJson.slice(0);
    this.$el.find('.side-content .pageSet').html(rightPart({}));
    let cfg = this.config.comp;
    
    this.$el.find('.side-content .compsSet').html(compsSetRightPart(cfg));
    server.getWC().then((d)=>{
    });
    server.getCommon().then((d)=>{
      this.area = d;
    });

  }
  bindEvent(){
    this.$el.find('.side-content').on('change','.baseSet input',(e)=>{
      let $tar = $(e.target);
      let v = $tar.val();
      if(!!v){
        let $dom = this.pageBox.find('.comp-selected .eevee-row-ele');
        // $('.click-evt').removeClass('click-evt');
        $tar.hasClass('setStyleWidth') ? $dom.width(v) : $dom.height(v);
        if(v.indexOf('%')>0 && $tar.hasClass('setStyleWidth')){
          $dom.parent().width(v);
          $dom.parent().parent().width(v);
        }
      }
    });
    this.pageBox.on('mouseover mouseout',(e)=>{
      if(!this.drag){
        return
      }
      this.mouseE = e;
      e.type === "mouseover" ?
        this.pageBox.on('mousemove',(e1)=>{
          this.dragComps(e1);
        }) :
        this.pageBox.off('mousemove');
    });
    this.pageBox.on('click',()=>{
      if(this.drag){
        this.pageBox.off('mousemove');
        this.drag = false;
        this.placeComps(this.position);
      }
    });
    this.$con.on('scroll',()=>{
      if(!this.drag){
        return;
      }
      this.scroll={
        x:this.$con.scrollLeft(),
        y:this.$con.scrollTop()
      }
    });
    this.$el.on('click','.side-content .compsSet a',(e)=>{
      !this.drag && this.addAllComp(e);
    });
    this.$el.on('click','.side-content .compsSet li.showmore',(e)=>{
      
      if(!this.drag){
        this.$el.find('.side-content').find(e.currentTarget).toggleClass('active');
      }
      e.preventDefault();
      e.stopPropagation();
      
    });
    this.$el.on('click','.saveCfgForm',(e)=>{
      let type = $(e.target).hasClass('all') ? 'all' : 'base';
      this.saveCfgForm(type);
    });
    //组件hover事件
    this.$el.on('mouseover mouseout','.eevee-grids .eevee-line-row .eevee-row-ele',(e)=>{
      if(this.drag){
        return
      }
      if (e.type === "mouseover") {
        this.mouseover(e)
      } else if (e.type === "mouseout") {
        this.mouseout(e)
      }
      e.preventDefault();
      e.stopPropagation();
    });
    // //边框hover事件
    // this.$el.on('mouseover mouseout','.eevee-grids,.eevee-col-row',(e)=>{
    //   let $tar = $(e.target);
    //   if (e.type == "mouseover") {
    //     $tar.addClass('hover-evt');
    //   } else if (e.type == "mouseout") {
    //     $tar.removeClass('hover-evt');
    //   }
    // });
    // //边框点击事件
    this.$el.on('click','.eevee-grids .controller-mask',(e)=>{
      let cls = $(e.target);
      if(cls.hasClass('delComp')){
         this.deleComp();
      }else if(cls.hasClass('setStyle')){
        this.setStyle();
      }else{
        this.clickEvent(e);
        this.setBorder();
        this.resetStyleLine();
      }
      e.preventDefault();
      e.stopPropagation();
    });

    //点击组件进行设置
    // this.$el.on('click','.eevee-col-box',(e)=>{
    //   this.index = $(e.target).closest('.eevee-grids').data('index');
    //   this.name = $(e.currentTarget).data('name');
    //   this.clickEvent(e);
    // });
    //页面选择
    this.$el.on('change','.controller-main input',(e)=>{
      this.setValue(e);
    });
    // this.$el.on('click','.controller-box .h1-logo img',()=>{
    //   this.$el.find('.controller-box').addClass('upaction');
    // });
    //保存、发布
    this.$el.on('click','button,a.evt',(e)=>{
      let $tar = $(e.target);
      if($tar.hasClass('js-page-release')){
        this.submit();
      }else if($tar.hasClass('js-page-save')){
        this.saveComp();
      }else if($tar.hasClass('js-page-yl')){
        this.showPage();
      }
    });
    this.$el.on('click','.controller-tabs li',(e)=>{
      let $tar = $(e.target);
      $tar.hasClass('addLi') ? this.newRegx():this.changeTabs(e);
    });
    this.$el.on('click','.addRow',(e)=>{
      let type = $(e.target).hasClass('insideRow') ? 'inside' : 'out';
      this.addOutLine(type);
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
      this.$el.find('.left-menu ul.menu-li li').removeClass('active');
      $tar.addClass('active');
      let index = $tar.index();
      let $doms = this.$el.find('.page-list-container .side-content .tabSwitch');
      $doms.addClass('hide');
      $doms.eq(index).removeClass('hide');
    });

    this.$el.on('click','.addAllComps',(e)=>{
      this.addAllCompsModal();

    });
    this.$el.on('click','.setRouter',(e)=>{
      this.setRouter();
    });
    $('body').on('click',()=>{
      $('body').off('.eevee');
    })

  }
  // [
  // {
  //  comps:[
  //  {comps: []
  //    css :
  // }
  // ]
  //  css
  // },
  // {}
  // ]
  showPage(){
    let data = this.getPageData();
    let html = reviewPage(data);
    this.$el.find('.ZCY-eevee-page-controller-content').addClass('hide');
    this.$el.find('.review').html(html).removeClass('hide');
  }
  getPageData(){
    let $line = this.pageBox.find('.eevee-grids');
    let result = [];
    $.each($line,(i,that)=>{
      let $that = $(that);
      let obj = {
        'comps':[]
      };
      if(!!$that.children().length){
        let $dom = $that.find('.eevee-line-row-box');
        $.each($dom,(j,_that)=>{
          let _$that = $(_that);
          let box = {
          
          };
          let css = _$that.attr('style');
          box.css = css;
          box.insert = [];
          let _$ele = _$that.find('.eevee-line-row');
          $.each(_$ele,(k,ele)=>{
            let $ele = $(ele);
            let css = $ele.children('.eevee-row-ele').attr('style');
            let data = $ele.children('.eevee-row-ele').data('json')||{};
            let path = $ele.data('compath');
            box.insert.push({
              css,data,path
            })
          });
          obj.comps.push(box);
        });
        result.push(obj);
      }
    });
    return result;
  }
  setBorder(){
    let $dom = this.pageBox.find('.comp-selected .eevee-row-ele');
    $dom.find('.border-line').length === 0 &&
        $dom.append(`
                      <div class="style-width-line border-line"></div>
                      <div class="style-height-line border-line"></div>
        `);
    $dom.find('.border-line').length === 0 && this.bindRresizeEvent();
    this.resetBorderLine()
  }
  bindRresizeEvent(){
    let $dom = this.pageBox.find('.comp-selected').find('.eevee-row-ele .border-line');
    let x,y,type,w,h;
    $dom.on('mousedown.eeveeborder',(e)=>{
      x = e.clientX;
      y = e.clientY;
      w = $dom.width();
      h = $dom.height();
      let $e = $(e.target);
      type = $e.hasClass('style-width-line') ? 'width' : 'height';
      $dom.on('mousemove.eeveeborder',(e1)=>{
        let x1 = e1.clientX,
            y1 = e1.clientY;
        if(type ==='width'){
          $dom.css('width',w+(x1-x));
        }else{
          $dom.css('height',h+(y1-y));
        }
        e.preventDefault();
        e.stopPropagation();
      })
    }).on('mouseup.eeveeborder',()=>{
      $dom.off('mousemove.eeveeborder');
    })
  
  }
  resetBorderLine(){
    let $dom = this.pageBox.find('.comp-selected').find('.eevee-row-ele');
    let w = $dom.width();
    let h = $dom.height();
    
  }
  resetStyleLine(){
    let $dom = this.pageBox.find('.comp-selected').find('.eevee-row-ele');
    $dom.find('.style-line').length === 0 &&
        $dom.append(`<div class="style-left-line style-line"></div><div class="style-top-line style-line"></div>`);
    let l = $dom.css('marginLeft').replace('px','')-0;
    let t = $dom.css('marginTop').replace('px','')-0;
    let w = $dom.width();
    let h = $dom.height();
    $dom.find('.style-left-line').css({
      'top':h/2-21,
      'left':`${-1*l}px`,
      'width':l
    }).html(l);
    $dom.find('.style-top-line').css({
      'top':`${-1*t}px`,
      'left':w/2,
      'height':t,
      'line-height':`${t}px`
    }).html(t);
  }
  getWhtchLine(p){
    if(!this.lineArr.length){
      return false;
    }
    let result = false;
    let arr = this.lineArr.slice();
    arr.forEach((v,i)=>{
      let cls = this.lineMap[`key${this.lineArr[i]}`];
      let e = this.lineArr[i+1] || (this.lineArr[i]+$(cls).height()+1);
      if((p.y-v>0||p.y-v===0) && (p.y-e <0||p.y-e ===0)){
        result = cls;
        return false;
      }
    });
    return result;
  }
  getWhtchRow(p,cls){
    let $tar = $(cls);
    let cfg = {};
    let dom =$tar.find('.eevee-line-row-box');
    if(dom.length===0){
      // $tar.append(`<div class="eevee-line-row-box eevee-line-row-box0"></div>`)
      // cfg.tar = $tar.find('.eevee-line-row-box0');
      // cfg.type='append';
      cfg.type ='noBox';
      cfg.tar = $tar;
    }else{
      let result = false;
      let w = $tar.width;
      $.each(dom,(i,v)=>{
        let e = $(v).width()+$(v).offset().left;
        if(p.x>e && i+2<=dom.length){
          return true
        }
        if(p.x>$(v).offset().left && p.x<e){
          cfg.type ='after';
          cfg.tar = $(v);
          return false;
        }
        cfg.type ='noBox';
        cfg.tar = $tar;
      })
    }
    return cfg;
  }
  reContMap(){
    let arr = this.lineArr.slice();
    let obj = {};
    arr.forEach((v,i)=>{
      let cls = this.lineMap[`key${v}`];
      let num = $(cls).offset().top-51;
      this.lineArr[i] = num;
      obj[`key${num}`] = cls;
    });
    this.lineMap = obj;
  }
  appendNewBox(cfg,p){
    let $tar = $(cfg.tar);
    let html = this.pageBox.find('.dragStart')[0].innerHTML;
    if(cfg.type==='after'){
      $tar.append(html);
    }else{
      $tar.append(`<div class="eevee-line-row-box eevee-line-row-box0">${html}</div>`);
    }
    this.pageBox.find('.dragStart').remove();
  }
  placeComps(p) {
    let positon = p;
    
    let line = this.getWhtchLine(p);
    if(line) {
      let cfg = this.getWhtchRow(p,line);
      this.appendNewBox(cfg,p);
      this.reContMap();
      return;
    }else{
      this.pageBox.find('.dragStart').remove();
      return;
    }
    // this.$el.find('.dragStart').removeClass('dragStart');
    let $tar = this.pageBox.find('.dragStart');
    $tar.css({
      top:positon.y,
      left:positon.x
    })
  }
  dragComps(e) {
    this.position = {
      x:e.clientX-200+this.scroll.x,
      y:e.clientY-60+this.scroll.y
    };
    this.moveComps(this.position);
    this.getDefaultDIV();
  }
  //TODO
  getDefaultDIV(){
    let positon = this.position;
  }
  moveComps(p) {
    let positon = p;
    let $tar = this.pageBox.find('.dragStart');
    $tar.css({
      top:positon.y,
      left:positon.x
    })
  }
  saveCfgForm(type) {
    if(type ==='base'){
      let cfg = this.$el.find('.editor-config-panel').getData();
      let $tar = this.$el.find('.click-evt');
      for(let pop in cfg) {
        if(cfg[pop]!= 0){
          $tar.css(pop,cfg[pop]);
        }
      }
    }else {
      let cfg = this.$el.find('.cssform').getData();
      let $tar = this.$el.find('.comp-selected');
      for(let pop in cfg) {
        if(cfg[pop]!= 0){
          $tar.css(pop,cfg[pop]);
        }
      }
    }
  }
  setRouter(){
    let that = this;
    ZCY.utils.modal({
      button:["取消","确认"], //按钮文案
      templateUrl:"zcyEvE/controller/templates/setRouter",   //自定义模板路径
      title:'新增页面',
      cls:"zcyEvE-modal",                                 // 自定义class
      confirm:function(m){                             //确认的callback
        m.modal('hide');
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
    let $pageSet = this.$el.find('.side-content');
    $pageSet.find('.tabSwitch').addClass('hide');
    $pageSet.find('.compsSet').removeClass('hide');
    // let that = this;
    // let cfg = this.config.comp;//changepageTemplates
    // ZCY.utils.modal({
    //   button:["取消","确认"], //按钮文案
    //   templateUrl:"zcyEvE/controller/templates/changeAllComp",   //自定义模板路径
    //   data:cfg,
    //   title:'新增页面',
    //   cls:"zcyEvE-modal",                                 // 自定义class
    //   confirm:function(m){                             //确认的callback
    //     let param = $('.zcyEvE-modal').find('table').getData({});
    //     that.addAllComp(param);
    //     m.modal('hide');
    //   },afterRander:function(m,target){                 //弹出框渲染成功后的callback
    //     $('.zcyEvE-modal').find('select').selectric();
    //   }
    // });
  }
  addAllComp(e){
    this.drag = true;
    let comp = $(e.target).data('path');
    let rootPath = this.config.basePath;
    let path = rootPath+'/'+comp+'/view';
    let temp = Handlebars.templates[path];
    let positon = {
      x:e.clientX-200,
      y:e.clientY-60
    };
    this.pageBox.append(`<div class="dragStart hide"><div class="eevee-line-row" data-compath="${rootPath}/${comp}"><div class="eevee-row-ele">${temp()}</div></div></div>`);
    this.pageBox.find('.dragStart').css({
      top:positon.y,
      left:positon.x
    }).removeClass('hide');
    console.log(positon);
    // let fn = false;
    // this.$el.find('.click-evt .eevee-col-row').append(`<div class="eevee-col-box" data-compath="${rootPath}/${d.coms}">${temp()}</div>`);
    // try{
    //   fn = require(path);
    // }catch(e){
    //   console.log(e);
    // }
    // fn && new fn($);
  }
  addOutLine(t){
    let index = this.index++;
    let html = `<div class="eevee-clu-line eevee-grids eevee-line${index}" style="min-height:50px">
                
                </div>`;
    if(t==='inside'){
      html = `<div class="eevee-col-box eevee-grids eevee-line${index}" style="min-height:50px"></div>`
    }
    let $tar = this.$el.find('.click-evt');
    if(!!$tar.length){
      this.$el.find('.click-evt').after(html);
    }else{
      this.pageBox.append(html);
    }
    let num = $(`.eevee-line${index}`).offset().top;
    this.lineArr.push(num-51);
    this.lineMap[`key${num-51}`] = `.eevee-line${index}`;
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
        m.modal('hide');
      },afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    });

  }
  changePage(param){
    let li = `<li class="show-title" title="" data-shopid="">
      <div class="page-title">${param.pageid}</div>
      <div><a>${param.href}</a></div>
    </li>`;
    this.$el.find('.side-content .pageSet ul').append(li);

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
    this.$el.find('.side-content .pageSet').html(rightPart());
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
        m.modal('hide');
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
        m.modal('hide');
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
        m.modal('hide');
      },
      afterRander:function(m,target){                 //弹出框渲染成功后的callback
        $('.zcyEvE-modal').find('select').selectric();
      }
    })

  }
  deleComp(){
    let $tar = this.$el.find('.comp-selected');
    if($tar.parent().children().length ===1){
      $tar.parent().remove();
    }else{
      $tar.remove();
    }
    this.reContMap();
    this.$el.find('.side-content').find('.comps-set').empty();
  }
  setStyle(){
    let $parent = this.$el.find('.comp-selected');//.addClass('settingStyle');
    let $tar = $parent.find('.eevee-row-ele');
    let m = `${$tar.css('marginTop')} ${$tar.css('marginBottom')} ${$tar.css('marginLeft')} ${$tar.css('marginRight')}`;
    
    $('body').on('keydown.eevee',(e)=>{
      let key = e.which;
      console.log(key);
      e.preventDefault();
      e.stopPropagation();
      if(key===38){
        let t = $tar.css('marginTop').replace('px','');
        t = Number(t)===0 ? 0 : Number(t)-1;
        $tar.css('marginTop',t);
      }else if(key===40){
        let t = $tar.css('marginTop').replace('px','');
        t = Number(t)+1;
        $tar.css('marginTop',t);
      }else if(key===37){
        let t = $tar.css('marginLeft').replace('px','');
        t = Number(t)===0 ? 0 : Number(t)-1;
        $tar.css('marginLeft',t);
      }else if(key===39){
        let t = $tar.css('marginLeft').replace('px','');
        t = Number(t)+1;
        $tar.css('marginLeft',t);
      }else if(key===27){//退出
        $tar.css('margin',m);
        $('body').off('keydown.eevee');
      }else if(key===13){//确认
        $('body').off('keydown.eevee');
      }
      this.resetStyleLine();
    })
  }
  
  submit(a){
    let param = this.param;

  }
  saveComp(){
    let obj = this.tempjson[this.index].insert.comps;
    let saveData = this.getSaveData();
    $.each(obj,(i,v)=>{
      if(v.name === this.name){
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
    $tar.find('.controller-mask').length === 0 ? $tar.append(mask()) : $tar.find('.controller-mask').removeClass('disnone');
  }
  mouseout(e){
    let $tar = $(e.currentTarget);
    $tar.find('.controller-mask').addClass('disnone');
  }
  clickEvent(e){
    let $tar = $(e.currentTarget).closest('.eevee-line-row');
    // $('.click-evt').removeClass('click-evt');
    this.pageBox.find('.comp-selected').removeClass('comp-selected');
    if($tar.length>0){
      let result = this.clickCompEvent($tar);
      this.$el.find('.comps-set').html(compsetTemplates(result));
      $tar.addClass('comp-selected');
    }else{
      this.$el.find('.comps-set').html(compsetTemplates({type:'line'}));
      $tar.addClass('click-evt');
    }
    let $pageSet = this.$el.find('.side-content');
    $pageSet.find('.tabSwitch').addClass('hide');
    $pageSet.find('.comps-set').removeClass('hide');
    
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
    let json = $tar.data('json') || {};
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
