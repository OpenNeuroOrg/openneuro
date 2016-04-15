// dependencies -------------------------------------------------------

import React                     from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import notifications             from '../../notification/notification.actions';

export default class WarnButton extends React.Component {

    constructor() {
        super();
        this.state = {
            showAction: false,
            link: null,
            loading: false
        };
    }

// life cycle events --------------------------------------------------

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    render () {
        let showAction = this.state.showAction;
        let message    = this.props.message;
        let cancel     = this.props.cancel;
        let confirm    = this.props.confirm;
        let tooltip    = <Tooltip>{this.props.tooltip}</Tooltip>;

        // check for bad validations and add disabled class
        let disabled = false;
        if (this.props.validations) {
            for (let i = 0; i < this.props.validations.length; i++) {
                let validation = this.props.validations[i];
                if (validation.check) {
                    disabled = true;
                }
            }
        }

        let link;
        if (this.state.link) {
            link = (
                <a className="btn-warn-component success" onClick={this.toggle.bind(this, this.props.action)} href={this.state.link} download>
                    {confirm}
                </a>
            );
        }

        let confirmBtn = <button className={'btn-warn-component success'} onClick={this.toggle.bind(this, this.props.action)}>{confirm}</button>;

        let viewAction = (
            <span className="btn-group slideInRightFast" role="group" >
                <button className="btn-warn-component cancel" onClick={this.toggle.bind(this)}>{cancel}</button>
                {link ? link : confirmBtn}
            </span>
        );

        let hideAction = (
            <span className={'fadeIn' + (disabled ? ' disabled' : '')} >
                <button className="btn-warn-component warning" onClick={this.toggle.bind(this, this.props.action)}>
                    <i className={'fa ' + this.props.icon}></i>  {message}
                </button>
            </span>
        );

        let button = showAction ? viewAction : hideAction;
        let loading = <span className="warning-loading"><i className="fa fa-spin fa-circle-o-notch"></i></span>;

        if (this.props.tooltip) {
            return (
                <OverlayTrigger role="presentation"  placement="top" className="tool" overlay={tooltip}>
                    {this.state.loading ? loading : button}
                </OverlayTrigger>
            );
        }

        return button;
    }

// custom methods -----------------------------------------------------

    toggle(action) {

        // initial click actions
        if (this.state.showAction == false) {

            // validate & warn
            if (this.props.validations) {
                for (let i = 0; i < this.props.validations.length; i++) {
                    let validation = this.props.validations[i];
                    if (validation.check) {
                        notifications.createAlert({type: 'Warning', message: validation.message, messageTimeout: validation.messageTimeout});
                        return;
                    }
                }
            }

            // generate download links
            if (this.props.prepDownload) {
                this.setState({loading: true});
                this.props.prepDownload((link) => {
                    this.setState({showAction: true, link: link, loading: false});
                });
                return;
            }

            if (!this.props.warn) {
                action();
                return;
            } else {
                this.setState({showAction: true});
                return;
            }
        }

        if (typeof action === 'function') {
            this.setState({loading: true});
            action(() => {
                if (this._mounted) {
                    this.setState({loading: false, showAction: !this.state.showAction});
                }
            });
        } else {
            this.setState({showAction: !this.state.showAction});
        }
    }

}

WarnButton.propTypes = {
    message: React.PropTypes.string,
    icon:    React.PropTypes.string,
    warn:    React.PropTypes.bool,
    tooltip: React.PropTypes.string,
    link:    React.PropTypes.string,
    cancel: React.PropTypes.object,
    confirm: React.PropTypes.object,
    validations: React.PropTypes.array,
    action: React.PropTypes.func,
    prepDownload: React.PropTypes.func

};

WarnButton.defaultProps = {
    message: '',
    cancel:  <i className="fa fa-times"></i>,
    confirm: <i className="fa fa-check"></i>,
    icon:    'fa-trash-o',
    warn:    true,
    tooltip: null
};