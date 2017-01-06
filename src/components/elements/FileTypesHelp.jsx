import React, { Component } from 'react';

export default class FileTypesHelp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showing: false
        };

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState({showing: !this.state.showing})
    }

    render() {
        return(
            <div className="react-show-hide margin-bottom--2">
                <div className="">
                    <button className={"btn btn--link react-show-hide__title" + (this.state.showing ? " active" : "")} onClick={this.handleClick}>Help with file types</button>
                </div>
                <div className={"highlight react-show-hide__content" + (this.state.showing ? " active" : "")}>
                    <dl>
                        <dt className="baseline margin-top--1"><dfn><strong>XLS</strong></dfn></dt>
                        <dd className="baseline">
                            This is a spreadsheet file format created by Microsoft for use with Microsoft Excel. XLS stands for eXceL Spreadsheet.
                        </dd>
                        <dt className="baseline margin-top--1"><dfn><strong>CSV</strong></dfn></dt>
                        <dd className="baseline">
                            The advantage of CSV files is simplicity. A comma-separated values (CSV) file stores tabular data in plain text. They are widely supported by many types of programs and can be viewed in text editors.
                        </dd>
                        <dt className="baseline margin-top--1"><dfn><strong>JSON</strong></dfn></dt>
                        <dd className="baseline">
                            This is an open-standard format that uses human-readable text to transmit data objects consisting of attribute–value pairs. JSON stands for JavaScript Object Notation.
                        </dd>
                    </dl>
                </div>
            </div>
        )
    }
}