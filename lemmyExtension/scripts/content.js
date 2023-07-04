
if (document.querySelectorAll("#root > .lemmy-site").length)
  findAtHome();

async function findAtHome(url = window.location.href) {
  let home = "";

  await chrome.storage.local.get(["home"]).then((result) => {
    home = result.home
  });

  if (url.includes(home) || home == "")
    return;

  url = url.split('?')[0]

  if (url.includes("/post/"))
    findPostAtHome(home, url)
  else if (url.includes('/c/'))
    findCommAtHome(home);

  // works if popups are allowed
  // window.open(homeSearch + param.toString(), '_blank', 'noopener, noreferrer');
}

function findPostAtHome(home, url) {
  const param = new URLSearchParams({
    q: url,
    type: "Url"
  })

  const ancher = document.createElement('a');
  ancher.textContent = "Find @ Home"
  ancher.target = "_blank"
  ancher.style.marginLeft = ".5rem"
  ancher.rel = 'noopener, noreferrer';
  ancher.href = home + "/search?" + param.toString();

  [...document.querySelectorAll('.post-title a')].forEach(e => {
    e.parentNode.appendChild(ancher.cloneNode(true));
  })
}

function findCommAtHome(home) {
  const alertBox = document.querySelector('.alert code.user-select-all')
  const postLink = document.querySelector('.mb-2 .community-link');

  const comm = alertBox.textContent.substring(1);

  const ancher = document.createElement('a');
  ancher.textContent = "Find @ Home"
  ancher.target = "_blank"
  ancher.style.marginLeft = ".5rem"
  ancher.rel = 'noopener, noreferrer';
  ancher.href = home + "/c/" + comm;

  alertBox.parentNode.appendChild(ancher.cloneNode(true));
  postLink.parentNode.appendChild(ancher.cloneNode(true));

}