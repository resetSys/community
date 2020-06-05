module.exports = {
  publicPath: "./",
  configureWebpack: {
    resolve: {
      alias: {
        'assets':'@/assets',
        'components':'@/components',
        'mixins':'@/mixins',
        'views':"@/views",
        'network':"@/network",
        'utils':'@/utils'
      }
    }
  }
}