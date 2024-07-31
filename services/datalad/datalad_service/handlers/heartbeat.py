import falcon


class HeartbeatResource:

    async def on_get(self, req, resp):
        resp.media = {
            'alive': True,
        }
        resp.status = falcon.HTTP_200
