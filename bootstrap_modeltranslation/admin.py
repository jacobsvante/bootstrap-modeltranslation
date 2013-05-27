from modeltranslation import admin


MODEL_TRANSLATION_JS = ('{0}/js/{0}.js'.format('bootstrap_modeltranslation'), )


class TranslationAdmin(admin.TranslationAdmin):

    class Media(object):
        js = MODEL_TRANSLATION_JS


class TranslationTabularInline(admin.TranslationTabularInline):

    class Media(object):
        js = MODEL_TRANSLATION_JS


class TranslationStackedInline(admin.TranslationStackedInline):

    class Media(object):
        js = MODEL_TRANSLATION_JS


class TranslationGenericTabularInline(admin.TranslationGenericTabularInline):

    class Media(object):
        js = MODEL_TRANSLATION_JS


class TranslationGenericStackedInline(admin.TranslationGenericStackedInline):

    class Media(object):
        js = MODEL_TRANSLATION_JS
