var webpack = require('webpack')
var UglifyJSPlugin = webpack.optimize.UglifyJsPlugin

module.exports = {
	entry: __dirname+'/src/app.js',
	output: {
		path: __dirname + "/dist" ,
		filename: 'bundle.js'
	},
	module: {
		loaders: [
			{
				test: /\.js[x]?$/,
				exclude: /node_modules/,
				loader: 'babel-loader?presets[]=es2015&presets[]=react'
			},
		]
	},
	resolve: {
    alias: {
      'vue$': 'vue/dist/vue.common.js' //独立构建vue
    }
  },
	devServer: {
        contentBase: "./dist",//本地服务器所加载的页面所在的目录
        //colors:true,//中断中输出结果为彩色
        historyApiFallback:true,//不跳转
        inline: true //实时刷新
    },
		plugins: [
    new UglifyJSPlugin(),//压缩
  ]
}
