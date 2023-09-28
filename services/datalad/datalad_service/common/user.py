def get_user_info(req):
    """Parse the name, email fields from a request."""
    name = None
    email = None
    if 'user' in req.context and req.context['user']:
        user = req.context['user']
        if 'name' in user:
            name = user['name']
        if 'email' in user:
            email = user['email']
    return name, email
