const BaseComponent = require('base/base-component');
const toDate=require('common/toDate');
const Query=require('common/query/extend');

class fullTextSearch extends BaseComponent{
    constructor(){
        super({
            events:{
                "click .Jtimeframe":"fuzzyTime",
                "input .globalkeyword":"shapeShow",
                "click .icon-Shape":"emptyInput",
                "keydown .globalkeyword":"enterSearch",
                "click .Jbtn":"btnSearch",
                "click .Jmodule":"changeType"
            }
        })
    }
    init(){
        this.$startTime=this.$el.find('.startTime');
        this.$endTime=this.$el.find('.endTime');
        this.$date=this.$el.find('.date');
        this.$searchInp=this.$el.find('.globalkeyword');
        this.$m=this.$el.find('.conditionwrap .Jmodule');
        this.$search_type=this.$el.find('.search_type');
        this.$pageContainer=this.$el.find('.page');
        this.$pageAbove=this.$el.find(".pagination-list-up");
        this.$pageBelow=this.$el.find(".pagination-list-down");
        this.$key=this.$el.find('.content .key');
        this.$count=this.$el.find('.content .count');
        this.$start=this.$el.find(".content .start");
        this.$end=this.$el.find(".content .end");
        this.$search_body=this.$el.find('.f_body');

        this._d = new Date().getTime();
        this._ndate = this._d - 3 * 24 * 60 * 60 * 1000;
        this.isExact = 0; //0:搜标题  1:搜全文
        this.pageNo=1;    //记录当前pageNo
        /**
         * 初始化开始时间和结束时间
         */
        this.$startTime.val(toDate(this._ndate));
        this.$endTime.val(toDate(this._d));
        
        this.query=new Query();
        this.$searchInp.val(this.query.get('k'));
        this.$m.eq(this.query.get('m')).addClass('selected');
        /**
         * 日期选择器
         */
        this.$date.datetimepicker({
            format: "yyyy-mm-dd",
            autoclose:true,
            maxView:2,
            minView:2,
            language: 'zh-CN',
        });

        // this.$el.find('.btn-title').trigger('click');
        // this.$searchInp.trigger('input');


        this.initPagination(100, this.$pageContainer.eq(0));
        this.initPagination(100, this.$pageContainer.eq(1));
        this.$pageContainer.find(".J-paginationjs-page:last").css("borderRight", "1px solid #D8D8D8")
        // this.initPagination(12, this.$pageBelow);
        
    }

    /**
     * 分页
     * @param count 
     * @param wrap 
     */
    initPagination(count, wrap){
        const that=this;
        var sources = function() {
            var result = [];
            for (var i = 0; i < count; i++) {
                result.push(i);
            }
            return result;
        }();
    
        const options = {
            dataSource: sources,
            totalNumber: count,
            pageSize: 15,
            pageNumber: that.pageNo,
            prevText: '上一页',
            nextText: '下一页',
            showGoInput: false,
            showGoButton: false,
            beforeGoButtonOnClick: (event, pageNumber) => {
                that.pageNo = pageNumber;
                that.search(that.isExact)
            },
            beforePageOnClick: (event, pageNumber) => {
                that.pageNo = pageNumber;
                that.search(that.isExact)
            },
            beforePreviousOnClick: (event, pageNumber) => {
                that.pageNo--;
                that.search(that.isExact)
            },
            beforeNextOnClick: (event, pageNumber) => {
                that.pageNo++;
                that.search(that.isExact)
            },
    
        };
        wrap.pagination(options);
    }

    btnSearch(e){
        const el = e.target || e.srcElement;
        this.isExact = $(el).data("exact")
        this.search(this.isExact,true);
    }
    
    emptyInput(e){
        this.$searchInp.val("");
        $(e.target).hide();
    }

    enterSearch(e){
        e.keyCode == 13&&search(this.isExact,true)
    }
   
    shapeShow(e){
        const $ele =$(e.target || e.srcElement);
        if ($ele.val().length > 0) {
            this.$el.find(".icon-Shape").show();
        } else {
            this.$el.find(".icon-Shape").hide();
        }
    }

    changeType(e){
        const el = e.target || e.srcElement;
        $(el).addClass("selected").siblings().removeClass("selected")
        this.search(this.isExact,true);
    }

    /**
     * 搜索
     * @param isRefresh 是否刷新分页
     */
    search(isExact,isRefresh){
        const that=this;
        const type = that.$m.filter(".selected").data("num");
        const beginDate = that.$startTime.val();
        const endDate = that.$endTime.val();
        const keyword = that.$searchInp.val();

        const sechtext = isExact == 0 ? "标题检索" : "全文检索"
        that.$search_type.text(sechtext);
        that.$key.text(keyword|| "");
        that.$start.text(beginDate);
        that.$end.text(endDate);

        let requestData = {
            pageNo: isRefresh?1:that.pageNo,
            pageSize: 15,
            keyword,
            type,
            beginDate,
            endDate,
            isExact
        }
        for (let k in requestData) {
            if (requestData[k] === "" || requestData[k] === null || requestData[k] === undefined) {
                delete requestData[k]
            }
        }
        $.ajax({
            url:'/dd',
            data:requestData,
            success:(res)=>{
                const {
                    articles = [],
                    count
                } = res;
                that.$count.text(count);

                if (count > 0) {
                    that.$page.show()
                    that.initPagination(count, that.$pageAbove);
                    that.initPagination(count, that.$pageBelow);
                    that.$pageContainer.find(".J-paginationjs-page:last").css("borderRight", "1px solid #D8D8D8")
                } else if(count <= 0){
                    that.$page.hide()
                }

                let html = "";
                $.each(articles, (index, item) => {
                    const {
                        districtName = "",
                            id = "",
                            keywords = "",
                            mainBidMenuName = "",
                            projectCode = "",
                            pubDate = "",
                            title = "",
                            typeName = "",
                            url = "",
                            type = ""
                    } = item;
                    html += `<div class="list" data-id="${id}"><a target="_blank" href="${url}"><h4>${title}</h4><p class="text">${keywords}</p>
                    <p class="t">${toDate(pubDate)} </p>
                    <p class="t">${typeName} ${districtName==""? "":"| "+districtName} ${mainBidMenuName==""?"":"| "+mainBidMenuName}</p></a>
                    </div>`;

                })
                if (html == "") {
                    html = `<div class="nodata">暂无搜索内容</div>`
                }
                that.$search_body.html(html)
            }
        })
    }


    /**
     * 时间模糊选择
     * @param e 
     */
    fuzzyTime(e){
        const that=this;
        const el = e.target || e.srcElement;
        $(el).addClass("selected").siblings().removeClass("selected")
        const _w = $(el).data("num");
        const _d = new Date().getTime();
        let newDate = "";
        if (_w.indexOf("m") > 0) {
            const p = _w.substring(0, 1)
            newDate = that.date(toDate(_d), p);
        } else {
            const _p = _w.substring(0, 1);
            const _ndate = _d - _p * 24 * 60 * 60 * 1000;
            newDate = toDate(_ndate);
        }
        that.$startTime.val(newDate);
        that.$endTime.val(toDate(_d));
        that.search(that.isExact,true)
    }

    date(_date, p){
        const that=this;
        const _timeArr = (_date).split("-");
        let year = _timeArr[0];
        let month = _timeArr[1];
        let date = _timeArr[2];
        if (month - p <= 0) {
            month = 12 + parseInt(month) - p;
            year--;
        } else {
            month = month - p;
        }
        const tempdate = `${year}-${month}-${date}`
        return that.judgeDate(tempdate)
    }

    judgeDate(datetemp){
        const _dArr = datetemp.split("-");
        let year = _dArr[0];
        let month = _dArr[1];
        let date = _dArr[2];
        const isLeap = (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        if (month == 2) {
            date = date > 29 ? isLeap ? 29 : 28 : date;
        } else if (month == 4 || month == 6 || month == 9 || month == 11) {
            date = date > 30 ? 30 : date;
        } else {
            date = date;
        }
        month = month>9?month:`0${month}`;
        // date = date>9?date:`0${date}`
        return `${year}-${month}-${date}`;
    
    }
    

}
module.exports=fullTextSearch;