import React, {Component} from 'react';

export default class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: false,
            focused: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);

    }

    handleChange(event) {
        this.setState({selected: event.target.checked});
    }
    
    handleFocus() {
        this.setState({focused: true});
    }
    
    handleBlur() {
        this.setState({focused: false});
    }

    render() {
        return (
            <div className="checkbox">
                <input className="checkbox__input" onFocus={this.handleFocus} onBlur={this.handleBlur} type="checkbox" name={this.props.id} id={this.props.id} value={this.props.value} checked={this.state.selected} onChange={this.handleChange} />
                <label className={"checkbox__label" + (this.state.focused ? " focused" : "")} htmlFor={this.props.id}>{this.props.label}</label>
            </div>
        )
    }


}