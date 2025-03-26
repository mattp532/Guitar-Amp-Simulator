import pedalsConfig from '../pedalsConfig.js'

export default function EffectBox({name, colour}) {
    const pedalConfig = pedalsConfig.find(pedal => pedal.name === name);

    const knobs = pedalConfig?.knobs ? Object.keys(pedalConfig.knobs).map(knobKey => {
        const knob = pedalConfig.knobs[knobKey];
        return (
            <div key={knobKey}>
                {knobKey}:                     <input
                      className="border"
                      type="range"
                      min="0"
                      max={knob.max}
                      step={knob.step}
                      value={knob.default_value}
                    />
            </div>
        );
    }) : null;

    return (
        <div className="h-1/1 rounded-md" style={{ backgroundColor: colour }}>
            <span className="font-bold text-lg">{name}</span>
            {knobs}

        </div>
    );
}
