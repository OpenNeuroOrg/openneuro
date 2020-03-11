import jwt
import os

from datalad_service.common.raven import set_user_context


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
        if 'accessToken' in cookies:
            try:
                req.context['user'] = jwt.decode(
                    cookies['accessToken'], key=os.environ['JWT_SECRET'])
                set_user_context(req.context['user'])
            except:
                req.context['user'] = None
                set_user_context(None)
        else:
            set_user_context(None)
