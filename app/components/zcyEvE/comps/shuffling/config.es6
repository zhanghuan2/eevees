module.exports = {
  defaultParam:{
    css:[
      '@padding',
      '@margin',
      {
        'name':'width',
        'label':'长度',
        'description': "设置组件长度",
        'type': "text",
        'defaultValue':'300'
      }
    ],
    data:[
      {
        'name':'hotword',
        'label':'热词',
        'description': "可输入多个热词 中间用空格分隔 最多可输入7个",
        'type': "text",
        'defaultValue':''
      },{
        'name':'action',
        'label':'搜索跳转链接',
        'description': "点击搜索按钮跳转链接地址，默认/eevees/search",
        'type': "text",
        'defaultValue':'/eevees/search'
      },
      {
        name: "position",
        label: "热词位置",
        description: "为热词选择展示位置",
        type: "radio",
        options:{
          "up": "搜索框上面",
          "down": "搜索框下面"
        },
        defaultValue: "down"
      }
    ]
  }
};