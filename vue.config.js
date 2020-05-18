module.exports = {
  chainWebpack:config=>{
    //发布模式 when
    config.when(process.env.NODE_ENV === 'production',config=>{
      //entry找到默认的打包入口，调用clear则是删除默认的打包入口
      //add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')
      // 过 webpack 的 externals 节点，来配置并加载外部的 CDN 资源。
      // 凡是声明在 externals 中的第三方依赖包，都不会被打包。
      // 这样就可以有效的减少单文件的体积。
      // cdn 包的名字、
      // 其中参数2对象中是键为依赖包的名字。值为使用Window全局的某个对象
      /*config.set('externals',{
        vue: 'Vue',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor'
      })*/
    })
    //开发模式
    config.when(process.env.NODE_ENV === 'development',config=>{
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
 
