// dependencies -------------------------------------------------------

import React        from 'react';
import Reflux       from 'reflux';
import Actions      from './upload.actions.js';
import UploadStore  from './upload.store.js';
import {Tabs, Tab}  from 'react-bootstrap';
import Select       from './upload.select.jsx';
import Rename       from './upload.rename.jsx';
import Issues       from './upload.issues.jsx';
import Disclaimer   from './upload.disclaimer.jsx';
import Resume       from './upload.resume.jsx';
import Progress     from './upload.progress.jsx';

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

        let totalTabs    = this.state.showResume ? 6 : 5;
        let activeBar = 'active-tab-' + activeKey;
        if (activeKey === 6 && totalTabs < 6) {activeBar = 'active-tab-5';}
        let activePane = 'active-pane-' + activeKey;

    // panels --------------------------------------


        let select;
        if (this.state.showSelect) {
            let tabName = <span><span>1:</span><span> Select</span></span>;
            select = (
                <Tab eventKey={1} title={tabName} disabled={disabledTab}>
                    <div className={activePane}>
                        <Select />
                    </div>
                </Tab>
            );
        }

        let rename;
        if (this.state.showRename) {
            let tabName = this.state.resuming ? <span><span>2:</span><span> Resume</span></span> : <span><span>2:</span><span> Rename</span></span>;
            rename = (
                <Tab eventKey={2} title={tabName} disabled={disabledTab || !this.state.renameEnabled}>
                    <div className={activePane}>
                        <Rename
                            dirName={dirName}
                            input={this.state.showRenameInput}
                            nameError={this.state.nameError}
                            resuming={this.state.resuming}
                            selectedName={this.state.selectedName} />
                    </div>
                </Tab>
            );
        }

        let issues;
        if (this.state.showIssues) {
            let tabName = <span><span>3:</span><span> Issues</span></span>;
            issues = (
                <Tab eventKey={3} title={tabName} disabled={disabledTab}>
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

        let disclaimer;
        if (this.state.showDisclaimer) {
            let tabName = <span><span>4:</span><span> Disclaimer</span></span>;
            disclaimer = (
                <Tab eventKey={4} title={tabName} disabled={disabledTab}>
                    <div className={activePane}>
                        <Disclaimer />
                    </div>
                </Tab>
            );
        }

        let resume;
        if (this.state.showResume) {
            let tabName = <span><span>5:</span><span> Resume</span></span>;
            resume = (
                <Tab eventKey={5} title={tabName} disabled={disabledTab}>
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
                <Tab eventKey={6} title={tabName}>
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
                                    <Tabs id="upload-tabs" bsStyle="pills" bsSize="xsmall" activeKey={activeKey} animation={false}  onSelect={Actions.selectTab}>
                                        <div className={activeBar}></div>
                                        {select}
                                        {rename}
                                        {issues}
                                        {disclaimer}
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