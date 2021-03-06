// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      if (this.rows().length === 0) {
        return false;
      }
      let countPiece = 0;
      for (let rowElement of this.get(rowIndex)) {
        if (rowElement === 1) {
          countPiece++;
        }
        if (countPiece > 1) {
          return true;
        }
      }
      return false; 
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      if (this.rows().length === 0) {
        return false;
      }
      let conflicts = false;
      for (let rowIndex = 0; rowIndex < this.rows().length; rowIndex++) {
        conflicts = conflicts || this.hasRowConflictAt(rowIndex);
      }
      return conflicts; 
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      if (this.rows().length === 0) {
        return false;
      }
      let countPiece = 0;
      for (let row of this.rows()) {
        if (row[colIndex] === 1) {
          countPiece++;
        }
        if (countPiece > 1) {
          return true;
        }
      }
      return false; 
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      if (this.rows().length === 0) {
        return false;
      }
      let conflicts = false;
      for (let colIndex = 0; colIndex < this.get(0).length; colIndex++) {
        conflicts = conflicts || this.hasColConflictAt(colIndex);
      }
      return conflicts; 
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      if (this.rows().length === 0) {
        return false;
      }
      let countPiece = 0;
      let rowIndex = 0;
      let colIndex = majorDiagonalColumnIndexAtFirstRow;
      while (rowIndex < this.rows().length && colIndex < this.get(0).length) {
        if (this.get(rowIndex)[colIndex] === 1) {
          countPiece++;
        }
        if (countPiece > 1) {
          return true;
        }
        rowIndex++;
        colIndex++;
      }
      return false; 
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      if (this.rows().length === 0) {
        return false;
      }
      let conflicts = false;
      //checking the matrix by iterating through each col in the first row, starting from -(n-1)
      //because that will cover the slots in the bottom left corner of the matrix
      for (let colIndex = (this.get(0).length - 1) * -1; colIndex < this.get(0).length; colIndex++) {
        conflicts = conflicts || this.hasMajorDiagonalConflictAt(colIndex);
      }
      return conflicts;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      if (this.rows().length === 0) {
        return false;
      }
      let countPiece = 0;
      let rowIndex = 0;
      let colIndex = minorDiagonalColumnIndexAtFirstRow;
      while (rowIndex < this.rows().length && colIndex >= 0) {
        if (this.get(rowIndex)[colIndex] === 1) {
          countPiece++;
        }
        if (countPiece > 1) {
          return true;
        }
        rowIndex++;
        colIndex--;
      }
      return false; 
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      if (this.rows().length === 0) {
        return false;
      }
      let conflicts = false;
      //checking the matrix by iterating through each col in the first row, starting from 0 to 2n-1
      //because that will cover the slots in the bottom right corner of the matrix
      for (let colIndex = 0; colIndex < this.get(0).length * 2 - 1; colIndex++) {
        conflicts = conflicts || this.hasMinorDiagonalConflictAt(colIndex);
      }
      return conflicts;
    },

    hasAnyElementInRow: function(rowIndex) {
      let row = this.get(rowIndex);
      for (let rowElement of row) {
        if (rowElement === 1) {
          return true;
        }
      }
      return false;
    },

    hasAnyElementInCol: function(colIndex) {
      for (let row of this.rows()) {
        if (row[colIndex] === 1) {
          return true;
        }
      }
      return false;
    },

    copyMatrixFromArray: function(matrix) {
      for (let row = 0; row < matrix.length; row++) {
        for (let col = 0; col < matrix[0].length; col++) {
          this.get(row)[col] = + matrix[row][col];
          this.trigger('change');
        }
      }
    }
    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
