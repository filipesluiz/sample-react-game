import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  
   renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
  }
  //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  renderRow(seed) {
    let row = [];
    for(let i = 0; i < 3; i++){
      row.push(this.renderSquare(i+seed))
    }
    return row;
  }

  render() {
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    let rows = [];

    for(let i = 0; i < 9; i += 3){
      rows.push(<div className="board-row">{this.renderRow(i)}</div>)
    }
    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      colRow: null,
      orderDesc:false
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares:squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      colRow: calculateColRow(i) // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
    });
  }
  

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2)  === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((obj, index) => {
      // &&&&& task = 4 
      let orderIndex = this.state.orderDesc ? history.length - 1 - index : index;
      const desc = orderIndex ? 'Go to move #' + orderIndex : 'Go to move start';
      const active = this.state.stepNumber === orderIndex;
      return (
        <li key={index}>
          <button 
            //&&&&&&&&&&&&&&&&&&&&
            style={{fontWeight: active ? 'bold': '', backgroundColor: active ? 'lightblue': ''}} 
            onClick={() => this.jumpTo(orderIndex)}>{desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>{this.state.colRow}</div> {/*&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*/}
          {/* &&&&& task = 4*/}
          <ol>
             <button onClick={() => this.setState({orderDesc: !this.state.orderDesc})}>
               Order by: {this.state.orderDesc ? 'DESC' : 'ASC'} 
               </button> 
          </ol>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
function calculateColRow(i){
  let col = i % 3 + 1;
  let row = parseInt(i / 3) + 1;
  return `Col = ${col} and Row = ${row}`;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
