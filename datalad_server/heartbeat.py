import falcon


class HeartbeatResource(object):

    def on_get(self, req, resp):
        resp.media = {
            'alive': True,
        }
        resp.status = falcon.HTTP_200
