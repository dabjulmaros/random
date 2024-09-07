// Bookmarklet
// javascript: 
(() => {
  const bread = document.querySelectorAll("#breadcrumbs li");
  let title = bread[1].innerText.match(/\w{3,}\d{4}/)[0];
  if (bread.length >= 3) title += " " + bread[2].innerText;
  document.title = title;
})();
