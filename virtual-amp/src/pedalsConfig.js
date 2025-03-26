const pedalsConfig = [
  {
    name: 'Distortion',
    knobs: {
      intensity: {
        max: 1000,
        default_value: 100,
        step: 1,
        current_value: 100
      },
      gain: {
        max: 100,
        step: 1,
        default_value: 20,
        current_value: 20
      }
    },
    buttons: {
      low_pass_filter: {
        name: "Low Pass Filter"
      }
    },
    color: '#ff5733',
    active: 'false',
    on: false
  },
  {
    name: 'Delay',
    knobs: {
      wet: {
        max: 1,
        default_value: 0.5,
        current_value: 0.5,
        step: 0.01
      },
      speed: {
        max: 10,
        default_value: 1,
        current_value: 1,
        step: 1
      },
      duration: {
        max: 1,
        default_value: 0.4,
        current_value: 0.4,
        step: 0.01
      }
    },
    color: '#33aaff',
    on: false
  },
  {
    name: 'Reverb',
    knobs: {
      wet: {
        max: 1,
        default_value: 0.5,
        current_value: 0.5,
        step: 0.01
      },
      level: {
        max: 1,
        default_value: 1,
        current_value: 1,
        step: 0.01
      }
    },
    color: '#66cc66',
    on: false
  },
  {
    name: 'Tremolo',
    knobs: {
      speed: {
        max: 10,
        default_value: 1,
        current_value: 1,
        step: 1
      }
    },
    color: '#9933cc',
    on: false
  }
];

export default pedalsConfig;
