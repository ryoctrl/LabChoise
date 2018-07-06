import React from 'react';

export default class Home extends React.Component {
        //eslint-disable-next-line
        constructor(props) {
                super(props);
                this.url = "https://str.mosin.jp/_api/labs";
                this.state = {
                        labs: [],
                };
                this.loadAjax = this.loadAjax.bind(this);
        }

        loadAjax() {
                return fetch(this.url)
                        .then((res) => res.json())
                        .then((resJson) =>
                                this.setState({
                                        labs: resJson.labs,
                                })
                        )
                        .catch((err) => {
                                console.error(err);
                        });
        }

        componentWillMount() {
                this.loadAjax();
        }

        render() {
		this.state.labs.unshift({ lab_id: 0, lab_name: "選択してください" });
		const labs_list = this.state.labs.map((lab, i) => {
			return <option value={lab.lab_id}> {lab.lab_name} </option>
		});
		//TODO: エラー処理等
                return (
			<div>
				<h1> LabChoise </h1>
				<p>近大　理工/情報　2018年度研究室配属用App</p>
    				<p>平均点と志望候補を入力すると自分の第一志望研究室に自己平均点以上が何人志望しているかがわかりまし。</p>
    				<p>皆が出来るだけ正確なデータを確認できるようにするため、確かな情報を入力してください</p>

				<form action="/" method="POST">
					<ul>
						<li>
							<label for="first_lab">第一志望研究室</label>
							<select name="first_lab" value="0">
								{labs_list}
							</select>
						</li>
						<li>
							<label for="second_lab">第二志望研究室</label>
							<select name="second_lab" value="0">
								{labs_list}
							</select>
						</li>
						<li>
							<label for="third_lab">第三志望研究室</label>
							<select name="third_lab" value="0">
								{labs_list}
							</select>
						</li>
						<li>
							<label for="average">全科目平均点</label>
							<input id="average" name="average" type="text" value=""></input>
						</li>
						<li>
							<input type="submit" value="Send"></input>
						</li>
					</ul>	
				</form>
				<form action="/readonly" method="GET">
					<input type="submit" value="見るだけ"></input>
				</form>
			</div>
		);
        }

}
