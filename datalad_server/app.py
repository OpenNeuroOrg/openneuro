import falcon
from .heartbeat import Heartbeat

api = application = falcon.API()

heartbeat = Heartbeat()
api.add_route('/heartbeat', heartbeat)
