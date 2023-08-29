const path = require('path');
const fs = require('fs');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');



// list of files to purge after build step
const removeFiles = [
  path.resolve(__dirname, 'assets', 'style.js'),
  path.resolve(__dirname, 'assets', 'app.js.LICENSE.txt'),
  path.resolve(__dirname, 'assets', 'style.js.LICENSE.txt'),
];


// cleanup function to run after build steps to nuke files
const cleanup = {
  scripts: [
    _ => {
      for (const file of removeFiles) {
        if (fs.existsSync(file)) {
          console.log(`- unlinking ${file}`);
          fs.unlinkSync(file);
        }
      }
    },
  ],
  blocking: true,
};



module.exports = {
  entry: {

    // javascript core libs
    app: './src/js/app.js',

    // css core lib
    style: './src/css/style.css',

  },
  mode: 'production',
  watchOptions: {
    ignored: [
      '**/node_modules',
      'package*.json',
    ],
    followSymlinks: true,
  },
  output: {

    // fill emit files by name in the assets dir to be shopify compatible
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',

  },
  optimization: {

    nodeEnv: 'production',
    concatenateModules: true,
    mergeDuplicateChunks: true,
    mangleExports: false,
    mangleWasmImports: true,
    minimize: true,
    moduleIds: 'size',
    providedExports: true,
    removeAvailableModules: true,
    removeEmptyChunks: true,
    usedExports: false,

  },
  module: {
    rules: [

      // js -> babel
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

    ],
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  plugins: [

    // emit css file separately, not in js
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    // cleanup since webpack will write some files we don't want
    new WebpackShellPluginNext({
      onAfterDone: cleanup,
    }),

  ],
};
