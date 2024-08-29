const integration = H5PIntegration.contents;
const jsonString = integration[Object.keys(integration)[0]].jsonContent;
const dialogs = JSON.parse(jsonString).dialogs;

for (const i of dialogs) {
  const span = document.createElement('span');
  const span2 = document.createElement('span');
  span.innerHTML = i.text;
  span2.innerHTML = i.answer;
  console.log(span.innerText.replaceAll('\n', '') + ": " + span2.innerText.replaceAll('\n', ''))
}
