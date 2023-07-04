// Fediverse helper script
// One of the biggest issues right now is finding content in 
// instances other than your home one
// this script should take the current page found and open it on 
// the search of the defined home instance.

// params = new URLSearchParams({
//   q: "Post URL To Find",
//   auth: "[Your Auth Cookie here]",
// });

// fetch(`//[Home Instance]}/api/v3/resolve_object?${params.toString()}`).then(r=>r.json()).then(j=>console.log(`//${window.location.host}/post/${j.post.counts.post_id}`);


// Issue with that script is cors and fetching from the foreing instance

// The workaround is to open the home search tool in a new window
// https://[Home Instance]/search?q=[encodeURIComponent(URL to find)]&type=Url

//Could be made into an extension or something
//https://stackoverflow.com/questions/27954806/how-to-clear-the-google-chrome-address-bar
//https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-reading-time/
//https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-tabs-manager/
//https://chrome.google.com/webstore/detail/custom-new-tab-url/mmjbdbjnoablegbkcklggeknkfcjkjia

if(document.querySelectorAll("#root > .lemmy-site").length)
  findAtHome();

function findAtHome(url = window.location.href) {
  const home = '//reddthat.com'
  if (url.includes(home))
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