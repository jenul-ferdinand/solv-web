/*======================================================================================================================
INSTANCE VARIABLES
======================================================================================================================*/

// Marks
var marks = 0;
var marks_displayed = 0; 

// Marks per second
var mps = 0;
var mps_counter = 0;

// Question
var question_value = 1;
var bottom_value = 1;
var top_value = 10;

// Debugging
var solved = 0;
var paused = false;

// Upgrades
var upgrades = [
    {name: 'Testing', cost: 2},
    {name: 'Lorem', cost: 3},
    {name: 'Ipsum', cost: 4}
]


/*======================================================================================================================
GAME LOOP
========================================================================================================================*/

//window.onload = init;

window.addEventListener('load', init); 

function init() {

    // * Run game loop before next repaint
    window.requestAnimationFrame(gameLoop);

}

function gameLoop(timeStamp) {

    renderUpgrades();
    
    // * Displayed marks interpolation
    if (marks_displayed < marks) {
        marks_displayed = Math.ceil(lerp(marks_displayed, marks, 0.3));
        elemid('marks').innerHTML = marks_displayed;

        // Debugging
        console.log(marks_displayed);
    } 

    // * Marks per second
    mps_counter++;
    if (mps_counter >= 60) {
        marks += mps;

        mps_counter = 0;
    }

    // * Request again
    repeating_request = window.requestAnimationFrame(gameLoop);
}




/*======================================================================================================================
RENDERING UPGRADES
======================================================================================================================*/

function renderUpgrades() {
    // Store the upgrades container
    let upgrade_container = document.getElementById("upgrades");

    // Loop through each upgrade of the upgrades list
    for (let upgrade of upgrades) {
        
        let upgrade_id = `${upgrade.name}-${upgrade.cost}-${upgrade.value}`;
        let upgrade_element = elemid(upgrade_id); 
        
        // When we have sufficient funds and upgrade doesn't exist
        if (marks >= upgrade.cost && !upgrade_element) {

            // Division for the upgrade
            let div = document.createElement("div");

            // Set the id
            div.id = upgrade_id;

            // Set the innerHTML
            div.innerHTML = `Name: ${upgrade.name}<br>Cost: ${upgrade.cost}<br>Value: ${upgrade.value}`; 

            // Append the upgrade to the "upgrades" container
            upgrade_container.appendChild(div);
            
            // ? Debugging
            console.log(`Create Upgrade: ${upgrade.name}`);
        
        } 
        // Insufficient funds condition and upgrade exists
        else if (marks < upgrade.cost && upgrade_element) {
            
            // Remove the upgrade
            upgrade_container.removeChild(upgrade_element);
            
            // ? Debugging
            console.log(`Remove Upgrade: ${upgrade.name}`); 
        }
    }
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
            value1 = getRandomInt(bottom_value, top_value);  
            value2 = getRandomInt(bottom_value, top_value);
            elemid('value1').innerHTML = value1; 
            elemid('value2').innerHTML = value2;
            
            // Add Marks
            marks += question_value;    

            // Clear the input                                 
            elemid('answer').value = "";    

            // Play sound effect                           
            //elemid('correct').play();     
            
            // Increment 'solved' count
            solved++;
            
            // Debugging
            console.log(`Correct, Marks: ${marks}`);
        } else {
            // Debugging
            console.log('Wrong.');
        }
    }
});




/*======================================================================================================================
PAUSING GAME
========================================================================================================================*/

document.addEventListener("keyup", (event) => {
    if (event.key === 'Escape') {
        if (paused) {
            // Un-paused
            paused = false;
            
            // Restart the animation frame
            window.requestAnimationFrame(gameLoop);
            console.log("Un-Pause");
        } else {
            // Pause
            paused = true;
            
            // Cancel the animation frame
            window.cancelAnimationFrame(repeating_request);
            console.log("Pause");
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
    // Both min and max are inclusive
}

// Linear Interpolation 
function lerp(start, stop, magnitude) {
    return start + magnitude * (stop - start); 
}




/*======================================================================================================================
REFERENCES:

- Game loop concept is adapted from: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
======================================================================================================================*/
