#!/usr/bin/env python
"""This file and its contents are licensed under the Apache License 2.0. Please see the included NOTICE for copyright information and LICENSE for a copy of the license.
"""
import os
import sys

if __name__ == '__main__':
    # Ensure we prefer local sources over any site-packages installation.
    # This avoids mixed imports like `core.*` from the repo and `label_studio.*`
    # from site-packages when running this script from the checkout.
    current_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(current_dir)
    if repo_root not in sys.path:
        sys.path.insert(0, repo_root)

    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings.label_studio')
    # os.environ.setdefault('DEBUG', 'True')
    try:
        from django.conf import settings
        from django.core.management import execute_from_command_line
        from django.core.management.commands.runserver import Command as runserver

        runserver.default_port = settings.INTERNAL_PORT

    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            'available on your PYTHONPATH environment variable? Did you '
            'forget to activate a virtual environment?'
        ) from exc
    execute_from_command_line(sys.argv)
