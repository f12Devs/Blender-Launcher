module.exports = {
  lintOnSave: false,

  pluginOptions: {
    quasar: {
      theme: "mat"
    },
    electronBuilder: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.styl$/,
              use: [
                { loader: "style-loader" },
                { loader: "css-loader" },
                { loader: "stylus-loader" }
              ]
            }
          ]
        }
        // resolve: {
        //   extensions: [".vue", ".js", ".styl"]
        // }
      }
    }
  }
};
