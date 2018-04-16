module.exports =  {
  'basePath':'zcyEvE/comps',
  'comp':{
    'header': 'header',  //左侧logo
    'tabline': 'daohang',
    'infoline':'infoline',
    'search':'search',
    'shuffling':'shuffling',
    'announcement':'announcement',
    'goodSearch':'goods_search'
  },
  defaultParam:{
    '@padding':{
      'name':'padding',
      'label':'内间距',
      'description': "设置组件内间距",
      'type': "text",
      'defaultValue':'0'
    },
    '@textAlign':{
      'name':'textAlign',
      'label':'对齐',
      'description': "设置组件内间距",
      'type': "text",
      'defaultValue':'0'
    },
    '@margin':{
      'name':'margin',
      'label':'外间距',
      'description': "设置组件外间距",
      'type': "text",
      'defaultValue':'0'
    }
  },
  'transform':{
    'textAlign':'text-align'
  }
}