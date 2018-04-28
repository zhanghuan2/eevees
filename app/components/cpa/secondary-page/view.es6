const BaseComponent = require('base/base-component');
const treeData = require('common/treeData');
const Spinner =require('common/spin/extend');

class secondaryPage extends BaseComponent{
    constructor(){
        super({
            events:{
                "change .page-size":"changPageSize"
            }
        })
    }
    init(){
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
        that.$nav.find('.list-nav-content').jstree(
            {
                'plugins': ['conditionalselect','wholerow'],
                'conditionalselect': function(node, event) {
                    return node.children.length === 0
                },
                'core': {
                    data:treeData[that.current],
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
            let navtext=that.getNavText(data.instance,data.instance.get_node(data.instance.get_selected()[0]).parents)
            that.$bread.find('#nav').text(navtext);

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

    search (isRefresh) {
        let that = this;
        let spinner=null;
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
        let result=[{
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        },
        {
            text:'关于2018年度“自我声明公开企业产品标准监督抽查”项目的竞争性磋商公告[杭州泛亚工程咨询有限公司]',
            pubTime:'2018-09-22'
        }]

        let str="";
        spinner=new Spinner({top:'40%'}).spin($('.content-list')[0]);
        for(let i=0,len=that.$pageSizeSel.val();i<len;i++){
            str+=`<p>
                <a href="./detail.html" title="" target="_blank">
                    <span class="dot">·</span>${result[0].text}
                </a>
                <span class="pubTime">${result[0].pubTime}</span>
            </p>`
        }
        that.$content.find('.content-list-container').html(str);
        if(isRefresh){
            that.initPagination(100);
        }
        setTimeout(function(){
            spinner.stop()
        },100)
        
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
}
module.exports=secondaryPage;