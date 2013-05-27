#!/usr/bin/env python
from distutils.core import setup
import os
import sys


appname = 'bootstrap_modeltranslation'
version = __import__(appname).__version__


if sys.argv[-1] == 'publish':
    os.system("python setup.py sdist upload")
    print "You probably want to also tag the version now:"
    print "  git tag -a %s -m 'version %s'" % (version, version)
    print "  git push --tags"
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
