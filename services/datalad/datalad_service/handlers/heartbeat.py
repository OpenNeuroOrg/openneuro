import falcon


class HeartbeatResource:

    def on_get(self, req, resp):
        resp.media = {
            'alive': True,
        }
        resp.status = falcon.HTTP_200
