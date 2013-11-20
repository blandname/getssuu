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

function get_page(){
	var img = fs.createWriteStream(crnt+'.jpg');
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
					console.log('finished');
				}
			});
	});
}