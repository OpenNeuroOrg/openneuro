let config = {
    "url": process.env.CRN_SERVER_URL,
    "port": 8111,
    "apiPrefix": "/crn/",
    "location": "/srv/crn-server",
    "headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, PATCH, DELETE",
        "Access-Control-Allow-Headers": "content-type, Authorization"
    },
    "scitran": {
        "url":       process.env.SCITRAN_URL,
        "secret":    process.env.SCITRAN_CORE_DRONE_SECRET,
        "fileStore": process.env.SCITRAN_PERSISTENT_DATA_PATH
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
		"url": "mongodb://mongo:27017/"
	},
    "notifications": {
        "email": {
            "service": process.env.CRN_SERVER_MAIL_SERVICE,
            "user":    process.env.CRN_SERVER_MAIL_USER,
            "pass":    process.env.CRN_SERVER_MAIL_PASS
        }
    }
};

export default config;
