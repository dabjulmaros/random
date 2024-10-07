// Bookmarklet
// javascript: 
(() => {
  const bread = document.querySelectorAll("#breadcrumbs li");
  let title = bread[1].innerText.match(/\w{3,}\d{4}/)[0];
  if (bread.length >= 4 && !bread[3].innerHTML.includes(ENV.current_user_id)) {
    title += " " + bread[3].innerText;
  }
  else if (bread.length >= 3) {
    title += " " + bread[2].innerText;
  }
  document.title = title;
})();


// javascript: (() => {const bread = document.querySelectorAll("#breadcrumbs li");let title = bread[1].innerText.match(/\w{3,}\d{4}/)[0];if (bread.length >= 4 && !bread[3].innerHTML.includes(ENV.current_user_id)) {title += " " + bread[3].innerText;}else if (bread.length >= 3) {title += " " + bread[2].innerText;}document.title = title;})();


