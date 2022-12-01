// Variables
var marks = 0;
var question_value = 1;
var arithmetic = document.getElementById('arithmetic');

// Add Marks
function addMarks() {
    marks += question_value;

    document.getElementById('count').innerHTML = marks;

    // Add the question value to the marks
    // Set the inner html to marks
}

// Event Listener
document.addEventListener("keydown", (event) => {
    // If the user submits the answer
    if (event.key === 'Enter') {

        // Get values
        var value1 = parseInt(document.getElementById('value1').innerHTML);
        var value2 = parseInt(document.getElementById('value2').innerHTML);
        var answer = document.getElementById('answer').value; 
        
        // Check Arithmetic
        if (value1 + value2 == answer) { 
            // Add marks
            addMarks();
        }
        
    }
});