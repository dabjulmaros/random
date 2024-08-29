const bread = document.querySelectorAll("#breadcrumbs li");
document.title =
  bread[1].innerText.match(/\w{3,}\d{4}/)[0] + " " + bread[2].innerText;
