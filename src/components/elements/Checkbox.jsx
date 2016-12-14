import React, {Component, PropTypes} from 'react';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func
};


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
        if (this.props.onChange) {
            this.props.onChange({
                id: this.props.id,
                selected: this.state.selected
            })
        }
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
                <input className="checkbox__input" type="checkbox"
                       id={this.props.id} name={this.props.id} value={this.props.value} checked={this.state.selected}
                       onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} />
                <label className={"checkbox__label" + (this.state.focused ? " focused" : "")} htmlFor={this.props.id}>
                    {this.props.label}
                </label>
            </div>
        )
    }
}

Checkbox.propTypes = propTypes;