module.exports =  {
  'basePath':'zcyEvE/comps',
  'comp':{
    //分类
    'topCopms':{
      'msg':'头部组件header、search等',
      'include':{
        //组件列表
        'header':{
          'path':'header',
          'msg':'网站头部'
        },
        'tabline':{
          'path':'daohang',
          'msg':'网站头部'
        },
        'infoline':{
          'path':'infoline',
          'msg':'网站头部'
        },
        'search':{
          'path':'search',
          'msg':'网站头部'
        }
      }
    },
    'messageBlock':{
      'msg':'消息模块',
      'include':{
        'shuffling':{
          'path':'shuffling',
          'msg':'网站头部'
        },
        'announcement':{
          'path':'announcement',
          'msg':'网站头部'
        },
        'banner':{
          'path':'banner',
          'msg':'网站头部'
        },
        'quickentry-y':{
          'path':'quickentry-y',
          'msg':'网站头部'
        }
      }
    }
    
    // 'shuffling':'shuffling',
    // 'announcement':'announcement',
    // 'goodSearch':'goods_search',
    // 'daohang':'daohang',
    // 'banner':'banner',
    // 'quickentry-y':'quickentry-y',
    // 'sitemap':'sitemap',
    // 'journal-list':'journal-list',
    // 'quickentry-x':'quickentry-x',
    // 'quickentry-x2':'quickentry-x2',
    // 'footer':'footer',
    // 'gotopbar':'gotopbar'
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