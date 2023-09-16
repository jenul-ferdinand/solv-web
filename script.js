import { elemid, getRandomInt, lerp, formatNumber } from './helper.js'

/*======================================================================================================================
INSTANCE VARIABLES
======================================================================================================================*/

let repeating_request; 

// Marks
var marks = 0;
var marks_displayed = 0;
var mps = 0;

// Timing
var counter = 0;
var time_limit = 10;

// Question
var question_value = 1;
var bottom_value = 1;
var top_value = 10;
var seconds = 0; 

// Debugging
var debug_mode = true;
var solved = 0;
var paused = false;

// Upgrades
var upgrade_div = null;
var upgrade_image = null;
var upgrade_text = null;
var upgrade_cost = null;

const upgrade_purchaseable_color = 'chartreuse';
const upgrade_non_purchaseable_color = 'red';

var upgrades = [
    {name: 'pencil', cost: 2, value: 1},
    {name: 'mathematician', cost: 3, value: 1},
    {name: 'trigonometry', cost: 4, value: 4},
    {name: 'amphetamine', cost: 3000, value: 10},
    {name: 'artificial_intelligence', cost: 10_000, value: 40}, 
    {name: 'quantum_computing', cost: 40_000, value: 100},
    {name: 'space_travel', cost: 200_000, value: 400},
    {name: 'time_travel', cost: 1_500_000, value: 6666},
    {name: 'animal_sacrifice', cost: 123_666_444, value: 98_765},
    {name: 'undead_experiments', cost: 3_999_999_999, value: 999_999},
    {name: 'nuclear_warfare', cost: 75_000_000_000, value: 10_000_000}
]

// Loop for upgrades to initialise default values
upgrades.forEach(function(upgrade) {
    upgrade.originalCost = upgrade.cost;
    upgrade.numberOfPurchases = 0;
});




/*======================================================================================================================
GAME LOOP
========================================================================================================================*/

//window.onload = init;

window.addEventListener('load', init); 

function init() {

    // Run game loop before next repaint
    window.requestAnimationFrame(gameLoop);

    // Create the upgrades
    createUpgrades();

}

function gameLoop(timeStamp) {

    // * Checking and purchasing upgrades
    purchaseUpgrades();
 
    // * Displayed marks interpolation
    // Check if marks displayed is not equal to the marks
    if (marks_displayed !== marks) {

        // Determine whether to round up or down based on whether marks_displayed is less than marks
        let roundingFunction = marks_displayed < marks ? Math.ceil : Math.floor;
        
        // Lerp the marks, round as determined, and set the value
        marks_displayed = roundingFunction(lerp(marks_displayed, marks, 0.3));
        
        // Update the 'marks' element and log the value
        elemid('marks').innerHTML = formatNumber(marks_displayed);
        console.log(marks_displayed);

    }

    // * Marks per second
    counter++;
    if (counter >= 60) {
        // Increase the marks by the MPS
        marks += mps;

        // Increment the seconds timer
        seconds++;
        elemid('timer').innerHTML = (time_limit - seconds) + 1;
        console.log((time_limit - seconds) + 1);

        // Reset question
        if (seconds > time_limit) { 

            // Randomise values
            value1 = getRandomInt(1, 10);
            value2 = getRandomInt(1, 10); 
            elemid('value1').innerHTML = value1;
            elemid('value2').innerHTML = value2;
            
            // Reset seconds
            seconds = 0;
            elemid('timer').innerHTML = "OUT OF TIME!";
        }

        // Reset the counter
        counter = 0;
    }
 
    // * Request again
    repeating_request = window.requestAnimationFrame(gameLoop);
}




/*======================================================================================================================
RENDERING UPGRADES
======================================================================================================================*/

function createUpgrades() {
    // Store the upgrades container
    let upgrade_container = elemid("upgrades");

    // Upgrades loop
    for (let upgrade of upgrades) {

        //? === UPGRADE ===
        upgrade_div = document.createElement("div");
        upgrade_div.classList.add("upgrade"); 
        // Image
        upgrade_image = document.createElement("img");
        upgrade_image.src = `images/${upgrade.name}.png`;
        upgrade_image.classList.add("upgrade-image");
        // Text
        upgrade_text = document.createElement("div");
        upgrade_text.className = "upgrade-text";
        let capital_name = upgrade.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        upgrade_text.innerHTML = `${capital_name}<br><br><br>`;
        // Cost
        upgrade_cost = document.createElement("span");
        upgrade_cost.className = "cost";
        upgrade_cost.style.color = upgrade_non_purchaseable_color;
        upgrade_cost.textContent = `Price: ${upgrade.cost}`;

        upgrade_text.appendChild(upgrade_cost);
        upgrade_div.appendChild(upgrade_image);
        upgrade_div.appendChild(upgrade_text);
        upgrade_container.appendChild(upgrade_div);

        // Store the upgrade div in the upgrade
        upgrade.div = upgrade_div; 
        upgrade.image = upgrade_image;
        upgrade.text = upgrade_text;
        upgrade.cost_span = upgrade_cost;

        // Create a dark overlay div
        let dark_overlay = document.createElement('div');
        dark_overlay.className = 'overlay'; 
        upgrade.div.appendChild(dark_overlay);
        upgrade.dark_overlay = dark_overlay;

        //? === MOUSE OVER ===
        upgrade_div.addEventListener('mouseover', (event) => {
            // Get the tooltip element
            const tooltip = elemid('tooltip');

            // Set the tooltip content
            if (upgrade.name == 'pencil') {
                tooltip.innerHTML = `${upgrade.name.toUpperCase()}<br><br>+${upgrade.value} qv<br><br>${upgrade.numberOfPurchases} ${upgrade.name}'s giving ${upgrade.value * upgrade.numberOfPurchases} question value`;
            } else {
                tooltip.innerHTML = `${upgrade.name.toUpperCase()}<br><br>+${upgrade.value} mps<br><br>${upgrade.numberOfPurchases} ${upgrade.name}'s getting ${upgrade.value * upgrade.numberOfPurchases} marks per second`;
            }
            
            // Get the upgrade element's dimensions and position
            const upgradeRect = upgrade_div.getBoundingClientRect();
            const upgradeX = upgradeRect.left;
            const upgradeY = upgradeRect.top;

            // Calculate the tooltip position based on the mouse position
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipX = upgradeX - upgradeRect.width - 60;
            const tooltipY = event.clientY;

            tooltip.style.width = `${upgradeRect.width}px`;

            // Position and show the tooltip
            tooltip.style.left = `${tooltipX}px`;
            tooltip.style.top = `${tooltipY}px`;
            tooltip.style.display = 'block';
        });

        //? === MOUSE OUT ===
        upgrade_div.addEventListener('mouseout', () => {
            // Hide the tooltip
            const tooltip = elemid('tooltip');
            tooltip.style.display = 'none';
        });
    }
}

function purchaseUpgrades() {
    function upgradeAdjust(color, overlay_opacity, upgrade) {
        if (upgrade.cost_span.style.color != color) {
                    
            upgrade.dark_overlay.style.opacity = overlay_opacity;
    
            upgrade.cost_span.style.color = color;
        }
    }

    // Loop through the upgrades
    for (let upgrade of upgrades) {

        //* SUFFICIENT FUNDS
        if (marks >= upgrade.cost) {

            // Change the colour
            upgradeAdjust(upgrade_purchaseable_color, 0, upgrade);

            //? === PURCHASE UPGRADE ===
            upgrade.div.onclick = function() {
                if (marks >= upgrade.cost) {
                    
                    // Deduct cost from marks
                    marks -= upgrade.cost;
                    
                    // Increment no. of purchases
                    upgrade.numberOfPurchases++; 

                    // Increase the cost
                    upgrade.cost = upgrade.originalCost * (1 + 2 * upgrade.numberOfPurchases);
                    upgrade.cost_span.textContent = `Price: ${upgrade.cost}`;

                    // Reap the benefits
                    if (upgrade.name == 'pencil') {
                        question_value++;
                        elemid('question-value').innerHTML = formatNumber(question_value);
                    } else { 
                        mps += upgrade.value;
                        elemid('marks-per-second').innerHTML = formatNumber(mps);
                    }
                    
                    // Flash bang effect on upgrade div
                    let flash = document.createElement('div'); 
                    flash.className = 'flash'; 
                    this.appendChild(flash);

                    // After a delay, remove the flash overlay
                    setTimeout(function() { flash.parentNode.removeChild(flash); }, 250);

                    // Debugging
                    console.log(`Purchase Upgrade: ${upgrade.name} for ${upgrade.cost} marks`);
                }
            }
        } 

        //! INSUFFICIENT FUNDS
        else if (marks < upgrade.cost) {
            // Change the colour 
            upgradeAdjust(upgrade_non_purchaseable_color, 0.5, upgrade);
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

            // Increment 'solved' count
            solved++;

            // Reset the seconds
            seconds = 0;
            elemid("timer").innerHTML = time_limit;
            
            // Debugging
            console.log(`Correct, Marks: ${marks}`);

            // Confetti
            confetti({
                particleCount: 100,
                spread: 360,
                startVelocity: 30,
                origin: {
                    x: Math.random(),
                    y: Math.random()
                }
            });
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
            console.log("Paused");
        }
    }
});




/*======================================================================================================================
DEBUG MODE
======================================================================================================================*/

document.addEventListener("keydown", (event) => {
    if (event.key == '=' && debug_mode) {
        marks += 100_000;
    } 
    else if (event.key == '-' && debug_mode) {
        marks -= 100_000;
    }
});




/*======================================================================================================================
REFERENCES:

- Game loop concept is adapted from: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
- Some game concepts are inspired from Cookie Clicker by Orteil: https://orteil.dashnet.org/cookieclicker/ 
======================================================================================================================*/
