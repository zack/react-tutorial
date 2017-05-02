import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const highlightClass = props.winningSquares.includes(props.number) ? 'highlight' : '';

  return (
    <button className={`square ${highlightClass}`} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square value={this.props.squares[i]}
              onClick={() => this.props.onClick(i)}
              key={i}
              number={i}
              winningSquares={this.props.winningSquares}
      />
    );
  }

  render() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let buttons = [];

      for (let j = 0; j < 3; j++) {
        buttons.push(this.renderSquare(i*3 + j));
      }

      rows.push(<div className="board-row" key={i}>{buttons}</div>);
    }

    return (
      <div>
        <div className="status">{status}</div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        selected: null,
      }],
      sortUp: true,
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if (!calculateWinner(squares) && !squares[i]) {
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          selected: i,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) ? false : true,
    });
  }

  toggleSort() {
    this.setState({
      sortUp: !this.state.sortUp,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      let desc
      if (move) {
        const x = step.selected % 3 + 1;
        const y = 3 - Math.floor(step.selected / 3);
        desc = `Move (${x}, ${y})`;
      } else {
        desc = 'Game start';
      }

      const link = <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>;
      let element;

      if (move === this.state.stepNumber) {
        element = <b>{link}</b>;
      } else {
        element = link;
      }

      return (
        <li key={move}>
          {element}
        </li>
      );
    });

    moves = this.state.sortUp ? moves : moves.reverse();

    let status;
    if (winner) {
      status = `Winner: ${winner[0]}`;
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
    }

    const winningSquares = winner ? winner[1] : [];
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winningSquares={winningSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={this.toggleSort.bind(this)}>Toggle Move Order</button>
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
      return [squares[a], lines[i]];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

