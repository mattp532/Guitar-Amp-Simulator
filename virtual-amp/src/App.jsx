import { useState, useEffect, useRef } from "react";
import "./App.css";
import EffectBox from "./components/EffectBox.jsx";
import StoredEffectBox from "./components/StoredEffectBox.jsx";

function App() {
  const [effectBoxes, setEffectBoxes] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [powerButton, setPowerButton] = useState(true);
  const [effectBoxesShelf, setEffectBoxesShelf] = useState([
    { name: "Reverb", colour: "#72A0C1" },
    { name: "Delay", colour: "#8C8C8C" },
    { name: "Distortion", colour: "#FF6347" },
    { name: "Chorus", colour: "#8A2BE2" },
    { name: "Overdrive", colour: "#FFD700" },
  ]);

  const context = useRef(new AudioContext());
  const gainNode = useRef(context.current.createGain());

  const getContext = () => context.current;
  const getGainNode = () => gainNode.current;

  useEffect(() => {
    setupContext();
  }, []);

  async function setupContext() {
    const guitar = await getGuitar();
    const ctx = getContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    const source = ctx.createMediaStreamSource(guitar);
    source.connect(getGainNode());
    getGainNode().connect(ctx.destination);
    getGainNode().gain.value = 0.5;
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
    getGainNode().gain.value = newVolume;
  };

  const handleOnOffButton = () => {
    const gainNode = getGainNode();
    const context = getContext();

    if (gainNode) {
      if (powerButton) {
        gainNode.gain.setValueAtTime(0, context.currentTime);
        setPowerButton(false);
      } else {
        gainNode.gain.setValueAtTime(volume, context.currentTime);
        setPowerButton(true);
      }
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
                colour={effectBox.colour}
              />
            ))}
          </div>
        </div>

        <div className="flex-30/100">
          <h1>Effects Rack</h1>
          <div className="grid grid-cols-1 grid-rows-5 h-full">
            <div>
              <h2>Amp</h2>
              <button onClick={handleOnOffButton}>On/Off</button>
              <div className="flex gap-2">
                <div>
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
                  colour={effectBox.colour}
                  style={{ backgroundColor: effectBox.colour }}
                >
                  -
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
