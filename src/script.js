const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('.search-input');
const form = document.querySelector('.search-form');
const more = document.querySelector('.more');
const main = document.querySelector('main');
const up = document.querySelector('.back-to-top')
const down = document.querySelector('.back-to-bottom')
const resultDiv = document.querySelector('.result');
const subtmitBtn = document.querySelector('.submit-btn');
const deleteBtn = document.querySelector('.delete-btn');
const refresh = document.querySelector('.refresh');
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;
let totalResults = 0;

searchInput.addEventListener('input', updateInput)
form.addEventListener('submit', (e) => {
    e.preventDefault();
    search();
})
more.addEventListener('click', loadMore)

up.addEventListener('click', (e) =>{
    window.scrollTo(0,0);
})

down.addEventListener('click', (e) =>{
    window.scrollTo(0, document.body.scrollHeight);
})

subtmitBtn.addEventListener('click', search)
deleteBtn.addEventListener('click', ()=>{
    searchInput.value = "";
    searchInput.focus();
})

refresh.addEventListener('click', () => {
    searchInput.value = "";
    searchInput.focus();
    curatedPhotos();
})

function updateInput(e){
    searchValue = e.target.value;
}

async function fetchAPI(url){
    const dataFetch = await fetch(url, {
        method: "GET",
        headers: {
            Accept: 'Application/JSON',
            Authorization: key
        }
    })
    const data = await dataFetch.json();
    return data;
}

function generatePics(data){
    if(data.total_results === 0){
        if(!document.querySelector('.no-results')){
            if(more.classList.contains('active')){
                more.classList.remove('active')
            }
            const galleryImg = document.createElement('div');
            galleryImg.classList.add('no-results');
            galleryImg.innerHTML = `
            <p>No results for '${currentSearch}'</p>`;
            main.appendChild(galleryImg);
        }
    }else{
        resultDiv.innerHTML = "";
        const results = document.createElement('div');
        results.innerHTML = `${data.total_results} results`;
        resultDiv.appendChild(results)
        data.photos.forEach(photo =>{
            const galleryImg = document.createElement('div');
            galleryImg.classList.add('gallery-img');
            galleryImg.innerHTML = `
            <a href=${photo.url} target="_blank">
            <div class="span"><img src=${photo.src.large} alt=${photo.alt}></div></img>
            </a>
            <div class="gallery-info">
            <span>Photographer: <a href=${photo.photographer_url} target="_blank">${photo.photographer}</a></span>
            <a href=${photo.src.original} target="_blank">Download</a>
            </div>`;
            gallery.appendChild(galleryImg);
        })
        if(!more.classList.contains('active')){
            more.classList.add('active');
        }
        totalResults += 15;
        if(totalResults > data.total_results){
            if(more.classList.contains('active')){
                more.classList.remove('active')
            }
            
        }
    }
}

async function curatedPhotos(){
    clear();
    let num = Math.floor(Math.random() * (8000/15));
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${num}`
    const data = await fetchAPI(fetchLink);
    generatePics(data);
}

async function searchPhotos(query){
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${query}&per_page=15`
    const data = await fetchAPI(fetchLink);
    generatePics(data);
}

async function loadMore(){
    page++;
    if(currentSearch){
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}&per_page=15&page=${page}`
    }else{
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`
    }
    const data = await fetchAPI(fetchLink)
    generatePics(data)
}

function search(){
    page = 1;
    if(searchInput.value !== ""){
        currentSearch = searchInput.value;
        searchPhotos(searchInput.value)
    }else{
        curatedPhotos();
    }
}

function clear(){
    gallery.innerHTML = "";
    resultDiv.innerHTML = "";
    totalResults = 0;
    const noResult = document.querySelector('.no-results');
    if(noResult){
        noResult.remove();
        if(more.classList.contains('active')){
            more.classList.remove('active')
        }
    }
}

curatedPhotos();