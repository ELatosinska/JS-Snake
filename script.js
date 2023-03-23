class Coordinates {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

var canvas;
var ctx; //uchwyt kontekstu tkaniny pozwalający na operowanie na niej
var axis, direction;
var snake_coordinates = []
var snake_x, snake_y; //zmienne pozycji bohatera
var apple_x, apple_y;
var welcome_screen = true; // stan ekranu powitalnego
var width, height;
/**
 * funkcja rysująca bohatera na tkaninie
 */
function draw_hero() {
  ctx.save() //zachowanie stanu kontekstu
  ctx.fillStyle = 'rgba(0, 255, 0, 1)'; //ustawienie koloru wypelnienia
  for (let i = 0; i < snake_coordinates.length; i++) {
    ctx.fillRect(snake_coordinates[i].x, snake_coordinates[i].y, 10, 10) //narysowanie bohatera
  };
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
  if (snake_coordinates.some((element) => element.x == snake_x && element.y == snake_y)) {
    window.alert("Game over") //TODO: game over screen with restart button
  }
  snake_coordinates.push(new Coordinates(snake_x, snake_y))
  if (!isEaten()) {
    snake_coordinates.shift();
  } else {
    generate_new_apple()
  }
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
  } while (snake_coordinates.some((element) => element.x == apple_x && element.y == apple_y))
}

function isEaten() {
  return (apple_x == snake_x && apple_y == snake_y)
}

/**
 *funkcja wywolywana cyklicznie przerysowujaca tkanine
 */
function redraw() {
  ctx.clearRect(0, 0, width, height) //czyszczenie tkaniny
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
  snake_y = height / 2
  axis = 'y'
  direction = -10
  ctx = canvas.getContext('2d')
    //pobranie kontekstu grafiki 2d dla tkaniny

  ctx.font = '48px sans-serif'
  ctx.textAlign = 'center'
    //ustawienie dla tkaniny kroju pisma i sposobu wyrownania tekstu

  ctx.fillText('Ready player one?', width / 2, height / 2)
    //umieszczenie napisu naekranie powitalnym

  snake_coordinates.push(new Coordinates(snake_x, snake_y))
  draw_hero()
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
    window.setInterval(redraw, 1000) //podlaczenie funkcji przerysowania tkaniny
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

document.onload = init()