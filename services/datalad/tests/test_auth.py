import base64
from falcon import Request, Response
from datalad_service.middleware.auth import parse_authorization_header, AuthenticateMiddleware

from .dataset_fixtures import *

raw_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmZDQ0ZjVjNS1iMjFiLTQyMGItOTU1NS1hZjg1NmVmYzk0NTIiLCJlbWFpbCI6Im5lbGxAc3F1aXNoeW1lZGlhLmNvbSIsInByb3ZpZGVyIjoiZ29vZ2xlIiwibmFtZSI6Ik5lbGwgSGFyZGNhc3RsZSIsImFkbWluIjp0cnVlLCJzY29wZXMiOlsiZGF0YXNldDpnaXQiXSwiZGF0YXNldCI6ImRzMDAyNDA0IiwiaWF0IjoxNjA4NDEwNjEyLCJleHAiOjIxNDc0ODM2NDd9.Gxy-2weKFlQ-q1IcP3X0OyqL4uF3WIXtR-ntRsUB3Gk'
basic_token = base64.urlsafe_b64encode(
    b'username:' + raw_token.encode()).decode()


def test_parse_authorization_header():
    assert parse_authorization_header(
        'Basic {}'.format(basic_token)) == raw_token
    assert parse_authorization_header(
        'Bearer {}'.format(raw_token)) == raw_token


def test_auth_middleware_bearer():
    middleware = AuthenticateMiddleware()

    req = Request({
        'wsgi.errors': '',
        'wsgi.input': '',
        'REQUEST_METHOD': 'GET',
        'SCRIPT_NAME': '',
        'PATH_INFO': '',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'HTTP_AUTHORIZATION': 'Bearer {}'.format(raw_token)
    })

    resp = Response()

    middleware.process_request(req, resp)

    assert 'user' in req.context
    assert 'dataset' in req.context['user']
    assert 'sub' in req.context['user']
    assert req.context['user']['dataset'] == 'ds002404'
    assert req.context['user']['sub'] == 'fd44f5c5-b21b-420b-9555-af856efc9452'


def test_auth_middleware_basic():
    middleware = AuthenticateMiddleware()

    req = Request({
        'wsgi.errors': '',
        'wsgi.input': '',
        'REQUEST_METHOD': 'GET',
        'SCRIPT_NAME': '',
        'PATH_INFO': '',
        'SERVER_PROTOCOL': 'HTTP/1.1',
        'HTTP_AUTHORIZATION': 'Basic {}'.format(basic_token)
    })

    resp = Response()

    middleware.process_request(req, resp)

    assert 'user' in req.context
    assert 'dataset' in req.context['user']
    assert 'sub' in req.context['user']
    assert req.context['user']['dataset'] == 'ds002404'
    assert req.context['user']['sub'] == 'fd44f5c5-b21b-420b-9555-af856efc9452'
