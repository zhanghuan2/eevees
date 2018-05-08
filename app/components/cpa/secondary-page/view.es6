const BaseComponent = require('base/base-component');
const treeData = require('common/treeData');
const Spinner =require('common/spin/extend');
const Query=require('common/query/extend');

const detailListTpl = Handlebars.templates['cpa/secondary-page/templates/detailList'];
const detailImgListTpl = Handlebars.templates['cpa/secondary-page/templates/detailList'];
const downloadListTpl = Handlebars.templates['cpa/secondary-page/templates/downloadList'];
const linkPageTpl = Handlebars.templates['cpa/secondary-page/templates/linkPage'];
const journalTpl = Handlebars.templates['cpa/secondary-page/templates/journalList'];
const listTpl = Handlebars.templates['cpa/secondary-page/templates/listTpl'];
const imgnewsTpl = Handlebars.templates['cpa/secondary-page/templates/imgnewsTpl'];


class secondaryPage extends BaseComponent{
    constructor(){
        super({
            events:{
                "change .page-size":"changPageSize"
            }
        })
    }
    init(){
        this.query=new Query();
        this.current=this.$el.find('.list-nav-title').text().trim();
        this.pageNo=1;     
        this.$bread=this.$el.find('.list-bread');
        this.$nav=this.$el.find('.list-nav');
        this.$container=this.$el.find('.list-container');
        this.$content=this.$el.find('.list-content');
        this.$pageDom=this.$el.find('.pagination-container');
        this.$pageSizeSel=this.$el.find('.pagination-container .page-size');
        $(window).on('scroll',()=>this.floatingMenu())
        this.initTree()
    }

    initTree(){
        let that=this;
        let mid=that.query.get('mid');
        let param=null;
        if(that.current!=="协会会刊"){
            param=treeData[that.current];
        }else{
            param=that.getJournalTreeList();
        }
        that.initTreeSelected(param,mid);
        /**
         * 菜单
         */
        that.$nav.find('.list-nav-content').jstree(
            {
                'plugins': ['conditionalselect','wholerow'],
                'conditionalselect': function(node, event) {
                    return node.children.length === 0
                },
                'core': {
                    data:param,
                    animation:300,
                }
            }
        )
        .on('ready.jstree',function(e,data){
            let name=''
            if(data.instance.get_selected().length>0){
                name=data.instance.get_node(data.instance.get_selected()[0]).original.name?data.instance.get_node(data.instance.get_selected()[0]).original.name:'';
                let text=data.instance.get_node(data.instance.get_selected()[0]).original.text
                that.$content.find('.list-title-text').text(text);
            }
            if(data.instance.get_selected().length>0){
                let navtext=that.getNavText(data.instance,data.instance.get_node(data.instance.get_selected()[0]).parents)
                that.$bread.find('#nav').text(navtext);

            }
            that.search(true,name);
        })
        .on('before_open.jstree',function(event,data){
            /**
             * 闭合同级节点
             */
            let arr=null;
            if(data.node.parents.length==1){
                arr=data.instance.get_node(data.node.parent).children.slice();
                arr.splice(arr.indexOf(data.node.id),1)
                for(let i=0,len=arr.length;i<len;i++){
                    let item_node=data.instance.get_node(arr[i]);
                    if(data.instance.is_parent(item_node)&&data.instance.is_open(item_node)){
                        data.instance.close_node(item_node,200)
                    }
                }
            }
            
        })
        .on('select_node.jstree',function(event,data){
            that.$content.find('.list-title-text').text(data.node.text)
            let name=data.instance.get_node(data.instance.get_selected()[0]).original.name;
            let navtext=that.getNavText(data.instance,data.instance.get_node(data.instance.get_selected()[0]).parents)
            that.$bread.find('#nav').text(navtext);
            that.search(true,name);
        })
    }

 
    changPageSize(){
        this.search(true)
    }

    /**
     * 初始化分页
     * @param count 总条数
     */
    initPagination(count){
        let that=this;
        let pageSize=that.$pageSizeSel.val()||15;
        let sources = function () {
            var result = [];
            for (var i = 0; i < count; i++) {
                result.push(i);
            }
            return result;
        }();
        let options = {
            dataSource:sources,
            totalNumber:count,
            pageSize: pageSize,
            prevText:'<',
            nextText:'>',
            showGoInput: true,
            showGoButton: true,
            beforeGoButtonOnClick:(event,pageNumber)=>{
                let lastPageNo = $(".paginationjs-last").data("num");
                if(!lastPageNo){
                    lastPageNo = $(".J-paginationjs-page:last").data("num");
                }
                if (pageNumber>lastPageNo) {
                    alert("跳转页数不得大于最大页数")
                    return;
                }
                if(pageNumber >=1 ){
                    that.pageNo = pageNumber;
                    that.search(false);
                }
            },
            beforePageOnClick:(event,pageNumber)=>{
                that.pageNo=pageNumber;
                that.search(false);
            },
            beforePreviousOnClick:(event,pageNumber)=>{
                that.pageNo --;
	            that.search(false);
            },
            beforeNextOnClick:(event,pageNumber)=>{
                that.pageNo ++;
	            that.search(false);
            },
    
        };
        that.$pageDom.find('.pagination-list').pagination(options)   
    }

    search (isRefresh,name) {
        let that = this;
        let spinner=null;
        if(!name){
            let tree=that.$nav.find('.list-nav-content').jstree(true);
            name=tree.get_node(tree.get_selected()).original.name;
        }
		const opts = {
            type: 'GET',
            url: '',
            contentType: 'application/json',
			data:{
                pageNo:that.pageNo,
                pageSize:that.$pageSizeSel.val()
            },
            beforeSend:function(){
                spinner=new Spinner({top:'45%'}).spin($('.content-list-container')[0]);
            }
        } 
        // $.ajax(opts)
        // .done((resp)=>{
        //     let result=resp.result;
        //     let str="";
        //     that.$pageDom.find('.total').text(resp.total);
        //     if(result&&result.length>0){
        //         for(let i=0,len=result.length;i<len;i++){
        //             str+=`<p>
        //             <a href="#" title="" target="_blank">
        //                 <span class="dot">·</span>${result[i].text}
        //             </a>
        //             <span class="pubTime">${result[i].pubTime}</span>
        //             </p>`
        //         }
        //     }else{
        //         let str=`<P class='noData'>暂无数据</p>`;
        //     }
        //     that.$content.html(str);
        //     if(isRefresh){
        //         initPagination(resp.total);
        //     }
        // })
        // .fail(()=>{
        //     that.$content.html(`<P class='noData'>暂无数据</p>`);
        // })
        // .always(()=>{
        //     spinner.stop()
        // })
        that.$pageDom.find('.total').text(100);

        let str="";
        spinner=new Spinner({top:'40%'}).spin($('.content-list')[0]);
        
        for(let i=0,len=that.$pageSizeSel.val();i<len;i++){
            // if(name==="homepage-imgnews"){
            //     str+=`<div class="detail-imgnews clearfix">
            //         <img src="/assets/images/other-images/图片新闻实例.png"/>
            //         <div class="imgnews-pullright">
            //             <i class="iconfont icon-newchunse"></i>
            //             <p class="imgnews-title">关于进一步明确网络申请注册会计师注册有关事项的通知</p>
            //             <span class="imgnews-pubdate">2018-01-12</span>
            //         </div>
            //     </div>`
            // }else{
            //     str+=`<p class="list-item">
            //     <a href="/cpa/detail" title="" target="_blank">
            //         <span class="dot">·</span>${result[0].text}
            //     </a>
            //     <span class="pubTime">${result[0].pubTime}</span>
            //     </p>`
            // }
            
        }
        if(name==="leaguer"){
            that.$content.find('.content-list-container').html(downloadListTpl);
        }else if(name==="link"){
            that.$content.find('.content-list-container').html(linkPageTpl);
        }else if(name==="journal"){
            that.$content.find('.content-list-container').html(journalTpl);
        }else if(name==="homepage-imgnews"){
            that.$content.find('.content-list-container').html(imgnewsTpl);
        }
        else{
            that.$content.find('.content-list-container').html(listTpl);
        }
        
        if(isRefresh&&that.$pageDom.length>0){
            that.initPagination(100);
        }
        setTimeout(function(){
            spinner.stop()
        },100)
        
    }

    /**
     * 初始化tree默认选中
     * @param obj tree的data对象
     * @param mid 要选中treenode的id
     */
    initTreeSelected(obj,mid){
        if(!mid){
            c(obj);
        }else{
            !b(obj,mid)&&c(obj);
        }

        function b(o,mid){
            for(let i = 0,len=o.length;i<len;i++){
                let item=o[i];
                if(item.id==mid){
                    if(item.state){
                        item.state.selected=true;
                    }else{
                        item.state={};
                        item.state.selected=true;
                    }
                    return true;
                }else{
                    if(item.children&&item.children.length>0){
                        if(b(item.children,mid)){
                            return true;
                        }
                    }
                }
            }
        }

        function c(o){
            if(o[0].children&&o[0].children.length>0){
                c(o[0].children)
            }else{
                if(o[0].state){
                    o[0].state.selected=true;
                }else{
                    o[0].state={};
                    o[0].state.selected=true;
                }
            }
        }
    }
    

    floatingMenu(){
        let that=this;
        let _h=that.$content.height();
        let _st=$(document).scrollTop();
        // that.$container.find('.list-nav').css({"position":"fixed","top":"0"})
        let $nav=that.$container.find('.list-nav')
        if(_h>800){
            if (_st > 340 && _st < _h-260){
                $nav.css({"position":"fixed","top":"0"})
            }else if(_st>=_h-260){
                $nav.css({"position":"absolute","top":_h-700})
            }else{
                $nav.css({"position":"absolute","top":"0"})
            }
        }else{
            $nav.css({"position":"absolute","top":"0"})
        }
    }

    getNavText(instance,list){
        let arr=[];
        for(let i=0,len=list.length-1;i<len;i++){
            arr.unshift(instance.get_node(list[i]).original.text);
        }
        arr.push(instance.get_node(instance.get_selected()[0]).original.text);
        return arr.join(' > ')
    }

    /**
     * 协会会刊菜单数据
     */
    getJournalTreeList(){
        const date = new Date();
        const _y = date.getFullYear();
        let arr=[];
        for(let i=2010;i<=_y;i++){
            let o={
                'id':`${i}`,
                'text':`${i}年`,
                'name':'journal'
            };
            arr.unshift(o)
        }
        arr.unshift({
            'id':'0',
            'text':'全部会刊',
            'name':'journal'
        })
        return arr;
    }
}
module.exports=secondaryPage;