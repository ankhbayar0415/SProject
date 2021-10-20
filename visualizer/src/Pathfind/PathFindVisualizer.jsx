import React, {Component} from 'react';
import Node from '../Pathfind/Node/Node';
import { djkstra, shortestPath } from '../algorithms/djkstra';

import './PathFindVisualizer.css';
import astar from '../algorithms/aStar';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, column) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, column) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, column);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animatePathFinder(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.column}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.column}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDjkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = djkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = shortestPath(finishNode);
    this.animatePathFinder(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeAStar() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = astar(grid, startNode, finishNode);
    const nodesInShortestPathOrder = shortestPath(finishNode);
    this.animatePathFinder(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const {grid, mouseIsPressed} = this.state;

    return (
      <>
        <button onClick={() => this.visualizeDjkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.visualizeAStar()}>
          Visualize A* Algorithm
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, column, isFinish, isStart, isWall} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      column={column}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, column) => this.handleMouseDown(row, column)}
                      onMouseEnter={(row, column) =>
                        this.handleMouseEnter(row, column)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let column = 0; column < 50; column++) {
      currentRow.push(createNode(column, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (column, row) => {
  return {
    column,
    row,
    isStart: row === START_NODE_ROW && column === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && column === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, column) => {
  const newGrid = grid.slice();
  const node = newGrid[row][column];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][column] = newNode;
  return newGrid;
};