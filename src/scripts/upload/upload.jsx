// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {Tabs, Tab} from 'react-bootstrap';

import Select   from './upload.select.jsx';
import Rename   from './upload.rename.jsx';
import Issues   from './upload.issues.jsx';
import Resume   from './upload.resume.jsx';
import Progress from './upload.progress.jsx';

let Upload = React.createClass({

    mixins: [Reflux.connect(UploadStore)],

// life cycle events --------------------------------------------------

    render () {

    // short references ----------------------------

        let activeKey    = this.state.activeKey;
        let uploadStatus = this.state.uploadStatus;
        let dirName      = this.state.dirName;
        let disabledTab  = this.state.disabledTab;

    // conditional variables -----------------------

        let totalTabs    = this.state.showResume ? 5 : 4;
        let activeBar = 'active-tab-' + activeKey;
        if (activeKey === 5 && totalTabs < 5) {activeBar = 'active-tab-4';}
        let activePane = 'active-pane-' + activeKey;

    // panels --------------------------------------


        let select;
        if (this.state.showSelect) {
            let tabName = <span><span>1:</span><span> Select</span></span>;
            select = (
                <Tab eventKey={1} title={tabName}  bsClass="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Select  />
                    </div>
                </Tab>
            );
        }

        let rename;
        if (this.state.showRename) {
            let tabName = this.state.resuming ? <span><span>2:</span><span> Resume</span></span> : <span><span>2:</span><span> Rename</span></span>;
            rename = (
                <Tab eventKey={2} title={tabName}  bsClass="upload-step" disabled={disabledTab || !this.state.renameEnabled}>
                    <div className={activePane}>
                        <Rename />
                    </div>
                </Tab>
            );
        }

        let issues;
        if (this.state.showIssues) {
            let tabName = <span><span>3:</span><span> Issues</span></span>;
            issues = (
                <Tab eventKey={3} title={tabName}  bsClass="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Issues
                            tree={this.state.tree}
                            errors={this.state.errors}
                            warnings={this.state.warnings}
                            dirName={dirName}
                            uploadStatus={uploadStatus} />
                    </div>
                </Tab>
            );
        }

        let resume;
        if (this.state.showResume) {
            let tabName = <span><span>4:</span><span> Resume</span></span>;
            resume = (
                <Tab eventKey={4} title={tabName}  bsClass="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Resume />
                    </div>
                </Tab>
            );
        }

        let progress;
        if (this.state.showProgress) {
            let tabName = <span><span>{totalTabs + ':'}</span><span> Progress</span></span>;
            progress = (
                <Tab eventKey={5} title={tabName}  bsClass="upload-step" >
                    <div className={activePane}>
                        <Progress progress={this.state.progress} name={this.state.dirName} />
                    </div>
                </Tab>
            );
        }

    // main template -------------------------------

        return (
            <div className='uploader'>
                <div className="upload-wrap panel-group" defaultActiveKey='1'>
                    <div className="upload-panel panel panel-default">
                        <div className="panel-collapse collapse in">
                            <div className="panel-body">
                                <div>
                                    <Tabs bsStyle="pills" bsSize="xsmall" className="upload-steps clearfix" activeKey={activeKey} animation={false}  onSelect={Actions.selectTab}>
                                        <div className={activeBar}></div>
                                        {select}
                                        {rename}
                                        {issues}
                                        {resume}
                                        {progress}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});


export default Upload;