const path = require('path')

module.exports = {
	mode: 'development',
	devtool: 'inline-source-map',
	entry: path.resolve(__dirname, '../src/main.ts'),
	module: {
		rules: [
			{
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, '../dist'),
		publicPath: '/dist'
	},
	devServer: {
		contentBase: path.join(__dirname, '../src'),
		overlay: true
	}
}
