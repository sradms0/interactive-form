const $nameInput = $('#name');
const $otherJobInput = $('#other-title');
const $jobRoleSelect = $('#title');


const $designSelect = $('#design');
const $colorsDiv = $('#colors-js-puns');
const $colorSelect = $('#color');

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



// set focus on first text field
$nameInput.focus();

// hide other job role text field
$otherJobInput.hide();
