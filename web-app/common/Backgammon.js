import R from "../common/ramda.js";
/**
 * Backgammon.js is a module to model and play Backgammon
 * https://en.wikipedia.org/wiki/Backgammon
 * @namespace Backgammon
 * @author Thomas Ward
 * @version 2022
 */
const Backgammon = Object.create(null);

/**
 * A Board is made up of 24 long pins.
 * Counters of the same colour can be placed on each pin.
 * It is implemented as an array of columns (rather than rows) of counters
 * (or empty positions)
 * @memberof Backgammon
 * @typedef {Backgammon.Counter_or_empty[][]} Board
 */

/**
 * A Counter is a coloured disk that players place in the grid.
 * @memberof Backgammon
 * @typedef {(1 | 2)} Counter
 */

/**
 * A player moves either White or Black Counters.
 * 1 for white, 2 for Black
 * @memberof Backgammon
 * @typedef {(1 | 2)} Player
 */

/**
 * Either a Counter or an empty position.
 * @memberof Backgammon
 * @typedef {( Backgammon.Counter | 0)} Counter_or_empty
 */

/**
 * Dice Roll - Array of two random numbers between 1 and 6
 * @memberof Backgammon
 * @typedef {[Number,Number]} Dice_Roll
 */

/**
 * Counter Location - Array of two numbers to show location of counter [row,column]
 * @memberof Backgammon
 * @typedef {[Number,Number]} Counter_Location
 */

/**
 * A set of template Counter strings for {@link Backgammon.string_Counter}.
 * @memberof Backgammon
 * @enum {string[]}
 * @property {string[]} default ["0", "1", "2"] Displays tokens by their index.
 * @property {string[]} counters ["🟫", "⚪️", "⚫"]
 * Displays counters as White or Black.
 * @property {string[]} Hearts ["🧡", "🤍", "🖤"]
 * Displays counters as White or Black Hearts.
 */
Backgammon.Counter_strings = Object.freeze({
    "default": ["0", "1", "2", "10"],
    "disks": ["🟫", "⚪️", "⚫", "🛑"],
    "hearts": ["🧡", "🤍", "🖤", "🛑"]
});

/**
 * Create a new starting board.
 * An array 28x15 to represent the 24 pins, home and the bar.
 * The first and last arrays represent the bar.
 * The Second and Penultimate arrays represent home for black and white respectively.
 * @memberof Backgammon
 * @function
 * @returns {Array}
 */

Backgammon.Create_Starting_Board = function () {
    const board = new Array(28).fill(0).map(() => new Array(15).fill(0));
    board[2][0] = 1;
    board[2][1] = 1;
    board[7][0] = 2;
    board[7][1] = 2;
    board[7][2] = 2;
    board[7][3] = 2;
    board[7][4] = 2;
    board[9][0] = 2;
    board[9][1] = 2;
    board[9][2] = 2;
    board[13][0] = 1;
    board[13][1] = 1;
    board[13][2] = 1;
    board[13][3] = 1;
    board[13][4] = 1;
    board[14][0] = 2;
    board[14][1] = 2;
    board[14][2] = 2;
    board[14][3] = 2;
    board[14][4] = 2;
    board[18][0] = 1;
    board[18][1] = 1;
    board[18][2] = 1;
    board[20][0] = 1;
    board[20][1] = 1;
    board[20][2] = 1;
    board[20][3] = 1;
    board[20][4] = 1;
    board[25][0] = 2;
    board[25][1] = 2;
    return board;

};
/**
 * Returns if a game is won for a specific player
 * @memberof Backgammon
 * @function
 * @param {Board} Board The board to test.
 * @param {Player} Player The player to test if game is won for
 * @returns {boolean} Whether the game is won for Player
 */
 Backgammon.is_winning_for_player = function(Board,Player){
    if (Board[1][14] == Player){
        return true
    }
    else if (Board[26][14] == Player){
        return true
    }
    else{

     return false
    }
 };


/**
 * Returns if a game has ended,
 * Because a player has won
 * @memberof Backgammon
 * @function
 * @param {Board} Board The board to test.
 * @returns {boolean} Whether the game has ended.
 */
Backgammon.is_ended = function (Board) {
    return (
        Backgammon.is_winning_for_player(Board, 1) ||
        Backgammon.is_winning_for_player(Board, 2)
    );
};

/**
 * Determines whether a player has all counters in their home section of the board allowing them to bear off
 * @memberof Backgammon
 * @function
 * @param {Player} Player The Player whose turn it is
 * @param {Board} Current_Board The current position of all counters on the board.
 * @returns {Boolean} Whether player can bear off or not
 */

 Backgammon.Can_Player_Bear_Off = function(Player,Current_Board){
    var i;
    if (Player == 1){
        for(i = 0; i < 20; ++i){
            if (Current_Board[i][0] == Player){
                return false
            }
            }
        }
    if (Player == 2){
        for(i = 8; i < 28; ++i){
            if (Current_Board[i][0] == Player){
                return false
            }
        }
    }
    return true
};

/**
 * If the result of a dice roll is two similar Dice, This function creates an array with 4 elements of the rolled number
 * @memberof Backgammon
 * @function
 * @param {Array} Dice_Roll The result of a player's rolled Dice.
 * @returns {Array} Either 2 or four in length depending whether the dice rolled was doubled.
 */
Backgammon.Double_Similar_Rolls = function (Dice_Result) {
    const allEqual = (array) => array.every((value) => value === array[0]);
    if (allEqual(Dice_Result)){
        const Doubled_Dice = Dice_Result.flatMap(i => [i,i]);
        return Doubled_Dice;
    }
    else {
        return Dice_Result;
    }
};

/**
 * Returns Player whose turn it is to play
 * @memberof Backgammon
 * @function
 * @param {Board} Board The board to test.
 * @param {Player} Player The player to test if game is won for
 * @returns {boolean} Whether the game is won for Player
 */
 Backgammon.Player_to_ply = function(Board,Player){
    if (Board[1][14] == Player){
        return true
    }
    else if (Board[26][14] == Player){
        return true
    }
    else{

     return false
    }
 };


/**
 * Returns a boolean statement of whether or not a player has a counter on the bar
 * @memberof Backgammon
 * @function
 * @param {Board} Board The Board in its current state
 * @param {Player} Player The Player currently playing
 * @returns {Boolean} True or False whether player has a counter on the bar.
 */
 Backgammon.Does_Player_Have_Counter_On_Bar = function(Board,Player){
     if (Board[0][0] == Player){
         return true
     }
     else if (Board[27][0] == Player){
         return true
     }
     else{

      return false
     }
 };


/**
 * This Function works out the location a counter is set when placed on top of a stack of its own type
 * @memberof Backgammon
 * @function
 * @param {Array} Coordinate Row the counter is to be placed
 * @param {Board} Current_Board The Board in its current state
 * @returns {Array} Coordinate of where counter should be placed
 */

Backgammon.Move_to_Top = function(Coordinate,Current_Board){
    const Row = Coordinate[0];
    let i = 0
    while (Current_Board[Row][i]!== 0){
        i = i+1;
    }
    return [Coordinate[0],i];

};

Backgammon.Opposite_Player = function (Player) {
    if (Player == 1){
        return 2
    }
    if (Player = 2){
        return 1
    }

};

Backgammon.searchForArray = function(haystack, needle){
    var i, j, current;
    for(i = 0; i < haystack.length; ++i){
      if(needle.length === haystack[i].length){
        current = haystack[i];
        for(j = 0; j < needle.length && needle[j] === current[j]; ++j);
        if(j === needle.length)
          return true;
      }
    }
    return false;
  }



/**
 * This Function determines all possible locations of where the counter can be moved to by the player
 * @memberof Backgammon
 * @function
 * @param {Array} Selected_Position The Counter chosen to be moved by the player
 * @param {Board} Current_Board The Board in its current state
 * @param {Array} Dice_Result The doubled Array of the dice
 * @param {Player} Player Player to see where moves are forwards or backwards
 * @returns {Array} Array of Arrays on all possible locations where selected counter can be moved to.
 */
 Backgammon.Possible_Moves = function (Selected_Position,Current_Board,Dice_Result, Player) {
    let All_Possible_Moves = [];
    let Move_From_Dice_1 = []
    let Move_From_Dice_2 = []
    let Move_From_Dice_1_and_2 = []
    let Move_From_Dice_1_2_3 = []
    let Move_From_Dice_1_2_3_4 = []
    if (Player == 2){
        if (Dice_Result.length == 4){
            All_Possible_Moves.push([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]-Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-2*Dice_Result[0],0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]-2*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-3*Dice_Result[0],0])
            Move_From_Dice_1_2_3.push([Selected_Position[0]-3*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-4*Dice_Result[0],0])
            Move_From_Dice_1_2_3_4.push([Selected_Position[0]-4*Dice_Result[0],0])
            
        }
        if (Dice_Result.length == 3){
            All_Possible_Moves.push([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]-Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-2*Dice_Result[0],0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]-2*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-3*Dice_Result[0],0])
            Move_From_Dice_1_2_3.push([Selected_Position[0]-3*Dice_Result[0],0])
        }
        if (Dice_Result.length == 1){
            All_Possible_Moves.push([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]-Dice_Result[0],0])
        }
        if (Dice_Result.length == 2){
            All_Possible_Moves.push([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]-Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]-Dice_Result[1],0])
            Move_From_Dice_2.push([Selected_Position[0]-Dice_Result[1],0])
            All_Possible_Moves.push([Selected_Position[0]-(Dice_Result[0]+Dice_Result[1]),0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]-(Dice_Result[0]+Dice_Result[1]),0])
        }
    }
    if (Player == 1){
        if (Dice_Result.length == 4){
            All_Possible_Moves.push([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]+Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+2*Dice_Result[0],0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]+2*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+3*Dice_Result[0],0])
            Move_From_Dice_1_2_3.push([Selected_Position[0]+3*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+4*Dice_Result[0],0])
            Move_From_Dice_1_2_3_4.push([Selected_Position[0]+4*Dice_Result[0],0])
            
        }
        if (Dice_Result.length == 3){
            All_Possible_Moves.push([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]+Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+2*Dice_Result[0],0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]+2*Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+3*Dice_Result[0],0])
            Move_From_Dice_1_2_3.push([Selected_Position[0]+3*Dice_Result[0],0])
        }
        if (Dice_Result.length == 1){
            All_Possible_Moves.push([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]+Dice_Result[0],0])
        }
        if (Dice_Result.length == 2){
            All_Possible_Moves.push([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1.push([Selected_Position[0]+Dice_Result[0],0])
            All_Possible_Moves.push([Selected_Position[0]+Dice_Result[1],0])
            Move_From_Dice_2.push([Selected_Position[0]+Dice_Result[1],0])
            All_Possible_Moves.push([Selected_Position[0]+(Dice_Result[0]+ Dice_Result[1]),0])
            Move_From_Dice_1_and_2.push([Selected_Position[0]+(Dice_Result[0]+Dice_Result[1]),0])
        }
        }

    if (Backgammon.Does_Player_Have_Counter_On_Bar(Current_Board,Player)){
        for (var i = 0; i < All_Possible_Moves.length;i++){
            All_Possible_Moves[i][0] = All_Possible_Moves[i][0] +1
        }
    }


    All_Possible_Moves = All_Possible_Moves.filter(function(Array){
        return Array[0]>=1;
    })
    All_Possible_Moves = All_Possible_Moves.filter(function(Array){
        return Array[0]<=26;
    })


    const Positions_With_No_Obstruction = All_Possible_Moves.filter(function(Possible_Move){
        return Current_Board[Possible_Move[0]][Possible_Move[1]] === 0;
    })
    
    const Positions_On_Top_Of_Own_Counters = All_Possible_Moves.filter(function(Possible_Move){
        return Current_Board[Possible_Move[0]][Possible_Move[1]] === Player;
    })
    const Moved_Upwards_Positions = Positions_On_Top_Of_Own_Counters.map(function(array){
        return Backgammon.Move_to_Top(array,Current_Board)

    })
    const Positions_With_Opponent = All_Possible_Moves.filter(function(Possible_Move){
        return Current_Board[Possible_Move[0]][Possible_Move[1]] === Backgammon.Opposite_Player(Player);
    })
    const Positions_With_Single_Opponent = Positions_With_Opponent.filter(function(array){
        return Current_Board[array[0]][1] === 0;
    })

    let Final_Positions = [];

    for (var i = 0; i < Positions_With_No_Obstruction.length;i++) {
        Final_Positions.push(Positions_With_No_Obstruction[i])
    }
    for (var i = 0; i < Moved_Upwards_Positions.length;i++) {
        Final_Positions.push(Moved_Upwards_Positions[i])
    }
    for (var i = 0; i < Positions_With_Single_Opponent.length;i++) {
        Final_Positions.push(Positions_With_Single_Opponent[i])
    }

    if (Backgammon.Can_Player_Bear_Off(Player,Current_Board) == false){
        Final_Positions = Final_Positions.filter(function(array){
            return R.equals(array,[1,0]) == false
        })
        Final_Positions = Final_Positions.filter(function(array){
            return R.equals(array,[26,0]) == false
        })
    }

    return Final_Positions;
};


console.log(Backgammon.Possible_Moves([18,2],Backgammon.Create_Starting_Board(),[2,6],1))
/**
 * Returns whether or not a particular counter can be selected based on whether it is your turn.
 * @memberof Backgammon
 * @function
 * @param {Player} Player The Player whose turn it is
 * @param {Board} Current_Board The current position of all counters on the board.
 * @param {Counter_Location} Counter_Location Location of selected counter.
 * @returns {Boolean} Whether or not counter can be selected
 */
Backgammon.Can_Counter_Be_Selected = function (Player,Current_Board,Counter_Location) {

    if (Current_Board[Counter_Location[0]][Counter_Location[1]+1] == Player){
        return false
    }

    if (Backgammon.Does_Player_Have_Counter_On_Bar(Current_Board,Player)){
        if (Player === 1){
            if (Counter_Location[0]== 0 && Current_Board[Counter_Location[0]][Counter_Location[1]] == Player ){
                return true
            }
            return false
        }
        if (Player === 2){
            if (Counter_Location[0]== 27 && Current_Board[Counter_Location[0]][Counter_Location[1]] == Player ){
                return true
            }
            return false
        }        
    }
     if (Counter_Location[0] === 1){
         return false;
     }
     if (Counter_Location[0] === 26){
        return false;
    }
     const Selected_Counter = (Current_Board[Counter_Location[0]][Counter_Location[1]]);
     return Selected_Counter === Player;

    };



/**
 * Moves a counter to your chosen location so long as it is a valid move
 * @memberof Backgammon
 * @function
 * @param {Player} Player The Player whose turn it is
 * @param {Board} Current_Board The current position of all counters on the board.
 * @param {Counter_Location} Counter_Location Location of selected counter.
 * @param {Counter_Location} Proposed_Move Location where player wishes to move counter.
 * @param {Dice_Result} Dice_Result 
 * @returns {Board} Updated board with move played.
 */
 
Backgammon.ply = function(Player,Current_Board,Counter_Location,Proposed_Move,Dice_Result){
    const Possible_Moves = Backgammon.Possible_Moves(Counter_Location,Current_Board,Dice_Result,Player);
    const Updated_Board = Current_Board;

    if (Backgammon.Can_Counter_Be_Selected(Player,Current_Board,Counter_Location) && Backgammon.searchForArray(Possible_Moves,Proposed_Move)){
        if (Current_Board[Proposed_Move[0]][Proposed_Move[1]] == Backgammon.Opposite_Player(Player)){
            Updated_Board[Counter_Location[0]][Counter_Location[1]] = 0;
            Updated_Board[Proposed_Move[0]][Proposed_Move[1]] = Player;
            let Opposite_Players_Bar = []
            if (Player == 1){
                Opposite_Players_Bar = [27,0]
            }
            if (Player == 2){
                 Opposite_Players_Bar = [0,0]
            }
            const Taken_Piece = Backgammon.Move_to_Top(Opposite_Players_Bar,Current_Board)
            Updated_Board[Taken_Piece[0]][Taken_Piece[1]] = Backgammon.Opposite_Player(Player)
            return Updated_Board
        }
    Updated_Board[Counter_Location[0]][Counter_Location[1]] = 0;
    Updated_Board[Proposed_Move[0]][Proposed_Move[1]] = Player;
    return Updated_Board
    }



    else {

    return undefined;
    }

};


/**
 * Updates the dice roll given the selected play
 * @memberof Backgammon
 * @function
 * @param {Player} Player The Player whose turn it is
 * @param {Board} Current_Board The current position of all counters on the board.
 * @param {Counter_Location} Counter_Location Location of selected counter.
 * @param {Counter_Location} Proposed_Move Location where player wishes to move counter.
 * @param {Dice_Result} Dice_Result 
 * @returns {Dice_Result} Updated dice result for next turn.
 */
 Backgammon.Update_Dice_Roll = function(Player,Selected_Position,Proposed_Move,Dice_Result){
    let Move_From_Dice_1 = []
    let Move_From_Dice_2 = []
    let Move_From_Dice_1_and_2 = []
    let Move_From_Dice_1_2_3 = []
    let Move_From_Dice_1_2_3_4 = []
    if (Player == 2){
        if (Dice_Result.length == 4){
            Move_From_Dice_1 = ([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]-2*Dice_Result[0],0])
            Move_From_Dice_1_2_3 = ([Selected_Position[0]-3*Dice_Result[0],0])
            Move_From_Dice_1_2_3_4 = ([Selected_Position[0]-4*Dice_Result[0],0])
            
        }
        if (Dice_Result.length == 3){
            Move_From_Dice_1 = ([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]-2*Dice_Result[0],0])
            Move_From_Dice_1_2_3 = ([Selected_Position[0]-3*Dice_Result[0],0])
        }
        if (Dice_Result.length == 1){
            Move_From_Dice_1 = ([Selected_Position[0]-Dice_Result[0],0])
        }
        if (Dice_Result.length == 2){
            Move_From_Dice_1 = ([Selected_Position[0]-Dice_Result[0],0])
            Move_From_Dice_2 = ([Selected_Position[0]-Dice_Result[1],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]-(Dice_Result[0]+Dice_Result[1]),0])
        }
    }
    if (Player == 1){
        if (Dice_Result.length == 4){
            Move_From_Dice_1 = ([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]+2*Dice_Result[0],0])
            Move_From_Dice_1_2_3 = ([Selected_Position[0]+3*Dice_Result[0],0])
            Move_From_Dice_1_2_3_4 = ([Selected_Position[0]+4*Dice_Result[0],0])
            
        }
        if (Dice_Result.length == 3){
            Move_From_Dice_1 = ([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]+2*Dice_Result[0],0])
            Move_From_Dice_1_2_3 = ([Selected_Position[0]+3*Dice_Result[0],0])
        }
        if (Dice_Result.length == 1){
            Move_From_Dice_1 = ([Selected_Position[0]+Dice_Result[0],0])
        }
        if (Dice_Result.length == 2){
            Move_From_Dice_1 = ([Selected_Position[0]+Dice_Result[0],0])
            Move_From_Dice_2 = ([Selected_Position[0]+Dice_Result[1],0])
            Move_From_Dice_1_and_2 = ([Selected_Position[0]+(Dice_Result[0]+Dice_Result[1]),0])
        }
        }
    if (Proposed_Move[0] == Move_From_Dice_1[0]){
        Dice_Result.splice(0,1)
    }
    if (Proposed_Move[0] == Move_From_Dice_1_and_2[0]){
        Dice_Result.splice(0,2)
    }
    if (Proposed_Move[0] == Move_From_Dice_1_2_3[0]){
        Dice_Result.splice(0,3)
    }
    if (Proposed_Move[0] == Move_From_Dice_1_2_3_4[0]){
        Dice_Result.splice(0,4)
    }
    if (Proposed_Move[0] == Move_From_Dice_2[0]){
        Dice_Result.splice(1,1)
    }
    return Dice_Result;


}

/**
 * Returns The Player who currently should be playing
 * @memberof Backgammon
 * @function
 * @param {Player} Player The Player whose turn it is
 * @param {Board} Current_Board The current position of all counters on the board.
 * @param {Counter_Location} Selectable_Counters Array of all selectable counters.
 * @param {Dice_Result} Dice_Result The most recent dice roll
 * @returns {Player} Player to Play next
 */
Backgammon.Player_to_ply = function(Player,Current_Board,Selectable_Counters,Dice_Result){
    let Player_to_Play = 0
    let Possible_Moves = []
    for (var i = 0; i < Selectable_Counters.length;i++){
        Possible_Moves.push(Backgammon.Possible_Moves(Selectable_Counters[i],Current_Board,Dice_Result, Player))
    }
    if (Dice_Result.length == 0 || Possible_Moves.length == 0){
        Player_to_Play = Backgammon.Opposite_Player(Player)
    }
    else{
        Player_to_Play = Player
    }
    return Player_to_Play
}


/**
 * Returns the size of a board as an array of [width, height].
 * @memberof Backgammon
 * @function
 * @param {Backgammon.Board} board The board to check the size of.
 * @returns {number[]} The width and height of the board, [width, height].
 */
Backgammon.size = function (board) {
    return [board.length, board[0].length];
};

const replace_Counters_in_slot = (Counter_strings) => (Counter) => (
    Counter_strings[Counter] || Counter
);

const replace_Counters_on_board = function (Counter_strings) {
    return function (board) {
        return R.map(R.map(replace_Counters_in_slot(Counter_strings)), board);
    };
};

/**
 * Returns a {@link Backgammon.to_string} like function,
 * mapping Counters to provided string representations.
 * @memberof Backgammon
 * @function
 * @param {string[]} Counter_strings
 * Strings to represent Counters as. Examples are given in
 * {@link Backgammon.Counter_strings}
 * @returns {function} The string representation.
 */
Backgammon.to_string_with_Counters = (Counter_strings) => (board) => R.pipe(
    R.transpose, // Columns to display vertically.
    R.reverse, // Empty slots at the top.
    replace_Counters_on_board(Counter_strings),
    R.map(R.join("")), // Add a space between each slot.
    R.join("\n") // Stack rows atop each other.
)(board);
Backgammon.show = function (board) {
    console.log(Backgammon.to_string_with_Counters(
        Backgammon.Counter_strings.disks
    )(board));
    return board;
};
// console.log(show(Custom_Board));

// const Ply = Backgammon.ply(1,Custom_Board,[2,1],[9,0],[6,1])

// console.log(show(Ply))

// const New_Possible_Moves = Backgammon.Possible_Moves([20,4],Backgammon.Create_Starting_Board(),[6,2],1)

// console.log(New_Possible_Moves)

// // console.log(new Backgammon.Create_Starting_Board());
// const Dice_Result = new Backgammon.Dice_Roll();
// console.log(Dice_Result);
// console.log(Backgammon.Number_of_Moves_in_Turn(Dice_Result));

// console.log(Backgammon.Can_Counter_Be_Selected(1,Backgammon.Create_Starting_Board(),[2,1]))


export default Object.freeze(Backgammon);