/*
    Tabbable translation fields for django-admin-bootstrapped and django-modeltranslation

    Copyright (c) 2013, Jacob Magnusson
    All rights reserved.

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:

        1. Redistributions of source code must retain the above copyright notice,
           this list of conditions and the following disclaimer.

        2. Redistributions in binary form must reproduce the above copyright
           notice, this list of conditions and the following disclaimer in the
           documentation and/or other materials provided with the distribution.

        3. Neither the name of django-imagekit nor the names of its contributors
           may be used to endorse or promote products derived from this software
           without specific prior written permission.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
    DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
    FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
    DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
    SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
    CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
    OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
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
                    'data-validation-msg': validationMsg
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
            var $firstInput = $inputs.first();
            var $parent = $firstInput.data('control-group-parent');
            var isRequired = $firstInput.prop('mtRequired');
            var fieldName = $firstInput.attr('data-mt-label-name');
            var firstLangFieldId = $firstInput.attr('id');
            var hasValidationMsgs = !!$.grep($inputs.attr('data-validation-msg'), function(n) { return(n); }).join();
            var controlGroupClasses = hasValidationMsgs ? 'error' : '';
            var $label = $('<label for="' + firstLangFieldId + '" class="' + (isRequired ? 'required' : '') + '">' + fieldName + ':</label>');
            var $controlGroup = $('<div class="control-group ' + controlGroupClasses + '"><div><div class="control-label"></div><div class="controls"></div></div></div>').insertBefore($parent);
            var $controls = $controlGroup.find('.controls');
            var $ul = $('<ul class="nav nav-tabs">').appendTo($controls);
            var $tabContent = $('<div class="tab-content"></div>').appendTo($controls);
            var setGlyphs = function() {
                var $input = $(this);
                var $glyphs = $input.data('glyphs-el');
                $glyphs.empty();
                if ($input.prop('mtRequired') && !$input.val()) {
                    $glyphs.append(' <i class="icon-exclamation-sign" title="Required"></i>');
                }
                if ($input.val()) {
                    $glyphs.append(' <i class="icon-comment" title="Contains text"></i>');
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
})(jQuery); // NOTE: Not using django.jQuery. It's way outdated, even in Django 1.5
