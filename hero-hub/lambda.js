let AWS = require('aws-sdk');
let cherrio = require('cherrio');
let request = require('request');

exports.handler = function(event, context, callback) {
	request.get('https://aws.amazon.com/heroes/', (error, response, data) => {
		console.log(data);
		let $ = cherrio.load(data);
		console.log($);
		$('.row-builder .aws-text-box').forEach(div => console.log(div.getElementsByTagName('a')[0].href));
		context.success('{}');
	})
}