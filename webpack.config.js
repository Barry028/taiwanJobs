// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const HtmlInlineCssWebpackPlugin = require("html-inline-css-webpack-plugin");
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const glob = require('glob-all');
const PurgeCSSPlugin = require('purgecss-webpack-plugin');


const HTMLReg = new RegExp(/\/([\w-]+)(?=.html)/);
const JSReg = new RegExp(/\/([\w-]+)(?=.js)/);

const html = glob.sync('./src/pages/**/*.html').map(path => {
    let name = path.match(HTMLReg)[1]
    console.log(name);
    return new HtmlWebpackPlugin({
        template: path,
        filename: name + '.html',
        chunks: [name],
        minify: {
            html5: true,
            // collapseWhitespace: true,
            // preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false
        }
    })
})

const entries = glob.sync('./src/pages/**/*.js').reduce((prev, next) => {
    let name = next.match(JSReg)[1];
    prev[name] = next;
    return prev
}, {})



module.exports = {
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name]/[name]-bundle.js',
    },
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src/fonts'),
        },
    },
    devtool: 'source-map',
    module: {
        rules: [{
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 4000, // 圖片小於 4000 Bytes 會使用 base64 打包插入 HTML
                    // name: 'images/[name][hash:8].[ext]',
                    name: 'images/[name].[ext]',
                    // publicPath: '/images/', // 很多 loader 可以單獨設置 publicPath
                },
            }, {
                test: /\.(woff|woff2|eot|otf|ttf)$/,
                loader: 'file-loader',
                options: {
                    // limit: 3000, // 字體小於 4000 Bytes 會使用 base64 打包插入 HTML
                    // name: 'fonts/[name].[hash:8].[ext]',
                    name: 'fonts/[name].[ext]',
                    // publicPath: 'dist/fonts/', // 很多 loader 可以單獨設置 publicPath
                },
            }, {
                test: /\.s[ac]ss$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                    // options: {
                    //   publicPath: '../',
                    // },
                }, {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: "sass-loader",
                    options: {
                        sourceMap: true,
                        implementation: require('sass'),
                        sassOptions: {
                            outputStyle: "expanded", // expanded compressed
                        },
                    },
                }, ],
            }, {
                test: /\.css$/i,
                use: [
                    // MiniCssExtractPlugin.loader,
                    {
                        loader: 'style-loader',
                        options: {
                            injectType: 'singletonStyleTag', // 多個 CSS 合併為單一個 style 標籤
                            attributes: {
                                id: 'allCSS', // 附加 id 屬性並定義其值為 "allCSS"
                            },
                        },
                    },
                    'css-loader', {
                        loader: 'postcss-loader'
                    }
                ],
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['lodash']
                    }
                }
            },

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // filename: 'css/[name]@[contenthash].css',
            // chunkFilename: 'css/[name]@[contenthash].async.css'
            filename: 'css/[name].css',
            chunkFilename: 'css/[name].async.css'
        }),
        new PurgeCSSPlugin({
            paths: glob.sync(
                [
                    `${path.resolve(__dirname, 'src')}/pages/**/*`,
                    `${path.resolve(__dirname, 'src')}/scss/**/*`,
                    // `${path.resolve(__dirname, 'src')}/scss/**/*`,
                ], {
                    nodir: true,
                }, ),
            whitelist: ['@font-face'],
            whitelistPatternsChildren: [/^font-face/],
        }),
        // new CleanWebpackPlugin(),
    ].concat(html)
}