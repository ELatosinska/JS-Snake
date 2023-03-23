class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals(x, y) {
    return x == this.x && y == this.y;
  }
}

var canvas;
var scoreDiv = document.getElementById('score');
var timeout;
var score;
var ctx; //uchwyt kontekstu tkaniny pozwalający na operowanie na niej
var axis, direction; //kierunek poruszania sie snake'a
var snake_coordinates; //koordynaty snake'a
var snake_x, snake_y; //zmienne pozycji glowy snake'a
var apple_x, apple_y; //pozycja jablka
var welcome_screen = true; // stan ekranu powitalnego
var width, height; // rozmiar canvas
/**
 * funkcja rysująca bohatera na tkaninie
 */
function draw_hero() {
  ctx.save() //zachowanie stanu kontekstu
  ctx.fillStyle = 'rgba(0, 255, 0, 1)'; //ustawienie koloru wypelnienia
  ctx.strokeStyle = 'rgba(0, 100, 0, 1)'; // kolor obramowania
  for (let i = 0; i < snake_coordinates.length; i++) {
    ctx.lineWidth = 1; // grubosc obramowania
    ctx.fillRect(snake_coordinates[i].x, snake_coordinates[i].y, 10, 10) //narysowanie modulu weza
    ctx.strokeRect(snake_coordinates[i].x, snake_coordinates[i].y, 10, 10) //obramowanie modulu weza
  }
  ctx.restore() //przywrocenie stanu kontekstu
}

function move_hero() {
  eval("snake_" + axis + '+=' + direction);
  if (snake_x == -10) {
    snake_x = width - 10;
  } else if (snake_y == -10) {
    snake_y = height - 10
  } else if (snake_x == width) {
    snake_x = 0
  } else if (snake_y == height) {
    snake_y = 0
  }
  //FIXME: czasem nie generuje jablek po zjedzeniu
  if (!isEaten()) {
    snake_coordinates.shift();
  } else {
    scoreDiv.innerHTML = "Score: " + ++score;
    generate_new_apple()
  }

  if (snake_coordinates.some(coordinates => coordinates.equals(snake_x, snake_y))) { //FIXME: pozwala zawrocic jesli waz ma dlugosc 2
    game_over()
  }
  snake_coordinates.push(new Coordinates(snake_x, snake_y))
}

function draw_apple() {
  ctx.save()
  ctx.fillStyle = 'rgba(255, 0, 0, 1)';
  ctx.fillRect(apple_x, apple_y, 10, 10);
}

function generate_new_apple() {
  do {
    apple_x = (Math.random() * width / 10).toFixed(0) * 10
    apple_y = (Math.random() * height / 10).toFixed(0) * 10
  } while (snake_coordinates.some(coordinates => coordinates.equals(apple_x, apple_y)))
}

function isEaten() {
  return (apple_x == snake_x && apple_y == snake_y)
}

/**
 *funkcja wywolywana cyklicznie przerysowujaca tkanine
 */
function redraw() {
  ctx.clearRect(0, 0, width, height) //czyszczenie tkaniny
  timeout = window.setTimeout(redraw, 1000 - snake_coordinates.length * 5)
  move_hero()
  draw_hero()
  draw_apple()
}

/**
 *funkcja inicjalizujaca gre i tworzaca ekran powitalny
 */
function init() {
  window.addEventListener("keydown", keyListener, false)
    //skojarzenie funkcji obslugi klawiatury ze zdarzeniem

  canvas = document.getElementById('game')
    //pobranie wskaznika na element tkaniny
  width = canvas.width
  height = canvas.height
  snake_x = width / 2
  snake_y = height / 2 + 50
  snake_coordinates = []
  axis = 'y'
  direction = -10
  score = 0
  ctx = canvas.getContext('2d')
    //pobranie kontekstu grafiki 2d dla tkaniny

  ctx.clearRect(0, 0, width, height)
  ctx.font = '48px sans-serif'
  ctx.textAlign = 'center'
    //ustawienie dla tkaniny kroju pisma i sposobu wyrownania tekstu

  ctx.fillText('Ready player one?', width / 2, height / 2)
    //umieszczenie napisu naekranie powitalnym

  snake_coordinates.push(new Coordinates(snake_x, snake_y))
  draw_hero()

  scoreDiv.innerHTML = "Score: " + score;
}

/**
 *funkcja obslugi klawiatury
 */
function keyListener(e) {
  if (welcome_screen) { //jesli ekran powitalny to wyczysc
    ctx.clearRect(0, 0, width, height)
    welcome_screen = false;
    generate_new_apple()
    redraw()
      //window.setInterval(redraw, 1000) //podlaczenie funkcji przerysowania tkaniny
  }
  switch (e.keyCode) {
    case 37: //strzalka w lewo
      axis = "x";
      direction = -10;
      break;
    case 38: //strzalka w gore
      axis = "y";
      direction = "-10";
      break;
    case 39: //strzalka w prawo
      axis = "x";
      direction = 10;
      break;
    case 40: //strzalka w dol
      axis = "y";
      direction = 10;
      break;
  }
}

function game_over() {
  window.clearTimeout(timeout);
  ctx.fillText('Game over, your score: ' + score, width / 2, height / 2);
}

document.onload = init()
document.getElementById('reset').onclick = function() {
  welcome_screen = true;
  clearTimeout(timeout)
  init();
}