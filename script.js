// Variables
var marks = 0;
var marksDisplayed = 0; 
var questionValue = 30;

// Game Loop                                                                    source: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
window.onload = init;
function init() {
    // Request the game loop to be run
    window.requestAnimationFrame(gameLoop)
}

function gameLoop(timeStamp) {
    
    // Lerp the displayed marks
    if (marksDisplayed < marks) {
        marksDisplayed = Math.ceil(lerp(marksDisplayed, marks, 0.3));
        document.getElementById('marks').innerHTML = marksDisplayed;

        // Debugging
        console.log(marksDisplayed);
    } 

    // Request again
    window.requestAnimationFrame(gameLoop);
}

// Event Listener
document.addEventListener("keydown", (event) => {
    // If the user submits the answer
    if (event.key === 'Enter') {
        // Get values
        var value1 = parseInt(document.getElementById('value1').innerHTML);
        var value2 = parseInt(document.getElementById('value2').innerHTML);
        var answer = document.getElementById('answer').value;
        
        // Check if the input was correct
        if (value1 + value2 == answer) { 
            // Randomise values
            value1 = getRandomInt(1, 10);                                 
            value2 = getRandomInt(1, 10);                                  
            document.getElementById('value1').innerHTML = value1; 
            document.getElementById('value2').innerHTML = value2;

            marks += questionValue;                                             // Add Marks
            document.getElementById('answer').value = "";                       // Clear the input
            document.getElementById('correct').play();                          // Play sound effect

            // Debugging
            console.log('Correct, Marks:' + marks);
        } else {
            // Debugging
            console.log('Wrong.');
        }
    }
});


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