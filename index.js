#!/usr/bin/env node

"use strict";

// // gitmanager Tutorial
// // ===============

// // Dependencies:
// // --------------

// "use strict";

// var chalk       = require('chalk');
// var clear       = require('clear');
// var CLI         = require('clui');
// var figlet      = require('figlet');
// var inquirer    = require('inquirer');
// var Preferences = require('preferences');
// var Spinner     = CLI.Spinner;
// var GitHubApi   = require('github');
// var _           = require('lodash');
// var git         = require('simple-git')();
// var touch       = require('touch');
// var fs          = require('fs');
// var files       = require('./lib/files');

// // Initialize Node CLI
// // --------------------

// // Clear the screen and display banner:

// clear();
// console.log(
//   chalk.yellow(
//     figlet.textSync('gitmanager', { horizontalLayout: 'full'
//     })
//   )
// );

// Check to ensure the current folder isn't already a Git repository:

// if (files.directoryExists('.git')) {
//   console.log(chalk.red('Already a git repository!'));
//   process.exit();
// }

// // Prompt User For Input
// // ----------------------

// // Prompt user for Github credentials:

// function getGithubCredentials(callback) {
//   var questions = [
//     {
//       name: 'username',
//       type: 'input',
//       message: 'Enter your Github username or e-mail address:',
//       validate: function( value ) {
//         if (value.length) {
//           return true;
//         } else {
//           return 'Please enter your username or e-mail address';
//         }
//       }
//     },
//     {
//       name: 'password',
//       type: 'password',
//       message: 'Enter your password:',
//       validate: function(value) {
//         if (value.length) {
//           return true;
//         } else {
//           return 'Please enter your password';
//         }
//       }
//     }
//   ];
//   inquirer.prompt(questions).then(callback);
// }

// // Create an instance of the Github API:
// var github = new GitHubApi({
//   version: '12.0.3'
// });

// // Check for authetication token and authenticate:
// function getGithubToken(callback) {
  
//   // Preferences
//   // Creates an OAuth token and saves user preferences.
//   // ( The prefs files is saved to /Users/[YOUR-USERNAME]/.config/preferences/gitmanager.pref )
//   var prefs = new Preferences('gitmanager');
  
//   // Check if preferences and a token already exists
//   if (prefs.github && prefs.github.token) {
//     return callback(null, prefs.github.token);
//   }

//   // Fetch token
//   getGithubCredentials(function(credentials) {
   
//     // Create a spinner:
//     var status = new Spinner('Authenticating, please wait...');
//     status.start();
    
//     // Authenticate - see node-github docs to add two-factor authentication if neccesssary.
//     github.authenticate(
//       _.extend(
//         {
//           type: 'basic',
//         },
//         credentials
//       )
//     );

//     // Return
//     github.authorization.create({
//       scopes: ['user', 'public_repo', 'repo', 'repo:status'],
//       notes: 'gitmanager, the command-line tool for initializing Git repos'
//     }, function(err, res) {
//       status.stop();
//       if ( err ) {
//         return callback( err) ;
//       }
//       if (res.token) {
//         prefs.github = {
//           token : res.token
//         };
//         return callback(null, res.token);
//       }
//       return callback();
//     });
//     status.stop();
//   });
// }

// // Creating a Repository
// // ----------------------

// // Parse the command line arguments and ask series of questions

// function createRepo(callback) {

//   // Place the command line arguments in an array
//   // { _: [ 'my-repo', 'just a test repository' ] }
//   var argv = require('minimist')(process.argv.slice(2));

//   // CLI questions
//   var questions = [
//     {
//       type: 'input',
//       name: 'name',
//       message: 'Enter a name for the repository:',
//       default: argv._[0] || files.getCurrentDirectoryBase(),
//       validate: function( value ) {
//         if (value.length) {
//           return true;
//         } else {
//           return 'Please enter a name for the repository';
//         }
//       }
//     },
//     {
//       type: 'input',
//       name: 'description',
//       message: 'Optionally enter a description of the repository:'
//     },
//     {
//       type: 'list',
//       name: 'visibility',
//       message: 'Public of private:',
//       choices: [ 'public', 'private' ],
//       default: 'public'
//     }
//   ];
  
//   inquirer.prompt(questions).then(function(answers) {
//     var status = new Spinner('Creating repository...');
//     status.start();

//     var data = {
//       name : answers.name,
//       description : answers.description,
//       private : (answers.visibility === 'private')
//     };

//     github.repos.create(
//       data,
//       function(err, res) {
//         status.stop();
//         if (err) {
//           return callback(err);
//         }
//         return callback(null, res.ssh_url);
//       }
//     );
//   });
// }

// // Creating a .gitignore File
// // ---------------------------
// // TODO:  See https://github.com/github/gitignore and https://zellwk.com/blog/gitignore/ and include everything to be already checked if exists.
// //        Currently using node.gitignore, python.gitignore, sass.gitignore, and yeoman.gitignore.
// // TODO:  Maybe even give the option to pick the contents of what gitignores to clone from above.

// function createGitignore(callback) {

//   var filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

//   var defaultlist = [
//     // OS generated files:
//     // Right now, just macOS
//     '.DS_Store',
//     '.DS_Store?',
//     '.AppleDouble',
//     '.LSOverride',
//     // IDE generated files:
//     // Right now, just vim
//     '*.swp',
//     '*.swo',
//     // Sass
//     '.sass-cache/',
//     '*.css.map',    
//     // Javascript
//     // Logs
//     'logs',
//     '*.log',
//     'npm-debug.log*',
//     'yarn-error.log',
//     // Runtime data
//     'pids',
//     '*.pid',
//     '*.seed',
//     '*.pid.lock',
//     // Grunt intermediate storage
//     '.grunt',
//     // Compiled binary addons
//     'build/Release',
//     // Dependency directories
//     'node_modules',
//     'jspm_packages',
//     // Typescript v1 declaration files
//     'typings',
//     // Optional npm cache directory
//     '.npm',
//     // Optional REPL history
//     '.node_repl_history',
//     // Output of 'npm pack'
//     '*.tgz',
//     // Yarn integrity file
//     '.yarn-integrity',
//     // dotenv environment variables file
//     '.env',
//     // Build files
//     'build',
//     'dist'
//   ]

//   if (filelist.length) {
//     inquirer.prompt(
//       [
//         {
//           type: 'checkbox',
//           name: 'ignore',
//           message: 'Select the files and/or folders you wish to ignore:',
//           choices: filelist,
//           default: defaultlist
//         }
//       ]
//     ).then(function( answers ) {
//       if (answers.ignore.length) {
//         fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
//       } else {
//         touch( '.gitignore' );
//       }
//       return callback();
//     }
//     );
//   } else {
//     touch('.gitignore');
//     return callback();
//   }
// }

// // Interacting With Git
// // ---------------------

// // Set up the repo
// function setupRepo( url, callback ) {
//   var status = new Spinner('Setting up the repository...');
//   status.start();

//   git
//     .init()
//     .add('.gitignore')
//     .add('./*')
//     .commit('Initial commit')
//     .addRemote('origin', url)
//     .push('origin', 'master')
//     .then(function(){
//       status.stop();
//       return callback();
//     });
// }

// // Obtain the token and authenticate the user

// function githubAuth(callback) {
//   getGithubToken(function(err, token) {
//     if (err) {
//       return callback(err);
//     }
//     github.authenticate({
//       type : 'oauth',
//       token : token
//     });
//     return callback(null, token);
//   });
// }


// githubAuth(function(err, authed) {
//   if (err) {
//     switch (err.code) {
//       case 401:
//         console.log(chalk.red('Couldn\'t log you in. Please try again.'));
//         break;
//       case 422:
//         console.log(chalk.red('You already have an access token.'));
//         break;
//     }
//   }
//   if (authed) {
//     console.log(chalk.green('Sucessfully authenticated!'));
//     createRepo(function(err, url){
//       if (err) {
//         console.log('An error has occured');
//       }
//       if (url) {
//         createGitignore(function() {
//           setupRepo(url, function(err) {
//             if (!err) {
//               console.log(chalk.green('All done!'));
//             }
//           });
//         });
//       }
//     });
//   }
// });

var chalk       = require('chalk');
var clear       = require('clear');
var CLI         = require('clui');
var figlet      = require('figlet');
var inquirer    = require('inquirer');
var Preferences = require('preferences');
var Spinner     = CLI.Spinner;
var GitHubApi   = require('github');
var _           = require('lodash');
var git         = require('simple-git')();
var touch       = require('touch');
var fs          = require('fs');
var files       = require('./lib/files');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Ginit', { horizontalLayout: 'full' })
  )
);

if (files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository!'));
  process.exit();
}

var github = new GitHubApi({
  version: '3.0.0'
});

function getGithubCredentials(callback) {
  var questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or e-mail address:',
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-mail address.';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your password.';
        }
      }
    }
  ];

  inquirer.prompt(questions).then(callback);
}

function getGithubToken(callback) {
  var prefs = new Preferences('ginit');

  if (prefs.github && prefs.github.token) {
    return callback(null, prefs.github.token);
  }

  getGithubCredentials(function(credentials) {
    var status = new Spinner('Authenticating you, please wait...');
    status.start();

    github.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );

    github.authorization.create({
      scopes: ['user', 'public_repo', 'repo', 'repo:status'],
      note: 'ginit, the command-line tool for initalizing Git repos'
    }, function(err, res) {
      status.stop();
      if ( err ) {
        return callback( err );
      }
      if (res.token) {
        prefs.github = {
          token : res.token
        };
        return callback(null, res.token);
      }
      return callback();
    });
  });
}

function createRepo(callback) {
  var argv = require('minimist')(process.argv.slice(2));

  var questions = [
    {
      type: 'input',
      name: 'name',
      message: 'Enter a name for the repository:',
      default: argv._[0] || files.getCurrentDirectoryBase(),
      validate: function( value ) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter a name for the repository.';
        }
      }
    },
    {
      type: 'input',
      name: 'description',
      default: argv._[1] || null,
      message: 'Optionally enter a description of the repository:'
    },
    {
      type: 'list',
      name: 'visibility',
      message: 'Public or private:',
      choices: [ 'public', 'private' ],
      default: 'public'
    }
  ];

  inquirer.prompt(questions).then(function(answers) {
    var status = new Spinner('Creating repository...');
    status.start();

    var data = {
      name : answers.name,
      description : answers.description,
      private : (answers.visibility === 'private')
    };

    github.repos.create(
      data,
      function(err, res) {
        status.stop();
        if (err) {
          return callback(err);
        }
        return callback(null, res.ssh_url);
      }
    );
  });
}

function createGitignore(callback) {

  var filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');
  
    var defaultlist = [
    // OS generated files:
    // Right now, just macOS
    '.DS_Store',
    '.DS_Store?',
    '.AppleDouble',
    '.LSOverride',
    // IDE generated files:
    // Right now, just vim
    '*.swp',
    '*.swo',
    // Sass
    '.sass-cache/',
    '*.css.map',    
    // Javascript
    // Logs
    'logs',
    '*.log',
    'npm-debug.log*',
    'yarn-error.log',
    // Runtime data
    'pids',
    '*.pid',
    '*.seed',
    '*.pid.lock',
    // Grunt intermediate storage
    '.grunt',
    // Compiled binary addons
    'build/Release',
    // Dependency directories
    'node_modules',
    'jspm_packages',
    // Typescript v1 declaration files
    'typings',
    // Optional npm cache directory
    '.npm',
    // Optional REPL history
    '.node_repl_history',
    // Output of 'npm pack'
    '*.tgz',
    // Yarn integrity file
    '.yarn-integrity',
    // dotenv environment variables file
    '.env',
    // Build files
    'build',
    'dist'
  ]


  if (filelist.length) {
    inquirer.prompt(
      [
        {
          type: 'checkbox',
          name: 'ignore',
          message: 'Select the files and/or folders you wish to ignore:',
          choices: filelist,
          default: defaultlist 
        }
      ]
    ).then(function( answers ) {
        if (answers.ignore.length) {
          fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
        } else {
          touch( '.gitignore' );
        }
        return callback();
      }
    );
  } else {
    touch('.gitignore');
    return callback();
  }
}

function setupRepo(url, callback) {
  var status = new Spinner('Setting up the repository...');
  status.start();

  git
    .init()
    .add('.gitignore')
    .add('./*')
    .commit('Initial commit')
    .addRemote('origin', url)
    .push('origin', 'master')
    .then(function(){
      status.stop();
      return callback();
    });
}

function githubAuth(callback) {
  getGithubToken(function(err, token) {
    if (err) {
      return callback(err);
    }
    github.authenticate({
      type : 'oauth',
      token : token
    });
    return callback(null, token);
  });
}

githubAuth(function(err, authed) {
  if (err) {
    switch (err.code) {
      case 401:
        console.log(chalk.red('Couldn\'t log you in. Please try again.'));
        break;
      case 422:
        console.log(chalk.red('You already have an access token.'));
        break;
    }
  }
  if (authed) {
    console.log(chalk.green('Successfully authenticated!'));
    createRepo(function(err, url){
      if (err) {
        console.log('An error has occured');
        console.log(err);
      }
      if (url) {
        createGitignore(function() {
          setupRepo(url, function(err) {
            if (!err) {
              console.log(chalk.green('All done!'));
            }
          });
        });
      }
    });
  }
});
