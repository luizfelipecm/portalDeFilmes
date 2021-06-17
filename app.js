const baseUrlPhoto = 'https://www.themoviedb.org/t/p/w220_and_h330_face'
// Selecting elements from the DOM
const buttonElement = document.querySelector('#search');
const inputElement = document.querySelector('#inputValue');
const movieSearchable = document.querySelector('#movies-searchable');
const moviesContainer = document.querySelector('#movies-container');

/* <div class = "movie">
        <section class = "section">
            <img
                src = "https://image.tmdb.org/t/p/w500/rZd0y1X1Gw4t5B3f01Qzj8DYY66.jpg"
                alt = ""
                data-movie-id="557"
            />
            <img
                src = "https://image.tmdb.org/t/p/w500/rjbNpRMoVvqHmhmksbokcyCr7wn.jpg"
                alt = ""
                data-movie-id="429617"
            />
        </section>
        <div class = "content">
            <p id = "content-close">X</p>
        </div>
    </div>
*/

function movieSection(movies){
    const section = document.createElement('section');
    section.classList = 'section';

    movies.map((movie) => {
       if(movie.poster_path){
            const img = document.createElement('img');
            img.src = IMAGE_URL + movie.poster_path;
            img.setAttribute('data-movie-id', movie.id);
            img.classList.add('banners');

            section.appendChild(img);
       }
    })
    return section;
}


function createMovieContainer(movies, title = '') {
    const movieElement = document.createElement('div');
    movieElement.setAttribute('class', 'movie');

    const header = document.createElement('h2');
    header.innerHTML = title;

    const content = document.createElement('div');
    content.classList = 'content';

    const contentClose = `<p id="content-close">X</p>`;

    content.innerHTML = contentClose;

    const section = movieSection(movies);

    movieElement.appendChild(header);
    movieElement.appendChild(section);
    movieElement.appendChild(content);
    return movieElement;
}

function renderSearchMovies(data){
    // data.results []
    movieSearchable.innerHTML = '';
    const movies = data.results;
    const movieBlock = createMovieContainer(movies);
    movieSearchable.appendChild(movieBlock);
}

function renderMovies(data){
    const movies = data.results;
    const movieBlock = createMovieContainer(movies, this.title);
    moviesContainer.appendChild(movieBlock);
}

function handleError(error){
    console.log('Error: ', error);
}


buttonElement.onclick = function(event){
    event.preventDefault();
    const value = inputElement.value;
    searchMovie(value);

    inputElement.value = '';
    console.log('Value: ', value);
}

function createIframe(video){
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${video.key}`;
    iframe.width = 360;
    iframe.height = 315;
    iframe.allowFullscreen = true;

    return iframe;
}

function createVideoTemplate(data, content){
    // TODO
    // display movie videos
    content.innerHTML = '<p id="content-close">X</p>'
    console.log('Videos: ', data);
    const videos = data.results;
    const length = videos.length > 4 ? 4 : videos.length;
    const iframeContainer = document.createElement('div');

    for(let i = 0; i < length; i++){
        const video = videos[i]; // video
        const iframe = createIframe(video);
        iframeContainer.appendChild(iframe);
        content.appendChild(iframeContainer);
    }
}

function createVideoInfos(data, content){
    // TODO
    // display movie videos
    content.innerHTML = '<p id="content-close">X</p>'
    console.log('Videos: ', data);

    const iframeContainer = document.createElement('div');
    const {title, overview, poster_path, homepage, vote_average} = data;
    const posterImg = `<img src="${baseUrlPhoto}${poster_path}">`
    content.insertAdjacentHTML( 'beforeend', posterImg);
    content.insertAdjacentHTML( 'beforeend', `<p class="paragrafoTitle">${title}</p>`);
    content.insertAdjacentHTML( 'beforeend', `<p class="paragrafoOverview"><strong>Sinopse:</strong> ${overview}</p>`);
    content.insertAdjacentHTML( 'beforeend', `<p class="paragrafoAvaliacao"><strong>Avaliação:</strong> ${vote_average}</p>`);
    content.insertAdjacentHTML( 'beforeend', `<a href="${homepage}" target="_blank" class="paragrafoHomepage">${homepage}</a>`);

    // for(let i = 0; i < length; i++){
    //     const video = videos[i]; // video
    //     const iframe = createIframe(video);
    //     iframeContainer.appendChild(iframe);
    //     content.appendChild(iframeContainer);
    // }
}


//Event Delegation
document.onclick = function(event){

    const target = event.target;
    console.log(target.classList[0]);

    if(target.tagName.toLowerCase() === 'img' && target.classList[0] == 'banners'){
        const movieId = target.dataset.movieId;
        console.log('Movie ID: ', movieId);
        const section = event.target.parentElement; // section
        const content = section.nextElementSibling; // content
        content.classList.add('content-display');

        // const path = `/movie/${movieId}/videos`;
        // const url = generateUrl(path);
        // // fetch movie videos
        // fetch(url)
        //     .then((res) => res.json())
        //     .then((data) => createVideoTemplate(data, content))
        //     .catch((error) => {
        //         console.log('Error: ', error);
        //     });

        const path = `/movie/${movieId}`;
        const url = generateUrl(path);

        fetch(url)
            .then((res) => res.json())
            .then((data) => createVideoInfos(data, content))
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    if(target.id === 'content-close'){
        const content = target.parentElement;
        content.classList.remove('content-display');

    }
}



getUpcomingMovies();

getTopRatedMovies();

getPopularMovies();