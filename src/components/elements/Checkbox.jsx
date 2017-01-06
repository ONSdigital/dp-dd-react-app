import React, {Component, PropTypes} from 'react';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    selected: PropTypes.bool,
    onChange: PropTypes.func
};

export default class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            selected: this.props.selected
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(event) {
        const selected = event.target.checked;
        const id = this.props.id;
        const onChange = this.props.onChange;

        this.setState({selected: selected});

        if (onChange) {
            onChange({ id, selected });
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