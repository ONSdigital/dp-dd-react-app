import React, {Component, PropTypes} from 'react';

const propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    note: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

const defaultProps = {
    checked: false,
    note: null
}

export default class Checkbox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            checked: props.checked
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(event) {
        const checked = this.state.checked = event.target.checked;
        const id = this.props.id;
        const value = this.props.value;
        const onChange = this.props.onChange;
        if (onChange) {
            onChange({ id, checked });
        }
    }
    
    handleFocus() {
        this.setState({focused: true});
    }
    
    handleBlur() {
        this.setState({focused: false});
    }

    render() {
        const disabled = this.props.disabled ? 'disabled' : '';
        const checkboxClass = "checkbox" + (this.props.disabled ? ' disabled' : '');
        return (
            <div className={checkboxClass}>
                <input className={"checkbox__input" + (this.props.checked ? " selected" : "") + (this.state.focused ? " focused" : "")} type="checkbox"
                       id={this.props.id} name={this.props.id} value={this.props.value} checked={this.props.checked}
                       onFocus={this.handleFocus} onBlur={this.handleBlur} onChange={this.handleChange} disabled={disabled} />
                <label className="checkbox__label" htmlFor={this.props.id}>
                    {this.props.label}

                    {!this.props.note || (
                        <span> ({this.props.note})</span>
                    )}
                </label>
            </div>
        )
    }
}

Checkbox.propTypes = propTypes;
Checkbox.defaultProps = defaultProps;