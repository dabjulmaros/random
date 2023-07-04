
chrome.storage.local.get(["newTab"]).then((data) => {
  if (data.home)
    document.querySelector('input').value = data.home;
});

document.getElementById("cancel").addEventListener("click", (e) => {
  document.querySelector('input').value = "";
  chrome.storage.local.set({ newTab: document.querySelector('input').value })
})

document.getElementById("save").addEventListener("click", (e) => {
  chrome.storage.local.set({ newTab: document.querySelector('input').value })
})