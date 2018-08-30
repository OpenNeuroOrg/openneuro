import falcon
import raven

import datalad_service.config


client = None


def setup():
    """If configured, enables a Sentry client."""
    global client
    if datalad_service.config.SENTRY_DSN:
        client = raven.Client(datalad_service.config.SENTRY_DSN)


def falcon_handler(api):
    """Registers a general Exception logger for Falcon requests."""
    # This function comes from https://github.com/falconry/falcon/issues/266#issuecomment-206300970
    def internal_error_handler(ex, req, resp, params):
        data = {
            'request': {
                'url': req.url,
                'method': req.method,
                'query_string': req.query_string,
                'env': req.env,
                'data': req.params,
                'headers': req.headers,
            }
        }
        message = isinstance(ex, falcon.HTTPError) and ex.title or str(ex)
        ident = client.captureException(message=message, data=data)

        if not isinstance(ex, falcon.HTTPError):
            resp.status = falcon.HTTP_500
            resp.body = ('A server error occurred (reference code: "%s"). '
                         'Please contact the administrator.' % ident)
        else:
            raise ex

    api.add_error_handler(Exception, internal_error_handler)


def set_user_context(user):
    """If configured, set user info on errors."""
    if client:
        client.user_context(user)
