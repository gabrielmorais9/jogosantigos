const canvas = document.getElementById("game"); // Pega o canvas do HTML
const ctx = canvas.getContext("2d"); // Define contexto 2D para desenhar

const tile = 20; // Tamanho de cada bloco do mapa

// Mapa do jogo
const map = [
  "#####################", // # = parede
  "#........#..........#", // . = comida
  "#.####...#...####...#",
  "#...................#",
  "#.####.#.#.#.####.#.#",
  "#......#...#........#",
  "######.# ###.######.#",
  "#........P.........G#", // P = jogador | G = fantasma
  "#####################"
];

let pacman, ghost, foods, score, gameOver; // Variáveis principais

// Função que inicia/reinicia o jogo
function init() {
  foods = []; // Lista de comidas vazia
  score = 0; // Pontuação começa em 0
  gameOver = false; // Jogo começa ativo

  // Percorre o mapa linha por linha
  map.forEach((row, y) => {
    row.split("").forEach((col, x) => {

      if (col === ".") { // Se for comida
        foods.push({
          x: x * tile + 10, // Posição X
          y: y * tile + 10  // Posição Y
        });
      }

      if (col === "P") { // Se for o jogador
        pacman = {
          x: x * tile,
          y: y * tile,
          dx: 0, // velocidade X
          dy: 0  // velocidade Y
        };
      }

      if (col === "G") { // Se for fantasma
        ghost = {
          x: x * tile,
          y: y * tile
        };
      }

    });
  });

  document.getElementById("score").innerText = score; // Atualiza pontuação na tela
}

// Desenha o mapa
function drawMap() {
  map.forEach((row, y) => {
    row.split("").forEach((col, x) => {
      if (col === "#") { // Se for parede
        ctx.fillStyle = "blue"; // Cor azul
        ctx.fillRect(x * tile, y * tile, tile, tile); // Desenha quadrado
      }
    });
  });
}

// Desenha comidas
function drawFoods() {
  ctx.fillStyle = "white"; // Cor branca
  foods.forEach(f => {
    ctx.beginPath(); // Começa desenho
    ctx.arc(f.x, f.y, 3, 0, Math.PI * 2); // Desenha bolinha
    ctx.fill(); // Preenche
  });
}

// Desenha Pac-Man
function drawPacman() {
  ctx.beginPath();
  ctx.arc(pacman.x + 10, pacman.y + 10, 8, 0.2*Math.PI, 1.8*Math.PI); // Forma com boca
  ctx.lineTo(pacman.x + 10, pacman.y + 10); // Fecha boca
  ctx.fillStyle = "yellow"; // Cor
  ctx.fill();
}

// Desenha fantasma
function drawGhost() {
  ctx.fillStyle = "red"; // Cor vermelha
  ctx.beginPath();
  ctx.arc(ghost.x + 10, ghost.y + 10, 8, 0, Math.PI * 2); // Círculo
  ctx.fill();
}

// Move o Pac-Man
function movePacman() {
  let nextX = pacman.x + pacman.dx; // Próxima posição X
  let nextY = pacman.y + pacman.dy; // Próxima posição Y

  if (!isWall(nextX, pacman.y)) pacman.x = nextX; // Move se não for parede
  if (!isWall(pacman.x, nextY)) pacman.y = nextY; // Move se não for parede
}

// Verifica se é parede
function isWall(x, y) {
  let gridX = Math.floor(x / tile); // Converte posição pra grade
  let gridY = Math.floor(y / tile);
  return map[gridY][gridX] === "#"; // Retorna true se for parede
}

// Comer comida
function eatFood() {
  foods = foods.filter(f => {
    let dist = Math.hypot(pacman.x - f.x, pacman.y - f.y); // Distância
    if (dist < 10) {
      score++; // Soma ponto
      document.getElementById("score").innerText = score; // Atualiza tela
      return false; // Remove comida
    }
    return true; // Mantém comida
  });
}

// Movimento do fantasma
function moveGhost() {
  let dx = pacman.x - ghost.x; // Distância X
  let dy = pacman.y - ghost.y; // Distância Y

  let stepX = dx > 0 ? 1 : -1; // Decide direção X
  let stepY = dy > 0 ? 1 : -1; // Decide direção Y

  if (!isWall(ghost.x + stepX * 2, ghost.y)) {
    ghost.x += stepX * 1.5; // Move no eixo X
  }

  if (!isWall(ghost.x, ghost.y + stepY * 2)) {
    ghost.y += stepY * 1.5; // Move no eixo Y
  }
}

// Detecta colisão
function checkCollision() {
  let dist = Math.hypot(pacman.x - ghost.x, pacman.y - ghost.y);
  if (dist < 15) {
    gameOver = true; // Encerra jogo
    alert("💀 Game Over!");
  }
}

// Loop principal
function update() {
  if (gameOver) return; // Para se perdeu

  ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa tela

  drawMap(); // Desenha mapa
  drawFoods(); // Desenha comidas
  drawPacman(); // Desenha jogador
  drawGhost(); // Desenha fantasma

  movePacman(); // Move jogador
  moveGhost(); // Move fantasma
  eatFood(); // Come comida
  checkCollision(); // Verifica colisão

  requestAnimationFrame(update); // Repete o loop
}

// Controles do teclado
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") { pacman.dx = 0; pacman.dy = -2; }
  if (e.key === "ArrowDown") { pacman.dx = 0; pacman.dy = 2; }
  if (e.key === "ArrowLeft") { pacman.dx = -2; pacman.dy = 0; }
  if (e.key === "ArrowRight") { pacman.dx = 2; pacman.dy = 0; }
});

// Reiniciar jogo
function restart() {
  init(); // Reseta
  update(); // Inicia loop
}

// Inicia o jogo
init();
update();