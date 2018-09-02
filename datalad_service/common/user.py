def get_user_info(req):
    """Parse the name, email fields from a request."""
    name = None
    email = None
    if 'user' in req.context:
        user = req.context['user']
        name = user['name']
        email = user['email']
    return name, email
