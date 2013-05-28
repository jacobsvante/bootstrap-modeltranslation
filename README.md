# bootstrap-modeltranslation

**Author:** Jacob Magnusson. [Follow me on Twitter][twitter]

## Overview

bootstrap-modeltranslation is a mini-package for adding tabbable [django-modeltranslation] translation fields to [django-admin-bootstrapped].

![Example image](https://raw.github.com/jmagnusson/bootstrap-modeltranslation/master/example.png)

## Tested with

* Python 2.7.3
* Django 1.5
* [django-admin-bootstrapped] 0.3.2
* [django-modeltranslation] 0.6.1

## Installation

Install using `pip`:

    pip install bootstrap-modeltranslation

Add package to `INSTALLED_APPS` (order doesn't matter):

```python
INSTALLED_APPS = (
    'django_admin_bootstrapped',
    'modeltranslation',
    ...
    'bootstrap_modeltranslation',
)
```

NOTE: `bootstrap_modeltranslation` must come before `modeltranslation` for tabbed translation fields to work

Copy the static files to your project:

    python manage.py collectstatic

Import admin classes for inheritance and use just like you would the default ones ([read the modeltranslation docs for more info][django-modeltranslation-docs-admin]).

```python
from bootstrap_modeltranslation.admin import (
    TranslationAdmin,
    TranslationTabularInline, 
    TranslationStackedInline, 
    TranslationGenericTabularInline,
    TranslationGenericStackedInline)

class SomeModelAdmin(TranslationAdmin):
    pass

class SomeModelInlineAdmin(TranslationStackedInline):
    pass
```

## Documentation

This document

[twitter]: https://twitter.com/pyjacob
[docs]: https://github.com/jmagnusson/bootstrap-modeltranslation
[django-modeltranslation]: https://github.com/deschler/django-modeltranslation
[django-modeltranslation-docs-admin]: https://django-modeltranslation.readthedocs.org/en/latest/admin.html
[django-admin-bootstrapped]: https://github.com/riccardo-forina/django-admin-bootstrapped
