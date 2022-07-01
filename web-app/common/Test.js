import R from "../common/ramda.js";

import Backgammon from "../common/Backgammon.js";

const DISPLAY_MODE = "to_string";

const display_functions = {
    "json": JSON.stringify,
    "to_string": Backgammon.to_string_with_Counters(Backgammon.Counter_strings.counters)
};


const display_board = function (board) {
    try {
        return "\n" + display_functions[DISPLAY_MODE](board);
    } catch (ignore) {
        return "\n" + JSON.stringify(board);
    }
};


/**
 * Returns if the board is in a valid state.
 * A board is valid if all the following are true:
 * - The board is a rectangular 2d array containing only 0, 1, or 2 as elements.
 * - Player 1 has the same number of tokens as Player 2.
 * - There are no empty slots in columns below filled ones.
 * - At most one player has a winning configuration.
 * @memberof Connect4.test
 * @function
 * @param {Board} board The board to test.
 * @throws if the board fails any of the above conditions.
 */
 const throw_if_invalid = function (board) {
    // Rectangular array.
    if (!Array.isArray(board) || !Array.isArray(board[0])) {
        throw new Error(
            "The board is not a 2D array: " + display_board(board)
        );
    }
    const height = board[0].length;
    const rectangular = R.all(
        (column) => column.length === height,
        board
    );
    if (!rectangular) {
        throw new Error(
            "The board is not rectangular: " + display_board(board)
        );
    }

    // Only valid Counters
    const counter_or_empty = [0, 1, 2];
    const contains_valid_counters = R.pipe(
        R.flatten,
        R.all((slot) => counter_or_empty.includes(slot))
    )(board);
    if (!contains_valid_counters) {
        throw new Error(
            "The board contains invalid counters: " + display_board(board)
        );
    }

    // Player 1 has equal number of counters to Player 2.
    const count_counter_type_in_board = (counter) => R.pipe(
        R.flatten,
        R.count(R.equals(counter))
    );
    const count_of_player_1_counters = count_counter_type_in_board(1)(board);
    const count_of_player_2_counters = count_counter_type_in_board(2)(board);
    if (!(
        count_of_player_1_counters === count_of_player_2_counters
    )) {
        throw new Error(
            "There is an imbalance of tokens on the board. " +
            `Player 1 has ${count_of_player_1_tokens}, ` +
            `Player 2 has ${count_of_player_2_tokens}: ` +
            display_board(board)
        );
    }

    // All empty slots at the top.
    /*
     - Determine how many zeros in a column.
     - Take that many elements from the top.
     - All elements taken should be zero.
    */
    const no_floating_tokens_in_column = (column) => R.all(
        R.equals(0),
        R.takeLast(R.count(R.equals(0), column), column)
    );
    const no_floating_tokens = R.all(no_floating_tokens_in_column, board);
    if (!no_floating_tokens) {
        throw new Error(
            "There are empty slots below filled ones: " + display_board(board)
        );
    }

    // At most one player has a winning configuration.
    const winning_for_1 = Backgammon.is_winning_for_player(1, board);
    const winning_for_2 = Backgammon.is_winning_for_player(2, board);
    if (winning_for_1 && winning_for_2) {
        throw new Error(
            "The board is winning for both players: " + display_board(board)
        );
    }
};

