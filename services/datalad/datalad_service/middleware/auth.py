import jwt
import os

from sentry_sdk import configure_scope


class AuthenticateMiddleware(object):
    def process_request(self, req, resp):
        """Process the request before routing it.

        Args:
            req: Request object that will eventually be
                routed to an on_* responder method.
            resp: Response object that will be routed to
                the on_* responder.
        """
        cookies = req.cookies
        if 'accessToken' in cookies or req.auth:
            try:
                token = req.auth and req.auth[7:] or cookies['accessToken']
                req.context['user'] = jwt.decode(
                    token, key=os.environ['JWT_SECRET'], algorithms=["HS256"])
                with configure_scope() as scope:
                    sentry_user = req.context['user'].copy()
                    try:
                        sentry_user['id'] = sentry_user['sub']
                    except KeyError:
                        raise Exception(sentry_user)
                    del(sentry_user['sub'])
                    scope.user = sentry_user
            except:
                req.context['user'] = None
                with configure_scope() as scope:
                    scope.user = None
        else:
            with configure_scope() as scope:
                scope.user = None
