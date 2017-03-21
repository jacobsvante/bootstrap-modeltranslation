/*
 *  Tabbable translation fields for django-admin-bootstrapped and
 *  django-modeltranslation.
 *  Tested with:
 *  - Django 1.6
 *  - django-admin-bootstrap 0.4.3
 *  - django-modeltranslation 0.7
 *
 *  NOTE #1: This is not very pretty code and might break if
 *           any of the packages change the hmtl output.
 *
 *  NOTE #2: Not using django.jQuery as django-admin-bootstrapped doesn't use
 *           it and we need to have access to the bootstrap tooltip plugin.
 */
(function($) {
    $(function() {
        var $mtInputs = $('[class*="mt-field-"]');

        var getMtLabelName = function(str) {
            try { return (/^(.+?) \[.+\]/).exec(str)[1]; } catch (a) { return ''; }
        };

        var getMtLangFromClass = function(str) {
            try {
                var lang = (/^.+?-([a-z_]{2,5})$/).exec(str)[1];
                return lang.replace('_', '-');
            } catch (a) { return null; }
        };

        // Set attributes on input fields that are needed
        var setMtAttrs = function($inputs) {
            $inputs.each(function() {
                var $input = $(this);
                var classNames = $input.attr('class').split(' ');
                var className = '';
                for (var i=0; i < classNames.length; i++) {
                    className = classNames[i];
                    if ((/mt-field-/).test(className)) {
                        break;
                    }
                }
                var lang = getMtLangFromClass(className);
                var $controls = $input.parent('.controls');
                if (!$controls.length) {
                    // This is to support clearable outputs for M
                    //
                    $controls = $input.parent().parent('.controls');
                }
                var $label = $controls.prev('.control-label').find(':first-child');
                var labelName = getMtLabelName($label.text());
                var fieldId = $input.attr('id');
                fieldId = fieldId.substr(0, fieldId.length - lang.length - 1);
                var isRequired = $label.hasClass('required');
                var validationMsg = $controls.children('.help-inline:first').text();

                if (!lang) {
                    throw Error("Couldn't find language for element" + fieldId);
                }
                if (!labelName) {
                    throw Error("Couldn't find label name for element " + fieldId);
                }

                $input.attr({
                    'data-mt-lang': lang,
                    'data-mt-label-name': labelName, // With language stripped out
                    'data-mt-field-id': fieldId, // With language stripped out
                    'data-validation-msg': validationMsg,
		    'data-mt-label-class': $controls.prev('.control-label').attr('class'),
		    'data-mt-field-class': $controls.attr('class'),
                }).prop({
                    'mtRequired': isRequired
                });
            });
        };

        // Get modeltranslation input fields grouped by original input id
        // minus language.
        var getGroupedMtInputs = function($inputs) {
            var groupedInputs = {};
            $inputs.each(function() {
                var $el = $(this);
                var $elParent = $el.parents('.control-group').first();
                var fieldId = $el.attr('data-mt-field-id');
                $el.data('control-group-parent', $elParent);
                groupedInputs[fieldId] = (groupedInputs[fieldId] || $([])).add($el.detach());
                $elParent.hide();
            });
            return groupedInputs;
        };

        var configureMtField = function($inputs) {
            var gettext = window.gettext || function(s) { return s; };
            var $firstInput = $inputs.first();
            var $parent = $firstInput.data('control-group-parent');
            var isRequired = $firstInput.prop('mtRequired');
            var fieldName = $firstInput.attr('data-mt-label-name');
            var firstLangFieldId = $firstInput.attr('id');
            var hasValidationMsgs = !!$.grep($inputs.attr('data-validation-msg'), function(n) { return(n); }).join();
	    var controlGroupClasses = hasValidationMsgs ? 'error' : '';
	    var labelClasses = $firstInput.attr('data-mt-label-class');
	    var fieldClasses = $firstInput.attr('data-mt-field-class');

            var $label = $('<label for="' + firstLangFieldId + '" class="' + (isRequired ? 'required' : '') + '">' + fieldName + ':</label>');
            var $controlGroup = $('<div class="control-group form-group ' + controlGroupClasses + '"><div><div class="' + labelClasses + '"></div><div class="' + fieldClasses + '"></div><div style="clear:both"></div></div></div>').insertBefore($parent);
            var $controls = $controlGroup.find('.controls');
            var $ul = $('<ul class="nav nav-tabs">').appendTo($controls);
            var $tabContent = $('<div class="tab-content"></div>').appendTo($controls);
            var getGlyph = function(iconName, title) {
                var $el = $('<i>').addClass(iconName).attr('title', title)
                               .css('margin-left', '4px');
                $el.tooltip();
                return $el;
            };
            var setGlyphs = function() {
                var $input = $(this);
                var $glyphs = $input.data('glyphs-el');
                $glyphs.empty();
                if ($input.prop('mtRequired') && !$input.val()) {
                    $glyphs.append(getGlyph('icon-exclamation-sign',
                                            gettext('Required')));
                }
                if ($input.val()) {
                    $glyphs.append(getGlyph('icon-comment',
                                            gettext('Contains text')));
                }
            };
            var removeOldParents = function() {
                $inputs.each(function() {
                    $(this).data('control-group-parent').remove();
                });
            };
            var onLabelClick = function() {
                var $activeInput = $(this).parents('.control-group')
                                            .find('.tab-pane.active > :first');
                $activeInput.focus();
            };

            removeOldParents();

            $controlGroup.find('.control-label').append($label);
            $label.on('click', onLabelClick);

            $inputs.each(function() {
                var $input = $(this);
                var validationMsg = $input.attr('data-validation-msg');
                var lang = $input.attr('data-mt-lang');
                var tabId = 'tab-' + Math.random().toString(36).substring(2);
                var active = $input.is('.mt-default') ? 'active' : '';
                var $tabAnchor = $('<a href="#' + tabId + '" data-toggle="tab">' + lang + '</a>');
                var $li = $('<li class="' + active + '">').append($tabAnchor);
                var $glyphs = $('<span class="glyphs"></span>');
                var $contentEl = $('<div class="tab-pane ' + active + '" id="' + tabId + '">').appendTo($tabContent);
                $li.find('a').append($glyphs);
                $ul.append($li);
                $contentEl.append($input);
                if (validationMsg) {
                    $input.after($('<span class="help-inline">').text(validationMsg));
                }
                $input.data('glyphs-el', $glyphs);
                $input.on('keyup', setGlyphs);
                $input.trigger('keyup');
            });
        };

        var configureMtFields = function(groupedInputs) {
            $.each(groupedInputs, function(fieldId, $inputs) {
                configureMtField($inputs);
            });
        };

        // Don't do anything if we have no modeltranslation fields
        if (!$mtInputs.length) {
            return;
        }

        // Make sure django-admin-bootstrapped is the active admin interface
        if (!$('.control-group').length) {
            return;
        }

        // Only support for change forms right now
        if (!$('body.change-form').length) {
            return;
        }

        setMtAttrs($mtInputs);
        var groupedInputs = getGroupedMtInputs($mtInputs);
        configureMtFields(groupedInputs);
    });
})(jQuery);
