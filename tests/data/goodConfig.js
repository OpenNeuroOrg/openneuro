// Dummy configuration that should pass validation
const goodConfig = {
    'url': 'http://localhost:9876',
    'port': 8111,
    'apiPrefix': '/crn/',
    'location': '/srv/crn-server',
    'headers': {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'content-type, Authorization'
    },
    'scitran': {
        'url':       'http://nginx:80/api/',
        'secret':    'quaemeeco9uXaiquai4ze6moovahroh8',
        'fileStore': '/srv/bids-core/persistent/data'
    },
    'mongo': {
        'url': 'mongodb://mongo:27017/'
    },
    'aws': {
        'credentials': {
            'accessKeyId': 'JEIHOIJAQU3EET5ONGOF',
            'secretAccessKey': 'eeQuahCeekahwiphoyoe3Do8Maekee9Nedohlese',
            'region': 'us-east-1'
        },
        's3': {
            'bucket': 'test-bucket',
            'concurrency': 10,
            'timeout': 10 * 60 * 1000
        }
    }
};

export default goodConfig;
