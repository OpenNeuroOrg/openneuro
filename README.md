# CRN SERVER

## Configuration

The CRN Server is configured through environment variables. Set the following values in your environment before starting the application. Variables starting with SCITRAN_ are likely already being set if you're running a SciTran (BIDS-Core) on the same box.

| variable                            | description                                             |
|-------------------------------------|---------------------------------------------------------|
| CRN_SERVER_URL                      | The url where this service is listening                 |
| CRN_SERVER_LOCATION                 | The file system location of this repository             |
| CRN_SERVER_MONGODB_URL              | The url where mongodb is listening                      |
| SCITRAN_URL                         | The url where SciTran is listening                      |
| SCITRAN_CORE_DRONE_SECRET           | A secret string shared between this service and scitran |
| SCITRAN_PERSISTENT_DATA_PATH        | The file system location of SciTran's data store        |
| CRN_SERVER_AGAVE_URL                | The root url to the AGAVE API                           |
| CRN_SERVER_AGAVE_USERNAME           | An AGAVE API username                                   |
| CRN_SERVER_AGAVE_PASSWORD           | The corresponding AGAVE API password                    |
| CRN_SERVER_AGAVE_CLIENT_NAME        | The name of a registered AGAVE client                   |
| CRN_SERVER_AGAVE_CLIENT_DESCRIPTION | The description of the AGAVE client                     |
| CRN_SERVER_AGAVE_CONSUMER_KEY       | The AGAVE client API key                                |
| CRN_SERVER_AGAVE_CONSUMER_SECRET    | The AGAVE client API secret                             |
| CRN_SERVER_AGAVE_STORAGE            | The root path of the associated AGAVE storage system    |
| CRN_SERVER_MAIL_SERVICE             | The name of the mail service for email notifications    |
| CRN_SERVER_MAIL_USER                | The username for the mail service                       |
| CRN_SERVER_MAIL_PASS                | The password for the mail service                       |



## Usage

__Requirements:__

Node `v4.4.1 (LTS)`
MongoDB

__Install the dependencies:__

`npm install`

__Run:__

`node index.js` or `npm start`
