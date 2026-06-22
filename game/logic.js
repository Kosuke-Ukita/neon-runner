/**
 * Neon Runner — ゲームロジック
 * ブラウザと Node.js の両方で動作します。
 */

export const CANVAS_W   = 900;
export const CANVAS_H   = 500;
export const GROUND_Y   = 430;
const GRAVITY    = 0.7;
const JUMP_FORCE = -15;
const INITIAL_SPEED = 5;

// ---- プレイヤー ----

function createPlayer() {
  return {
    x: 110,
    y: GROUND_Y - 60,   // 上端 (height=60 なので底面=GROUND_Y)
    width:  38,
    height: 60,
    vy: 0,
    isGrounded: true,
  };
}

export function jump(player) {
  if (!player.isGrounded) return;

  player.vy = JUMP_FORCE;
  player.isGrounded = false;
}

export function updatePlayer(player) {
  if (!player.isGrounded) {
    player.vy += GRAVITY;
  }
  player.y += player.vy;

  const bottom = GROUND_Y - player.height;
  if (player.y >= bottom) {
    player.y = bottom;
    player.vy = 0;
    player.isGrounded = true;
  }
}

// ---- 障害物 ----

function createObstacle() {
  const h = 30 + Math.random() * 45;
  return {
    x: CANVAS_W + 10,
    y: GROUND_Y - h,
    width: 28,
    height: h,
  };
}

export function updateObstacles(state) {
  const speed = getGameSpeed(state);
  for (const ob of state.obstacles) {
    ob.x -= speed;
  }
  state.obstacles = state.obstacles.filter(ob => ob.x + ob.width > -20);

  state.nextObstacleIn -= 1;
  if (state.nextObstacleIn <= 0) {
    state.obstacles.push(createObstacle());
    state.nextObstacleIn = 70 + Math.floor(Math.random() * 70);
  }
}

// ---- 衝突判定 (AABB) ----

function checkCollision(player, obstacle) {
  const margin = 6;
  return (
    player.x + margin         < obstacle.x + obstacle.width  &&
    player.x + player.width   - margin > obstacle.x          &&
    player.y + margin         < obstacle.y + obstacle.height &&
    player.y + player.height  - margin > obstacle.y
  );
}

export function isGameOver(state) {
  return state.obstacles.some(ob => checkCollision(state.player, ob));
}

// ---- スコア ----

export function updateScore(state, deltaTime) {
  state.score += deltaTime * 0.05;
}

export function getHighScore(previousScores) {
  return previousScores.length > 0 ? Math.max(...previousScores) : 0;
}

// ---- ゲームスピード ----

export function getGameSpeed(state) {
  return INITIAL_SPEED + Math.floor(state.score / 300) * 0.6;
}

// ---- ゲーム状態 ----

export function createGameState() {
  return {
    player:          createPlayer(),
    obstacles:       [],
    score:           0,
    time:            0,
    running:         false,
    nextObstacleIn:  80,
  };
}

export function restart(state) {
  state.player         = createPlayer();
  state.score          = 0;
  state.time           = 0;
  state.running        = true;
  state.nextObstacleIn = 80;
  state.obstacles = [];
}

// ---- エクスポート (Node.js 互換) ----

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CANVAS_W, CANVAS_H, GROUND_Y, GRAVITY, JUMP_FORCE, INITIAL_SPEED,
    createPlayer, createObstacle, createGameState,
    jump, updatePlayer,
    updateObstacles, checkCollision, isGameOver,
    updateScore, getHighScore, getGameSpeed,
    restart,
  };
}
