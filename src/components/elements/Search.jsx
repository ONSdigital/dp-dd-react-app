
import React, {Component} from 'react';

export default class Search extends Component {
    constructor(props) {
        super(props);

        this.state = {value: props.value};

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <div className="keyword-search">
                <label className="keyword-search__label" htmlFor={this.props.id}>{this.props.label}</label>
                <input className="keyword-search__input" value={this.state.value} type="search" id={this.props.id} name={this.props.id} onChange={this.handleChange} />
            </div>
        )
    }
}