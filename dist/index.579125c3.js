"use strict";
const refs = {
    resetBtn: document.querySelector(".reset"),
    game: document.querySelector(".game"),
    moves: document.querySelector(".moves")
};
refs.resetBtn.addEventListener("click", resetGame);
let isPaused = false;
let firstPick;
let win = 0;
let steps = 0;
async function loadPokemon() {
    const BASE_URL = "https://pokeapi.co/api/v2/pokemon/";
    //колода(object) в якій не будуть повторки(сам за цим дивиться)
    const randomIds = new Set();
    while(randomIds.size < 8){
        //беремо рандомні 8 числа до 150
        const randomNumber = Math.ceil(Math.random() * 150);
        randomIds.add(randomNumber);
    }
    console.log([
        ...randomIds
    ]);
    const pokePromises = [
        ...randomIds
    ].map((id)=>fetch(BASE_URL + id));
    const responses = await Promise.all(pokePromises);
    const pokemonsData = await Promise.all(responses.map((response)=>response.json()));
    // console.log(pokePromises)
    // console.log(responses)
    // console.log(dataArr)
    return pokemonsData;
}
function displayPokemon(pokemonsArr) {
    //отже ми їх 'розкидуємо', тепер вони рандомні
    pokemonsArr.sort(()=>0.5 - Math.random());
    renderMarkup(pokemonsArr);
}
async function resetGame() {
    const pokemonsArr = await loadPokemon();
    //мені треба по дві однакові картки, отже я роблю масив, 'вливаю' 8 покемонів та ще таких же 8, проблема, вони будуть не в рандомному порядку
    //кожні 2 картки будуть знаходитись в одних і тих же місцях, отже 
    displayPokemon([
        ...pokemonsArr,
        ...pokemonsArr
    ]);
    steps = 0;
    renderMoves(steps);
}
resetGame();
function renderMarkup(arr) {
    const markup = arr.map((pokemon)=>{
        return `<div class="card" onclick="cardClickHandler(event)" "
        data-pokename = "${pokemon.name}">
        <div class ="front"> </div>
        <div class ="back rotated">
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
         </div>
      </div>`;
    }).join("");
    refs.game.innerHTML = markup;
}
function cardClickHandler(event) {
    const pokemonCard = event.currentTarget;
    const [front, back] = getFrontAndBackCard(pokemonCard);
    //щоб не закривав картку знову, 
    // contains -> для 1 картки, клік - вже перевернув 'rotated'? - так - клік(по тій же картці) - не перевертай знову(вийди з фукнкції)
    // isPaused -> клік - true, - клік(в любу картку,якщо в ту саму contains) -> isPaused=true? - так - вийди з функції(ДЛЯ ВСІХ карток, ніяку інше не перевернещ)
    if (front.classList.contains("rotated") || isPaused) return;
    isPaused = true;
    // front.classList.toggle('rotated')
    // back.classList.toggle('rotated')
    rotateCards([
        front,
        back
    ]);
    if (!firstPick) {
        firstPick = pokemonCard;
        console.log("first", firstPick);
        //Клік-!firstPick - firstPick=pokemonCard та FALSE, отже я можу ще раз клікнути
        //клік - isPaused true? - ні(бо FALSE) - переверни,постав true - немає firstPick(if) - є -> else це буде 2 картка secondCard
        isPaused = false;
        console.log("paused false");
    } else {
        const secondCard = pokemonCard;
        const secondPokemonName = secondCard.dataset.pokename;
        const firstPokemonName = firstPick.dataset.pokename;
        //якщо не співпали
        if (firstPokemonName !== secondPokemonName) {
            steps += 1;
            const [firstFront, firstBack] = getFrontAndBackCard(firstPick);
            console.log(firstFront, firstBack);
            setTimeout(()=>{
                rotateCards([
                    front,
                    back,
                    firstFront,
                    firstBack
                ]);
                firstPick = null;
                isPaused = false;
                renderMoves(steps);
            }, 500);
        } else {
            steps += 1;
            isPaused = false;
            firstPick = null;
            win += 1;
            console.log(win);
            if (win === 8) setTimeout(()=>{
                alert("YOU WON!!!");
            }, 200);
        }
        console.log("steps: ", steps);
    }
}
function getFrontAndBackCard(card) {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    //без масиву було б return value is not iterable
    return [
        front,
        back
    ];
}
function rotateCards(cards) {
    cards.forEach((card)=>card.classList.toggle("rotated"));
}
function renderMoves(moves) {
    refs.moves.innerHTML = "";
    refs.moves.insertAdjacentHTML("beforeend", moves);
} //зробити рейтинг локал хост
 // дві картки -> 200 очків,рейтинг
 // коли всі, тоді сума очків / кількість ходів

//# sourceMappingURL=index.579125c3.js.map
