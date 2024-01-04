document.addEventListener("load", () => {
    updateTask();
  });
  /**
   * Get the DOM elements for toggle button, sidebar, flex-box, searchbar, dbObjectFavList, and dbLastInput
   */
  
  const toggleButton = document.getElementById("toggle-sidebar");
  const sidebar = document.getElementById("sidebar");
  const flexBox = document.getElementById("flex-box");
  const searchbar = document.getElementById("search-bar");
  
  /**
   * Check and initialize the local storage items for favorite list
   */
  
  const dbObjectFavList = "favMovieList";
  if (localStorage.getItem(dbObjectFavList) == null) {
    localStorage.setItem(dbObjectFavList, JSON.stringify([]));
  }
  
  /**
   * Update the task counter with the current number of items in the favorite list.
   */
  function updateTask() {
    const favCounter = document.getElementById("total-counter");
    const db = JSON.parse(localStorage.getItem(dbObjectFavList));
    if (favCounter.innerText != null) {
      favCounter.innerText = db.length;
    }
  }
  
  function isFav(list, id) {
    let res = false;
    for (let i = 0; i < list.length; i++) {
      if (id == list[i]) {
        res = true;
      }
    }
    return res;
  }
  
  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + "..." : str;
  }
  

  function generateOneCharString() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  toggleButton.addEventListener("click", function () {
    showFavMovieList();
    sidebar.classList.toggle("show");
    flexBox.classList.toggle("shrink");
  });
   
  flexBox.onscroll = function () {
    if (flexBox.scrollTop > searchbar.offsetTop) {
      searchbar.classList.add("fixed");
    } else {
      searchbar.classList.remove("fixed");
    }
  };

  const fetchMoviesFromApi = async (url, value) => {
    const response = await fetch(`${url + value}`);
    const movies = await response.json();
    return movies;
  };
  
  async function showMovieList() {
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    const inputValue = document.getElementById("search-input").value;
    const url = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
    const moviesData = await fetchMoviesFromApi(url, inputValue);
    let html = "";
    if (moviesData.Search) {
      html = moviesData.Search.map((element) => {
        return `
  
         
            <div class="card">
            <div class="card-top"  onclick="showMovieDetails('${
              element.imdbID
            }', '${inputValue}')">
                <div class="movie-poster" >
                <img src="${
                  element.Poster == "N/A" ? "backdrop.jpg" : element.Poster
                }" alt="">
                </div>
                <div>
                    <div class="movie-name">
                        ${element.Title}
                    </div>
                    <div class="movie-year">
                        (  ${element.Year})

                        <span class="button" onclick="showMovieDetails('${
                            element.imdbID
                        }', '${inputValue}')">Know More</span>
                        
                    </div>
                </div>
            </div>
            <div class="card-bottom">
                <div class="like">
                <Strong> Add to Favoruite: </Strong>
                <i class="fa-solid fa-star ${
                  isFav(list, element.imdbID) ? "active" : ""
                } " onclick="addRemoveToFavList('${element.imdbID}')"></i>
                
                </div>
                
            </div>
        </div>
            `;
      }).join("");
      document.getElementById("cards-holder").innerHTML = html;
    }
  }
  
  function addRemoveToFavList(id) {
    const detailsPageLikeBtn = document.getElementById("like-button");
    let db = JSON.parse(localStorage.getItem(dbObjectFavList));
    console.log("before: ", db);
    let ifExist = false;
    for (let i = 0; i < db.length; i++) {
      if (id == db[i]) {
        ifExist = true;
      }
    }
    if (ifExist) {
      db.splice(db.indexOf(id), 1);
    } else {
      db.push(id);
    }
  
    localStorage.setItem(dbObjectFavList, JSON.stringify(db));
    if (detailsPageLikeBtn != null) {
      detailsPageLikeBtn.innerHTML = isFav(db, id)
        ? "Remove From Favourite"
        : "Add To Favourite";
    }
  
    console.log("After:", db);
    showMovieList();
    showFavMovieList();
    updateTask();
  }
   
  async function showMovieDetails(itemId, searchInput) {
    console.log("searchInput:...............", searchInput);
    const list = JSON.parse(localStorage.getItem(dbObjectFavList));
    flexBox.scrollTo({ top: 0, behavior: "smooth" });
    const url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
    const searchUrl = "https://www.omdbapi.com/?apikey=7b6b319d&s=";
    const movieList = await fetchMoviesFromApi(searchUrl, searchInput);
    console.log("movieslist:..........", movieList);
    let html = "";
    const movieDetails = await fetchMoviesFromApi(url, itemId);
    if (movieDetails) {
      html = `
        <div class="container remove-top-margin">
  
            <div class="header hide">
                <div class="title">
                    Let's Eat Something New
                </div>
            </div>
            <div class="fixed" id="search-bar">
                <div class="icon">
                    <i class="fa-solid fa-search "></i>
                </div>
                <div class="new-search-input">
                    <form onkeyup="showMovieList()">
                        <input id="search-input" type="text" placeholder="Search hear...." />
                    </form>
                </div>
            </div>
        </div>
        <div class="item-details">
        <div class="item-details-left">
        <img src="${
          movieDetails.Poster == "N/A" ? "backdrop.jpg" : movieDetails.Poster
        }" alt="">
    </div>
    <div class="item-details-right">
        <div class="item-name">
            <strong>Movie Name: </strong>
            <span class="item-text">
            ${movieDetails.Title}
            </span>
         </div>
        <div class="movie-category">
            <strong>Genre: </strong>
            <span class="item-text">
            ${movieDetails.Genre}
            </span>
        </div>
        <div class="movie-info">
            <strong>Actors: </strong>
            <span class="item-text">
            ${movieDetails.Actors}
            </span>
        </div>
  
        <div class="movie-info">
        <strong>Directors: </strong>
        <span class="item-text">
        ${movieDetails.Director}
        </span>
    </div>
        <div class="movie-plot">
            <strong>Plot: </strong>
            <span class="item-text">
            ${movieDetails.Plot}
            </span>
        </div>
        <div class="movie-rating">
            <strong>Ratings: </strong>
            <span class="item-text"> 
            ${movieDetails.Ratings[0].Value}
          
            </span>
            <div id="like-button" onclick="addRemoveToFavList('${
              movieDetails.imdbID
            }')"> 
             ${
               isFav(list, movieDetails.imdbID)
                 ? "Remove From Favourite"
                 : "Add To Favourite"
             } </div>
        </div>
    </div>
 </div> 
        <div class="card-name">
             Related Items
        </div>
     <div id="cards-holder" class=" remove-top-margin ">`;
    }
    if (movieList.Search) {
      html += movieList.Search.map((element) => {
        return `       
            <div class="card">
                <div class="card-top"  onclick="showMovieDetails('${
                  element.imdbID
                }', '${searchInput}')">
                    <div class="movie-poster" >
                    <img src="${
                      element.Poster == "N/A" ? "backdrop.jpg" : element.Poster
                    }" alt="">
                    </div>
                    <div class="movie-name">
                        ${element.Title}
                    </div>
                    <div class="movie-year">
                        ${element.Year}
                        <span class="button" onclick="showMovieDetails('${
                          element.imdbID
                        }', '${searchInput}')">Know More</span>
                    </div>
                </div>
                <div class="card-bottom">
                <div class="like">
                <Strong> Add to Favoruite: </Strong>
                <i class="fa-solid fa-star ${
                  isFav(list, element.imdbID) ? "active" : ""
                } " onclick="addRemoveToFavList('${element.imdbID}')"></i>
                
                </div>
                
            </div>
            </div>
        `;
      }).join("");
    }
  
    html = html + "</div>";
  
    document.getElementById("flex-box").innerHTML = html;
  }
  
  async function showFavMovieList() {
    let favList = JSON.parse(localStorage.getItem(dbObjectFavList));
    let url = "https://www.omdbapi.com/?apikey=7b6b319d&i=";
    let html = "";
  
    if (favList.length == 0) {
      html = `<div class="fav-item nothing"> <h1> 
        Nothing To Show.....</h1> </div>`;
    } else {
      for (let i = 0; i < favList.length; i++) {
        const favmovieList = await fetchMoviesFromApi(url, favList[i]);
        if (favmovieList) {
          let element = favmovieList;
          html += `
                <div class="fav-item">

                <div class="fav-item-photo"  onclick="showMovieDetails('${
                  element.imdbID
                }','arjun')">
                <img src="${
                  element.Poster == "N/A" ? "backdrop.jpg" : element.Poster
                }" alt="">
                </div>
                <div class="fav-item-details">
                    <div class="fav-item-name">
                        <strong>Name: </strong>
                        <span class="fav-item-text">
                        ${truncate(element.Title, 20)}
                        </span>
                    </div>
                    <div id="fav-like-button" onclick="addRemoveToFavList('${
                      element.imdbID
                    }')">
                    <i class="fas fa-trash"></i>
                    </div>
  
                </div>
  
            </div>               
                `;
        }
      }
    }
    document.getElementById("fav").innerHTML = html;
  }
  
  updateTask();
  /************************************** End Of the Code ****************************************** */
  