chrome.storage.local.get(["newTab"]).then((result) => {
  if (result.newTab && result.newTab != "")
    window.location.replace(result.newTab);
  else
    window.location.replace("chrome://new-tab-page");
}); 