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
  let solution = new Board({n: n}); //fixme
  //loop through every row/col in the matrix
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      solution.togglePiece(row, col);
      if (solution.hasAnyRooksConflicts()) {
        solution.togglePiece(row, col);
      }
    }
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  let startTime = performance.now();
  let solutionCount = 0;
  //start of help functions
  //recursive call function
  let rooksDecisionTree = function(prevMatrix, row, col) {
    if (hasAnyElementInCol(prevMatrix, col)) {
      return;
    }
    if (row === n - 1) {
      // console.log(nextSolution.rows());
      solutionCount++;
    } else {
      //e.g. nextRow = [[0,1,0]]
      let nextRow = [Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)];
      //toggle
      nextRow[0][col] = 1;
      //concat newRow to newSolution e.g. [[1,0,0],[0,1,0]]
      let nextSolution = prevMatrix.concat(nextRow);
      for (let childCol = 0; childCol < n; childCol++) {
        rooksDecisionTree(nextSolution, row + 1, childCol);
      }
    }
  };
  //end of help functions
  //start from each col in the first row
  for (let col = 0; col < n; col++) {
    rooksDecisionTree([], 0, col);
  }
  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  let endTime = performance.now();
  console.log('Time cost:' + (endTime - startTime));
  return solutionCount;
};


//new conflicts testing function, and because we starting a new row, we only need to check column conflicts
window.hasAnyElementInCol = function(matrix, col) {
  if (matrix.length === 0) {
    return false;
  }
  for (let row = 0; row < matrix.length; row++) {
    if (matrix[row][col] === 1) {
      return true;
    }
  }
  return false;
};

////////////////////////////////////////////////////////////////
////here are two differnt approchs to the countRooks problem////
///     their performance is not good as the one above     /////
////////////////////////////////////////////////////////////////

// window.countNRooksSolutions_slow_object = function(n) {
//   let solutionSet = new Set();
//   for (let col = 0; col < n; col++) {
//     rooksDecisionTree(new Board({n:n}), 0, col);
//   }
//   function rooksDecisionTree(prevMatrix, row, col) {
//     if (hasAnyElementInCol(prevMatrix, col)) {
//       return;
//     }
//     //creat a new instance
//     let nextSolution = new Board({n:n});
//     //copy every element from prevMatrix arrays to nextSolution
//     nextSolution.copyMatrixFromArray(prevMatrix.rows());
//     //toggle
//     nextSolution.togglePiece(row, col);
//     if (row === n - 1) {
//       // console.log(nextSolution.rows());
//       solutionSet.add(nextSolution);
//     } else {
//       for (let childCol = 0; childCol < n; childCol++) {
//         rooksDecisionTree(nextSolution, row + 1, childCol);
//       }
//     }
//   };
//   console.log('Number of solutions for ' + n + ' rooks:', solutionSet.size);
//   return solutionSet.size;
// };

// window.countNRooksSolutions_slow_set = function(n) {
//   let startTime = performance.now();
//   let solutionSet = new Set();
//   //start of help functions
//   //recursive call function
//   let rooksDecisionTree = function(prevMatrix, row, col) {
//     if (hasAnyElementInCol(prevMatrix, col)) {
//       return;
//     }
//     //e.g. nextRow = [[0,1,0]]
//     let nextRow = [Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)];
//     //toggle
//     nextRow[0][col] = 1;
//     //concat newRow to newSolution e.g. [[1,0,0],[0,1,0]]
//     let nextSolution = prevMatrix.concat(nextRow);
//     if (row === n - 1) {
//       // console.log(nextSolution.rows());
//       solutionSet.add(nextSolution);
//     } else {
//       for (let childCol = 0; childCol < n; childCol++) {
//         rooksDecisionTree(nextSolution, row + 1, childCol);
//       }
//     }
//   };
//   //end of help functions
//   //start from each col in the first row
//   for (let col = 0; col < n; col++) {
//     rooksDecisionTree([], 0, col);
//   }
//   console.log('Number of solutions for ' + n + ' rooks:', solutionSet.size);
//   let endTime = performance.now();
//   console.log('Time cost:' + (endTime - startTime));
//   return solutionSet.size;
// };
////////////////////////////////////////////////////////


// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  if (n === 0) {
    return [];
  }
  let solution;
  //start of help functions
  //recursive call function
  let rooksDecisionTree = function(prevMatrix, row, col) {
    //if we found our solution matrix, skip all recursion
    if (solution !== undefined) {
      return;
    }
    //if there's any conficts, skip this branch
    if (hasAnyElementInColAndDiagonal(prevMatrix, col)) {
      return;
    }
    //e.g. nextRow = [[0,1,0]]
    let nextRow = [Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)];
    //toggle
    nextRow[0][col] = 1;
    //concat newRow to newSolution e.g. [[1,0,0],[0,0,1]]
    let nextSolution = prevMatrix.concat(nextRow);
    if (row === n - 1) {
      //previous line garentee there is not conflicts
      //at the last row, we get our one solution, assign it to the solution
      //and because we only do this in the last row, so the number of toggled pieces always = n
      solution = new Board(nextSolution);
    } else {
      for (let childCol = 0; childCol < n; childCol++) {
        rooksDecisionTree(nextSolution, row + 1, childCol);
      }
    }
  };
  //end of help functions
  //start from each col in the first row
  for (let col = 0; col < n; col++) {
    rooksDecisionTree([], 0, col);
  }
  //if there's no good solution was found, return a empty n*n board
  if (solution === undefined) {
    return new Board({n: n}).rows();
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution.rows()));
  return solution.rows();
};

//new conflicts testing function
window.hasAnyElementInColAndDiagonal = function(matrix, col) {
  if (matrix.length === 0) {
    return false;
  }
  //check for col
  for (let row = 0; row < matrix.length; row++) {
    if (matrix[row][col] === 1) {
      return true;
    }
  }
  //check for major diagonal
  for (let colIndex = col - 1, row = matrix.length - 1; row >= 0; row--, colIndex--) {
    if (matrix[row][colIndex] === 1) {
      return true;
    }
  }
  //check for minor diagonal
  for (let colIndex = col + 1, row = matrix.length - 1; row >= 0; row--, colIndex++) {
    if (matrix[row][colIndex] === 1) {
      return true;
    }
  }
  return false;
};

//return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  let startTime = performance.now();
  if (n === 0) {
    return 1;
  }
  let solutionCount = 0;
  //start of help functions
  //recursive call function
  let rooksDecisionTree = function(prevMatrix, row, col) {
    //if there's any conficts, skip this branch
    if (hasAnyElementInColAndDiagonal(prevMatrix, col)) {
      return;
    }
    if (row === n - 1) {
      //previous line garentee there is not conflicts
      //at the last row, we get our one solution, add it to the solution
      //and because we only do this in the last row, so the number of toggled pieces always = n
      solutionCount++;
    } else {
      //e.g. nextRow = [[0,1,0]]
      let nextRow = [Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)];
      //toggle
      nextRow[0][col] = 1;
      //concat newRow to newSolution e.g. [[1,0,0],[0,0,1]]
      let nextSolution = prevMatrix.concat(nextRow);

      for (let childCol = 0; childCol < n; childCol++) {
        rooksDecisionTree(nextSolution, row + 1, childCol);
      }
    }

  };
  //end of help function
  //start from each col in the first row
  for (let col = 0; col < n; col++) {
    rooksDecisionTree([], 0, col);
  }
  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  let endTime = performance.now();
  console.log('Time cost: ' + (endTime - startTime));
  return solutionCount;
};

////////////////////////////////////////////////////////////////
////here are two differnt approchs to the countRooks problem////
///     their performance is not good as the one above     /////
////////////////////////////////////////////////////////////////

// window.countNQueensSolutions_slow_set = function(n) {
//   let startTime = performance.now();
//   if (n === 0) {
//     return 1;
//   }
//   let solution = new Set();
//   //start of help functions
//   //recursive call function
//   let rooksDecisionTree = function(prevMatrix, row, col) {
//     //if there's any conficts, skip this branch
//     if (hasAnyElementInColAndDiagonal(prevMatrix, col)) {
//       return;
//     }
//     //e.g. nextRow = [[0,1,0]]
//     let nextRow = [Array.apply(null, Array(n)).map(Number.prototype.valueOf, 0)];
//     //toggle
//     nextRow[0][col] = 1;
//     //concat newRow to newSolution e.g. [[1,0,0],[0,0,1]]
//     let nextSolution = prevMatrix.concat(nextRow);
//     if (row === n - 1) {
//       //previous line garentee there is not conflicts
//       //at the last row, we get our one solution, add it to the solution
//       //and because we only do this in the last row, so the number of toggled pieces always = n
//       solution.add(nextSolution);
//     } else {
//       for (let childCol = 0; childCol < n; childCol++) {
//         rooksDecisionTree(nextSolution, row + 1, childCol);
//       }
//     }
//   };
//   //end of help function
//   //start from each col in the first row
//   for (let col = 0; col < n; col++) {
//     rooksDecisionTree([], 0, col);
//   }
//   console.log('Number of solutions for ' + n + ' queens:', solution.size);
//   let endTime = performance.now();
//   console.log('Time cost: ' + (endTime - startTime));
//   return solution.size;
// };