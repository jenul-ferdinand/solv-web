/*======================================================================================================================
INSTANCE VARIABLES
======================================================================================================================*/

// Marks per second
var mps = 0;
var mps_counter = 0;
var bottom_value = 1;
var top_value = 10;

// Debugging
var debug_mode = true;
var solved = 0;
var paused = false;

// Upgrades
var upgrade_container = null;
var upgrade_div = null;
var upgrade_image = null;
var upgrade_text = null; 
var upgrade_cost = null; 
var overlay = null;

const upgrade_purchaseable_color = 'chartreuse';
const upgrade_non_purchaseable_color = 'red';

// Sounds
const sound_upgrade_purchase = new Audio('audio/correct.mp3');

class Upgrade { 
    constructor(name, cost, value) {
        this.name = name;
        this.cost = cost;
        this.originalCost = cost;
        this.value = value;
        this.numberOfPurchases = 0;
    }

    purchase() { 
        if (marks >= this.cost) {
            marks -= this.cost;
            this.numberOfPurchases++;
            this.cost = this.originalCost * (1 + 2 * this.numberOfPurchases);
            return true;
        }

        return false;
    }
}

class Game {
    constructor() {
        this.marks = 0;
        this.marksDisplayed = 0;
        this.mps = 0;
        this.mpsCounter = 0;
        this.paused = false;
        this.upgrades = [
            new Upgrade('pencil', 2, 1),
            new Upgrade('mathematician', 3, 1),
            new Upgrade('trigonometry', 4, 4),
            new Upgrade('amphetamine', 3000, 10),
            new Upgrade('artificial_intelligence', 10000, 40),
            new Upgrade('quantum_computing', 40000, 100),
            new Upgrade('space_travel', 200000, 400),
            new Upgrade('time_travel', 1500000, 6666),
            new Upgrade('animal_sacrifice', 123666444, 98765),
            new Upgrade('undead_experiments', 3999999999, 999999),
            new Upgrade('nuclear_warfare', 75000000000, 10000000)
        ];
    }

    init() {
        window.addEventListener('load', () => {
            this.gameLoop();
            this.createUpgrades();
        });
    }

    gameLoop() {
        // * Checking and purchasing upgrades
        this.purchaseUpgrades();

        // * Displayed marks interpolation
        // Check if marks displayed is not equal to the marks
        if (this.marks_displayed !== this.marks) {

            // Determine whether to round up or down based on whether marks_displayed is less than marks
            let roundingFunction = this.marks_displayed < this.marks ? Math.ceil : Math.floor;
            
            // Lerp the marks, round as determined, and set the value
            this.marks_displayed = roundingFunction(lerp(this.marks_displayed, this.marks, 0.3));
            
            // Update the 'marks' element and log the value
            elemid('marks').innerHTML = formatNumber(this.marks_displayed);
            console.log(this.marks_displayed);

        }

        // * Marks per second
        this.mps_counter++;
        if (this.mps_counter >= 60) {
            this.marks += this.mps;

            this.mps_counter = 0;
        }

        // * Request again
        window.requestAnimationFrame(() => this.gameLoop());
    }

    createUpgrades() {
        // Store the upgrades container
        let upgrade_container = elemid("upgrades");

        // Upgrades loop
        for (let upgrade of this.upgrades) {

            // Upgrade
            upgrade_div = document.createElement("div");
            upgrade_div.classList.add("upgrade"); 
            // Image
            upgrade_image = document.createElement("img");
            upgrade_image.src = `images/${upgrade.name}.png`;
            upgrade_image.classList.add("upgrade-image");
            // Text
            upgrade_text = document.createElement("div");
            upgrade_text.className = "upgrade-text";
            var capital_name = upgrade.name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
                    tooltip.innerHTML = `${upgrade.name}<br><br>+${upgrade.value} qv<br><br>${upgrade.numberOfPurchases} ${upgrade.name} giving ${upgrade.value * upgrade.numberOfPurchases} question value`;
                } else {
                    tooltip.innerHTML = `${upgrade.name}<br><br>+${upgrade.value} mps<br><br>${upgrade.numberOfPurchases} ${upgrade.name} getting ${upgrade.value * upgrade.numberOfPurchases} marks per second`;
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

            // Add event listener for tooltip hide
            upgrade_div.addEventListener('mouseout', () => {
                // Hide the tooltip
                const tooltip = elemid('tooltip');
                tooltip.style.display = 'none';
            });
        }
    }

    purchaseUpgrades() {
        for (let upgrade of this.upgrades) {
    
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
}

const game = new Game();
game.init();

/*======================================================================================================================
GAME LOOP
========================================================================================================================*/


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
            game.marks += game.question_value;    

            // Clear the input                                 
            elemid('answer').value = "";    

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




/*======================================================================================================================
DEBUG MODE
======================================================================================================================*/

document.addEventListener("keydown", (event) => {
    if (event.key == '=') {
        marks += 100_000;
    } 
    else if (event.key == '-') {
        marks -= 100_000;
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

// Change the upgrade's price text colour and overlay opacity
function upgradeAdjust(color, overlay_opacity, upgrade) {
    if (upgrade.cost_span.style.color != color) {
                
        upgrade.dark_overlay.style.opacity = overlay_opacity;

        upgrade.cost_span.style.color = color;
    }
}

// Large number representation
function formatNumber(number) {
    if (number < 1_000_000) { return number }; 

    const suffixes = [
        "",
        "Thousand",
        "Million",
        "Billion",
        "Trillion",
        "Quadrillion",
        "Quintillion",
        "Sextillion",
        "Septillion",
        "Octillion",
        "Nonillion",
        "Decillion",
        "Undecillion",
        "Duodecillion",
        "Tredecillion",
        "Quattuordecillion",
        "Quindecillion",
        "Sexdecillion",
        "Septendecillion",
        "Octodecillion",
        "Novemdecillion",
        "Vigintillion",
    ];

    const base = 1000;
    let index = 0;

    while (number >= base) {
        number /= base;
        index++;
    }

    const roundedNumber = Math.round(number * 1000) / 1000; // Round to one decimal place

    return `${roundedNumber} ${suffixes[index]}`;
}


/*======================================================================================================================
REFERENCES:

- Game loop concept is adapted from: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/create-a-proper-game-loop-with-requestanimationframe
- Some game concepts are inspired from Cookie Clicker by Orteil: https://orteil.dashnet.org/cookieclicker/ 
======================================================================================================================*/
