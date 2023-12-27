document.querySelector("#bigCookie").click();

Game.ClickCookie();

Game.CanClick;

Game.UpgradesInStore[0].click();

document
  .querySelectorAll(".product.unlocked.enabled")
  .forEach((e) => e.click());

let run = true;

function auto() {
  Game.ClickCookie();
  document
    .querySelectorAll(".product.unlocked.enabled")
    .forEach((e) => e.click());
  document.querySelectorAll(".crate.upgrade.enabled").forEach((e) => e.click());
  [...document.querySelector("#shimmers").childNodes].forEach((e) => e.click());
  [...document.querySelector("#goldenCookie").childNodes].forEach((e) =>
    e.click()
  );
  if (run) {
    window.requestAnimationFrame(auto);
  }
}
