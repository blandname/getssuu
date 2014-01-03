var http = require('http');
var url = process.argv[2];
var fs = require('fs');

var rgxp_did = /"documentId":"(.*?)"/g;
var rgxp_pcnt = /"pageCount":(.*?),/g;
var base = '';
var did;
var pgcnt;
var crnt = 1;

http.get(url, function(res){
        res
                .on('data', function (chunk) {
                        base += chunk;
                })
                .on('end', function(){

                        var rslt_did = rgxp_did.exec(base);
                        did = rslt_did[1];
                        var rslt_pcnt = rgxp_pcnt.exec(base);
                        pgcnt = rslt_pcnt[1];

                        get_page();
                });
});
function padDigits(number, digits) {
    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
}
function get_page(){
	var padded = padDigits(crnt,4);
        var img = fs.createWriteStream('page_'+padded+'.jpg');
        http.get('http://image.issuu.com/'+did+'/jpg/page_'+crnt+'.jpg', function(res){
                res
                        .on('data', function(chunk){
                                img.write(chunk);
                        })
                        .on('end', function(){
                                if(crnt < pgcnt){
                                        crnt++;
                                        get_page();
                                } else {
										concat();
                                }
                        });
        });
}


function concat(){
	var terminal = require('child_process').spawn('bash');

	terminal.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
	});

	terminal.on('exit', function (code) {
		console.log('Download finished. Your lucky number is: ' + code);
	});

	setTimeout(function() {
		console.log('Sending stdin to terminal');
		terminal.stdin.write('convert -compress jpeg page_*.jpg output.pdf');
		// terminal.stdin.write('rm -rf page_*.jpg');
		terminal.stdin.end();
		}, 1000);
	}
