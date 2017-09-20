// dependencies -------------------------------------------------------

import React from 'react';

// component setup ----------------------------------------------------

let Input = React.createClass({

// life cycle events --------------------------------------------------

    getInitialState() {
        return {
            value: this.props.initialValue ? this.props.initialValue : ''
        };
    },

    componentWillReceiveProps(nextProps) {
        // Will reset value when prop changes
        if ('value' in nextProps) {
            this.setState({value: nextProps.value})
        }
    },

    propTypes: {
        initialValue: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        name: React.PropTypes.string,
        type: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func,
        disabled: React.PropTypes.bool,
        checked: React.PropTypes.bool
    },

    render() {
        let placeholder = this.props.placeholder;
        let type = this.props.type;
        let name = this.props.name;
        let value = this.state.value || this.props.value;

        return (
            <div className="form-group float-label-input">
                {value && value.length > 0 ? <label>{placeholder}</label> : null}
                {this._input(type, name, placeholder, value)}
            </div>
        );
    },

// custom methods -----------------------------------------------------

    _input(type, name, placeholder, value) {
        if (type === 'textarea') {
            return (
                <textarea name={name} placeholder={placeholder} value={value} onChange={this._handleChange}></textarea>
            );
        } else {
            return <input type={type} name={name} placeholder={placeholder} value={value} onChange={this._handleChange} disabled={this.props.disabled}/>;
        }
    },

    _handleChange(event) {
        this.setState({value: event.target.value});

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    _toggleChecbox(event) {
        this.setState({value: event.target.checked});
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

});

export default Input;