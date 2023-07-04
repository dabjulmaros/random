
chrome.storage.local.get(["home"]).then((data) => {
  if (data.home)
    document.querySelector('input').value = data.home;
});

document.getElementById("cancel").addEventListener("click", (e) => {
  document.querySelector('input').value = "";
})

document.getElementById("save").addEventListener("click", (e) => {
  chrome.storage.local.set({ home: document.querySelector('input').value })

})