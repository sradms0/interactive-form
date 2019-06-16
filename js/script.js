const $otherJobInput = $('#other-job');
const $jobRoleSelect = $('#title');

$jobRoleSelect.on('change', function() {
  if (this.value === 'other') {
    $otherJobInput.show();
  } else {
    $otherJobInput.hide();
  }
});

// set focus on first text field
$('#name').focus();

// hide other job role text field
$otherJobInput.hide();
