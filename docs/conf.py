# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'OpenNeuro'
copyright = '2022, Stanford Center for Reproducible Neuroscience'
author = 'Stanford Center for Reproducible Neuroscience'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = [
    'myst_parser',
    'sphinx_copybutton',
    'graphqllexer',
    'sphinxext.rediraffe',
]

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']



# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'furo'
html_static_path = ['assets']

html_theme_options = {
    'light_logo': 'on-dark.svg',
    'dark_logo': 'on-light.svg',
    'sidebar_hide_name': True,
}

# Translate routes without extensions to directories with index pages,
# as Sphinx doesn't have a notion of generic routes.
rediraffe_redirects = {
    f'{route}/index.md': f'{route.replace("-", "_")}.md'
    for route in (
        'user-guide',
        'api',
        'git',
        'monitoring', # Still rendered, but not in ToC
        'maintenance',
    )
}
rediraffe_redirects.update({
    'openneuro-readme/index.md': 'index.md',
    'openneuro-packages-openneuro-cli-readme/index.md': 'cli.md',
})
