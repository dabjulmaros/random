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
function findAtHome(url = window.location.href) {
  const homeSearch = '//reddthat.com/search?'
  const param = new URLSearchParams({
    q: url,
    type: "Url"
  })

  const ancher = document.createElement('a');
  ancher.textContent = "Find @ Home"
  ancher.target = "_blank"
  ancher.style.marginLeft = ".5rem"
  ancher.rel = 'noopener, noreferrer';
  ancher.href = homeSearch + param.toString();

  [...document.querySelectorAll('.post-title a.d-inline')].forEach(e => {
    e.parentNode.appendChild(ancher.cloneNode(true));
  })

  // works if popups are allowed
  // window.open(homeSearch + param.toString(), '_blank', 'noopener, noreferrer');
}