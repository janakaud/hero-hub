let AWS = require('aws-sdk');
let cheerio = require('cheerio');
let request = require('request');

exports.handler = function(event, context, callback) {
console.log("start");
	request.get('https://aws.amazon.com/heroes/', (error, response, data) => {
		let $ = cheerio.load(data);
		$('.row-builder .aws-text-box').each(div => console.log(div.getElementsByTagName('a')[0].href));
		context.success('{}');
	})
}