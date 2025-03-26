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
  const [powerButton, setPowerButton] = useState(true);
  const [effectBoxesShelf, setEffectBoxesShelf] = useState(
    pedalsConfig
  );

  const context = useRef(new AudioContext());
  const volumeRef = useRef(new Volume(context.current));
  const reverbRef = useRef(new Reverb(context.current));
  const inputRef = useRef(new Input(context.current));

  const getContext = () => context.current;

  useEffect(() => {
    setupContext();
  }, []);

  async function setupContext() {
    const ctx = getContext();

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    const inputStream = await getGuitar();

    const input = inputRef.current;
    input.input = inputStream;
    const output = new Output(ctx);

    const gain = volumeRef.current;
    gain.level = 0.5;

    const reverb = new Reverb(ctx);
    reverb.wet = 0.5;
    reverb.level = 1;


    input.connect(gain).connect(reverb).connect(output);
  }

  function getGuitar() {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        autoSuppression: false,
        latency: 0,
      },
    });
  }

  const handleVolumeSlider = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if(powerButton == true) {
      volumeRef.current.level = newVolume;
    }
  };

  const handleOnOffButton = () => {
    if (powerButton) {
      volumeRef.current.level = 0;
      setPowerButton(false);
    } else {
      volumeRef.current.level = volume;
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
  };

  const handleEffectBoxDelete = (effectBox) => {
    setEffectBoxes((prevEffectBoxes) =>
      prevEffectBoxes.filter((box) => box !== effectBox)
    );
    setEffectBoxesShelf((prevEffectBoxesShelf) => [
      ...prevEffectBoxesShelf,
      effectBox,
    ]);
  };

  return (
    <>
      <div className="flex h-full">
        <div className="flex-1">
          <h1>Effect Boxes</h1>
          <div>
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
          <div className="grid grid-cols-1 grid-rows-5 h-full">
            <div className="bg-yellow-800 items-center">
              <h2>Amp</h2>
              <div className="flex items-center mt-6 gap-5">
                <button className="border rounded bg-gray-300 h-10" onClick={handleOnOffButton}>On/Off</button>

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
