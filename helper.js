/*======================================================================================================================
HELPER FUNCTIONS
======================================================================================================================*/

// GetElementId Helper
export function elemid(id) { 
    return document.getElementById(id); 
}

// Random Range (Integer)
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);

    // Return a random value between the min and max
    // Both min and max are inclusive
}

// Linear Interpolation 
export function lerp(start, stop, magnitude) {
    return start + magnitude * (stop - start); 
}

// Large number representation
export function formatNumber(number) {
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