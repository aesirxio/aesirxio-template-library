const path = require("path");
const critical = require("critical");

class CriticalCssWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(
      {
        src: "index.html",
        target: "index.css",
        inline: true,
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
      (compilation, callback) => {
        for (const chunk of compilation.chunks) {
          if (chunk.name === "app") {
            let css = [];

            for (const file of chunk.files) {
              if (/\.css$/.test(file)) {
                css.push(path.join(compilation.outputOptions.path, file));
              }
            }

            critical.generate(Object.assign({ css }, this.options), (err) => {
              callback(err);
            });

            return true;
          }
        }
      }
    );
  }
}

module.exports = CriticalCssWebpackPlugin;
