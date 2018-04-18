module.exports = {
  urls: {
    '/api/template/view':function(){
      var data = {
        "districtCodes": '339900',
        "id": 73460,
        "pageId": "search",
        "templateJson": [
          {
            "insert":{
              "comps":[
                {
                  "name":"header",
                  "path":"zcyEvE/comps/header",
                  "data":{
                    "name":"网上超市",
                    "colorCode": "#000"
                  }
                }
              ]
            }
          }
        ],
        'comA':'getRoles',
        'comB':'getElf',
        'serviceC':[]
    
      };
      return data;
    
    },
    '/api/template/getWC':function(){
      var data = [
        {
          "name":"搜索页面",
          "href":"eevees/search",
          "pageID":"search"
        },{
          "name":"店铺页",
          "href":"eevees/shop",
          "pageID":"search"
        },{
          "name":"供应商详情页",
          "href":"eevees/supplier",
          "pageID":"search"
        }
      ];
      return data;
    },
    '/api/template/getCommon':function(){
      return [
    
      ]
    }
  },
  comps: {
    'zcyEvE/page':function(){
      var data = {
        "districtCodes": '339900',
        "id": 73460,
        "pageId": "search",
        "templateJson": [
          {
            "insert":{
              "css":{
                "width":"100%"
              },
              "comps":[
                {
                  "name":"header",
                  "path":"zcyEvE/comps/header",
                  "data":{
                    "name":"网上超市",
                    "colorCode": "#000"
                  },
                  "css":{
                    "width":"100%"
                  }
                }
              ]
            }
          }
        ],
        'comA':'getRoles',
        'comB':'getElf',
        'serviceC':[]
    
      };
      return data;
    },
    'zcyEvE/eevees':function(){
      var data = {
        "districtCodes": '339900',
        "id": 73460,
        "pageId": "search",
        "templateJson": [
          {
            "insert":{
              "css":{
                "width":"100%"
              },
              "comps":[
                {
                  "name":"header",
                  "path":"zcyEvE/comps/header",
                  "data":{
                    "name":"网上超市",
                    "colorCode": "#000"
                  },
                  "css":{
                    "width":"100%"
                  }
                }
              ]
            }
          }
        ],
        'comA':'getRoles',
        'comB':'getElf',
        'serviceC':[]
    
      };
      return data;
    }
  }
};