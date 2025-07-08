import falcon
from sentry_sdk import get_current_scope


class HeartbeatResource:
    async def on_get(self, req, resp):
        scope = get_current_scope()
        scope.set_transaction_name('excluded')
        resp.media = {
            'alive': True,
        }
        resp.status = falcon.HTTP_200
