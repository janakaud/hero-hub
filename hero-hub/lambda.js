let AWS = require('aws-sdk');
const s3 = new AWS.S3();

let cheerio = require('cheerio');
let axios = require('axios');

exports.handler = function (event, context, callback) {
	let csv = [["Name", "Bio", "AWS", "LinkedIn", "Facebook", "Twitter", "Other..."].join(',')];
	let promises = [];

	axios.get('https://aws.amazon.com/heroes/').then(response => {
		let $ = cheerio.load(response.data);
		$('.row-builder .aws-text-box').find('a').each((k, v) => {

			let url = `https://aws.amazon.com${v.attribs.href}`;
			promises.push(axios.get(url).then(response => {
				let hero = cheerio.load(response.data);

				let name = hero(".row .title").eq(1).find('h1').first().text().trim();
				let columns = hero(".row .column-builder");
				let bio = `"${columns.first().text().replace(/\s{2,}/g, ' ').trim()}"`;
				let linkedin = '', facebook = '', twitter = '', other = [];

				columns.eq(1).find('a').each((i, a) => {
					let link = a.attribs.href;
					if (link.indexOf('linkedin.') > -1) {
						linkedin = link;
					} else if (link.indexOf('facebook.') > -1) {
						facebook = link;
					} else if (link.indexOf('twitter.') > -1) {
						twitter = link;
					} else if (!other.includes(link)) {
						other.push(link);
					}
				});
				csv.push([name, bio, url, linkedin, facebook, twitter, ...other].join(','));
			})
			.catch(err => {
				callback(err);
			}));
		});

		Promise.all(promises).then((result) => {
			console.log(`Collected ${csv.length} records`);
			s3.putObject({
				"Body": csv.join('\n'),
				"Bucket": "temp-playground",
				"Key": "heroes.csv",
				"ACL": "public-read"
			})
				.promise()
				.then(data => {
					callback(null, data);
				})
				.catch(err => {
					callback(err);
				});
		})
		.catch(err => {
			callback(err);
		});
	})
	.catch(err => {
		callback(err);
	});
}