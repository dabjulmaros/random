
function loadNotes() {
  chrome.storage.local.get(["myNotes"]).then((data) => {
    if (data?.myNotes) {
      notes.push(...data.myNotes)
      for (const i in notes) {
        createItem(notes[i][0], notes[i][1], i);
      }
    }
  });
}

async function storeNotes(reload = false) {
  await chrome.storage.local.set({ myNotes: notes });
  if (reload) {
    notes.splice(0)
    wrapper.innerHTML = "";
    loadNotes();
  }
}


function showToast() {
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2900);
}
