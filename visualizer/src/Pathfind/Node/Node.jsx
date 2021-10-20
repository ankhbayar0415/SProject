import React, {Component} from 'react';
import './Node.css';

export default class Node extends Component {
  render() {
    const {
      column,
      row,
      onMouseDown,
      onMouseEnter,
      onMouseUp,
      isFinish,
      isStart,
      isWall,
      
    } = this.props;
    const extraClassName = isFinish
      ? 'node-finish'
      : isStart
      ? 'node-start'
      : isWall
      ? 'node-wall'
      : '';

    return (
      <div
        id={`node-${row}-${column}`}
        className={`node ${extraClassName}`}
        onMouseDown={() => onMouseDown(row, column)}
        onMouseEnter={() => onMouseEnter(row, column)}
        onMouseUp={() => onMouseUp()}></div>
    );
  }
}