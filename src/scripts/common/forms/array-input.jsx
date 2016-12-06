// dependencies -------------------------------------------------------

import React      from 'react';
import Input      from './input.jsx';
import WarnButton from './warn-button.jsx';

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

    getInitialState () {
        let initialState = {error: null};
        if (this.props.model) {
            for (let property of this.props.model) {
                initialState[property] = '';
            }
        } else {
            initialState.reference = '';
        }

        return initialState;
    },

    getDefaultProps () {
        return {value: []};
    },


    propTypes: {
        model: React.PropTypes.array,
        value: React.PropTypes.array,
        onChange: React.PropTypes.func
    },

    render() {
        let referenceInput = <Input placeholder="Reference" value={this.state.reference} onChange={this._handleChange.bind(null, 'reference')} />;
        let authorInputs = (
            <span>
                <Input placeholder="name" value={this.state.name} onChange={this._handleChange.bind(null, 'name')} />
                <Input placeholder="ORCID ID" value={this.state.ORCIDID} onChange={this._handleChange.bind(null, 'ORCIDID')} />
            </span>
        );
        return (
            <div className="cte-edit-array">
                {this._arrayList(this.props.value, this.props.model)}
                <div className="text-danger">{this.state.error}</div>
                <div className="form-inline">
                    {this.props.model ? authorInputs : referenceInput}
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

    _add(model) {
        this.setState({error: null});
        let value = this.props.value;

        if(model){
            if (this.state.name.length < 1) {
                this.setState({error: 'An author name is required.'});
                return;
            }
            value.push({name: this.state.name, ORCIDID: this.state.ORCIDID});
        }else{
            if (this.state.reference.length < 1) {
                this.setState({error: 'A reference or link is required.'});
                return;
            }
            value.push(this.state.reference);
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
        if (this.props.model) {
            initialState.name = this.props.item.name;
            initialState.ORCIDID = this.props.item.ORCIDID;
        }else{
            initialState.reference = this.props.item;
        }
        return initialState;
    },

    propTypes: {
        //need to add item propType for Author OBJECT...?
        model: React.PropTypes.array,
        item: (props) => {
            if (props.model && typeof props.item !== 'object') {
                return new Error('Prop `item` must be an object if a model prop is defined');
            }
            if (!props.model && typeof props.item !== 'string') {
                return new Error('Prop `item` must be a string if no model prop is defined');
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
        if (this.props.model) {
            return (
                <span>
                    <span className="author-name">{item.name}</span>
                    <span className="orcid-id">{item.ORCIDID ? '-' : null} {item.ORCIDID}</span>
                </span>
            );
        } else {
            return (
                <span className="reference-name">{item}</span>
            );
        }
    },

    _input() {
        if (this.props.model) {
            return (
                <span>
                    <Input placeholder="name" value={this.state.name} onChange={this._handleChange.bind(null, 'name')} />
                    <Input placeholder="ORCID ID" value={this.state.ORCIDID} onChange={this._handleChange.bind(null, 'ORCIDID')} />
                </span>
            );
        } else {
            return (
                <Input placeholder="Reference" value={this.state.reference} onChange={this._handleChange.bind(null, 'reference')} />
            );
        }
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

    _save(model) {
        if(model){
            this.props.onEdit(this.props.index, {ORCIDID: this.state.ORCIDID, name: this.state.name});
        }else{
            this.props.onEdit(this.props.index, this.state.reference);
        }
    }

});