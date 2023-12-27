document.querySelector("#bigCookie").click();

Game.ClickCookie();

Game.CanClick;

Game.UpgradesInStore[0].click();

document
  .querySelectorAll(".product.unlocked.enabled")
  .forEach((e) => e.click());

Game.Ascend(1);

let run = true;

function auto() {
  if (Game.CanClick) {
    //click big cookie
    Game.ClickCookie();

    //buy new generators
    [...document.querySelectorAll(".product.unlocked.enabled")].forEach((e) =>
      e.click()
    );

    //buy upgrades
    [...document.querySelectorAll(".crate.upgrade.enabled")].forEach((e) =>
      e.click()
    );

    // click on special cookies
    [...document.querySelector("#shimmers").childNodes].forEach((e) =>
      e.click()
    );
    [...document.querySelector("#goldenCookie").childNodes].forEach((e) =>
      e.click()
    );
    // sugar lumps
    // Game.gainLumps(100)
    // document.querySelectorAll(".row.enabled .productButton.productLevel.lumpsOnly").forEach(e=>e.click())
  }

  if (run) {
    window.requestAnimationFrame(auto);
  }
}

if (gainLumps) {
  Game.gainLumps(10000);
  let lastLumpCount = Game.lumps;
  let spendLumpsBool = true;

  function spendLumps() {
    // upgrade all generators

    [
      ...document.querySelectorAll(".productButtons .productLevel.lumpsOnly"),
    ].forEach((e) => e.click());
    if (lastLumpCount == Game.lumps) spendLumpsBool = false;
    if (spendLumpsBool) {
      lastLumpCount = Game.lumps;
      window.setTimeout(spendLumps, 1000);
    }
  }
  spendLumps();
}

if (ascend) {
  let lastAscendLength = [
    ...document.querySelectorAll(".crate.upgrade.heavenly"),
  ].length;
  let spendAscendBool = true;
  function spendAscend() {
    [...document.querySelectorAll(".crate.upgrade.heavenly")].forEach((e) =>
      e.click()
    );
    if (
      lastAscendLength ==
      [...document.querySelectorAll(".crate.upgrade.heavenly")].length
    )
      spendAscendBool = false;
    if (spendAscendBool) {
      lastAscendLength = [
        ...document.querySelectorAll(".crate.upgrade.heavenly"),
      ].length;
      window.setTimeout(spendAscend, 1000);
    } else {
      Game.Reincarnate(1);
    }
  }
  spendAscend();
}
