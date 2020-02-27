const path = require('path');

module.exports = {
  publicPath: './',
  // 输出文件目录,默认就是dist
  outputDir: process.env.NODE_ENV === "test" ? 'distTest' : 'distPro',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // 配置es-link true,'error'
  lintOnSave: false,
  css: { // 一次配置，全局使用，这个scss 因为每个文件都要引入
    loaderOptions: {
      sass: {
        prependData: `@import "./src/styles/main.scss";`
      }
    }
  },
  // webpack-dev-server 相关配置
  devServer: {
    // 可以通过设置让浏览器 overlay 同时显示警告和错误：
    overlay: {
      warnings: true,
      errors: true
    },
    open: false,
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hot:true,
    proxy: {
      '/devApi': {
        target: 'http://www.web-jshtml.cn/productapi',
        changeOrigin: true,
        pathRewrite: {
          '^/devApi': ''
        }
      }
    }
  },
  configureWebpack: (config)=>{
    config.resolve = { // 覆盖webpack默认配置的都在这里
        extensions: ['.js', '.json', '.vue'],
        alias: {
          '@': path.resolve(__dirname, './src'),
          'public': path.resolve(__dirname, './public'),
          '@c': path.resolve(__dirname, './src/components'),
          'common': path.resolve(__dirname, './src/common'),
          'api': path.resolve(__dirname, './src/api'),
          'view': path.resolve(__dirname, './src/view'),
          'data': path.resolve(__dirname, './src/data'),
      }
    }
  }
}