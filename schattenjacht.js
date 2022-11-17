"use strict";
// Variabelen HTML elementen + extra's
let spelbord = document.getElementById("spelbord");
let stats = document.getElementById("stats");
let audioTreasure = new Audio("audio/treasure.wav");
let audioDeath = new Audio("audio/death.wav");
let treasures = 0;

// Objecten
class Spelbord {
    #row;
    #col;
    constructor(row, col) {
        this.#row = row;
        this.#col = col;
    }
    maakSpelbord() {
        let row = this.#row;
        let col = this.#col;
        for (let i = 0; i < (row + 2); i++) {
            let tr = spelbord.insertRow();
            for (let j = 0; j < (col + 2); j++) {
                tr.insertCell();
            }
        }
        let playerRow = spelbord.rows[1];
        let playerCell = playerRow.cells[1];
        playerCell.setAttribute("id", "player");
        let enemyRow = spelbord.rows[row];
        let enemyCell = enemyRow.cells[col];
        enemyCell.setAttribute("id", "enemy");
        spelbord.rows[0].cells[0].setAttribute("id", "cornertopleft");
        spelbord.rows[0].cells[col + 1].setAttribute("id", "cornertopright");
        spelbord.rows[row + 1].cells[0].setAttribute("id", "cornerbottomleft");
        spelbord.rows[row + 1].cells[col + 1].setAttribute("id", "cornerbottomright");
        for (let i = 1; i <= (col); i++) {
            spelbord.rows[0].cells[i].setAttribute("class", "bordertop");
            spelbord.rows[i].cells[col + 1].setAttribute("class", "borderright");
        }
        for (let i = 1; i <= (row); i++) {
            spelbord.rows[i].cells[0].setAttribute("class", "borderleft");
            spelbord.rows[row + 1].cells[i].setAttribute("class", "borderbottom");
        }
    }
}

class Muren {
    #aantal;
    constructor(aantal) {
        this.#aantal = aantal;
    }
    zetMuren() {
        let aantal = this.#aantal;
        let aantalRijen = -1;
        let aantalKolommen = -1;
        for (let i = 0; i < spelbord.rows.length; i++) {
            aantalRijen += 1;
        }
        for (let j = 0; j < spelbord.rows[0].cells.length; j++) {
            aantalKolommen += 1;
        }
        for (let e = 0; e < aantal; e++) {
            let rij = Math.floor(Math.random() * (aantalRijen - 1) + 1);
            let kolom = Math.floor(Math.random() * (aantalKolommen - 1) + 1);
            let cel = spelbord.rows[rij].cells[kolom];
            while (cel.classList.contains("wall")) {
                rij = Math.floor(Math.random() * (aantalRijen - 1) + 1);
                kolom = Math.floor(Math.random() * (aantalKolommen - 1) + 1);
                cel = spelbord.rows[rij].cells[kolom];
            }
            cel.setAttribute("class", "wall");
        }
    }
}

class Schatten {
    #aantal;
    constructor(aantal) {
        this.#aantal = aantal;
    }
    zetSchatten() {
        let aantal = this.#aantal;
        let aantalRijen = -1;
        let aantalKolommen = -1;
        for (let i = 0; i < spelbord.rows.length; i++) {
            aantalRijen += 1;
        }
        for (let j = 0; j < spelbord.rows[0].cells.length; j++) {
            aantalKolommen += 1;
        }
        for (let e = 0; e < aantal; e++) {
            let rij = Math.floor(Math.random() * (aantalRijen - 1) + 1);
            let kolom = Math.floor(Math.random() * (aantalKolommen - 1) + 1);
            let cel = spelbord.rows[rij].cells[kolom];
            while (cel.classList.contains("wall") || cel.classList.contains("treasure")) {
                rij = Math.floor(Math.random() * (aantalRijen - 1) + 1);
                kolom = Math.floor(Math.random() * (aantalKolommen - 1) + 1);
                cel = spelbord.rows[rij].cells[kolom];
            }
            cel.setAttribute("class", "treasure");
            treasures += 1;
        }
    }
}

class Statistieken {
    #lives;
    #score;
    constructor(lives) {
        this.#lives = lives;
        this.#score = 0;
    }
    zetStatistieken() {
        stats.innerHTML = "Levens: " + this.#lives + " - Score: " + this.#score;
    }
    schatGeopend() {
        audioTreasure.play();
        this.#score += 100;
        stats.innerHTML = "Levens: " + this.#lives + " - Score: " + this.#score;
        if (this.#score == treasures * 100) {
            setTimeout(function() {
                alert("Gewonnen!");
                location.reload();
            }, 10);
            return;
        }
    }
    levenVerloren() {
        this.#lives -= 1;
        audioDeath.play();
        stats.innerHTML = "Levens: " + this.#lives + " - Score: " + this.#score;
        if (this.#lives == 0) {
            alert("Game over. Score = " + this.#score);
            location.reload();
            return;
        }
    }
}

// Extra functie's
let i = 0;
function animateVijand() {
    let img = ['url("img/slime.png")', 'url("img/slime2.png")', 'url("img/slime.png")', 'url("img/slime3.png")'];
    let enemy = document.getElementById("enemy");
    enemy.style.backgroundImage = img[i];
    i = (i + 1) % img.length;
}
setInterval(animateVijand, 400);

// Spel maken
let statistieken = new Statistieken(3);
statistieken.zetStatistieken();
let speelveld = new Spelbord(10, 10);
speelveld.maakSpelbord();
let muren = new Muren(15);
muren.zetMuren();
let schatten = new Schatten(5);
schatten.zetSchatten();

// Functie bewegen
function move(rij, kolom, rijEnemy, kolomEnemy, borderPlayer, borderEnemy) {
    let celBefore = playerPosition;
    let celAfter = spelbord.rows[rij].cells[kolom];
    let celBeforeEnemy = enemyPosition;
    let celAfterEnemy = spelbord.rows[rijEnemy].cells[kolomEnemy];
    if (celAfter.classList.contains("wall")) {
        celAfter = celBefore;
    }
    if (celAfterEnemy.classList.contains("wall")) {
        celAfterEnemy = celBeforeEnemy;
    }
    if (celAfterEnemy == celBefore || celAfterEnemy == celAfter) {
        statistieken.levenVerloren();
        celBefore.removeAttribute("id");
        celAfter.removeAttribute("id");
        celBeforeEnemy.removeAttribute("id");
        celAfterEnemy.removeAttribute("id");
        celBeforeEnemy.removeAttribute("style");
        playerPosition = spelbord.rows[1].cells[1];
        playerPosition.setAttribute("id", "player");
        enemyPosition = spelbord.rows[aantalRijen - 2].cells[aantalKolommen - 2];
        enemyPosition.setAttribute("id", "enemy");
        return;
    }
    if (celAfter.classList.contains(borderPlayer)) {
        celAfter = celBefore;
    }
    if (celAfterEnemy.classList.contains(borderEnemy)) {
        celAfterEnemy = celBeforeEnemy;
    }
    if (celAfter.classList.contains("treasure")) {
        celAfter.classList.remove("treasure");
        celAfter.setAttribute("class", "treasureOpen");
        statistieken.schatGeopend();
    }
    playerPosition = celAfter;
    enemyPosition = celAfterEnemy;
    celBeforeEnemy.removeAttribute("id");
    celBeforeEnemy.removeAttribute("style");
    celBefore.removeAttribute("id");
    celAfter.setAttribute("id", "player");
    celAfterEnemy.setAttribute("id", "enemy");
    return playerPosition, enemyPosition;
}

// Interactie
let playerPosition = document.getElementById("player");
let enemyPosition = document.getElementById("enemy");
// let aantalKolommen = spelbord.rows[0].cells.length;
// let aantalRijen = spelbord.rows.length;
window.addEventListener("keydown", function (event) {
    if (event.code == "ArrowDown") {
        move(playerPosition.parentNode.rowIndex + 1, playerPosition.cellIndex, enemyPosition.parentNode.rowIndex - 1, enemyPosition.cellIndex, "borderbottom", "bordertop");
    }
    if (event.code == "ArrowUp") {
        move(playerPosition.parentNode.rowIndex - 1, playerPosition.cellIndex, enemyPosition.parentNode.rowIndex + 1, enemyPosition.cellIndex, "bordertop", "borderbottom");
    }
    if (event.code == "ArrowRight") {
        move(playerPosition.parentNode.rowIndex, playerPosition.cellIndex + 1, enemyPosition.parentNode.rowIndex, enemyPosition.cellIndex - 1, "borderright", "borderleft");
    }
    if (event.code == "ArrowLeft") {
        move(playerPosition.parentNode.rowIndex, playerPosition.cellIndex - 1, enemyPosition.parentNode.rowIndex, enemyPosition.cellIndex + 1, "borderleft", "borderright");
    }
})