const RESULT_KEY = 'result'
const refs = {
    resetBtn: document.querySelector('.reset'),
     box: document.querySelector('.box'),
     moves: document.querySelector('.moves'),
     reset: document.querySelector('.reset'),
     score: document.querySelector('.score'),
     scoreInf: document.querySelector('.last-score')
}
refs.resetBtn.addEventListener('click',resetGame)

checkLocalStorage()

let steps = 0
let win = 0;
let isPaused = false;
let firstPick;


async function getCharacters(){
const BASE_URL = 'https://rickandmortyapi.com/api/character/'

const randomIds = new Set()
while(randomIds.size < 6){
    const randomNumber = Math.ceil(Math.random() * 90)
    randomIds.add(randomNumber)
} 
// console.log([...randomIds])
const charPromises = [...randomIds].map(id => fetch(BASE_URL + id))
const responses = await Promise.all(charPromises)
const charactersData = await Promise.all(responses.map(response => response.json()))

return charactersData
}
function displayCharacters(charactersArr){
     //отже ми їх 'розкидуємо', тепер вони рандомні
     charactersArr.sort(() => 0.5 - Math.random())
     renderMarkup(charactersArr)
}

async function resetGame(){
    if(win === 6 && steps !== 0){
        showContent(getResult())
        resetData()
        renderMoves(steps) 
        }   
        resetData()
        renderMoves(steps)
        steps = 0

    const charactersArr = await getCharacters()
    displayCharacters([...charactersArr,...charactersArr])
    
}
resetGame()
function renderMarkup(arr){
    const markup = arr.map(char =>{
        return `<div class="card" onclick="cardClickHandler(event)" "
        data-character = "${char.name}">
        <div class ="front"> </div>
        <div class ="back rotated">
        <img src="${char.image}" alt="${char.name}">
         </div>
      </div>` 
    }).join('')
refs.box.innerHTML = markup
}
function cardClickHandler(event){
    const pokemonCard = event.currentTarget
    const [front,back] = getFrontAndBackCard(pokemonCard)

    //щоб не закривав картку знову, 
    // contains -> для 1 картки, клік - вже перевернув 'rotated'? - так - клік(по тій же картці) - не перевертай знову(вийди з фукнкції)
    // isPaused -> клік - true, - клік(в любу картку,якщо в ту саму contains) -> isPaused=true? - так - вийди з функції(ДЛЯ ВСІХ карток, ніяку інше не перевернещ)
    
    if(front.classList.contains('rotated')|| isPaused){ return }
   
    isPaused = true;
    // front.classList.toggle('rotated')
    // back.classList.toggle('rotated')
    rotateCards([front,back])

    if(!firstPick){
        firstPick = pokemonCard;
        console.log('first', firstPick)
        //Клік-!firstPick - firstPick=pokemonCard та FALSE, отже я можу ще раз клікнути
        //клік - isPaused true? - ні(бо FALSE) - переверни,постав true - немає firstPick(if) - є -> else це буде 2 картка secondCard
        
        isPaused = false
        console.log('paused false')
    } else{
        const secondCard = pokemonCard

        const secondPokemonName = secondCard.dataset.character
        const firstPokemonName = firstPick.dataset.character
        //якщо не співпали
        if(firstPokemonName !== secondPokemonName){
            steps += 1
            const [firstFront,firstBack] = getFrontAndBackCard(firstPick)
            console.log(firstFront,firstBack)

        setTimeout(() =>{
            rotateCards([front,back,firstFront,firstBack])
            firstPick = null
            isPaused = false

        renderMoves(steps)    
            },500)

        }
        else{
        steps += 1
        renderMoves(steps)    

            isPaused = false
            firstPick = null
            win +=1

        if(win === 6){
            getResult()

        setTimeout(()=>{
            alert('YOU WON!!!')
        },200)
            }
        }
    }

   

}
function getFrontAndBackCard(card){
    const front = card.querySelector('.front')
    const back = card.querySelector('.back')
//без масиву було б return value is not iterable
return [front,back]
}
function rotateCards(cards){
    cards.forEach(card => card.classList.toggle('rotated'))
}
function renderMoves(moves){
    refs.moves.innerHTML = ''
    refs.moves.insertAdjacentHTML("beforeend",moves)
}
function getResult(){
    localStorage.setItem(RESULT_KEY,steps)
    const lastResult = localStorage.getItem(RESULT_KEY)
    return lastResult
}

function renderResult(result){
    refs.score.textContent = result
}
function showContent(result){
    refs.score.textContent = result
    refs.scoreInf.classList.remove('is-hidden')
}
function resetData(){
    steps = 0
    win = 0
}
function checkLocalStorage(){
    const result = localStorage.getItem(RESULT_KEY)
    if(Number(result) > 0){
        showContent(result)
    }
}