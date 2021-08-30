const rfg = require("rfg-api").init();

const pluginName = "RealFaviconPlugin";

class RealFaviconPlugin {
  // Do some setup and check we were given the correct options
  constructor(options) {
    const { favicon, faviconJson, publicPath, outputPath } = options;
    if (!favicon) throw new Error(`${pluginName}: Missing favicon option`);
    if (!faviconJson)
      throw new Error(`${pluginName}: Missing faviconJson option`);
    if (!publicPath)
      throw new Error(`${pluginName}: Missing publicPath option`);
    if (!outputPath)
      throw new Error(`${pluginName}: Missing outputPath option`);

    this.options = options;
  }

  // Generate and write favicon images
  generateFavicons(cb) {
    rfg.generateFavicon(this.request, this.options.outputPath, cb);
  }

  apply(compiler) {
    // Hook into the webpack compilation
    // to start the favicon generation
    compiler.hooks.make.tapPromise(pluginName, async (compilation) => {
      const jsonPath = this.options.faviconJson;
      const json = require(jsonPath);

      const opts = {
        apiKey: "114204dabff7639f8a4c1a567e98b57d2cf8e76e",
        masterPicture: this.options.favicon,
        iconsPath: this.options.publicPath,
        design: json.design,
        settings: json.settings,
        versioning: json.versioning,
      };

      this.request = rfg.createRequest(opts);

      const HtmlWebpackPlugin = compiler.options.plugins
        .map(({ constructor }) => constructor)
        .find(
          /**
           * Find only HtmlWebpkackPlugin constructors
           * @type {(constructor: Function) => constructor is typeof import('html-webpack-plugin')}
           */
          (constructor) =>
            constructor && constructor.name === "HtmlWebpackPlugin"
        );

      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        pluginName,
        (data, cb) => {
          if (data.plugin.options.realfavicons === true) {
            this.generateFavicons((err, res) => {
              if (err) return cb(err);

              data.html = data.html.replace(
                "</head>",
                res.favicon.html_code + "</head>"
              );

              cb(null, data);
            });
          } else {
            cb(null, data);
          }
        }
      );
    });
  }
}

module.exports = RealFaviconPlugin;
