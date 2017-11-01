// dependencies -------------------------------------------------------

import React from 'react'
import Reflux from 'reflux'
import Actions from './upload.actions.js'
import UploadStore from './upload.store.js'
import { Tabs, Tab } from 'react-bootstrap'
import Select from './upload.select.jsx'
import Rename from './upload.rename.jsx'
import Issues from './upload.issues.jsx'
import Disclaimer from './upload.disclaimer.jsx'
import Resume from './upload.resume.jsx'
import Progress from './upload.progress.jsx'
import { refluxConnect } from '../utils/reflux'

class Upload extends Reflux.Component {
  constructor() {
    super()
    refluxConnect(this, UploadStore, 'upload')
  }
  // life cycle events --------------------------------------------------

  render() {
    // short references ----------------------------

    let activeKey = this.state.upload.activeKey
    let uploadStatus = this.state.upload.uploadStatus
    let dirName = this.state.upload.dirName
    let disabledTab = this.state.upload.disabledTab

    // conditional variables -----------------------

    let totalTabs = this.state.upload.showResume ? 5 : 5
    let activeBar = 'active-tab-' + activeKey
    if (activeKey === 6 && totalTabs < 6) {
      activeBar = 'active-tab-5'
    }
    let activePane = 'active-pane-' + activeKey

    // panels --------------------------------------

    let select
    if (this.state.upload.showSelect) {
      let tabName = (
        <span>
          <span>1:</span>
          <span> Select</span>
        </span>
      )
      select = (
        <Tab eventKey={1} title={tabName} disabled={disabledTab}>
          <div className={activePane}>
            <Select />
          </div>
        </Tab>
      )
    }

    let rename
    if (this.state.upload.showRename) {
      let tabName = this.state.upload.resuming ? (
        <span>
          <span>2:</span>
          <span> Resume</span>
        </span>
      ) : (
        <span>
          <span>2:</span>
          <span> Rename</span>
        </span>
      )
      rename = (
        <Tab
          eventKey={2}
          title={tabName}
          disabled={disabledTab || !this.state.upload.renameEnabled}>
          <div className={activePane}>
            <Rename
              dirName={dirName}
              input={this.state.upload.showRenameInput}
              nameError={this.state.upload.nameError}
              resuming={this.state.upload.resuming}
              selectedName={this.state.upload.selectedName}
            />
          </div>
        </Tab>
      )
    }

    let issues
    if (this.state.upload.showIssues) {
      let tabName = (
        <span>
          <span>3:</span>
          <span> Issues</span>
        </span>
      )
      issues = (
        <Tab eventKey={3} title={tabName} disabled={disabledTab}>
          <div className={activePane}>
            <Issues
              tree={this.state.upload.tree}
              errors={this.state.upload.errors}
              warnings={this.state.upload.warnings}
              dirName={dirName}
              uploadStatus={uploadStatus}
            />
          </div>
        </Tab>
      )
    }

    let disclaimer
    if (this.state.upload.showDisclaimer) {
      let tabName = (
        <span>
          <span>4:</span>
          <span> Disclaimer</span>
        </span>
      )
      disclaimer = (
        <Tab eventKey={4} title={tabName} disabled={disabledTab}>
          <div className={activePane}>
            <Disclaimer />
          </div>
        </Tab>
      )
    }

    let resume
    if (this.state.upload.showResume) {
      let tabName = (
        <span>
          <span>2:</span>
          <span> Resume</span>
        </span>
      )
      resume = (
        <Tab eventKey={2} title={tabName} disabled={disabledTab}>
          <div className={activePane}>
            <Resume />
          </div>
        </Tab>
      )
    }

    let progress
    if (this.state.upload.showProgress) {
      let tabName = (
        <span>
          <span>{totalTabs + ':'}</span>
          <span> Progress</span>
        </span>
      )
      progress = (
        <Tab eventKey={6} title={tabName}>
          <div className={activePane}>
            <Progress
              progress={this.state.upload.progress}
              name={this.state.upload.dirName}
            />
          </div>
        </Tab>
      )
    }

    // main template -------------------------------

    return (
      <div className="uploader">
        <div className="upload-wrap panel-group" defaultActiveKey="1">
          <div className="upload-panel panel panel-default">
            <div className="panel-collapse collapse in">
              <div className="panel-body">
                <div>
                  <Tabs
                    id="upload-tabs"
                    bsStyle="pills"
                    bsSize="xsmall"
                    activeKey={activeKey}
                    animation={false}
                    onSelect={Actions.selectTab}>
                    <div className={activeBar} />
                    {select}
                    {rename}
                    {resume}
                    {issues}
                    {disclaimer}
                    {progress}
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Upload
