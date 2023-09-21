const fs = require("fs");
const uglifyJs = require("uglify-js");

function main() {
  console.log("main");

  const before = fs.readFileSync("./before.js", "utf-8");
  console.log(before);

  const { code } = uglifyJs.minify(before, { webkit: true });
  console.log(code);

  fs.writeFileSync("./after.js", code);
}

main();
