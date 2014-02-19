// on DOM ready
jQuery(function ($) {
    'use strict';

    // enable Tab Override for all textareas
    $('textarea').tabOverride();
    $.fn.tabOverride.tabSize(4).autoIndent(false);
});
