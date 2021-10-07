const path = require("path");
const critical = require("critical");

class CriticalCssWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(
      {
        src: "index.html",
        target: "index.css",
        extract: true,
        width: 375,
        height: 565,
        concurrency: 4,
        penthouse: {
          blockJSRequests: false,
        },
      },
      options
    );
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapAsync(
      "CriticalCssWebpackPlugin",
      (compilation) => {
        for (const chunk of compilation.chunks) {
          if (chunk.id === "app") {
            let css = [];

            for (const file of chunk.files) {
              if (/\.css$/.test(file)) {
                css.push(path.join(compilation.outputOptions.path, file));
              }
            }

            critical.generate(
              Object.assign({ css }, this.options),
              function (err, cb) {
                console.log(cb.css);

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
              }
            );

            return;
          }
        }
      }
    );
  }
}

module.exports = CriticalCssWebpackPlugin;
