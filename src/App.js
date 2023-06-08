//css
import './App.css';

//REACT
import { useCallback, useEffect, useState } from "react"

// Data

import {wordsList} from "./data/words";

//Components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

//páginas do jogo, inicio, jogo em si e game over, todas criadas dentro de component
const stages = [
  {id: 1, name: "start"},
  {id: 2, name: "game"},
  {id: 3, name: "end"}
]

const guessesQty = 3

function App() {
  //linha responsavel por iniciar o jogo na tela 0, que seria a de start
  const [gameStage, setGameStage] = useState(stages[0].name);

  //import das palvras do jogo
  const [words] = useState(wordsList)

  //variaveis criadas para selecionar letra, categoria, e palavras, as letras serão um array, porque será criada uma "lista", quebrando a palavra letra por letra.
  const [pickedWord, setPickedWord] = useState ("");
  const [pickedCategory, setPickedCategory] = useState ("");
  const [letters, setLetters] = useState([]);

  //variaveis das letras adivinhadas
  const [guessedLetters, setGuessedLetters] = useState ([]);
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(guessesQty)
  const [score, setScore] = useState(50)
  
  //função que selecionada palavra e categoria aleatoria - mathfloor serve para arredondar, math random seleciona aleatoriamente
  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]


    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  }, [words])
 
  //Função que faz com que ao clicar no botao começar jogo, seja mandado para a tela do jogo 
  const startGame = useCallback(() => {
    //clear all letter
    clearLetterStates();
    // pick word and pick category 
    const { word, category } = pickWordAndCategory();

    //create array of letter = separando as letras da palavra
    let wordLetters = word.split("")
    //faz com que as palavras sejam padronizadas em minusculas
    wordLetters = wordLetters.map((l) => l.toLowerCase())


    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  //Função que irá processar a letra do input - process the letter input
  const verifyLetter = (letter) => {
    const normalizedLetter = letter.toLowerCase()

    // check if letter has already been utilized
    if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
      return;
    }

    // push guessed letter or remove a guess
    if (letters.includes(normalizedLetter)) {
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter,
      ])
    } else {
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter,

        setGuesses((actualGuesses) => actualGuesses - 1)
      ])
    }

    
  };


  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }



  //useEffect fica monitorando o guesses, que está no fim da function
  //check if guesses ended
  useEffect(() => {
    if (guesses <= 0) {
      //reset all states and end the game
      clearLetterStates()

      setGameStage(stages[2].name)
    }
  }, [guesses])

  //check win condition
  useEffect(() => {

    const uniqueLetters = [...new Set(letters)]

    //win conidtio
    if(guessedLetters.length === uniqueLetters.length) {
      //add score

      setScore((actualScore) => actualScore +=100)

      //reestart game with new word
      startGame();
    }

  }, [guessedLetters, letters, startGame])

  // Restart do game (função mais complexa porque ela reseta todos os atributos)
  const retry = () => {
    setScore(0);
    setGuesses(guessesQty)

    setGameStage(stages[0].name)
  }

  return (
    <div className="App">

      {/* Telas do jogo, quando estiver em 'tal' sera exibida o component indicado  */}
      {/* função startGame com prop tbm dentro da start screen*/}
      {gameStage === 'start' && <StartScreen startGame={startGame} />}
      {/* Função verifyletter funcionando exatamente como a start, nos levando para a terceira pag do jogo */}
      {/* linkar as variaveis do game aqui  */}
      {gameStage === 'game' && <Game verifyLetter={verifyLetter} pickedWord={pickedWord} pickedCategory={pickedCategory} letters={letters} guessedLetters={guessedLetters} wrongLetters={wrongLetters} guesses={guesses} score={score}/>}
      {/* Retry nos leva a reinicialização do jogo */}
      {gameStage === 'end' && <GameOver retry={retry} score={score}/>}

    </div>
  );
}

export default App;
