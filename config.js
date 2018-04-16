/**
 *
 * Web前端自动化构建调试 配置文件
 */
module.exports = {

  // 目录
  paths: {
    src: 'app',
    vendor: 'vendor',
    public: 'public'
  },

  // 构建、调试相关的任务
  chores: {
    bundles: {
    
    },

    // 拷贝
    copy: {
      images: {
        globs: '/images/other-images/*',
        base: '/images', // 相对 paths.src 的路径,可选
        dest: '/assets/images' // 相对 path.public 路径,可选
      },
      files: {
        globs: '/files/white_list',
        base: '/files',
        dest: '/'
      },
      download: {
        globs: '/download/**/*',
        base: '/download',
        dest: '/assets/download'
      },
      'files-yaml': {
        globs: '/files/**/*.yaml',
        base: '/files',
        dest: '/'
      },
      'files-everstone': {
        globs: '/files/*.yml',
        base: '/files',
        dest: '/'
      },
      font: {
        globs: '/styles/iconfont/iconfont.{eot,svg,ttf,woff}',
        base: '/styles',
        dest: '/assets/styles'
      },
      views: {
        globs: '/views/**/*.hbs',
        base: '/views',
        dest: '/views'
      },
      component: {
        globs: '/components/**/view.hbs',
        base: '/components',
        dest: '/components'
      }
    },

    // 编译模板文件
    compile: {
      views: {
        globs: '/views/**/*.erb',
        base: '/views',
        dest: '/views',
        context: {
          tips: false
        }
      },
      files: {
        globs: '/files/**/*.erb',
        base: '/files',
        dest: '/',
        context: {
          photohref: 'https://www.zcy.gov.cn',
          main: 'https://www.zcy.gov.cn',
          login: 'http://127.0.0.1:8001/login',
          mainHref: 'https://www.zcy.gov.cn'
        }
      }
    },

    // 处理handlebars静态模板
    precompile: {
      templates: {
        dest: '/assets/scripts/templates.js',
        globs: '{/components/**/templates/*.hbs,/components/zcyEvE/comps/**/*.hbs}'
      }
    },

    // 编译coffeeScript,ES6,合并JavaScript
    concatScript: {
      app: {
        globs: '/{scripts,components}/**/*.{js,jsx,coffee,es6}',
        dest: '/assets/scripts/app.js',
        definition: true, // 可选 ,默认false
        wrapper: true, // 可选 ,默认false
        order: [ '...', 'app/scripts/app.es6' ] // 相对于运行脚本的路径
      },
      vendor: {
        globs: '../vendor/*.{js,jsx,coffee,es6}',
        dest: '/assets/scripts/vendor.js',
        definition: false, // 可选 ,默认false
        wrapper: false, // 可选 ,默认null
        order: [ 'vendor/es5-shim.js', 'vendor/es5-sham.js','vendor/require.js', 'vendor/jquery-1.12.3.js','vendor/handlebars.js', '...' ]
      }
    },

    // 编译 Sass文件,合并CSS文件
    concatStyle: {
      app: {
        globs: '/**/*.{css,scss,sass}',
        dest: '/assets/styles/app.css',
        order: [ '...', 'app/components/common/header/view.scss' ]
      },
      vendor: {
        globs: '../vendor/**/*.{css,scss,sass}',
        dest: '/assets/styles/vendor.css',
        order: [ 'vendor/moomball.css', 'vendor/base.css', '...' ]
      }
    },

    // 雪碧图处理
    sprite: {
      icons: {
        globs: '/images/*.png',
        outImage: '/assets/images/other-images/icons.png',
        outCss: '/assets/styles/other-images/icons.css',
        imageUrl: '/assets/images/other-images/icons.png',
        templateSrc: '/styles/icons.mustache'
      }
    },

    // cache 版本控制
    revision: {
      assets: {
        globs: '/assets/{scripts/*.js,images/*.png,styles/*.css}',
        dest: '/manifest.json'
      }
    },

    // cache 版本控制 相关url替换
    revisionReplace: {
      assets: {
        globs: '/{views/layout.hbs,assets/styles/app-*.css}',
        prefix: '',
        manifest: '/manifest.json'
      }
    },
    // eslint
    eslint: {
      globs: '',
      config: ''
    },

    // scsslint
    scsslint: {
      globs: '',
      config: ''
    }
  },

  // 调试 Web服务相关的配置
  server: {
    port: '8083',
    dataFilePatterns: [
      'test/**/*.js'
    ],
    proxyTable: {
      '/api/district/getDistrictTree': {
        target: 'http://dev.internal:8012/',
        changeOrigin: true
      }
    }
  },

  // 不同环境的配置选项
  environments: {
    dev: {
      compile: {
        views: {
          context: {
            tips: false
          }
        },
        files: {
          context: {
            photohref: 'https://www.zcy.gov.cn',
            main: 'https://www.zcy.gov.cn',
            login: 'http://127.0.0.1:8001/login',
            mainHref: 'https://www.zcy.gov.cn'
          }
        }
      },
      revision: false,
      postCss: false,
      uglify: false
    },
    demo: {
      compile: {
        views: {
          context: {
            tips: false
          }
        },
        files: {
          context: {
            photohref: 'https://demo.zcy.gov.cn',
            main: 'https://demo.zcy.gov.cn',
            login: 'https://login.demo.zcy.gov.cn/login',
            mainHref: 'https://demo.zcy.gov.cn'
          }
        }
      },
      revision: true,
      postCss: true,
      uglify: true
    },
    production: {
      compile: {
        views: {
          context: {
            tips: false
          }
        },
        files: {
          context: {
            photohref: 'https://www.zcy.gov.cn',
            main: 'https://www.zcy.gov.cn',
            login: 'https://login.zcy.gov.cn/login',
            mainHref: 'https://www.zcy.gov.cn'
          }
        }
      },
      revision: true,
      postCss: true,
      uglify: true
    }
  }
};
