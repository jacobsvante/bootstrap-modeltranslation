#!/usr/bin/env python
from __future__ import print_function
from distutils.core import setup
import os
import sys


appname = 'bootstrap_modeltranslation'
version = __import__(appname).__version__


if sys.argv[-1] == 'publish':
    os.system("python setup.py sdist upload")
    print("You probably want to tag the version if the upload was successful:")
    print("  git tag -a {0} -m 'Version {0}' && git push " \
          "--tags".format(version))
    sys.exit()

setup(
    name='bootstrap-modeltranslation',
    version=version,
    description="Tabbable translation fields for django-admin-bootstrapped "
                "and django-modeltranslation",
    author='Jacob Magnusson',
    author_email='m@jacobian.se',
    url='https://github.com/jmagnusson/bootstrap-modeltranslation',
    license='BSD License',
    platforms=['any'],
    packages=[appname],
    package_data={appname: ['static/{0}/*/*'.format(appname)]},
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Django',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Programming Language :: Python',
    ],
)
