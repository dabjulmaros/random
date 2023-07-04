chrome.storage.local.get(["newTab"]).then((result) => {
  if (result.newTab && result.newTab != "")
    if(window.location.href == result.newTab){
      console.log("hello world")
    }
}); 