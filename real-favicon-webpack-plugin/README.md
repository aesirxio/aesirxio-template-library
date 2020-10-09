[![npm version](https://badge.fury.io/js/real-favicon-webpack-plugin.svg)](https://badge.fury.io/js/real-favicon-webpack-plugin)

# real-favicon-webpack-plugin

Generate favicons using [RealFaviconGenerator](https://github.com/RealFaviconGenerator) as part of your Webpack build process.


## Usage

In your Webpack config:

**webpack.config.js**

```js
const RealFaviconPlugin = require('real-favicon-webpack-plugin');

module.exports = {
  plugins: [
    new RealFaviconPlugin({
        favicon: path.resolve(__dirname, "./src/favicon/favicon.png"),
        faviconJson: path.resolve(__dirname, "./src/favicon/favicon.json"),
        publicPath: "/publicPath/favicon",
        outputPath: "/outputPath/favicon",
    })
  ]
}
```

The options are:

* `favicon` (required): the path to a favicon icon
* `faviconJson` (required): the path to a JSON configuration file from the [RFG website](https://realfavicongenerator.net)
* `publicPath` (required): the path where the plugin will output the public path
* `outputPath` (required): the path where the plugin will output the favicon files generated from your config


### Generated files

The plugin will generate files based on your configuration file. Generally these will include one or more favicon images, and possibly some browser- or device-specific files such as `browserconfig.xml` for IE11.
