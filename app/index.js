'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var AppGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
        this.log(yosay('Everything went smoothly! We\'ll just download the dependencies now. Bye from Antistatique!'));
      } else {
        this.log(yosay('Everything went smoothly! Bye from Antistatique!'));
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the marvelous Styleguide generator by Antistatique!'));

    var prompts = [{
      type: 'input',
      name: 'name',
      message: "What's the name of your project?",
      default: 'Styleguide'
    },
    {
      type: 'input',
      name: 'repo_url',
      message: "What's the name of your repo?",
      default: this._.slugify(this.appname)
    },
    {
      type: 'input',
      name: 'github_user',
      message: "What's your Github username?",
      default: 'username'
    },
    {
      type: 'input',
      name: 'version',
      message: "What's the current version number?",
      default: '0.0.0'
    },
    {
      type: 'confirm',
      name: 'twig',
      message: "Would you like to generate some twig example pages?",
      default: false
    }];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.github_user = props.github_user;
      this.repo_url = props.repo_url;
      this.version = props.version;
      this.twig = props.twig;

      done();
    }.bind(this));
  },

  app: function () {
    this.template('_package.json', 'package.json');
    this.copy('_bower.json', 'bower.json');
    this.copy('Gemfile', 'Gemfile');
    this.template('README.md', 'README.md');

    this.directory('assets/sass/components', 'assets/sass/components');
    this.directory('assets/sass/javascript', 'assets/sass/javascript');
    this.directory('assets/sass/layout', 'assets/sass/layout');

    this.mkdir('assets/fonts');

    this.copy('assets/sass/bootstrap-variables.scss', 'assets/sass/bootstrap-variables.scss');
    this.copy('assets/sass/bootstrap.scss', 'assets/sass/bootstrap.scss');
    this.copy('assets/sass/styleguide.scss', 'assets/sass/styleguide.scss');

    this.template('assets/sass/project-variables.scss', 'assets/sass/'+this._.slugify(this.name)+'-variables.scss');
    this.template('assets/sass/project-mixins.scss', 'assets/sass/'+this._.slugify(this.name)+'-mixins.scss');
    this.template('assets/sass/main.scss', 'assets/sass/main.scss');
    this.template('assets/js/main.js', 'assets/js/main.js');
    this.template('assets/README.md', 'assets/README.md');
    this.template('hologram_config.yml', 'hologram_config.yml');

    this.template('gulpfile.js', 'gulpfile.js');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    this.copy('htaccess', '.htaccess');
    this.copy('robots.txt', 'robots.txt');
  },

  addTwigToProject: function() {
    if (this.twig) {
      this.copy('layout.twig', 'assets/pages/layout.twig');
      this.composeWith('styleguide:twig', { options: {
        name: 'index'
      }});
    }
  }
});

module.exports = AppGenerator;
