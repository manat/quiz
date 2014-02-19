// on DOM ready
jQuery(function ($) {
    'use strict';

    // enable Tab Override for all textareas
    $('textarea.editor').tabOverride();
    $.fn.tabOverride.tabSize(4).autoIndent(false);
});
