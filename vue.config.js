module.exports = {
    publicPath: "./",
    lintOnSave: false,

    devServer: {
        overlay:{
            warning: false,
            errors:false
        },

        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5000',
                changeOrigin: true,
                secure: false,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }

    },
    configureWebpack:{
        module: {
            rules: [
                {
                    test: /\.mjs$/,
                    include: /node_modules/,
                    type: "javascript/auto"
                },
            ]
        }
    }
}