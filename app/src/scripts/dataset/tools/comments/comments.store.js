import Reflux from 'reflux'
import React from 'react'
import Actions from './comments.actions.js'
import crn from '../../../utils/crn'
import moment from 'moment'

let commentStore = Reflux.createStore({
  // store setup -----------------------------------------------------------------------

  listenables: Actions,

  init: function() {
    this.setInitialState()
  },

  getInitialState: function() {
    return this.data
  },
  // data ------------------------------------------------------------------------------

  data: {},

  update: function(data, callback) {
    for (let prop in data) {
      this.data[prop] = data[prop]
    }
    this.trigger(this.data, callback)
  },

  /**
   * Set Initial State
   *
   * Sets the state to the data object defined
   * inside the function. Also takes a diffs object
   * which will set the state to the initial state
   * with any differences passed.
   */
  setInitialState: function(diffs) {
    let data = {
      datasetId: null,
      commentTree: [],
      comments: [],
      loading: false,
      userId: null,
      parentId: null,
      content: '',
    }

    for (let prop in diffs) {
      data[prop] = diffs[prop]
    }
    this.update(data)
  },

  // Actions ---------------------------------------------------------------------------

  // Comments -----------------------------------------------------------------------

  loadComments(datasetId) {
    console.log('calling loadComments with datasetId:', datasetId)
    crn.getComments(datasetId).then(res => {
      console.log('got a response from the server for loadComments:', res)
      if (res && (res.status === 404 || res.status === 403)) {
        this.update({
          status: res.status,
          commentTree: [],
          comments: [],
          loading: false,
        })
      } else {
        console.log('response from loadComments:', res)
        let comments = res.body
        this.createCommentTree(comments)
        this.update({
          loading: false,
          comments: comments,
          content: '',
        })
      }
    })
  },

  createComment(content, parent) {
    console.log('running createComment')
    console.log('with content:', content, 'and parent:', parent)
    const parentId = typeof parent === 'undefined' ? null : parent
    console.log('parentId:', parentId)
    const comment = {
      datasetId: this.data.datasetId,
      parentId: parentId,
      text: content,
      userId: this.data.userId,
      createDate: moment().format(),
    }
    console.log('comment object:', comment)
    crn.createComment(this.data.datasetId, comment).then(res => {
      console.log('comment sent to crn!')
      if (res) {
        console.log('response from createComment:', res)
        if (res.status === 200 && res.ok) {
          this.loadComments(this.data.datasetId)
        }
      }
    })
  },

  deleteComment(commentId, parent) {
    console.log('running deleteComment')
    const parentId = typeof parent === 'undefined' ? null : parent
    console.log('with the commentId:', commentId, 'and parentId:', parentId)
    const comment = {
      commentId: commentId,
      parentId: parentId,
    }
    crn.deleteComment(comment, err => {
      if (err) {
        console.log(err)
      } else {
        this.loadComments(this.data.datasetId)
      }
    })
  },

  createCommentTree(comments) {
    let commentTree

    this.update({
      commentTree: commentTree,
    })
  },
})

export default commentStore
