// dependencies -------------------------------------------------------

import React      from 'react';
import Input      from './input.jsx';
import WarnButton from './warn-button.jsx';

// component setup ----------------------------------------------------

let ArrayInput = React.createClass({

// life cycle events --------------------------------------------------

    getInitialState () {
        return {
            reference: '',
            error: null
        };
    },

    getDefaultProps () {
        return {value: []};
    },


    propTypes: {
        value: React.PropTypes.array,
        onChange: React.PropTypes.func
    },

    render() {
        return (
            <div className="cte-edit-array">
                {this._referenceList(this.props.value)}
                <div className="text-danger">{this.state.error}</div>
                <div className="form-inline">
                    <Input placeholder="Reference" value={this.state.reference} onChange={this._handleChange.bind(null, 'reference')} />
                    <button className="cte-save-btn btn-admin-blue " onClick={this._add}>add</button>
                </div>
            </div>
        );
    },

// template methods ---------------------------------------------------

    _referenceList(references) {
        if (references && references.length > 0) {
            let list = references.map((item, index) => {
                return (
                    <References key={index} index={index} item={item} onEdit={this._edit} remove={this._remove.bind(null, index)} />
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

    _add() {
        this.setState({error: null});

        if (this.state.reference.length < 1) {
            this.setState({error: 'A reference or link is required.'});
            return;
        }

        let value = this.props.value;
        value.push(this.state.reference);
        this.props.onChange({target: {value: value}});
        this.setState(this.getInitialState());
    },

    _remove(index) {
        let array = this.props.value;
        array.splice(index, 1);
        this.props.onChange({target: {value: array}});
    },

    _edit(index, value) {
        let references = this.props.value;
        references[index] = value;
        this.props.onChange({target: {value: references}});
    }

});

export default ArrayInput;


/**
 * Author
 *
 * Sub component of Author Input used to manage
 * interactions on individual Authors.
 */
let References = React.createClass({

    getInitialState() {
        return {
            edit: false,
            reference: this.props.item
        };
    },

    propTypes: {
        item: React.PropTypes.string,
        remove: React.PropTypes.func,
        onEdit: React.PropTypes.func,
        index: React.PropTypes.number
    },

    render() {
        let item = this.props.item;
        let view = (
            <div className="cte-array-item">
                <span className="reference-name">{item}</span>
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
                    <Input placeholder="Reference" value={this.state.reference} onChange={this._handleChange.bind(null, 'reference')} />
                    <div className="btn-wrap reference-edit">
                        <WarnButton message="Save" warn={false} icon="fa-check" action={this._save}/>
                    </div>
                    <div className="btn-wrap reference-edit">
                        <WarnButton message="Cancel" warn={false} icon="fa-times" action={this._cancel}/>
                    </div>
                </div>
            </div>

        );

        return this.state.edit ? edit : view;
    },

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

    _save() {
        this.props.onEdit(this.props.index, this.state.reference);
    }

});