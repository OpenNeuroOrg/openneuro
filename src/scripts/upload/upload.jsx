// dependencies -------------------------------------------------------

import React       from 'react';
import Reflux      from 'reflux';
import Actions     from './upload.actions.js';
import UploadStore from './upload.store.js';
import {TabbedArea, TabPane} from 'react-bootstrap';

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
        let activeBar = 'activeTab-' + activeKey;
        if (activeKey === 5 && totalTabs < 5) {activeBar = 'activeTab-4';}
        let activePane = 'activePane-' + activeKey;

    // panels --------------------------------------


        let select;
        if (this.state.showSelect) {
            let tabName = <span><span>1:</span><span> Select</span></span>;
            select = (
                <TabPane eventKey={1} tab={tabName}  className="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Select  />
                    </div>
                </TabPane>
            );
        }

        let rename;
        if (this.state.showRename) {
            let tabName = this.state.resuming ? <span><span>2:</span><span> Resume</span></span> : <span><span>2:</span><span> Rename</span></span>;
            rename = (
                <TabPane eventKey={2} tab={tabName}  className="upload-step" disabled={disabledTab || !this.state.renameEnabled}>
                    <div className={activePane}>
                        <Rename />
                    </div>
                </TabPane>
            );
        }

        let issues;
        if (this.state.showIssues) {
            let tabName = <span><span>3:</span><span> Issues</span></span>;
            issues = (
                <TabPane eventKey={3} tab={tabName}  className="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Issues
                            tree={this.state.tree}
                            errors={this.state.errors}
                            warnings={this.state.warnings}
                            dirName={dirName}
                            uploadStatus={uploadStatus} />
                    </div>
                </TabPane>
            );
        }

        let resume;
        if (this.state.showResume) {
            let tabName = <span><span>4:</span><span> Resume</span></span>;
            resume = (
                <TabPane eventKey={4} tab={tabName}  className="upload-step" disabled={disabledTab}>
                    <div className={activePane}>
                        <Resume />
                    </div>
                </TabPane>
            );
        }

        let progress;
        if (this.state.showProgress) {
            let tabName = <span><span>{totalTabs + ':'}</span><span> Progress</span></span>;
            progress = (
                <TabPane eventKey={5} tab={tabName}  className="upload-step" >
                    <div className={activePane}>
                        <Progress progress={this.state.progress} name={this.state.dirName} />
                    </div>
                </TabPane>
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
                                    <TabbedArea bsStyle="pills" bsSize="xsmall" className="upload-steps clearfix" activeKey={activeKey} animation={false}  onSelect={Actions.selectTab}>
                                        <div className={activeBar}></div>
                                        {select}
                                        {rename}
                                        {issues}
                                        {resume}
                                        {progress}
                                    </TabbedArea>
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