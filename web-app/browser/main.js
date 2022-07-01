import Backgammon from "../common/Backgammon.js";

var board = Backgammon.Create_Starting_Board();

const grid_columns = 14;
const grid_rows = 12;
var player_to_play = 1;
let loops_of_inital_rolls = 0

document.documentElement.style.setProperty("--grid-rows", grid_rows);
document.documentElement.style.setProperty("--grid-columns", grid_columns);

const grid = document.getElementById("grid");
const footer = document.getElementById("footer");
const comment = document.getElementById("comments");

var dieOneValue
var dieTwoValue
let player_one_not_rolled = true
let player_two_not_rolled = true

let images = ["./assets/dice-01.svg",
"./assets/dice-02.svg",
"./assets/dice-03.svg",
"./assets/dice-04.svg",
"./assets/dice-05.svg",
"./assets/dice-06.svg"];


let dice = document.querySelectorAll("img");
let die_One = document.getElementById("die-1")
let die_Two = document.getElementById("die-2")
const button = document.getElementById("button");


const Player_Colour = function(Player){
    var Colour
    if (Player == 1){
        Colour = "White";
    }
    if (Player == 2){
        Colour = "Black";
    }
    return Colour
}

const player_one_starting_roll = function(){
    if (player_one_not_rolled){
        player_one_not_rolled = false
        die_One.classList.add("shake");
        setTimeout(function(){
        die_One.classList.remove("shake");
        dieOneValue = Math.floor(Math.random()*6);
        document.querySelector("#die-1").setAttribute("src", images[dieOneValue]);
        button.removeEventListener("click", player_one_starting_roll, {once: true});
        1000
        comment.textContent = 'Black Player to Roll Dice Now'
        button.addEventListener("click", player_two_starting_roll, {once:true});
        })
    }
    else{
        console.log("Player One Has Rolled")
    }

};
const player_two_starting_roll = function(){
    if (player_two_not_rolled){
        player_two_not_rolled = false
        button.removeEventListener("click", player_two_starting_roll, {once:true})
        die_Two.classList.add("shake");
        setTimeout(function(){
        die_Two.classList.remove("shake");
        dieTwoValue = Math.floor(Math.random()*6);
        document.querySelector("#die-2").setAttribute("src", images[dieTwoValue]);
        1000
        if (dieOneValue>dieTwoValue){
            comment.textContent = "White Player to start, Roll Dice Again";
            button.textContent = "Roll Dice";
            player_to_play = 1;
            console.log(`player to play is ${player_to_play}`)
            button.addEventListener("click", roll)
        }
        if (dieTwoValue>dieOneValue){
            comment.textContent = "Black Player to start, Roll Dice Again";
            button.textContent = "Roll Dice";
            player_to_play = 2;
            console.log(`player to play is ${player_to_play}`)
            button.addEventListener("click", roll)
        }
        if (dieTwoValue == dieOneValue){
            comment.textContent = "Rolls were the same - White Player roll again"
            loops_of_inital_rolls = loops_of_inital_rolls +1
            player_one_not_rolled = true
            player_two_not_rolled = true
            start_game_roll()
        }
        })
    }
    else{
        console.log("Player Two Has Rolled")
    }

};

const start_game_roll = function(){
    if (loops_of_inital_rolls == 0){
        comment.textContent = 'White Player to Roll Dice First'
    }
    button.addEventListener("click", player_one_starting_roll,{once:true})

}

if (player_one_not_rolled){

    start_game_roll()
}


const range = (n) => Array.from({"length": n}, (ignore, k) => k);

const create_coordinates = function(column_index,row_index){
    if (row_index < 6){
        let coor = [grid_columns - 1 - column_index,row_index];
        return coor
   }
   if (row_index > 5){
       let coor = [14 + column_index, 11 - row_index];
       return coor
   }
}


const show_potential_move = function(Potential_Move,){
    cells.forEach(function(row,row_index){
        row.forEach(function(cell, column_index){
            if (create_coordinates(column_index,row_index)[0]==Potential_Move[0] && (create_coordinates(column_index,row_index)[1]==Potential_Move[1])){
                cell.classList.add("potential_move");
            }

            


        })
    })
    
}

const Make_Play = function(){
    const chosen_possible_move = coordinate
    const selectable2 = Backgammon.searchForArray(Available_Moves, coordinate);
    if (selectable2){
        board = Backgammon.ply(Player,board,chosen_counter,chosen_possible_move,[2,6])
        update_grid()
    }

};

const Show_Moves = function(coordinate,Player,board) {
    const chosen_counter = coordinate
    const selectable = Backgammon.Can_Counter_Be_Selected(Player,board,chosen_counter)
    if (selectable){
        if (Player ==1){
            cell.classList.add("white_selected")
        }
        if (Player ==2){
            cell.classList.add("black_selected")
        }
        console.log(coordinate)
        const Available_Moves = Backgammon.Possible_Moves(coordinate,board,[2,6],Player)
        console.log(Available_Moves)
        for (var i = 0; i < Available_Moves.length;i++){
            show_potential_move(Available_Moves[i],)
            

        }

    }

};


var Available_Moves = []
var chosen_counter = []
var Dice_Rolls = [1,1]

const cells = range(grid_rows).map(function (row_index) {
    // const row_index = grid_rows - row_index_inv;
    const row = document.createElement("div");
    row.className = "row";

    const rows = range(grid_columns).map(function (column_index) {

        const cell = document.createElement("div");
        cell.className = "cell";
        cell.coordinate = create_coordinates(column_index,row_index)
        // cell.textContent = (`${column_index},${row_index}`)
        // cell.textContent = (`${coordinate}`)


        let Selection_or_Play
        Selection_or_Play = "Selection"
        cell.clickcount = 0
        const Selectable_Counters = function(){
            let Selectable_Counters_List = []
            for(var i = 0; i < board.length;i++){
                for(var k = 0; k< board[i].length;k++){
                    if (Backgammon.Can_Counter_Be_Selected(player_to_play,board,[i,k])){
                        Selectable_Counters_List.push([i,k])
                    }
            
                }
            }
            return Selectable_Counters_List
        
        }

        cell.onclick = function(){ 
            if (Backgammon.is_ended(board)){
                if (Backgammon.is_winning_for_player(board,1)){
                    comment.textContent = "The White Player Has Won"
                }
                else{
                    comment.textContent = "The Black Player Has Won"

                }
            }

            console.log(Dice_Rolls[Dice_Rolls.length -1])
            if (Selection_or_Play == "Selection"){
                let selectable = Backgammon.Can_Counter_Be_Selected(player_to_play,board,cell.coordinate)
                Available_Moves.push(Backgammon.Possible_Moves(cell.coordinate,board,Dice_Rolls[Dice_Rolls.length -1],player_to_play))
                chosen_counter.push(cell.coordinate)
                console.log(chosen_counter)
                console.log(Available_Moves)
                if (selectable && Backgammon.searchForArray(Selectable_Counters(), cell.coordinate)){
                    update_grid(board)
                    if (player_to_play ==1){
                        cell.classList.add("white_selected")
                    }
                    if (player_to_play ==2){

                        cell.classList.add("black_selected")
                    }
                    console.log(cell.coordinate)
                    for (var i = 0; i < Available_Moves[Available_Moves.length -1].length;i++){
                        show_potential_move(Available_Moves[Available_Moves.length -1][i],)
                    }
                    Selection_or_Play = "Play"
                }
                if (selectable == false){
                    // console.log(cell.chosen_counter[cell.chosen_counter.length -2])
                    // console.log(cell.Available_Moves[cell.Available_Moves.length -2])
                    cell.addEventListener("click", Make_Move(Available_Moves[Available_Moves.length -2],chosen_counter[chosen_counter.length -2]))
                }
            }
        };

        function Make_Move(Available_Moves,chosen_counter){
            const chosen_possible_move = cell.coordinate
            const selectable = Backgammon.searchForArray(Available_Moves, chosen_possible_move);
            if (selectable){
                console.log("HI")
                board = Backgammon.ply(player_to_play,board,chosen_counter,chosen_possible_move,Dice_Rolls[Dice_Rolls.length -1])
                Dice_Rolls.push(Backgammon.Update_Dice_Roll(player_to_play,chosen_counter,chosen_possible_move,Dice_Rolls[Dice_Rolls.length -1]))
                console.log(Dice_Rolls[Dice_Rolls.length -1])
                // console.log(Backgammon.show(board))
                update_grid(board);
                player_to_play = Backgammon.Player_to_ply(player_to_play,board,Selectable_Counters(),Dice_Rolls[Dice_Rolls.length -1])

                comment.textContent = (`${Player_Colour(player_to_play)} Player to Play`)
                
            }
        }


        // cell.addEventListener("click", Display_Possible,);
        row.append(cell);
        return cell;
    });
    grid.append(row);
    return rows;
});




const update_grid = function (board) {
    cells.forEach(function (row) {
        row.forEach(function (cell) {
            let token = board[cell.coordinate[0]][cell.coordinate[1]];
            cell.classList.remove("empty");
            cell.classList.remove("counter_1");
            cell.classList.remove("counter_2");
            cell.classList.remove("white_selected");
            cell.classList.remove("black_selected");
            cell.classList.remove("potential_move")
            if (token === 0) {
                cell.classList.add("empty");
            }
            if (token === 1) {
                cell.classList.add("counter_1");
            }
            if (token === 2) {
                cell.classList.add("counter_2");
            }
        });
    });

};

update_grid(board);





function roll(){
    dice.forEach(function(die){
        die.classList.add("shake");
    });
    setTimeout(function(){
        dice.forEach(function(die){
            die.classList.remove("shake");
        });
        var dieOneValue = Math.floor(Math.random()*6);
        var dieTwoValue = Math.floor(Math.random()*6);
        console.log(dieOneValue,dieTwoValue);
        document.querySelector("#die-1").setAttribute("src", images[dieOneValue]);
        document.querySelector("#die-2").setAttribute("src", images[dieTwoValue]);

        const dice_result = Backgammon.Double_Similar_Rolls([dieOneValue+1,dieTwoValue+1])

        Dice_Rolls.push(dice_result)
        console.log(Dice_Rolls)

    },
    1000
    
    );

}
