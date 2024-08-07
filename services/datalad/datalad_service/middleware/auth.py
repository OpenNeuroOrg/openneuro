import base64
import jwt
import os

import falcon


def parse_authorization_header(authorization):
    try:
        # This can be 'bearer' or 'basic' followed by space and token
        auth_value = authorization and authorization.split(" ", 1)[1]
        if authorization[:5].lower() == 'basic':
            b64_bytes = base64.urlsafe_b64decode(auth_value.encode())
            return b64_bytes.decode().split(':')[1]
        elif authorization[:6].lower() == 'bearer':
            return auth_value
    except IndexError:
        return None


class AuthenticateMiddleware:
    async def process_request(self, req, resp):
        """Process the request before routing it for authentication.

        Args:
            req: Request object that will eventually be
                routed to an on_* responder method.
            resp: Response object that will be routed to
                the on_* responder.
        """
        # Different methods may use a cookie or the Authorization header (req.auth)
        if 'accessToken' in req.cookies or req.auth:
            assert os.environ['JWT_SECRET'] is not None
            try:
                if req.auth:
                    token = parse_authorization_header(req.auth)
                elif 'accessToken' in req.cookies:
                    token = req.cookies['accessToken']
                try:
                    req.context['user'] = jwt.decode(
                        token, key=os.environ['JWT_SECRET'], algorithms=["HS256"])
                except (jwt.exceptions.InvalidSignatureError, jwt.exceptions.DecodeError):
                    resp.status = falcon.HTTP_BAD_REQUEST
                    resp.text = "Token malformed and could not be decoded"
                    resp.complete = True
                    return
                except jwt.exceptions.ExpiredSignatureError:
                    resp.status = falcon.HTTP_UNAUTHORIZED
                    resp.text = "Token expired"
                    resp.complete = True
                    return
            except TimeoutError:
                req.context['user'] = None
