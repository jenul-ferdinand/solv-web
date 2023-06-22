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
    {name: 'pencil', cost: 2},
    {name: 'amphetamine', cost: 3},
    {name: 'animal_sacrifice', cost: 4}
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

    // * Render the upgrades
    renderUpgrades();
    
    // * Displayed marks interpolation
    // Check if marks displayed is not equal to the marks
    if (marks_displayed !== marks) {

        // Determine whether to round up or down based on whether marks_displayed is less than marks
        let roundingFunction = marks_displayed < marks ? Math.ceil : Math.floor;
        
        // Lerp the marks, round as determined, and set the value
        marks_displayed = roundingFunction(lerp(marks_displayed, marks, 0.3));
        
        // Update the 'marks' element and log the value
        elemid('marks').innerHTML = marks_displayed;
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
        
        // Set a unique id for each upgrade
        let upgrade_id = `${upgrade.name}-${upgrade.cost}-${upgrade.value}`;

        // Store the current upgrade based on it's id
        let upgrade_element = elemid(upgrade_id); 
        
        // When we have sufficient funds and upgrade doesn't exist
        if (marks >= upgrade.cost && !upgrade_element) {

            // Upgrade
            let upgrade_div = document.createElement("div");
            upgrade_div.id = upgrade_id;
            upgrade_div.classList.add("upgrade"); 

            // Image
            let upgrade_image = document.createElement("img");
            upgrade_image.src = `images/${upgrade.name}.png`;
            upgrade_image.classList.add("upgrade-image");

            // Text
            let upgrade_text = document.createElement("div");
            upgrade_text.className = "upgrade-text";
            
            // Format the words in the name ('hello_world' -> 'Hello World')
            let capital_name = upgrade.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

            upgrade_text.innerHTML = `${capital_name}<br><br><br>`;

            // Cost
            let upgrade_cost = document.createElement("span");
            upgrade_cost.className = "cost";
            upgrade_cost.style.color = 'chartreuse'; 
            upgrade_cost.textContent = `Price: ${upgrade.cost}`;

            // Append cost to text div
            upgrade_text.appendChild(upgrade_cost);

            // Append to the parent upgrade_div
            upgrade_div.appendChild(upgrade_image);
            upgrade_div.appendChild(upgrade_text);



            // Purchasing upgrade
            upgrade_div.onclick = function() {

                // We must have sufficient funds
                if (marks >= upgrade.cost) {
                    
                    marks -= upgrade.cost; // Deduct the cost
                    
                    let flash = document.createElement('div'); // Create the flash overlay
                    flash.className = 'flash'; // Assign it the class "flash"
                    this.appendChild(flash); // Append it to the upgrade

                    // After a delay, remove the flash overlay
                    setTimeout(function() {
                        flash.parentNode.removeChild(flash);
                    }, 250);

                    console.log(`Purchase Upgrade: ${upgrade.name} for ${upgrade.cost} marks`);
                }
            }

            // Append the upgrade to the "upgrades" container
            upgrade_container.appendChild(upgrade_div);
            
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
