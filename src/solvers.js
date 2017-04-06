/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  let solution = new Board({n:n}); //fixme
  //loop through every row/col in the matrix
  for (let row = 0; row < solution.rows().length; row++) {
    for (let col = 0; col < solution.rows()[row].length; col++) {
      // solution.togglePiece(row, col);
      if (!solution.hasAnyElementInRow(row) && !solution.hasAnyElementInCol(col)) {
        solution.togglePiece(row, col);
      }
    }
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

window.findNRooksSolutionForCount = function(n, startRow, startCol) {
  let solution = new Board({n: n}); 
  //loop through every row/col after the start point in the matrix
  for (let row = startRow; row < solution.rows().length; row++) {
    if (row !== startRow) {
      for (let col = 0; col < solution.get(0).length; col++){
        if (!solution.hasAnyElementInRow(row) && !solution.hasAnyElementInCol(col)) {
          solution.togglePiece(row, col);
        }
      }
    } else {
      for (let col = startCol; col < solution.get(0).length; col++) {
        if (!solution.hasAnyElementInRow(row) && !solution.hasAnyElementInCol(col)) {
          solution.togglePiece(row, col);
        }
      }
    }
  }

  //loop through every row/col before the start point in the matrix
  for (let row = 0; row <= startRow; row++) {
    if (row !== startRow) {
      for (let col = 0; col < solution.get(0).length; col++){
        if (!solution.hasAnyElementInRow(row) && !solution.hasAnyElementInCol(col)) {
          solution.togglePiece(row, col);
        }
      }
    } else {
      for (let col = 0; col < startCol; col++) {
        if (!solution.hasAnyElementInRow(row) && !solution.hasAnyElementInCol(col)) {
          solution.togglePiece(row, col);
        }
      }
    }
  }
  console.log(`Single solution for ${n} rooks starting at: ${startRow},${startCol} ${JSON.stringify(solution.rows())}`);
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  // let solutionCount = 0; //fixme
  let solutionSet = new Set();
  for (let x = 0; x < n; x++) {
    for (let y = 0; y < n; y++) {
      solutionSet.add(JSON.stringify(findNRooksSolutionForCount(n, x, y).rows()));
    }
  }
  // console.log('Number of solutions for ' + n + ' rooks:', solutionSet.size);
  return solutionSet.size;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = undefined; //fixme

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = undefined; //fixme

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
