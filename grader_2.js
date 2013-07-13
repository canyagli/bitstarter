#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var util = require('util');

//var HTMLFILE_DEFAULT = "index.html";
var HTMLFILE_DEFAULT = "index_2.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://www.google.com";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var assertURLExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        //process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code                                                                                                                                                   
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var cheerioURLFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var buildfn = function() {
    var response2console = function(result, response) {
        if (result instanceof Error) {
            console.error('Error: ' + util.format(response.message));
        } else {
            //console.error("Wrote %s", data);
            //fs.writeFileSync(csvfile, result)
            //var dumHTMLFile = cheerio.load(response);
            //var checkJson = checkHtmlFile(dumHTMLFile, program.checks);
            var dumHTMLFile = fs.writeFile('message.txt', result, function (err) {
              if (err) 
                {
                  throw err;
                  console.log('Error thrown!\n');
                }
              var checkJson = checkHtmlFile('message.txt', program.checks);
              var outJson = JSON.stringify(checkJson, null, 4);
              console.log(outJson);
              console.log('It\'s saved!');
              });
            //var checkJson = checkHtmlFile('message.txt', program.checks);
            //var outJson = JSON.stringify(checkJson, null, 4);
            //console.log(outJson);
        }
    };
    return response2console;
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url_adress>', 'The URL to show the application', undefined)
        .parse(process.argv);
    

    // print process.argv
    process.argv.forEach(function (val, index, array) {
      console.log(index + ': ' + val);
    });

    //var htmlInput = 4;
    console.log("\nprogram.url is %s", program.url);

    // Check if a URL has been given as an argument
    if((program.url === undefined))  {

      var htmlInput = program.file;
      //program.url = "CHANGED!";                                                                                                                                                                                                          
      //console.log("\nURL is " + program.url);                                                                                                                                                                                            
      console.log("\nhtmlInput is %s", htmlInput.toString());
      var checkJson = checkHtmlFile(program.file, program.checks);
      var outJson = JSON.stringify(checkJson, null, 4);
      console.log(outJson);
     }
    else {
      console.log("\nURL is " + program.url);
      var response2console = buildfn();
      rest.get(program.url).on('complete', response2console);
      //htmlInput = rest.get(program.url).on('complete', response2console);                                                                                                                                                                
    }


   
    /*
    var checkJson = checkHtmlFile(htmlInput, program.checks);
    var outJson = JSON.stringify(checkJson, null, 4);
    console.log(outJson);
    */
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
