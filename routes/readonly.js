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

	console.log(recordsCollection);
}


//基準点で分ける 90以上, 80以上, 70以上
function getLabsListByScore(labs, records) {
	let result = [];
//	for(let lab of labs) {
//		
//	}
}

/* Get Method*/
router.get('/', function(req, res, next) {
	res.header('Content-Type', 'text/plain;charset=utf-8');
	res.end('未実装');
	getLabsRegistered();

/*
	new records().query().select(function() {
			this.count('*');
		}).groupBy('first').then((firstCollections) => {
			new records().select(function() {
				this.count('*');
			}).groupBy('second').then((secondCollections) => {
				new records().select(function() {
					this.count('*');
				}).groupBy('third').then((thirdCollections) => {
					new labs().fetchAll().then((labCollections) => {
						console.log("first" + firstCollections.toArray().length);
						console.log("second" + secondCollections.toArray().length);
						console.log("third" + thirdCollections.toArray().length);
						console.log("lab" + labCollections.toArray().length);
					});
				})
			});
		});
	new labs().fetchAll().then((collection) => {
		let labsModel = collection.toArray();
		let labs = [];
		for(labIndex in labs) {
			
		}
                datas.labs = collection.toArray();
                datas.title = '閲覧';
                res.render('index', datas);
        })
        .catch((err) => {
                res.status(500).json({ error: true, data: { message: err.message}});
        });
*/
});


module.exports = router;
