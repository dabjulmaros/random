const wrapper = document.getElementById('wrapper');

const dialog = document.querySelector('dialog');
const newTitle = document.getElementById('newTitle');
const newNote = document.getElementById('newNote');

// chrome.storage.local.get(["home"]).then((data) => {
//   if (data.home)
//     document.querySelector('input').value = data.home;
// });

// document.getElementById("save").addEventListener("click", (e) => {
//   chrome.storage.local.set({ home: document.querySelector('input').value })
// })

function copyText(ele) {
  const textArea = ele.parentElement.querySelector('textarea');
  navigator.clipboard.writeText(textArea.value);
}

function editText(ele) {
  const textArea = ele.parentElement.querySelector('textarea');
  textArea.disabled = !textArea.disabled
}

function addNote() {
  dialog.showModal();
}

function submitNote(ele) {
  if (ele.title === "Add") {
    createItem(newTitle.value, newNote.value);
  }
  newTitle.value = "";
  newNote.value = "";
  dialog.close()
}


function createItem(_title, _value) {
  const section = document.createElement('div');
  section.classList.add("section");

  const title = document.createElement('h2');
  title.innerText = _title;

  const item = document.createElement('div');
  item.classList.add('item');

  const textArea = document.createElement('textarea');
  textArea.disabled = true;
  textArea.value = _value;

  const copyButton = document.createElement('button');
  copyButton.title = "Copy";
  copyButton.innerText = "✂️";
  copyButton.onclick = () => copyText(copyButton);

  const editButton = document.createElement('button');
  editButton.title = "Edit";
  editButton.innerText = "📝";
  editButton.onclick = () => editText(editButton);

  item.appendChild(textArea);
  item.appendChild(copyButton);
  item.appendChild(editButton);

  section.appendChild(title);
  section.appendChild(item);

  wrapper.appendChild(section);

}