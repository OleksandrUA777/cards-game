const RESULT_KEY = "result";
const refs = {
    resetBtn: document.querySelector(".reset"),
    box: document.querySelector(".box"),
    moves: document.querySelector(".moves"),
    reset: document.querySelector(".reset"),
    score: document.querySelector(".score"),
    scoreInf: document.querySelector(".last-score")
};
refs.resetBtn.addEventListener("click", resetGame);
let isPaused = false;
let firstPick;
let win = 0;
let steps = 0;
async function getCharacters() {
    const BASE_URL = "https://rickandmortyapi.com/api/character/";
    const randomIds = new Set();
    while(randomIds.size < 8){
        const randomNumber = Math.ceil(Math.random() * 200);
        randomIds.add(randomNumber);
    }
    // console.log([...randomIds])
    const charPromises = [
        ...randomIds
    ].map((id)=>fetch(BASE_URL + id));
    const responses = await Promise.all(charPromises);
    const charactersData = await Promise.all(responses.map((response)=>response.json()));
    return charactersData;
}
function displayCharacters(charactersArr) {
    //отже ми їх 'розкидуємо', тепер вони рандомні
    charactersArr.sort(()=>0.5 - Math.random());
    renderMarkup(charactersArr);
}
async function resetGame() {
    if (win === 8 && steps !== 0) {
        refs.score.textContent = getResult();
        steps = 0;
        win = 0;
        renderMoves(steps);
        refs.scoreInf.classList.remove("is-hidden");
    }
    win = 0;
    steps = 0;
    renderMoves(steps);
    const charactersArr = await getCharacters();
    //мені треба по дві однакові картки, отже я роблю масив, 'вливаю' 8 покемонів та ще таких же 8, проблема, вони будуть не в рандомному порядку
    //кожні 2 картки будуть знаходитись в одних і тих же місцях, отже 
    displayCharacters([
        ...charactersArr,
        ...charactersArr
    ]);
    steps = 0;
// renderMoves(steps)
}
resetGame();
function renderMarkup(arr) {
    const markup = arr.map((char)=>{
        return `<div class="card" onclick="cardClickHandler(event)" "
        data-character = "${char.name}">
        <div class ="front"> </div>
        <div class ="back rotated">
        <img src="${char.image}" alt="${char.name}">
         </div>
      </div>`;
    }).join("");
    refs.box.innerHTML = markup;
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
        const secondPokemonName = secondCard.dataset.character;
        const firstPokemonName = firstPick.dataset.character;
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
            renderMoves(steps);
            isPaused = false;
            firstPick = null;
            win += 1;
            if (win === 8) {
                getResult();
                setTimeout(()=>{
                    alert("YOU WON!!!");
                }, 200);
            }
        }
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
}
function getResult() {
    localStorage.setItem(RESULT_KEY, steps);
    const lastResult = localStorage.getItem(RESULT_KEY);
    // renderResult(lastResult)
    return lastResult;
}
function renderResult(result) {
    refs.score.textContent = result;
}

//# sourceMappingURL=index.9df44f3e.js.map
