document.querySelectorAll('body,.bc-tray,.bc-box,.bc-color-base').forEach(e => {
  e.style.color = "#fff";
  e.style.backgroundColor = "#262626";
});
document.querySelectorAll('#adbl-cloud-player-controls img').forEach(e => e.style.filter = 'invert(0.85)')
document.querySelectorAll('.bc-text,.bc-icon.bc-icon-fill-base').forEach(e => e.style.color = '#cbcbcb')
document.querySelectorAll('.bc-box .bc-icon-fill-base:not(.bc-icon-bookmarks,#adbl-cloud-player-menu-icon)').forEach(e => { e.style.backgroundColor = '#cbcbcb' })
