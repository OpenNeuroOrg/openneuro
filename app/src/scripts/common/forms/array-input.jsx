// dependencies -------------------------------------------------------

import React      from 'react';
import Select     from 'react-select';
import Input      from './input.jsx';
import WarnButton from './warn-button.jsx';

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

    getInitialState () {
        let initialState = {error: null};

        for (let field of this.props.model) {
            initialState[field.id] = '';
        }

        return initialState;
    },

    getDefaultProps () {
        return {value: []};
    },


    propTypes: {
        model: React.PropTypes.array,
        value: React.PropTypes.array,
        onChange: React.PropTypes.func,

    },

    render() {
        console.log(this.props.model)
        let inputFields = this.props.model ? this.props.model.map((field) => {
            if (field.hasOwnProperty('select') && field.select.length > 0) {
                return <Select placeholder={field.placeholder} simpleValue options={field.select} value={this.state[field.id]} onChange={this._handleSelectChange.bind(null, field.id)} key={field.id} />
            } else if (field.hasOwnProperty('id') && field.id === 'required') {
                return (
                    <div className="form-group float-label-input" key={field.id}>
                        <button className="required-button" onClick={this._toggleCheckBox.bind(null, field.id)} key={field.id} >
                            <span>
                                <i className={this.state[field.id] ? 'fa fa-check-square-o' : 'fa fa-square-o' }></i> Required
                            </span>
                        </button>
                    </div>
                );
            } else if (field.hasOwnProperty('id') && field.id === 'hidden') {
                return (
                    <div className="form-group float-label-input" key={field.id}>
                        <button className="hide-button" onClick={this._hidden.bind(null, field.id)} key={field.id} >
                            <span>
                                <i className={this.state[field.id] ? 'fa fa-check-square-o' : 'fa fa-square-o' }></i> Hide for Users
                            </span>
                        </button>
                    </div>
                );
             } else {
                return <Input placeholder={field.placeholder} value={this.state[field.id]} onChange={this._handleChange.bind(null, field.id)} key={field.id} />
            }
        }) : null;

        return (
            <div className="cte-edit-array">
                {this._arrayList(this.props.value, this.props.model)}
                <div className="text-danger">{this.state.error}</div>
                <div className="form-inline">
                    <span>{inputFields}</span>
                    <br/>
                    <button className="cte-save-btn btn-admin-blue " onClick={this._add.bind(this, this.props.model)}>add</button>
                </div>
            </div>
        );
    },

// template methods ---------------------------------------------------

    _arrayList(array, model) {
        if (array && array.length > 0) {
            let list = array.map((item, index) => {
                return (
                    <ArrayItem key={index} index={index} item={item} model={model} onEdit={this._edit} remove={this._remove.bind(null, index)} />
                );
            });
            return <div className="cte-array-items">{list}</div>;
        }
    },

// custom methods -----------------------------------------------------

    _handleChange(key, event) {
        let state = {};
        state[key] = event.target.value;
        this.setState(state);
    },

    _handleSelectChange(key, selected) {
        let state = {};
        state[key] = selected;
        this.setState(state);
    },

    _toggleCheckBox(key, event) {
        let state = {};
        state[key] = !this.state[key];
        this.setState(state);
    },

    _add(model) {
        this.setState({error: null});
        let value = this.props.value;

        for (let field of model) {
            if (field.required && !this.state[field.id]) {
                this.setState({error: field.placeholder + ' is required.'});
                return;
            }
        }

        if (model.length > 1) {
            let itemValue = {};
            for (let field of model) {
                itemValue[field.id] = this.state[field.id];
            }

            value.push(itemValue);
        } else {
            value.push(this.state[model[0].id]);
        }

        this.props.onChange({target: {value: value}});
        this.setState(this.getInitialState());
    },

    _remove(index) {
        let array = this.props.value;
        array.splice(index, 1);
        this.props.onChange({target: {value: array}});
    },

    _edit(index, value) {
        let item = this.props.value;
        item[index] = value;
        this.props.onChange({target: {value: item}});
    }, 

    _hidden(key, event) {
         let state = {};
        state[key] = !this.state[key];
        this.setState(state);
    }

});

export default ArrayInput;


/**
 * ArrayItem
 *
 * Sub component of Array List Input used to manage
 * interactions on individual Array Items.
 */
let ArrayItem = React.createClass({

    getInitialState () {
        let initialState = {edit: false};

        for (let field of this.props.model) {
            initialState[field.id] = this.props.item[field.id];
        }

        return initialState;
    },

    componentWillReceiveProps() {
        this.setState({edit: false});
    },

    propTypes: {
        model: React.PropTypes.array,
        item: (props) => {

            if (props.model.length > 1 && typeof props.item !== 'object') {
                return new Error('Prop `item` must be an object if a model has more than one property');
            }
            if (props.model.length == 1 && typeof props.item !== 'string') {
                return new Error('Prop `item` must be a string if modal has a single property');
            }
        },
        remove: React.PropTypes.func,
        onEdit: React.PropTypes.func,
        index: React.PropTypes.number
    },

    render() {
        let view = (
            <div className="cte-array-item">
                {this._display()}
                <div className="btn-wrap">
                    <WarnButton message="Remove" icon="fa-times" action={this.props.remove}/>
                </div>
                <div className="btn-wrap">
                    <WarnButton message="Edit" warn={false} icon="fa-pencil" action={this._toggleEdit}/>
                </div>
            </div>
        );

        let edit = (
            <div className="cte-array-item">
                <div className="form-inline">
                    {this._input()}
                    <div className="btn-wrap array-edit">
                        <WarnButton message="Save" warn={false} icon="fa-check" action={this._save.bind(this, this.props.model)}/>
                    </div>
                    <div className="btn-wrap array-edit">
                        <WarnButton message="Cancel" warn={false} icon="fa-times" action={this._cancel}/>
                    </div>
                </div>
            </div>
        );

        return this.state.edit ? edit : view;
    },

// template methods ---------------------------------------------------

    _display() {
        let item = this.props.item;
        if (typeof item == 'object') {
            return (
                <span>
                    {Object.keys(item).map((key) => {return <span className="reference-name" key={key}>{item[key]}</span>})}
                </span>
            );
        } else {
            return (
                <span className="reference-name">{item}</span>
            );
        }
    },

    _input() {
        return (
            <span>
                {this.props.model.map((field) => {
                    if (field.hasOwnProperty('select') && field.select.length > 0) {
                        return <Select placeholder={field.placeholder} simpleValue options={field.select} value={this.state[field.id]} onChange={this._handleSelectChange.bind(null, field.id)} key={field.id} />
                    } else if (field.hasOwnProperty('id') && field.id === 'required') {
                        return (
                            <div className="form-group float-label-input" key={field.id}>
                                <button className="required-button" onClick={this._toggleCheckBox.bind(null, field.id)} key={field.id} >
                                    <span className="filter-admin">
                                        <i className={this.state[field.id] ? 'fa fa-check-square-o' : 'fa fa-square-o' }></i> Required
                                    </span>
                                </button>
                            </div>
                        );
                    } else if (field.hasOwnProperty('id') && field.id === 'hidden') {
                        return (
                            <div className="form-group float-label-input" key={field.id}>
                                <button className="hide-button" onClick={this._hidden.bind(null, field.id)} key={field.id} >
                                    <span>
                                        <i className={this.state[field.id] ? 'fa fa-check-square-o' : 'fa fa-square-o' }></i> Hide for Users
                                    </span>
                                </button>
                            </div>
                        );
                    } else {
                        return <Input placeholder={field.placeholder} value={this.state[field.id]} onChange={this._handleChange.bind(null, field.id)} key={field.id} />
                    }
                })}
            </span>
        );
    },

// custom methods -----------------------------------------------------

    _cancel() {
        this._toggleEdit();
        this.setState(this.getInitialState());
    },

    _toggleEdit() {
        this.setState({edit: !this.state.edit});
    },

    _handleChange(key, event) {
        let state = {};
        state[key] = event.target.value;
        this.setState(state);
    },

    _handleSelectChange(key, selected) {
        let state = {};
        state[key] = selected;
        this.setState(state);
    },

    _toggleCheckBox(key, event) {
        let state = {};
        state[key] = !this.state[key];
        this.setState(state);
    },

    _save(model) {
        let data = {};
        for (let field of model) {
            data[field.id] = this.state[field.id];
        }
        this.props.onEdit(this.props.index, data);
    }

});
