function astar(nodes, startNode, finishNode, nodesToAnimate, boardArray, name, heuristic) {
    if (!startNode || !finishNode || startNode === finishNode) {
      return false;
    }
    nodes[startNode].distance = 0;
    nodes[startNode].totalDistance = 0;
    nodes[startNode].direction = "up";
    let unvisitedNodes = Object.keys(nodes);
    while (unvisitedNodes.length) {
      let currentNode = closestNode(nodes, unvisitedNodes);
      while (currentNode.status === "wall" && unvisitedNodes.length) {
        currentNode = closestNode(nodes, unvisitedNodes)
      }
      if (currentNode.distance === Infinity) return false;
      nodesToAnimate.push(currentNode);
      currentNode.status = "visited";
      if (currentNode.id === finishNode) {
        return "success!";
      }
      updateNeighbors(nodes, currentNode, boardArray, finishNode, name, startNode, heuristic);
    }
  }
  
  function closestNode(nodes, unvisitedNodes) {
    let currentClosest, index;
    for (let i = 0; i < unvisitedNodes.length; i++) {
      if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
        if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
          currentClosest = nodes[unvisitedNodes[i]];
          index = i;
        }
      }
    }
    unvisitedNodes.splice(index, 1);
    return currentClosest;
  }
  
  function updateNeighbors(nodes, node, boardArray, finishNode, name, startNode, heuristic) {
    let neighbors = getNeighbors(node.id, nodes, boardArray);
    for (let neighbor of neighbors) {
      if (finishNode) {
        updateNode(node, nodes[neighbor], nodes[finishNode], name, nodes, nodes[startNode], heuristic, boardArray);
      } else {
        updateNode(node, nodes[neighbor]);
      }
    }
  }
  
  function updateNode(currentNode, finishNodeNode, actualfinishNodeNode, name, nodes, actualStartNode, heuristic, boardArray) {
    let distance = getDistance(currentNode, finishNodeNode);
    if (!finishNodeNode.heuristicDistance) finishNodeNode.heuristicDistance = manhattanDistance(finishNodeNode, actualfinishNodeNode);
    let distanceToCompare = currentNode.distance + finishNodeNode.weight + distance[0];
    if (distanceToCompare < finishNodeNode.distance) {
      finishNodeNode.distance = distanceToCompare;
      finishNodeNode.totalDistance = finishNodeNode.distance + finishNodeNode.heuristicDistance;
      finishNodeNode.previousNode = currentNode.id;
      finishNodeNode.path = distance[1];
      finishNodeNode.direction = distance[2];
    }
  }
  
  function getNeighbors(id, nodes, boardArray) {
    let coordinates = id.split("-");
    let x = parseInt(coordinates[0]);
    let y = parseInt(coordinates[1]);
    let neighbors = [];
    let potentialNeighbor;
    if (boardArray[x - 1] && boardArray[x - 1][y]) {
      potentialNeighbor = `${(x - 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x + 1] && boardArray[x + 1][y]) {
      potentialNeighbor = `${(x + 1).toString()}-${y.toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x][y - 1]) {
      potentialNeighbor = `${x.toString()}-${(y - 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    if (boardArray[x][y + 1]) {
      potentialNeighbor = `${x.toString()}-${(y + 1).toString()}`
      if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
    }
    return neighbors;
  }
  
  
  function getDistance(nodeOne, nodeTwo) {
    let currentCoordinates = nodeOne.id.split("-");
    let finishNodeCoordinates = nodeTwo.id.split("-");
    let x1 = parseInt(currentCoordinates[0]);
    let y1 = parseInt(currentCoordinates[1]);
    let x2 = parseInt(finishNodeCoordinates[0]);
    let y2 = parseInt(finishNodeCoordinates[1]);
    if (x2 < x1 && y1 === y2) {
      if (nodeOne.direction === "up") {
        return [1, ["f"], "up"];
      } else if (nodeOne.direction === "right") {
        return [2, ["l", "f"], "up"];
      } else if (nodeOne.direction === "left") {
        return [2, ["r", "f"], "up"];
      } else if (nodeOne.direction === "down") {
        return [3, ["r", "r", "f"], "up"];
      } else if (nodeOne.direction === "up-right") {
        return [1.5, null, "up"];
      } else if (nodeOne.direction === "down-right") {
        return [2.5, null, "up"];
      } else if (nodeOne.direction === "up-left") {
        return [1.5, null, "up"];
      } else if (nodeOne.direction === "down-left") {
        return [2.5, null, "up"];
      }
    } else if (x2 > x1 && y1 === y2) {
      if (nodeOne.direction === "up") {
        return [3, ["r", "r", "f"], "down"];
      } else if (nodeOne.direction === "right") {
        return [2, ["r", "f"], "down"];
      } else if (nodeOne.direction === "left") {
        return [2, ["l", "f"], "down"];
      } else if (nodeOne.direction === "down") {
        return [1, ["f"], "down"];
      } else if (nodeOne.direction === "up-right") {
        return [2.5, null, "down"];
      } else if (nodeOne.direction === "down-right") {
        return [1.5, null, "down"];
      } else if (nodeOne.direction === "up-left") {
        return [2.5, null, "down"];
      } else if (nodeOne.direction === "down-left") {
        return [1.5, null, "down"];
      }
    }
    if (y2 < y1 && x1 === x2) {
      if (nodeOne.direction === "up") {
        return [2, ["l", "f"], "left"];
      } else if (nodeOne.direction === "right") {
        return [3, ["l", "l", "f"], "left"];
      } else if (nodeOne.direction === "left") {
        return [1, ["f"], "left"];
      } else if (nodeOne.direction === "down") {
        return [2, ["r", "f"], "left"];
      } else if (nodeOne.direction === "up-right") {
        return [2.5, null, "left"];
      } else if (nodeOne.direction === "down-right") {
        return [2.5, null, "left"];
      } else if (nodeOne.direction === "up-left") {
        return [1.5, null, "left"];
      } else if (nodeOne.direction === "down-left") {
        return [1.5, null, "left"];
      }
    } else if (y2 > y1 && x1 === x2) {
      if (nodeOne.direction === "up") {
        return [2, ["r", "f"], "right"];
      } else if (nodeOne.direction === "right") {
        return [1, ["f"], "right"];
      } else if (nodeOne.direction === "left") {
        return [3, ["r", "r", "f"], "right"];
      } else if (nodeOne.direction === "down") {
        return [2, ["l", "f"], "right"];
      } else if (nodeOne.direction === "up-right") {
        return [1.5, null, "right"];
      } else if (nodeOne.direction === "down-right") {
        return [1.5, null, "right"];
      } else if (nodeOne.direction === "up-left") {
        return [2.5, null, "right"];
      } else if (nodeOne.direction === "down-left") {
        return [2.5, null, "right"];
      }
    } 
  }
  
  function manhattanDistance(nodeOne, nodeTwo) {
    let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
    let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
    let xOne = nodeOneCoordinates[0];
    let xTwo = nodeTwoCoordinates[0];
    let yOne = nodeOneCoordinates[1];
    let yTwo = nodeTwoCoordinates[1];
  
    let xChange = Math.abs(xOne - xTwo);
    let yChange = Math.abs(yOne - yTwo);
  
    return (xChange + yChange);
  }
  
  module.exports = aStar;