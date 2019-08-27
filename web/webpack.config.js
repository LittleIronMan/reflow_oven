const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

let env = process.env.NODE_ENV;
env = env ? env.trim() : env; // trim вызывается потому-что в конце может быть пробел

module.exports = {
    entry: './app/app.jsx', // входная точка - исходный файл
    output: {
        path: path.resolve(__dirname, './public'), // путь к каталогу выходных файлов - папка public
        publicPath: '/public/',
        filename: 'bundle.js', // название создаваемого файла
    },
    plugins: [
        new webpack.ProvidePlugin({
            'React': 'react',
        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // all options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
            ignoreOrder: false, // Enable to remove warnings about conflicting order
        }),
    ],
    module: {
        rules: [
            // загрузчик для jsx
            {
                test: /\.jsx?$/, // определяем тип файлов
                exclude: /(node_modules)/, // исключаем из обработки папку node_modules
                loader: 'babel-loader', // определяем загрузчик
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react'], // используемые плагины
                },
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            // загрузчик для css
            {
                test: /\.(scss|sass)$/i,
                include: [
                    // path.resolve(__dirname, 'node_modules'),
                    path.resolve(__dirname, 'app'),
                ],
                loaders: [
                    env === 'development' ? // первый лоадер зависит от типа сборки
                        'style-loader' // в режиме разработки - сразу загружем CSS в DOM с помощью style-тега
                        : {
                            loader: MiniCssExtractPlugin.loader, // для продакшена, собираем все css-файлы в один модуль
                            options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            // publicPath: '../',
                                hmr: env === 'development', // hmr == hot module replacement
                            },
                        },
                    {
                        loader: 'css-loader',
                        query: {
                            modules: {
                                mode: 'local',
                                localIdentName: env === 'development' ? '[local]_[hash:base64:3]' : '[hash:base64:5]',
                                // localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                // context: path.resolve(__dirname, 'src'),
                                // hashPrefix: 'my-custom-hash',
                            },
                            localsConvention: 'camelCaseOnly',
                        },
                        // об опциях css-loader'a читай здесь https://github.com/webpack-contrib/css-loader#options
                    },
                    'sass-loader', // компилирует Sass/SCSS в CSS.
                    'postcss-loader', // postcss со своими плагинами преобразуют CSS
                    // Autoprefix, например, добавляет префиксы там где они нужны
                ],
            },
            // загрузчик для изображений и других файлов
            {
                test: /\.(png|jpe?g|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            },
        ],
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'app'),
            'node_modules',
            path.resolve(__dirname, 'img'),
        ],
    },
    devServer: {
        historyApiFallback: true,
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false,
    },
};
