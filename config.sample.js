export default {
	"url": "http://127.0.0.1",
	"port": 8111,
	"location: "/srv/crn-server',
	"headers": {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
		"Access-Control-Allow-Headers": "content-type, Authorization"
	},
	"scitran": {
		"url": "http://localhost:8110/api/",
		"secret": "***************",
		"fileStore": "/absolute/path/to/scitran/file/store"
	},
	"agave": {
		"url": "https://api.tacc.utexas.edu/",
		"username": "crn_plab",
		"password": "***************",
		"clientName": "crn_plab",
		"clientDescription": "Agave client application for CRN interaction.",
		"consumerKey": "***************",
		"consumerSecret": "***************"
	},
	"mongo": {
		"url": "mongodb://localhost:27017/crn"
	}
};