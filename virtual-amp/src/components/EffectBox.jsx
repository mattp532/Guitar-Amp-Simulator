import pedalsConfig from "../pedalsConfig";
export default function EffectBox({ name, colour, handleKnobChange, knobs }) {
    const pedalConfig = pedalsConfig.find(pedal => pedal.name === name);
  
    const handleKnobInputChange = (knobName, e) => {
      const newValue = e.target.value;
      handleKnobChange(name, knobName, newValue);
    };
  
    const knobElements = knobs
      ? Object.keys(knobs).map(knobKey => {
          const knob = knobs[knobKey];
          return (
            <div className="flex items-center"key={knobKey}>
              {knobKey}: 
              <input
                className="border ml-2"
                type="range"
                min="0"
                max={knob.max}
                step={knob.step}
                value={knob.current_value}
                onChange={(e) => handleKnobInputChange(knobKey, e)}
              />
            </div>
          );
      })
      : null;
  
    return (
      <div className="h-1/1 rounded-md border-2 border-black flex " style={{ backgroundColor: colour }}>
        <div className="flex ml-3 flex-col justify-center">
        <span className="font-bold text-lg">{name}</span>
        <div className="flex flex-col justify-center">
        {knobElements}
        </div>
        </div>


      </div>
    );
  }