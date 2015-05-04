#!/usr/bin/env node

var http = require('http')
  , path = require('path')
  , spawn = require('child_process').spawn

var thumbnailDirectory = process.argv[2] || '.'

function request(){
  http.get('http://webtp.fil.univ-lille1.fr/~delemotte/image-search.php?withId=true',
    function(res){
      var body = ''
      console.log('Got response: '  + res.statusCode)
      res.on('data', function(chunk){
        body += chunk
      })
      res.on('end', function(){
        JSON.parse(body).result.map(processImage)
      })
  }).on('error', function(e){
    console.log('Got error: ' + e.message)
  })
}

function processImage(image){
  var id = image.id
    , url = image.url
    , outputFile = path.join(thumbnailDirectory, id + '.png')
    , convert = spawn('convert', ['-thumbnail', '300', '-', outputFile])

  convert.on('close', function(code){
    if (code !== 0){
      console.log(url + ' -> ' + id + ' has exited with code: '+ code)
    }
  })
  
  convert.stderr.on('data', function(data){
    console.log('convert stderr: ' + data)
  })

  http.get('http://' + url, function(res){
    console.log('Get ' + url + ': [' + res.statusCode + ']')
    res.on('data', function(chunk){
      convert.stdin.write(chunk)
    })
    res.on('end', function(){
      console.log(url + ' -> ' + id + ' is ended')
      convert.stdin.end()
    })
  }).on('error', function(e){
    console.log('Got error: ' + e.message)
  })
}

request()