/**** form ****/
const $form = $('form');

/**** user info ****/
const $nameInput = $('#name');
const $emailInput = $('#mail');
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

/**** payment info ****/
const $paymentSelect = $('#payment');
const $paymentOptions = $paymentSelect.children();
const $paymentSiblings = $paymentSelect.nextAll();
const $creditCardDiv = $paymentSiblings.eq(0);
const $cardNumberInput = $('#cc-num');
const $zipCodeInput = $('#zip');
const $cVVInput = $('#cvv');
const $payPalP = $paymentSiblings.eq(1);
const $bitCoinP = $paymentSiblings.eq(2);



/**** helpers ****/
function showPayment({ type, select=false}) {
  $paymentSiblings.hide();
  let eq;

  switch (type) {
    case 'credit card': eq = 0; break;
    case 'paypal': eq = 1; break;
    case 'bitcoin': eq = 2; break;
    default: break;
  }

  $paymentSiblings.eq(eq).show();

  if (select) {
    $paymentOptions.eq(eq+1).prop('selected', true);
  }
}

function initErrorMessages() {
  $nameInput.after('<div class="name-error"></div>');
  $emailInput.after('<div class="mail-error"></div>');
  $activitiesFieldset.after('<div class="activities-error"></div>');
  $cardNumberInput .after('<div class="cc-num-error"></div>');
  $zipCodeInput.after('<div class="zip-error"></div>');
  $cVVInput.after('<div class="cvv-error"></div>');
  $('div[class$="error"]').hide();
}

function validator(e, payment) {
  const { target } = e;
  let validators = [
    {key: 'name', func: _=> 
      /\d+/.test($nameInput.val()) ? 'alpha-characters required' :
      !/\w{2}/.test($nameInput.val()) ? 'name required' :
      null
    },
    {key: 'mail', func: _=> 
      !/\w+@\w+\.\w{2,3}/.test($emailInput.val()) ? 'valid email required' : 
      null
    }, 
    {key: 'activities', func: _=> 
      $activitiesFieldset.find('input:checked').length === 0 ? 'select at least one activity' :
      null
    }
  ];

  if (payment === 'credit card') {
    const alphaCheck = $ => /[a-z]+/.test($.val());
    const alphaMsg = 'digit-characters required';
    validators.push(
      {key: 'cc-num', func: _=> 
        alphaCheck($cardNumberInput) ? alphaMsg :
        !/^(\d{13,16})$/.test($cardNumberInput.val()) ? 'number between 13 and 16 required' : 
        null
      },
      {key: 'zip', func: _=> 
        alphaCheck($zipCodeInput) ? alphaMsg :
        !/^(\d{5})$/.test($zipCodeInput.val()) ? '5 digit zip code required' : 
        null
      },
      {key: 'cvv', func: _=> 
        alphaCheck($cVVInput) ? alphaMsg :
        !/^(\d{3})$/.test($cVVInput.val()) ? '3 digit number required':
        null
      }
    );
  }

  // check for live validation on form children
  if (target.tagName !== 'FORM') { // (not submitting)
    let key = target.id || target.className || null;
    if (!key && target.type === 'checkbox') key = 'activities';
    validators = validators.filter(v => v.key === key);
  }

  // run through field(s), hiding/showing err(s) when needed
  let errors = 0;
  validators.forEach(v => {
    const $errorDiv = $(`.${v.key}-error`);
    const res = v.func();
    //console.log(res);
    if (res) {
      $errorDiv.text(res).show();
      errors++;
    } else {
      $errorDiv.hide();
    }
  });

  // stop event from continuing if there errors
  return errors > 0 ? e.preventDefault() : true;
}

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
  const selectFirstOption = $ => $.show().eq(0).prop('selected', true);

  $colorsDiv.show();

  if (this.value === 'heart js') {
    selectFirstOption($heartJSOptions);
    $JSPunOptions.hide();
  } else if (this.value === 'js puns') {
    selectFirstOption($JSPunOptions);
    $heartJSOptions.hide();
  } else {
    $colorsDiv.hide();
  } 
});

// display and hide payment methods
$paymentSelect.on('change', function() {
  const { value } = this;
  showPayment({ type: value });
});

// stop form submission if there are errors
$form.on('submit change focusout input', function(e) { validator(e, $paymentSelect.val()) });

/**** page load ****/
// set focus on first text field
$nameInput.focus();

// hide other job role text field
$otherJobInput.hide();

// add total pricing to activites
$activitiesFieldset.append(`<div id="activities-total">${totalStringLiteral()}</div>`);

// hide shirt colors 
$colorsDiv.hide();

// set default payment selection to credit card, and disable 'Select Payment' option
showPayment({ type: 'credit card', select: true });
$paymentOptions.eq(0).prop('disabled', true);

// add and hide error messages
initErrorMessages();
