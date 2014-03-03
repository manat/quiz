$(function() {
  /* Exam Navigation */
  var buttonSelector = 'a#previous_button, a#next_button, ' + 
                       'a[id^=previous_dropdown_button_], a[id^=next_dropdown_button], ' + 
                       'a#submit_button';

  var examNavigation = function(event) {
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
  }

  $(buttonSelector).click(examNavigation);
  /* ===== */

  /* Counter */
  var counterSelector = 'span#time-counter span.counter';
  var counter = $(counterSelector).text();

  /* See http://stackoverflow.com/a/6313008/136492 */
  var toHHMMSS = function(counter) {
    var hours   = Math.floor(counter / 3600);
    var minutes = Math.floor((counter - (hours * 3600)) / 60);
    var seconds = counter - (hours * 3600) - (minutes * 60);

    if (counter < 1) { return '00:00:00'; }

    if (hours   < 10) { hours   = "0" + hours;}
    if (minutes < 10) { minutes = "0" + minutes;}
    if (seconds < 10) { seconds = "0" + seconds;}
    
    return hours + ':' + minutes + ':' + seconds;
  }

  // Format counter;
  $(counterSelector).text(toHHMMSS(counter));

  var forceSubmit = function() {
    var url = '/exams/53135f3d9301e2961bf39eaf/done';
    var form = $('<form action="' + url + '" method="post">' +
      '</form>');
    $('body').append(form);

    alert('Time is up!');
    $(form).submit();
  }

  setInterval(function() {
    if (counter < 1) {
      return forceSubmit();
    }

    var hiddenCounter = $('form').find('input[name=counter]');
    
    --counter;
    hiddenCounter.val(counter);
    $("#time-counter span").html(toHHMMSS(counter));
  }, 1000);
});