var express = require('express');
var router = express.Router();
let crypto = require('crypto');

let knex = require('knex')({
	dialect: 'sqlite3',
	connection: {
		filename: 'labchoise.db'
	},
	useNullAsDefault: true
});

let Bookshelf = require('bookshelf')(knex);

let records = Bookshelf.Model.extend({
	tableName: 'records'
});

let labs = Bookshelf.Model.extend({
	tableName: 'labs'
});

/* GET home page. */
router.get('/', function(req, res, next) {
	let cookie = getCookie("hash_id", req);
	let datas = {
		err: null,
		form: {first: 0, second: 0, third: 0, ave: ""},
		hash: null,
		edit: false
	};

	if(cookie != '') {
		new records().where('cookie', '=', cookie).fetch().then((collection) => {
			if(collection != null) {
				let ave = collection.attributes.average;
				let first = collection.attributes.first_lab;
				moveToResult(ave, first, res);
				return;
			} else {
				renderChoisepage(req, res, datas);
			}
		});
	} else {
		renderChoisepage(req, res, datas);
	}
});

router.get('/edit', function(req, res, next) {
	let cookie = getCookie("hash_id", req);
	if(cookie != '') {
		new records().where('cookie', '=', cookie).fetch().then((collection) => {
			if(collection != null) {
				let ave = collection.attributes.average;
				let first = collection.attributes.first_lab;
				let second = collection.attributes.second_lab;
				let third = collection.attributes.third_lab;
				let datas = {
					err: null,
					form: {first: first, second: second, third: third, ave: ave},
					hash: cookie,
					edit: true
				};
				renderChoisepage(req, res, datas);
			}
		});
	}
});

router.post('/edit', function(req, res, next) {
	let cookie = req.body.hash;
	let ave = req.body.average;
        let first = req.body.first_lab;
        let second = req.body.second_lab;
        let third = req.body.third_lab;

	  //入力チェック
        req.check('average', '平均点を小数2桁まで入力してください').notEmpty().isFloat();

        let errors = req.validationErrors();

        if(!errors) errors = [];

        if(ave < 60.0 || ave > 100.0) {
                errors.push({msg: '平均点は60.0以上100.0以下で入力してください'});
                errors.isEmpty = false;
        }

        if(first == second || second == third || first == third) {
                errors.push({msg: '第一～第三までそれぞれ違う研究室を設定してください'});
                errors.isEmpty = false;
        }



        if(first == 0 || second == 0 || third == 0) {
                errors.push({msg: '研究室を選択してください'});
                errors.isEmpty = false;
        }

	 if(!errors.isEmpty) {
                var errMsg = '';
                let results = errors;
                for(let n in results) {
                        if(results[n] && errMsg.indexOf(results[n].msg) == -1)  errMsg += '<li>' + results[n].msg + '</li>';
                }
                if(errMsg != '') {
                        let datas = {
                                err: errMsg,
                                form: {first: first, second: second, third: third, ave: ave},
				hash: cookie,
                                edit: true
                        }
                        renderChoisepage(req, res, datas);
                        return;
                }
        }

	 const inputData = {
                average : ave,
                first_lab: first,
                second_lab: second,
                third_lab: third,
		cookie: cookie
        };
	new records().where('cookie', '=', cookie)
		.save(inputData, {method: 'update'})
		.then((model) => {
			moveToResult(ave, first, res);
			return;
		});
});

function renderChoisepage(req, res, datas) {
	new labs().fetchAll().then((collection) => {
		datas.labs = collection.toArray();
		datas.title = 'LabChoise';
                //DBには研究室名しか入っていないのでDropDownの初期値を設定
                datas.labs.unshift({
                        attributes: {
                                lab_id: 0,
                                lab_name: "選択してください"
                        }
                });
                res.render('index', datas);
        })
        .catch((err) => {
                res.status(500).json({ error: true, data: { message: err.message}});
        });
}

router.post('/', function(req, res, next) {
	let ave = req.body.average;
	let first = req.body.first_lab;
	let second = req.body.second_lab;
	let third = req.body.third_lab;
	console.log(`平均点:${ave}, 第一志望:${first}, 第二志望: ${second}, 第三志望${third}`);

	//入力チェック
	req.check('average', '平均点を小数2桁まで入力してください').notEmpty().isFloat();
	
	let errors = req.validationErrors();

	if(!errors) errors = [];

	if(ave < 60.0 || ave > 100.0) {
		errors.push({msg: '平均点は60.0以上100.0以下で入力してください'});
		errors.isEmpty = false;
	}

	if(first == second || second == third || first == third) {
		errors.push({msg: '第一～第三までそれぞれ違う研究室を設定してください'});
		errors.isEmpty = false;
	}

	

	if(first == 0 || second == 0 || third == 0) {
		errors.push({msg: '研究室を選択してください'});
		errors.isEmpty = false;
	}

	if(!errors.isEmpty) {
		var errMsg = '';
		let results = errors;
		for(let n in results) {
			if(results[n] && errMsg.indexOf(results[n].msg) == -1)  errMsg += '<li>' + results[n].msg + '</li>';
		}
		if(errMsg != '') {
			let datas = {
				err: errMsg,
				form: {first: first, second: second, third: third, ave: ave},
				edit: false
			}
			renderChoisepage(req, res, datas);
			return;
		}
	}


	const inputData = {
		average : ave,
		first_lab: first,
		second_lab: second,
		third_lab: third
	};
	//同値データチェック
	var cookie= crypto.createCipher('aes192', 'labchoise');
	cookie.update(`${ave}${first}${second}${third}`, 'utf8', 'hex');
	inputData.cookie = cookie.final('hex');
	new records().where('cookie', '=', inputData.cookie).fetch().then((collection) => {
		setCookie("hash_id", inputData.cookie, res);
		if(!collection) {
			saveNewRecord(inputData).then((model) => {moveToResult(ave, first, res);});		
		}
		moveToResult(ave, first, res);
		return;
	});
});

async function saveNewRecord(inputData, completion) {
 return new records(inputData).save();	
}

function moveToResult(ave, first, res) {
	//成績上位者の一覧を取得
	new records().where(function() {
	                        this.where('average', '>', ave).andWhere(function() {
	                                this.where('first_lab', '=', first).orWhere('second_lab', '=', first).orWhere('third_lab', '=', first)
	                        })
	                })
	                .fetchAll()
	                .then((collection) => {
	                        //研究室一覧から研究室名取得
	                        new labs().where('lab_id', '=', first).fetch().then((lab) => {
	                                var datas = {
	                                        lab: lab.attributes.lab_name,
	                                        count: collection.toArray().length
	                                };
	                                res.render('result', datas);
	                        });
	                });
}

function setCookie(key, value, res) {
	const cookie = escape(value);
	res.cookie(key, value, { maxAge: 900000 });
}

function getCookie(key, request) {
	let cookie_data = request.headers.cookie != undefined ? request.headers.cookie : '';
	var data = cookie_data.split(';');
	for(var i in data) {
		if(data[i].trim().startsWith(key + '=')){
			let result = data[i].trim().substring(key.length + 1);
			return unescape(result);
		}
	}
	return '';
}



module.exports = router;
