Perkogine.Keyboard = function(target) {
  this.keys = {};
  
  target.addEventListener('keydown', keydown.bind(this), false);
  target.addEventListener('keyup', keyup.bind(this), false);
  
  function keydown(event) {
    this.keys[event.keyCode || event.which] = true;
		this.keys['shift'] = event.shiftKey;
		this.keys['ctrl'] = event.ctrlKey;
		this.keys['alt'] = event.altKey;
  }
  
  function keyup(event) {
    this.keys[event.keyCode || event.which] = false;
		this.keys['shift'] = event.shiftKey;
		this.keys['ctrl'] = event.ctrlKey;
		this.keys['alt'] = event.altKey;
  }
}

Perkogine.Keys = {};

Object.defineProperties( Perkogine.Keys, {
  'Tab': { value: 9 },
  'Esc': { value: 27 },
  'Ins': { value: 45 },
  'Del': { value: 46 },
  'Space': { value: 32 },
  'Caps_Lock': { value: 20 },
  'Shift': { value: 'shift' },
  'Ctrl': { value: 'ctrl' },
  'Alt': { value: 'alt' },
  
  'UP': { value: 38 },
  'DOWN': { value: 40 },
  'LEFT': { value: 37 },
  'RIGHT': { value: 39 },
  
  'Num_0': { value: 48 },
  'Num_1': { value: 49 },
  'Num_2': { value: 50 },
  'Num_3': { value: 51 },
  'Num_4': { value: 52 },
  'Num_5': { value: 53 },
  'Num_6': { value: 54 },
  'Num_7': { value: 55 },
  'Num_8': { value: 56 },
  'Num_9': { value: 57 },
  
  'A': { value: 65 },
  'B': { value: 66 },
  'C': { value: 67 },
  'D': { value: 68 },
  'E': { value: 69 },
  'F': { value: 70 },
  'G': { value: 71 },
  'H': { value: 72 },
  'I': { value: 73 },
  'J': { value: 74 },
  'K': { value: 75 },
  'L': { value: 76 },
  'M': { value: 77 },
  'N': { value: 78 },
  'O': { value: 79 },
  'P': { value: 80 },
  'Q': { value: 81 },
  'R': { value: 82 },
  'S': { value: 83 },
  'T': { value: 84 },
  'U': { value: 85 },
  'V': { value: 86 },
  'W': { value: 87 },
  'X': { value: 88 },
  'Y': { value: 89 },
  'Z': { value: 90 }
});