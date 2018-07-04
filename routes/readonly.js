var express = require('express');
var router = express.Router();

let knex = require('knex')({
	dialect: 'sqlite3',
	connection: {
		filename: 'labchoise.db'
	},
	useNullAsDefault: true
});

async function getLabsList() {
	return knex.select().from('labs');
}

async function getRecordsList() {
	return knex.select().from('records');
}

async function getLabsRegistered() {
	let labsCollection = await getLabsList();
	let recordsCollection = await getRecordsList();
	return getLabsListByScore(labsCollection, recordsCollection);
}


//基準点で分ける 90以上, 80以上, 70以上
function getLabsListByScore(labs, records) {
	let result = [{
		"lab": {lab_id: -1, lab_name: "研究室"},
		"first": "90点以上",
		"second": "80点以上",
		"third": "70点以上",
		"num": records.length
	}];

	console.log(records);
	
	for(let lab of labs) {
		let first = 0, second = 0, third = 0;
		for(let record of records) {
			if(record.first_lab != lab.lab_id && record.second_lab != lab.lab_id && record.third_lab != lab.lab_id) continue;
			if(record.average >= 90) {
				first++;
			} else if(record.average >= 80) {
				second++;
			}else if(record.average >= 70) {
				third++;
			}
		}
		let labObj = {
			"lab": lab,
			"first": first,
			"second": second,
			"third": third
		};
		result.push(labObj);
	}
	return result;
}

/* Get Method*/
router.get('/', function(req, res, next) {
//	res.header('Content-Type', 'text/plain;charset=utf-8');
//	res.end('未実装');
	getLabsRegistered().then((collections) => {
		console.log(collections);
		datas = {
			data: collections,
		};

		res.render('readonly', datas);
	});
});


module.exports = router;
