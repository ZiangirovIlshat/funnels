const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/funnels/",
  devServer: {
    historyApiFallback: true,
  },
})