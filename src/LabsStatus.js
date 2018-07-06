import React from 'react';

export default class LabsStatus extends React.Component {
        //eslint-disable-next-line
        constructor(props) {
                super(props);
                this.url = "https://str.mosin.jp/_api/labs_status";
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
                const labs_list = this.state.labs.map((lab, i) => {
                        if(lab.num > 0) this.numOfData = lab.num;
                        let className = lab.lab.lab_id === -1 ? "top" : "next";
                        let danName = lab.lab.lab_id === -1 ? "dan2" : "dan2-r";
                        return (
                                <li key={i} className={className}>
                                        <span className="dan"> {lab.lab.lab_name}</span>
                                        <span className={danName}> {lab.first} </span>
                                        <span className={danName}> {lab.second} </span>
                                        <span className={danName}> {lab.third} </span>
                                </li>
                        )
                });
                return (
                        <div>
                                <form action="https://labchoise.mosin.jp/" method="GET">
                                        <input type="submit" value="戻る"></input>
                                </form>
                                <p>現在のデータ数:{this.numOfData}</p>
                                <ul>
                                        {labs_list}
                                </ul>
                        </div>
                );
        }
}
