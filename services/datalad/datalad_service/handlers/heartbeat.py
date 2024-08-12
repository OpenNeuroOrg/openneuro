import falcon
from sentry_sdk import configure_scope

class HeartbeatResource:
    async def on_get(self, req, resp):
        with configure_scope() as scope:
            scope.set_transaction_name("excluded")
            resp.media = {
                'alive': True,
            }
            resp.status = falcon.HTTP_200
