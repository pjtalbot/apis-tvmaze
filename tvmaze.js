/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */

const missingImageUrl =
	'https://image.shutterstock.com/z/stock-vector-upset-magnifying-glass-cute-not-found-symbol-unsuccessful-search-zoom-icon-no-suitable-1127749553.jpg';

async function searchShows(query) {
	let response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);

	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.

	let shows = response.data.map((result) => {
		let show = result.show;
		return {
			id: show.id,
			name: show.name,
			summary: show.summary,
			image: show.image ? show.image.medium : missingImageUrl
		};
	});

	return shows;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
	const $showsList = $('#shows-list');
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image}">
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$('#search-form').on('submit', async function handleSearch(evt) {
	evt.preventDefault();

	let query = $('#search-query').val();
	if (!query) return;

	$('#episodes-area').hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
	let epResponse = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	let episodes = epResponse.data.map((episode) => ({
		id: episode.id,
		name: episode.name,
		season: episode.season,
		number: episode.number
	}));
	return episodes;
}

function populateEpisodes(arr) {
	console.log('populateEpisodes Run');
	const $episodesList = $('#episodes-list');
	$episodesList.empty();

	for (let ep of arr) {
		let $item = $(`<li class="episode">
  ${ep.name}
  (Season ${ep.season}, episode ${ep.number})
  <button id="reveal-cast">Show Cast</button>
  </li><ul class="cast-list" style="display: none"></ul>`);
		$episodesList.append($item);
	}

	$('#episodes-area').show();
}

// use async await function to ensure click is handled even though button may not be displayed at initial dom loading.

$('#shows-list').on('click', '.get-episodes', async function handleEpClick(e) {
	let showId = $(e.target).closest('.Show').data('show-id');
	let episodes = await getEpisodes(showId);
	populateEpisodes(episodes);
});

// started to work on "Show Cast Functionality"

// $(".cast-list").on('click', '#reveal-cast', async function handleCastClick(e) {
//   let episodeID = $(e.target).closest('.episode').data('episode-id');
//   let castMembers = await getCast(episodeID)
// })

// async function getCast(id) {
// 	let castResponse = await axios.get(`https://api.tvmaze.com/shows/${id}/cast`);
// 	let cast = castResponse.data.map((person) => {
// 		id: person.id;
// 		name: person.name;
// 		character: person.character.name;
// 		image: person.image ? person.image.medium : missingImageUrl;
// 	});
// 	return cast;
// }

// function populateCast(arr) {
// 	console.log('populateCast Run');
// 	const $castList = $('#cast-list');
// 	$castList.empty();

// 	for (let member of arr) {
// 		let $item = $(`<li>
//   ${member.name}
//   Character: ${member.character}
//   </li>`);
// 		$castList.append($item);
// 	}

// 	$('#episodes-area').show();
// }
