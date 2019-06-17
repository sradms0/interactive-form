/**** user info ****/
const $nameInput = $('#name');
const $otherJobInput = $('#other-title');
const $jobRoleSelect = $('#title');


/**** t-shirt info ****/
const $designSelect = $('#design');
const $colorsDiv = $('#colors-js-puns');
const $colorSelect = $('#color');

/**** activities info ****/
const $activitiesFieldset = $('.activities');


/**** event listeners ****/
// disable/enable activities based on schedule, and add/subtract total
$activitiesFieldset.on('change', function(e) {
  const extractDate = string => {
    const regex = /\w+ \d+\w\w-\d+\w\w/i;
    let date = string.match(regex);
    if (date) date = date[0];
    return date
  };
  const extractInput = $ => $.children(':first');

  // save selected activity and date, and other unselected activities  
  const $activityLabel = $(e.target.parentNode);
  const $activityInput = extractInput($activityLabel);
  const date = extractDate($activityLabel.text());

  // search for any conflicting day and time
  const $otherActivityLabels = $(this).find('input:not(:checked)').parent();
  $otherActivityLabels.each(function(i) {
    const $nextActivityLabel = $(this);
    const $nextActivityInput = extractInput($nextActivityLabel);
    const nextDate = extractDate($nextActivityLabel.text());

    // if dates are equal: enable or disable checkbox according to status
    if (date === nextDate) {
      const disabledStatus = $activityInput.prop('checked');
      $nextActivityLabel.children(':first').prop('disabled', disabledStatus);
    }
  });
});

// toggle other rob role text field
$jobRoleSelect.on('change', function() {
  if (this.value === 'other') {
    $otherJobInput.show();
  } else {
    $otherJobInput.hide();
  }
});

// display and hide shirt colors based on shirt design
$designSelect.on('change', function() {
  const $heartJSOptions =  $('option:contains("I ♥ JS shirt only")');
  const $JSPunOptions = $('option:contains("JS Puns shirt only")');

  $colorsDiv.show();

  if (this.value === 'heart js') {
    $heartJSOptions.show().eq(0).prop('selected', true);
    $JSPunOptions.hide();
  } else if (this.value === 'js puns') {
    $JSPunOptions.show().eq(0).prop('selected', true);;
    $heartJSOptions.hide();
  } else {
    $colorsDiv.hide();
  } 
});



/**** page load ****/
// set focus on first text field
$nameInput.focus();

// hide other job role text field
$otherJobInput.hide();
