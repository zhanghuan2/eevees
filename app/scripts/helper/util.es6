/**
* 工具类
*/
module.exports = {
    isIE :(ver)=>{
        var b = document.createElement('b')
        b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
        return b.getElementsByTagName('i').length === 1
    }
}
  