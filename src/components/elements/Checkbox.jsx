import React, {Component} from 'react';

export default class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {selected: false};

        this.handleChange = this.handleChange.bind(this);

    }

    handleChange(event) {
        this.setState({selected: event.target.checked});
    }

    render() {
        return (
            <div className="checkbox">
                <input type="checkbox" name={this.props.id} id={this.props.id} value={this.props.value} checked={this.state.selected} onChange={this.handleChange} />
                <label htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
    }


}