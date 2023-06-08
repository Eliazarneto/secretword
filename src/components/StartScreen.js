import './StartScreen.css';


//prop start game fazendo chamada a função do app.js, onde o onclick do botão nos leva para a pag 1, no caso, page do game
const StartScreen = ({ startGame }) => {
  return (
    <div className="start">
        <h1>Secret Word</h1>
        <p>Clique no botão abaixo para começar a jogar</p>
        <button onClick={startGame}>Começar o jogo</button>
    </div>
  )
}

export default StartScreen