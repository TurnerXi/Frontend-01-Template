var path = require('path');
const fs = require('fs');
var Generator = require('yeoman-generator');
module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
    this.option("version");
    // this.argument("appname", { type: String, required: false });
    this.params = {};
  }

  start() {
    if (this.options.version) {
      this.log("1.0.1");
    } else {
      this._init();
    }
  }

  async _init() {
    let answers;
    answers = await this.prompt([{
      type: "input",
      name: "appname",
      message: "Your project name"
    }]);
    this.params.appname = answers.appname;

    this._copy();
    this._install();
  }
  _copy() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      this.params
    );

    const files = listFiles(this.sourceRoot());
    for (const filepath of files) {
      const tplPath = path.relative(this.sourceRoot(), filepath);
      if (tplPath !== 'package.json') {
        this.fs.copyTpl(
          this.templatePath(tplPath),
          this.destinationPath(tplPath)
        );
      }
    }
  }

  _install() {
    this.yarnInstall();
  }
};

function listFiles(filepath) {
  let list = [];
  const dirent = fs.readdirSync(filepath, { withFileTypes: true });
  for (const item of dirent) {
    const fpath = path.join(filepath, item.name)
    if (item.isDirectory()) {
      list.push(...listFiles(fpath));
    } else {
      list.push(fpath);
    }
  }
  return list;
}
