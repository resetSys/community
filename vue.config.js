module.exports = {
  publicPath: "./",
  configureWebpack: {
    resolve: {
      alias: {
        'assets':'@/assets',
        'components':'@/components',
        'views':"@/views",
        'network':"@/network"
      }
    }
  }
}