var path = require('path');
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
    // if (this.arguments.appname) {
    //   this.params.appname = this.arguments.appname;
    // }
    let answers;
    // if (this.params.appname) {
    answers = await this.prompt([{
      type: "input",
      name: "appname",
      message: "Your project name"
    }]);
    this.params.appname = answers.appname;
    // }
    answers = await this.prompt([{
      type: 'list',
      name: 'preset',
      message: 'Please pick a preset:',
      choices: ['default (babel, eslint)', 'Manually select features']
    }]);
    this.params.preset = answers.preset;

    if (this.params.preset.indexOf('default') !== 0) {
      answers = await this.prompt([{
        type: 'checkbox',
        name: 'dependencies',
        message: 'Check the features needed for your project:',
        // choices: ['Babel', 'TypeScript', 'Progressive Web App (PWA) Support', 'Router', 'Vuex', 'CSS Pre-processors', 'Linter / Formatter', 'Unit Testing', 'E2E Testing'],
        choices: ['Babel', 'TypeScript', 'Linter / Formatter'],
        default: ['Babel', 'Linter / Formatter']
      }])
      this.params.dependencies = {};
      for (const item of answers.dependencies) {
        if (item === 'Babel') this.params.dependencies.babel = true;
        if (item === 'TypeScript') this.params.dependencies.typescript = true;
        if (item === 'Progressive Web App (PWA) Support') this.params.dependencies.pwa = true;
        if (item === 'Router') this.params.dependencies.router = true;
        if (item === 'Vuex') this.params.dependencies.vuex = true;
        if (item === 'CSS Pre-processors') this.params.dependencies.precss = true;
        if (item === 'Linter / Formatter') this.params.dependencies.linter = true;
        if (item === 'Unit Testing') this.params.dependencies.unittest = true;
        if (item === 'E2E Testing') this.params.dependencies.e2etest = true;
      }
    } else {
      this.params.dependencies = { babel: true, linter: true };
    }

    this._copy();
    this._install();
  }
  _copy() {
    this.fs.copyTpl(
      this.templatePath('package.tpl'),
      this.destinationPath('package.json'),
      this.params
    );
  }

  _install() {

  }
};