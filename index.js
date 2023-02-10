//establishg global var for menu buttons
let home = $('<button></button>');
let nextbtn = $('<button></button>');
let backbtn = $('<button></button>');
//establish/ create buttons for different consoles
let sonyArr = ['PS1','PS2','PS3','PS4','PS5'];
let microsoftArr= ['Xbox', 'Xbox 360', 'Xbox One', 'Xbox Series X/S'];
let nintendoArr = ['NES', 'SNES', 'N64', 'GameCube', 'Wii', 'Wii U', 'Switch'];
let nintendoHandheldArr = ['Game Boy', 'Game Boy Color', 'GBA', 'DS', '3DS'];
let sonyHandheldArr = ['PSP', 'PS Vita']
makeButtons4Consoles('Sony', sonyArr);
makeButtons4Consoles('Sony Portables', sonyHandheldArr);
makeButtons4Consoles('Microsoft', microsoftArr);
makeButtons4Consoles('Nintendo', nintendoArr);
makeButtons4Consoles('Nintendo Portables', nintendoHandheldArr);

let num = 1;
function getPlatformID(name){
    let objOfData = {
        'PS1': 27,
        'PS2': 15,
        'PS3': 16,
        'PS4': 18,
        'PS5': 187,
        'Xbox': 80,
        'Xbox 360': 14,
        'Xbox One': 1,
        'Xbox Series X/S': 186,
        'NES': 49,
        'SNES': 79,
        'N64': 83,
        'GameCube': 105,
        'Wii': 11,
        'Wii U': 10,
        'Switch': 7,
        'Game Boy': 26,
        'Game Boy Color': 43,
        'GBA': 24,
        'DS': 9,
        '3DS': 8,
        'PS Vita': 19,
        'PSP': 17
    }
    return objOfData[name];
}

//function to make dropdown buttons for consoles
function makeButtons4Consoles(company, names){
  let dropdown = $('<li class="nav-item dropdown">');
  let dropdownButton = $('<a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'+company+'</a>');
  let dropdownMenu = $('<div class="dropdown-menu" aria-labelledby="navbarDropdown">');
  for(let i = 0; i < names.length; i++){
    let dropdownItem = $('<a class="dropdown-item" href="#">' + names[i] + '</a>');
    dropdownItem.click(function(){
        let name = getPlatformID(names[i]);
        console.log(name);
        $.get('https://api.rawg.io/api/games?key=7c845feceec64c0b9c61a0954517c2bc&platforms='+name, (data) => {
        console.log(data);
        $('#results').empty();
        checkmenuSearch();
        makeBackbtn(name, 'platforms');
        makeNextbtn(name, 'platforms');
        showGames(data);
        })
    })
    dropdownMenu.append(dropdownItem);
    }
    dropdown.append(dropdownButton, dropdownMenu);
    $('#parentUL').append(dropdown); 
}
//search bar functionality
let button = $('#searchingbtn');
button.click(function(){
    let name = $('#searching').val()
    console.log(name);
    $.get('https://api.rawg.io/api/games?key=7c845feceec64c0b9c61a0954517c2bc&search='+name, (data) => {
    console.log(data);
    $('#results').empty();
    checkmenuSearch();
    makeBackbtn(name, 'search');
    makeNextbtn(name, 'search');
    $("#searching").val("");
    showGames(data)
  })
})
//allow user to hit enter instead of just the button
let box = $('#searching');
box.keypress(function(event){
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13'){
        let name = $('#searching').val()
        console.log(name);
        $.get('https://api.rawg.io/api/games?key=7c845feceec64c0b9c61a0954517c2bc&search='+name, (data) => {
        console.log(data);
        $('#results').empty();
        checkmenuSearch();
        makeBackbtn(name, 'search');
        makeNextbtn(name, 'search');
        $("#searching").val("");
        showGames(data);
    })
    }
})

//click function for home to clear page
let homebtn = $('#homebtn');
homebtn.click(function(){
    $('#results').empty();
    $(nextbtn).remove();
    $(backbtn).remove();
    $("#searching").val("");
})

//function to show games
function showGames(data){
    for(let i = 0; i < data.results.length; i++){
        let topParent = $("#results");
        let parent = $('<div class="card-columns" id="parent"></div>');
        $(topParent).append(parent);
        let currentGame = data.results[i];
        console.log(currentGame);
        let span = $('<div class="card" style="width: 41rem;" </div>');
        $(parent).append(span);
        //images
        let imageLocation = currentGame.background_image;
        let imageTag = $('<img class="card-img-top" src='+ imageLocation+'>');
        $(span).append(imageTag); 
        //card body creation
        let cardBody = $('<div class="card-body"></div>');
        $(span).append(cardBody);
        //title
        let title = $('<h4 class="card-title">'+ currentGame.name + '</h4>');
        $(cardBody).append(title);
        //genres
        let genreText = currentGame.genres;
        let genreNames = [];
        for(let j = 0; j <genreText.length; j++){
            genreNames.push(genreText[j].name);
        }
        genreText = genreNames.join(', ');
        let genre = $('<h5 class="card-text">'+ genreText+'</h5>');
        $(cardBody).append(genre);
        //esrb
        let esrb = $('<h6 class="card-text"></h6>');
        if(currentGame.esrb_rating){
            let esrbRatting = currentGame.esrb_rating.name;
            $(esrb).text('ESRB:'+esrbRatting);    
        }else{
            $(esrb).text('Has no ESRB ratting');
        } 
        $(cardBody).append(esrb);
        let linkbtn = $('<a class="btn btn-primary">'+ "IGN LINK"+ '</a>')
        $(cardBody.append(linkbtn))
        $(linkbtn).click(function(){
            let tempName = currentGame.name;
            let temoName = tempName.replace(/\s/g, '-');
            temoName = temoName.replace(':', '');
            temoName = temoName.replace(',', '');
            temoName = temoName.replace(/[']/g, "");
            temoName = temoName.replace(/["]/g, "");
            temoName = temoName.toLowerCase();
            window.open('https://www.ign.com/games/'+temoName, '_blank');    
        })
    }
} 

//back button
function makeBackbtn(name, search){
    $(backbtn).addClass('#backbtn');
    $(backbtn).text('BACK');
    $('#user-section').append(backbtn);
    backbtn.click(function(){
        num-=1;
        $.get('https://api.rawg.io/api/games?key=7c845feceec64c0b9c61a0954517c2bc&page='+num+'&'+search+'='+name, (data)=>{
            $('#results').empty();
            showGames(data);
        })
    })
}    
    //next results button
function makeNextbtn(name, search){
    $(nextbtn).addClass('nextbtn');
    $(nextbtn).text('NEXT');
    $('#user-section').append(nextbtn);
    nextbtn.click(function(){
        num+=1;
        $.get('https://api.rawg.io/api/games?key=7c845feceec64c0b9c61a0954517c2bc&page='+num+'&'+search+'='+name, (data)=>{
            $('#results').empty();
            showGames(data);
        })
    })
}
function checkmenuSearch(){
        if('#backbtn'){
        $(backbtn).remove();
        }
        if('#nextbtn'){
        $(nextbtn).remove();
        }  
}