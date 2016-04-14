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

    propTypes: {
        initialValue: React.PropTypes.string,
        placeholder: React.PropTypes.string,
        name: React.PropTypes.string,
        type: React.PropTypes.string,
        value: React.PropTypes.string,
        onChange: React.PropTypes.func
    },

    render() {
        let placeholder = this.props.placeholder;
        let type = this.props.type;
        let name = this.props.name;
        let value = this.props.hasOwnProperty('value') ? this.props.value : this.state.value;

        return (
            <div className="form-group float-label-input">
                {value.length > 0 ? <label>{placeholder}</label> : null}
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
            return <input type={type} name={name} placeholder={placeholder} value={value} onChange={this._handleChange} />;
        }
    },

    _handleChange(event) {
        this.setState({value: event.target.value});

        if (this.props.onChange) {
            this.props.onChange(event);
        }
    }

});

export default Input;