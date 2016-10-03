/**
* Configuration - Example
*
* Update the values and rename this file "config.js"
*/
export default {

/**
* Scitran
*/
scitran: {
// url: 'http://prod-openfmri.tacc.utexas.edu/api/'
url: 'http://dev-openfmri.tacc.utexas.edu:8110/api/'
// url: 'http://localhost:8110/api/'
},

/**
* CRN
*/
crn: {
// url: 'http://prod-openfmri.tacc.utexas.edu/crn/'
url: 'http://dev-openfmri.tacc.utexas.edu:8110/crn/'
// url: 'http://localhost:8111/crn/'
},

/**
* Authentication
*/
auth: {
google: {
clientID: '502351221849-msl7gongejlva02kq1popd516hgg7bnq.apps.googleusercontent.com'
}
},

/**
* Upload
*/
upload: {

/**
* Filenames ignored during upload.
*/
blacklist: [
   '.DS_Store',
   'Icon\r'
]
}
};