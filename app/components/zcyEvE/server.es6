module.exports =  {
  //获取指定页面、区划的装修模板
  getTemplate: param => {
    let url = '/api/template/view';
    if(param.page){
      url = '/api/template/view2';
    }
    return $.ajax({
      spins: true,
      type: 'get',
      url: url,
      contentType: 'application/json',
      data: param
    })
  },
  //获取某一站点下的所有页面
  getWC: params => $.ajax({
    spins: true,
    type: 'get',
    url: '/api/template/getWC',
    traditional: true
  }),
  create: param => $.ajax({
    spins: true,
    type: 'post',
    url: '/api/template/create',
    contentType: 'application/json',
    data: JSON.stringify(param)
  }),
  //删除模板
  deleteTemplate: param => $.ajax({
    spins: true,
    type: 'post',
    url: '/api/template/delete',
    contentType: 'application/json',
    data: JSON.stringify(param)
  }),
  updata: param => $.ajax({
    spins: true,
    type: 'post',
    url: '/api/template/update',
    contentType: 'application/json',
    data: JSON.stringify(param)
  }),
  //all
  getAllTemplate: params => $.ajax({
    spins: true,
    type: 'get',
    url: '/api/template/viewAll',
    traditional: true,
    data: params
  }),
  //获取全站属性
  getCommon: params => $.ajax({
    spins: true,
    type: 'get',
    url: '/api/template/getCommon',
    traditional: true,
    data: params
  }),
  //发布
  submit: params => $.ajax({
    spins: true,
    type: 'POST',
    url: '/api/template/submit',
    traditional: true,
    data: JSON.stringify(params)
  }),//发布
  getPage: params => $.ajax({
    spins: true,
    type: 'get',
    url: '/api/template/submit11',
    traditional: true,
    data: params
  })
};
