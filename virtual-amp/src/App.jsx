import { useState, useEffect, useRef } from "react";
import "./App.css";
import EffectBox from "./components/EffectBox.jsx";
import StoredEffectBox from "./components/StoredEffectBox.jsx";
import pedalsConfig  from "./pedalsConfig.js";
import { HasAudioContext } from 'audio-effects';
import { Volume, Distortion, Delay, Reverb, Input, Output } from "audio-effects";

function App() {
  const [effectBoxes, setEffectBoxes] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [userInteracted, setUserInteracted] = useState(false);

  const [powerButton, setPowerButton] = useState(false);
  const [effectBoxesShelf, setEffectBoxesShelf] = useState(
    pedalsConfig
  );
  //audio context refs
  const context = useRef(new AudioContext());
  const volumeRef = useRef(new Volume(context.current));
  const reverbRef = useRef(new Reverb(context.current));
  const inputRef = useRef(null);
  const outputRef = useRef(null);
const handleKnobChange = (effectName, knobName, newValue) => {
  const floatValue = parseFloat(newValue);
  setEffectBoxes((prevEffectBoxes) =>
    prevEffectBoxes.map((effect) =>
      effect.name === effectName
        ? {
            ...effect,
            knobs: {
              ...effect.knobs,
              [knobName]: {
                ...effect.knobs[knobName],
                current_value: floatValue, 
              },
            },
          }
        : effect
    )
  );
};
  const getContext = () => context.current;

 
  useEffect(() => {
    // Wait for user interaction to start the audio context
    if (userInteracted) {
      setupContext();
    }
  }, [userInteracted]); // only trigger setupContext when user interacts
  console.log(effectsChain.current)
  const handleUserInteraction = () => {
    // This function triggers when the user clicks a button or interacts with the page
    if (context.current.state === "suspended") {
      context.current.resume();
    }
    setUserInteracted(true);
  };

  async function setupContext() {
    const ctx = getContext();
    inputRef.current = new Input(ctx);
    outputRef.current = new Output(ctx);
    try {
      await inputRef.current.getUserMedia();
      volumeRef.current.level = volume;
      inputRef.current.connect(volumeRef.current).connect(outputRef.current);
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  const updateAudioChain = () => {
    Object.keys(effectBoxes).forEach((effect) => effect.current.disconnect());
    let lastNode = inputRef.current;
  
    // Loop through effectBoxes and connect them to the audio chain
    effectBoxes.forEach((effect) => {
      const effectInstance = effectsChain.current[effect.name];
  
      // Check if the effect is enabled/active
      if (effectInstance) {
        lastNode.connect(effectInstance);
        console.log(lastNode)
        lastNode = effectInstance;
      }
    });
  
    lastNode.connect(volumeRef.current);
    volumeRef.current.connect(outputRef.current);
  };
  

  const handleVolumeSlider = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if(powerButton == true) {
      volumeRef.current.level = newVolume;
    }
  };
  const handleOnOffButton = () => {
    if (powerButton) {
      volumeRef.current.mute=true;
      setPowerButton(false);
    } else {
      volumeRef.current.mute=false;
      handleUserInteraction();
      setPowerButton(true);
    }
  };

  const handleBoxSelectClick = (effectBox) => {
    if (effectBoxes.length < 4) {
      setEffectBoxes((prevEffectBoxes) => [...prevEffectBoxes, effectBox]);
      setEffectBoxesShelf((prevEffectBoxesShelf) =>
        prevEffectBoxesShelf.filter((box) => box !== effectBox)
      );
    }
    effectsChain.current.effectBox.name = effectBox.name+"ref"
    updateAudioChain();
  };

  const handleEffectBoxDelete = (effectBox) => {
    delete effectsChain.current[effectBox.name];

    const resetEffectBox = {
      ...effectBox,
      knobs: Object.fromEntries(
        Object.entries(effectBox.knobs).map(([knobName, knobConfig]) => [
          knobName,
          {
            ...knobConfig,
            current_value: knobConfig.default_value
          }
        ])
      )
    };
  
    setEffectBoxes(prevEffectBoxes => 
      prevEffectBoxes.filter(box => box.name !== effectBox.name)
    );
    setEffectBoxesShelf(prevEffectBoxesShelf => [
      ...prevEffectBoxesShelf,
      resetEffectBox  
    ]);
    
  };

  return (
    <>
      <div className="flex h-full">
        <div className="flex-1">
          <h1>Effect Boxes</h1>
          <div className="">
            {effectBoxesShelf.map((effectBox) => (
              <StoredEffectBox
                key={effectBox.name}
                onClick={() => handleBoxSelectClick(effectBox)}
                name={effectBox.name}
                color={effectBox.color}
              />
            ))}
          </div>
        </div>

        <div className="flex-30/100">
          <h1>Effects Rack</h1>
          <div className="grid bg-gray-300 border grid-cols-1 grid-rows-5 h-full">
            <div className="bg-yellow-800 items-center">
              <h2 className="font-bold text-lg">Amp</h2>
              <div className="flex items-center mt-6 gap-5">
                <button className="border rounded bg-gray-300 h-10 px-3" onClick={handleOnOffButton}>{powerButton?"On":"Off"}</button>

                <div className="flex gap-2">
                  <div className="bg-white border h-10">
                    <p>Volume</p>
                    <input
                      className="border"
                      type="range"
                      min="0"
                      max="1"
                      step=".01"
                      value={volume}
                      onChange={handleVolumeSlider}
                    />
                  </div>
                </div>
              </div>
            </div>
            {effectBoxes.map((effectBox) => (
              <div key={effectBox.name} className="relative">
                <p
                  onClick={() => handleEffectBoxDelete(effectBox)}
                  className="absolute right-5 top-0 text-4xl"
                >
                  X
                </p>
                <EffectBox
                
                  name={effectBox.name}
                  colour={effectBox.color}
                  style={{ backgroundColor: effectBox.colour }}
                  handleKnobChange={handleKnobChange}
                  knobs={effectBox.knobs}
                >
                </EffectBox>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
