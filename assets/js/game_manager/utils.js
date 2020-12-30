const SpawnerType = {
  MONSTER: 'MONSTER',
  CHEST: 'CHEST',
  WOOD: 'WOOD',
  HOUSE:'HOUSE',
  SEEDS:'SEEDS'
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * max) + min;
}
