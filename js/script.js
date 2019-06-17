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
let total = 0;
const totalStringLiteral = _ => `Total: $${total}`;

/**** event listeners ****/
// disable/enable activities based on schedule, and add/subtract total
$activitiesFieldset.on('change', function(e) {
  const extractString = ($, { type }) => {
    const string = $.text();
    const dateRegex = /\w+ \d+\w\w-\d+\w\w/i;
    const priceRegex = /\$\d+/;
    let selectedRegex;
    let extracted;

    if (type === 'date') selectedRegex = dateRegex;
    else if (type === 'price') selectedRegex = priceRegex;

    extracted = string.match(selectedRegex);
    if (extracted) extracted = extracted[0];
    return extracted;
  };

  const extractInput = $ => $.children(':first');

  // save selected activity, price, date, and other unselected activities  
  const $activityLabel = $(e.target.parentNode);
  const $activityInput = extractInput($activityLabel);
  const checked = $activityInput.prop('checked');
  const date = extractString($activityLabel, {type: 'date'});
  let price = extractString($activityLabel, {type: 'price'});

  // search for any conflicting day and time
  const $otherActivityLabels = $(this).find('input:not(:checked)').parent();
  $otherActivityLabels.each(function(i) {
    const $nextActivityLabel = $(this);
    const $nextActivityInput = extractInput($nextActivityLabel);
    const nextDate = extractString($nextActivityLabel, {type: 'date'});

    // if dates are equal: enable or disable checkbox according to status
    if (date === nextDate) {
      $nextActivityLabel.children(':first').prop('disabled', checked);
    }
  });

  // handle total price calculation
  price = parseInt(price.slice(1));
  if (!checked) price *= -1;
  total += price;
  $('#activities-total').text(`${totalStringLiteral()}`);
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

// add total pricing to activites
$activitiesFieldset.append(`<div id="activities-total">${totalStringLiteral()}</div>`);
