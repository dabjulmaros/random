// document.querySelector("#bigCookie").click();

// Game.ClickCookie();

// Game.CanClick;

// Game.UpgradesInStore[0].click();

// document
//   .querySelectorAll(".product.unlocked.enabled")
//   .forEach((e) => e.click());

// Game.Ascend(1);

let autoRun = true;
let autoAscend = true;

function _auto() {
  // id="ascend"
  // id="ascendUpgrades" children
  if (Game.CanClick) {
    //click big cookie
    Game.ClickCookie();

    //buy new generators
    [...document.querySelectorAll("#store .product.unlocked.enabled")].forEach(
      (e) => Game.ObjectsById[e.id.split("product")[1]].buy(1)
    );

    //buy upgrades
    [...document.querySelectorAll("#store .crate.upgrade.enabled")].forEach(
      (e) => Game.UpgradesById[e.dataset.id].buy(1)
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

  if (autoRun) {
    if (autoAscend) {
      autoRun = false;
      _ascend();
    } else {
      window.requestAnimationFrame(_auto);
    }
  }
}

// if (gainLumps) {
//   Game.gainLumps(10000);
//   let lastLumpCount = Game.lumps;
//   let spendLumpsBool = true;

//   function _spendLumps() {
//     // upgrade all generators

//     [
//       ...document.querySelectorAll(".productButtons .productLevel.lumpsOnly"),
//     ].forEach((e) => e.click());
//     if (lastLumpCount == Game.lumps) spendLumpsBool = false;
//     if (spendLumpsBool) {
//       lastLumpCount = Game.lumps;
//       window.setTimeout(_spendLumps, 1000);
//     }
//   }
//   _spendLumps();
// }

function _ascend() {
  Game.Ascend(1);
  window.setTimeout(_getAscend, 6000);
  function _getAscend() {
    let lastAscendLength = [
      ...document.querySelectorAll(".crate.upgrade.heavenly"),
    ].length;
    console.log(lastAscendLength);
    let spendAscendBool = true;
    function _spendAscend() {
      [
        ...document.querySelectorAll(
          ".crate.upgrade.heavenly:not(.ghosted):not(.enabled)"
        ),
      ].forEach((e) => e.click());
      if (
        lastAscendLength ==
        [...document.querySelectorAll(".crate.upgrade.heavenly")].length
      )
        spendAscendBool = false;
      if (spendAscendBool) {
        lastAscendLength = [
          ...document.querySelectorAll(".crate.upgrade.heavenly"),
        ].length;
        window.setTimeout(_spendAscend, 500);
      } else {
        autoAscend = false;
        autoRun = true;
        // Game.Reincarnate(1);
        // window.setTimeout(_auto, 2000);
      }
    }
    _spendAscend();
  }
}
