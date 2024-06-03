async function getPlayerCustomFields() {
  const selectPlayerElement = document.getElementById('selectPlayer');
  const userId = selectPlayerElement.value;

  const customFieldNameElement = document.getElementById('customFieldNameInput');
  const requestedCustomField = customFieldNameElement.value.trim();
  
  let query = `/getPlayerCustomFields?userId=${userId}`;
  if (requestedCustomField) {
    query += `&requestedCustomField=${requestedCustomField}`;
  }

  const response = await fetch(query);
  const responseText = await response.json();

  let outputText = '';
  if (responseText.customFieldValue) {
    outputText = JSON.stringify(responseText.customFieldValue, null, 2);
  } else {
    outputText = `(No custom field named ${requestedCustomField} for ${selectPlayerElement.options[selectPlayerElement.options.selectedIndex].text})`
  }

  document.getElementById('getPlayerCustomFieldsOutput').value = outputText
}

async function updatePlayerCustomFields() {
  const jsonInputElement = document.getElementById('updateCustomFieldsJsonInput');
  const text = jsonInputElement.value;

  try {
    JSON.parse(text);
  } catch {
    alert('Please enter valid JSON');
    return;
  }

  const response = await fetch('/updatePlayerCustomFields', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customFieldsJson: text
    })
  });

  const responseText = await response.text();
  document.getElementById('updatePlayerCustomFieldsOutput').innerHTML = responseText;
}

async function getLastSavedTimestamp() {
  const response = await fetch('/getLastSavedTimestamp');
  const responseText = await response.text();
  document.getElementById('getLastSavedTimestampOutput').innerHTML = `You've been playing since ${responseText}`;
}

async function deletePlayerTimestamp() {
  const response = await fetch('/deletePlayerTimestamp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const responseText = await response.text();
  document.getElementById('deletePlayerTimestampOutput').innerHTML = responseText;
}