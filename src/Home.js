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
                return fetch(this.props.url)
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
                console.log("renderingHome");
                const labs_list = this.state.labs.map((lab, i) => {
                        console.log("hello");
                });
                return <div>Home</div>;
        }

}
