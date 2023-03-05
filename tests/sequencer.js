const Sequencer = require('@jest/test-sequencer').default;

class ShieldbowSequencer extends Sequencer {
  sort(tests) {
    const processed = super.sort(tests);
    const sorter = (a, b) => {
      if (a.path.includes('ratelimit')) return 1;
      else if (b.path.includes('ratelimit')) return -1;
      else return 0;
    };
    if (Array.isArray(processed)) return processed.sort(sorter);
    else return processed.then((tests) => tests.sort(sorter));
  }
}

module.exports = ShieldbowSequencer;
