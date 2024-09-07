/*
div#wrapper > div.ic-app-nav-toggle-and-crumbs {
  position: sticky;
  top: 0;
  background-color: var(--primary-contrast);
  z-index: 100;
}
div#left-side > div#sticky-container {
  top: 4.5rem;
}
*/

//javascript:
(() => {
  const styleEle = document.createElement('style');
  styleEle.innerHTML = `div#wrapper > div.ic-app-nav-toggle-and-crumbs {
  position: sticky;
  top: 0;
  background-color: var(--primary-contrast);
  z-index: 100;
}
div#left-side > div#sticky-container {
  top: 4.5rem;
}`;
  document.head.appendChild(styleEle);
})()