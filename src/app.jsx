import React from "react"
import { languages } from "./langs"
import { clsx } from "clsx"
import { getFarewellText , randomWord } from "./tool"
import {useWindowSize} from "react-use"
import Confetti from "react-confetti"

function App() {

  const [currentWord,setcurrentWord] = React.useState(() => randomWord())
  const [userguess,setuserguess] = React.useState([])


  const wrongGuessCount = userguess.filter(letter => !currentWord.includes(letter)).length
  const isGameWon = currentWord.split("").every(letter => userguess.includes(letter))
  const isGameLost = wrongGuessCount >= languages.length - 1  
  const isGameOver = isGameWon || isGameLost
  const lastuserGuest = userguess.at(-1)
  const numGuessesLeft = languages.length - 1 
  const {width , height } = useWindowSize()

  console.log(wrongGuessCount)
  function Addletter(letter){
    setuserguess(prev => userguess.includes(letter) ? prev : [...prev,letter] )
  }
  function gameMessage(){
    if (!isGameOver) {
      if (!currentWord.includes(lastuserGuest) && userguess.length > 0) {
        const num = wrongGuessCount === 0 ? 0 : wrongGuessCount - 1
        return(
          <h1>{getFarewellText(languages[num].name)}</h1>
        )
      }else{   
        return(null)
      }
    }
    if(isGameWon){
      return(
                <>
                  <h1>You won!</h1>
                  <p>Well done! 🎉</p>
                </> )}
    if (isGameLost) {
      return(
                <>
                  <h1>Game over!</h1>
                  <p>You lose! Better start learning Assembly 😭 
                    The Secret word was {currentWord}
                  </p>

                </> )}
  }
  function resetGame(){
    setcurrentWord(randomWord)
    setuserguess([])
  }


  console.log(userguess)
  const alphabet = "abcdefghijklmnopqrstuvwxyz"
  const keyboardElements = alphabet.split("").map(letter =>
  (
  <button 
  onClick={() => Addletter(letter)} 
  key={letter}
  disabled={isGameOver}
  aria-disabled={userguess.includes(letter)}
  aria-label={`letter ${letter}`}
  className={clsx('normal',
    userguess.includes(letter) && currentWord.split("").includes(letter) && "correct" ,
    userguess.includes(letter) && !currentWord.split("").includes(letter) && "false"
  )

  }
  >
  {letter.toUpperCase()}
  </button>))

  const langs = languages.map((lang,index) => {
        
        return(<span 
          className={clsx('lang',
            wrongGuessCount >= index + 1 && 'dead'
          )} 
          style={{backgroundColor:lang.backgroundColor,color:lang.color}} 
          key={lang.name}>{lang.name}</span>)})
   
  const secret = currentWord.split("").map((letter,index) => {
          if (isGameLost) {
          return(<span key={index} className={clsx('loseReveal', userguess.includes(letter) && 'rights')}>
            {letter.toUpperCase()}
            </span>)
          }else{
            return(<span key={index} className="blanks">
            {userguess.includes(letter) ? letter.toUpperCase(): ""}
            </span>)}}
            )
          

  return (
    <>
    <header>
      <h1>Assembly: Endgame</h1>
      <p>Guess the word in under 8 attempts to keep the programming world safe from Assembly!</p>
    </header>
    <section aria-live="polite" 
    className={
      clsx("gamestatus",
      (isGameWon && "won"),
      (isGameLost && "lost"),
      (!isGameOver && !currentWord.includes(lastuserGuest) && userguess.length > 0 && "interact" ))}>
      {gameMessage()}
    </section>
    
    <main>
      {isGameWon && <Confetti width={width} height={height}/>}
    <div className="langs-container">
      {langs}
    </div>
    <div className="secret">
      {secret}
    </div>


          {/* Combined visually-hidden aria-live region for status updates */ }
    <section className="sr-only" aria-live="polite" role="status">
      <p>
        {currentWord.includes(lastuserGuest) ? 
        `Correct! the letter ${lastuserGuest} is in the word .`:
        `Sorry , the letter ${lastuserGuest} is not in the word .`
        }
        You have {numGuessesLeft} attempts left . 
      </p>
      <p>
      {currentWord.split("").map(letter => userguess.includes(letter) ? letter : "blank").join(" ")}
      </p>
    </section>



    <div className="alphabets">
      {keyboardElements}
    </div>
    {
    isGameOver ?
    <button
    onClick={resetGame} 
    className="newgame">
      New Game
      </button>
    : ""
      }
    
    </main>
      </>
  )
}
export default App