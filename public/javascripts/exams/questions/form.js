$(function() {
  var selector = 'a#previous_button, a#next_button, ' + 
                 'a[id^=previous_dropdown_button_], a[id^=next_dropdown_button], ' + 
                 'a#submit_button';
  
  $(selector).click(function(event) {
    event.preventDefault();
    var target = $(event.target);
    var form;
    var submitMode;
    var submitId;
    
    if (target.is('a')) {
      form = $(this).closest('form');

      if ($(this).attr('id').match(/previous_button|next_button|submit_button/)) {
        submitMode = $(form).find('input[name=submit_mode]');
        submitMode.val($(this).attr('data-action'));
      }
      else {
        submitId = $(form).find('input[name=submit_id]');
        submitId.val($(this).attr('data-action').replace(/\"/g, ""));
      }

      form.submit();
    }
  });
});