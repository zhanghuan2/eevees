const Appendzero = (obj)=>{
    if(obj<10) return "0" +""+ obj;
    else return obj;
}

const toDate=(nS,flag=false)=>{
    if(!nS){
        return "";
    }
    const date = new Date(parseInt(nS));
    const _y = date.getFullYear();
    const _m = Appendzero(date.getMonth()+1);
    const _d = Appendzero(date.getDate())
    const _h = Appendzero(date.getHours())
    const $m = Appendzero(date.getMinutes())
    const _s = Appendzero(date.getSeconds())
    if(flag){
        return _y+"-"+_m+"-"+_d+"  "+_h+":"+$m;
    }else{
        return _y+"-"+_m+"-"+_d;
    }

}

module.exports=toDate;