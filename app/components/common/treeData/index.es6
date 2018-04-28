module.exports={
    '协会概况':[
        {
            'text' : '协会简介',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'name':'xhjz'
        },
        {
            'text' : '协会章程',
            'name':'xhzc'
        },
        {
            'text' : '领导机构',
            'name':'ldjg'
        },
        {
            'text' : '联系我们',
            'name':'lxwm'
        }
    ],
    '会员管理':[
        {
            'id':1,
            'text' : '注册会计师',
            'state' : {
                'opened' : true,
                'selected' : false
            },
            'children' : [
                {   'id':'1.1',
                    'text' : '执业会员',
                    'state' : {
                        'opened' : true,
                        'selected' : false
                    },
                    'children':[
                        {   
                            'id':'1.1.1',
                            'text':'管理制度',
                            'state' : {
                                'selected' : true
                            },
                        },
                        {
                            'id':'1.1.2',
                            'text':'批准（撤销）文件'
                        },
                        {
                            'id':'1.1.3',
                            'text':'注师年检'
                        },
                        {
                            'id':'1.1.4',
                            'text':'表格下载'
                        }
                    ]
                },
                {
                    'id':'1.2',
                    'text' : '非执业会员',
                    'children':[
                        {
                            'id':'1.2.1',
                            'text':'管理制度'
                        },
                        {
                            'id':'1.2.2',
                            'text':'批准文件'
                        },
                        {
                            'id':'1.2.3',
                            'text':'表格下载'
                        }
                    ]
                }

            ]
        },
        {
            'id':2,
            'text' : '资产评估师',
            'children':[
                {
                    'id':2.1,
                    'text':'管理制度'
                },
                {
                    'id':2.2,
                    'text':'机构入会'
                },
                {
                    'id':2.3,
                    'text':'执业会员'
                },
                {
                    'id':2.4,
                    'text':'非执业会员'
                },
                {
                    'id':2.5,
                    'text':'表格下载'
                }
            ]
        }
    ],
    '行业党建':[
        {
            'text' : '通知公告',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'name':'xhjz'
        },
        {
            'text' : '党建信息',
            'name':'xhzc'
        },
        {
            'text' : '群团工作',
            'name':'ldjg'
        },
        {
            'text' : '学习园地',
            'name':'lxwm',
            'children':[
                {
                   'text':'课件'
                },
                {
                    'text':'图书'
                }

            ]
        }
    ],
    '综合管理':[
        {
            'text' : '法律法规',
            'state' : {
                'opened' : true,
                'selected' : true
            },
            'name':'xhjz'
        },
        {
            'text' : '财务管理',
            'name':'xhzc'
        },
        {
            'text' : '课题研究',
            'name':'ldjg'
        },
        {
            'text' : '招聘信息',
            'name':'lxwm'
        },
        {
            'text' : '问卷调查',
            'name':'lxwm'
        }
    ],
    '业务指导':[
        {
            'text' : '注册会计师',
            'state' : {
                'opened' : true
            },
            'name':'xhjz',
            'children':[
                {
                    'text':'最新准则',
                    'state' : {
                        'opened' : true,
                        'selected' : true
                    },
                },
                {
                    'text':'专业法规'
                },
                {
                    'text':'其他相关'
                }
            ]
        },
        {
            'text' : '资产评估师',
            'name':'xhjz',
            'children':[
                {
                    'text':'最新准则'
                },
                {
                    'text':'专业法规'
                },
                {
                    'text':'其他相关'
                }
            ]
        },
        {
            'text' : '专家委员会',
            'name':'xhjz',
            'children':[
                {
                    'text':'委员会名录'
                },
                {
                    'text':'委员会动态'
                },
                {
                    'text':'专业指导'
                }
            ]
        }
    ],
    '执业监督':[
        {
            'text' : '注册会计师',
            'state' : {
                'opened' : true
            },
            'name':'xhjz',
            'children':[
                {
                    'text':'监管制度',
                    'state' : {
                        'opened' : true,
                        'selected' : true
                    },
                },
                {
                    'text':'监管信息'
                },
                {
                    'text':'业务报备'
                }
            ]
        },
        {
            'text' : '资产评估师',
            'name':'xhjz',
            'children':[
                {
                    'text':'监管制度'
                },
                {
                    'text':'监管信息'
                },
                {
                    'text':'业务报备'
                }
            ]
        }
    ],
    '考试之窗':[
        {
            'text' : '注册会计师',
            'state' : {
                'opened' : true
            },
            'name':'xhjz',
            'children':[
                {
                    'text':'考试制度',
                    'state' : {
                        'selected' : true
                    },
                },
                {
                    'text':'考试信息'
                }
            ]
        },
        {
            'text' : '资产评估师',
            'name':'xhjz',
            'children':[
                {
                    'text':'考试制度'
                },
                {
                    'text':'考试信息'
                }
            ]
        }
    ],
    '人才培养':[
        {
            'text' : '注册会计师',
            'state' : {
                'opened' : true
            },
            'name':'xhjz',
            'children':[
                {
                    'text':'培训制度',
                    'state' : {
                        'selected' : true
                    },
                },
                {
                    'text':'培训信息'
                },
                {
                    'text':'网络培训'
                }
            ]
        },
        {
            'text' : '资产评估师',
            'name':'xhjz',
            'children':[
                {
                    'text':'培训制度'
                },
                {
                    'text':'培训信息'
                }
            ]
        },
        {
            'text' : '人才基金'
        }
    ],
    '增值服务':[
        {
            'text' : '金融服务',
            'state' : {
                'selected' : true
            },
            'name':'xhjz'
        },
        {
            'text' : '购车服务',
            'name':'xhzc'
        },
        {
            'text' : '酒店服务',
            'name':'ldjg'
        },
        {
            'text' : '采购服务',
            'name':'lxwm'
        },
        {
            'text' : '关爱基金',
            'name':'lxwm'
        },
        {
            'text' : '会员疗休养',
            'name':'lxwm'
        }
    ]

}