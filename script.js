/*======================================================================================================================
INSTANCE VARIABLES
======================================================================================================================*/

var marks = 0;
var marksDisplayed = 0; 
var questionValue = 30;




/*======================================================================================================================
GAME LOOP
========================================================================================================================*/

window.onload = init;
function init() {
    // Request the game loop to be run
    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp) {
    
    // Lerp the displayed marks
    if (marksDisplayed < marks) {
        marksDisplayed = Math.ceil(lerp(marksDisplayed, marks, 0.3));
        elemid('marks').innerHTML = marksDisplayed;

        // Debugging
        console.log(marksDisplayed);
    } 

    // Request again
    window.requestAnimationFrame(gameLoop);
}




/*======================================================================================================================
SUBMISSION OF ANSWER
======================================================================================================================*/

document.addEventListener("keydown", (event) => {
    // If the user submits the answer
    if (event.key === 'Enter') {
        // Get values
        var value1 = parseInt(elemid('value1').innerHTML);
        var value2 = parseInt(elemid('value2').innerHTML);
        var answer = elemid('answer').value;
        
        // Check if the input was correct
        if (value1 + value2 == answer) { 
            // Randomise values
            value1 = getRandomInt(1, 10);                                 
            value2 = getRandomInt(1, 10);                                  
            elemid('value1').innerHTML = value1; 
            elemid('value2').innerHTML = value2;
            
            // Add Marks
            marks += questionValue;    

            // Clear the input                                 
            elemid('answer').value = "";    

            // Play sound effect                           
            elemid('correct').play();                                           
            
            // Debugging
            console.log(`Correct, Marks: ${marks}`);
        } else {
            // Debugging
            console.log('Wrong.');
        }
    }
});




/*======================================================================================================================
HELPER FUNCTIONS
======================================================================================================================*/

// GetElementId Helper
function elemid(id) { 
    return document.getElementById(id); 
}

// Random Range (Integer)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);

    // Return a random value between the min and max
    // *Both min and max are inclusive
}

// Linear Interpolation 
function lerp(start, stop, magnitude) {
    return start + magnitude * (stop - start); 
}




/*======================================================================================================================
REFERENCES:

- Game loop concept is adapted from: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
======================================================================================================================*/
