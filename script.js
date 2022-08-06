const elements = {
    input: document.querySelector('.userInput'),
    siteInput: document.querySelector('.siteInput'),
    searchBtn: document.querySelector('.searchBtn'),
    mainTitle: document.querySelectorAll('.movieTitle'),
    mainPoster: document.getElementById('poster'),
    desc: document.getElementById('desc'),
    mainYear: document.querySelectorAll('.year'),
    runTime: document.querySelectorAll('.runTime'),
    director: document.getElementById('director'),
    ratingNumber: document.querySelectorAll('.ratingNumber'),
    ratingStars: document.getElementById('ratingStars'),
    gener: document.getElementById('gener'),
    actors: document.getElementById('actors'),
    bottom: document.getElementById('similars'),
    header: document.querySelector('.bg'),
    trailer: document.getElementById('trailer'),
    loader: document.querySelector('.loading'),
    loading: document.getElementById('loader')
}

var key = 'k_01hl7w2j'
// k_01hl7w2j
// k_wpyh766t
// k_es1p9nvs

var trailerLink

var loadData = async (value) => {
    try{
        elements.loader.style.visibility='visible'
        elements.loading.style.visibility='visible'
        let res = await axios.get(`https://imdb-api.com/en/API/Search/${key}/${value}`)
        let specifictMovieID = res.data.results[0]
        
        let specifictMovieExpanded = await axios.get(`https://imdb-api.com/en/API/Title/${key}/${specifictMovieID.id}`)
        updateElements(specifictMovieExpanded.data)
        let trailerInfo = await axios.get(`https://imdb-api.com/en/API/Trailer/${key}/${specifictMovieID.id}`)
        trailerLink = trailerInfo.data.link
        console.log(trailerInfo.data);


    }
    catch(err){
        console.log(err);
    }
}


var search = () => {
    let value = elements.input.value;
    loadData(value)
    elements.siteInput.value = elements.input.value;
    elements.siteInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchAgain()
        }
      });
}

var searchAgain = () => {
    let value = elements.siteInput.value;
    loadData(value)
}

var pageinput = document.querySelector(".userInput");
var page = document.querySelector('.page')
var site = document.querySelector('.site')
pageinput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      page.style.display = 'none'
      site.style.display = 'block'
      search()
    }
  });


  function backtopage(){
    page.style.display = 'block'
    site.style.display = 'none'
    elements.input.value = ''
}

elements.searchBtn.addEventListener('click', () => {
    if(elements.input.value =='') {
        alert('error')
        console.log('error');
    } else{
        searchAgain()
    }
})



var updateElements = (movie)=> {
    clearData()

    for (let title of elements.mainTitle) {
        title.innerHTML = movie.title;
    }

    for (let year of elements.mainYear) {
        year.innerHTML = `<i class="fa-regular fa-calendar"></i>${movie.year}`
    }

    for (let time of elements.runTime) {
        time.innerHTML = `<i class="fa-regular fa-clock"></i>${movie.runtimeStr}`
    }

    elements.mainPoster.src = movie.image;
    elements.director.innerHTML = movie.directors
    elements.header.style.backgroundImage = `linear-gradient(to bottom, #1f70d39e, #0b1941), url(${movie.image})`;
    elements.desc.innerHTML = movie.plot


    for (let rate of elements.ratingNumber) {
        rate.innerHTML = movie.imDbRating
    }

    

    if(movie.type == "TVSeries") {
        for (let time of elements.runTime) {
            time.innerHTML = `<i class="fa-solid fa-tv"></i>TV Series`
        }
    } else {
        elements.runTime.innerHTML = movie.runtimeStr
    }

    let geners = movie.genreList
    for (let i = 0; i < 3; i++) {
        elements.gener.innerHTML += `<li>${geners[i].key}</li>`    
    }

    let actors = movie.actorList
    for (let i = 0; i <= 6; i++) {
        elements.actors.innerHTML +=
        `
        <div class="col actor">
        <img src="${actors[i].image}">
        <div class="actorName">
            <h3>${actors[i].name}</h3>
            <p>${actors[i].asCharacter}</p>
        </div>
        </div>
        `    
    }


    trailer.addEventListener('click', () => {
        window.open(trailerLink);
    })

    let rating = movie.imDbRating
    for (let i = 0; i < Math.round(rating); i++) {
        elements.ratingStars.innerHTML += `<i class="fa-solid fa-star"></i>`
    }
    for (let i = 0; i < 10-Math.round(rating); i++) {
        elements.ratingStars.innerHTML += `<i class="fa-regular fa-star"></i>`
    }


    for(let i = 0; i<10; i++) {
        elements.bottom.innerHTML += 
        `
        <div class="col box movieBox">
        <img src="${movie.similars[i].image}">
        <h4>${movie.similars[i].title}</h4>
        <p><i class="fa-solid fa-star"></i> ${movie.similars[i].imDbRating}</p>
        </div>
        `
    }

    let similars = document.querySelectorAll('.movieBox')
    similars.forEach((box)=>{
        box.addEventListener('click', (e)=> {
            let newSearch;
            console.log(e.target.localName);
            if(e.target.localName == 'h4'){
                newSearch = e.target.innerText;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } 
            else {
                newSearch = e.target.parentElement.children[1].innerText;
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            loadData(newSearch);
        })
    })
}

var clearData = ()=> {
    elements.gener.innerHTML = ''
    elements.actors.innerHTML = ''
    elements.ratingStars.innerHTML = ''
    elements.bottom.innerHTML = ''
    elements.loader.style.visibility='hidden'
    elements.loading.style.visibility='hidden'
}
