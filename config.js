let config = {
    "url": process.env.CRN_SERVER_URL,
    "port": 8111,
    "apiPrefix": "/crn/",
    "location": process.env.CRN_SERVER_LOCATION,
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "content-type, Authorization"
    },
    "scitran": {
        "url": "http://localhost:8110/api/",
        "secret":    process.env.SCITRAN_CORE_DRONE_SECRET,
        "fileStore": process.env.CRN_SERVER_CORE_FILE_STORE
    },
    "agave": {
        "url":               process.env.CRN_SERVER_AGAVE_URL,
        "username":          process.env.CRN_SERVER_AGAVE_USERNAME,
        "password":          process.env.CRN_SERVER_AGAVE_PASSWORD,
        "clientName":        process.env.CRN_SERVER_AGAVE_CLIENT_NAME,
        "clientDescription": process.env.CRN_SERVER_AGAVE_CLIENT_DESCRIPTION,
        "consumerKey":       process.env.CRN_SERVER_AGAVE_CONSUMER_KEY,
        "consumerSecret":    process.env.CRN_SERVER_AGAVE_CONSUMER_SECRET,
        "storage":           process.env.CRN_SERVER_AGAVE_STORAGE
    },
    "mongo": {
		"url": "mongodb://localhost:27017/crn"
	}
};

export default config;