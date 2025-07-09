import logging


class CustomErrorHandlerMiddleware:
    async def process_response(self, req, resp, resource, req_succeeded):
        if not req_succeeded:
            exc = resp.get_header(
                'X-Falcon-Exception'
            )  # Retrieve exception from ASGI header
            if exc:
                logging.exception(f'Unhandled exception: {exc}', exc_info=eval(exc))
            else:
                logging.error('Request failed without exception details')
