import { useState, useEffect, useRef } from "react";
import "./App.css";
import EffectBox from "./components/EffectBox.jsx";
import StoredEffectBox from "./components/StoredEffectBox.jsx";
import pedalsConfig from "./pedalsConfig.js";
import { Volume, Distortion, Delay, Reverb, Input, Output, Tremolo } from "audio-effects";

function App() {
  const [effectBoxes, setEffectBoxes] = useState([]);
  const [volume, setVolume] = useState(0.5);
  const [userInteracted, setUserInteracted] = useState(false);
  const [powerButton, setPowerButton] = useState(false);
  const [effectBoxesShelf, setEffectBoxesShelf] = useState(pedalsConfig);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const context = useRef(new AudioContext());
  const volumeRef = useRef(new Volume(context.current));
  const effectInstances = useRef({
    Distortion: new Distortion(context.current),
    Tremolo: new Tremolo(context.current),
    Reverb: new Reverb(context.current),
    Delay: new Delay(context.current),
  });

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
    if (userInteracted) {
      setupContext();
    }
  }, [userInteracted]);

  const handleUserInteraction = () => {
    if (context.current.state === "suspended") {
      context.current.resume();
    }
    setUserInteracted(true);
  };

  async function setupContext() {
    const ctx = getContext();
    try {
      inputRef.current = new Input(ctx);
      outputRef.current = new Output(ctx);
      await inputRef.current.getUserMedia();
      volumeRef.current.level = volume;
      updateAudioChain();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  const updateAudioChain = () => {
    if (inputRef.current) {
      inputRef.current.disconnect();
    }
    if (volumeRef.current) {
      volumeRef.current.disconnect();
    }

    Object.values(effectInstances.current).forEach(effect => {
      if (effect) {
        effect.disconnect();
      }
    });

    if (!inputRef.current || !outputRef.current) {
      return;
    }

    let lastNode = inputRef.current;

    effectBoxes.forEach((effect) => {
      const effectInstance = effectInstances.current[effect.name];

      if (effectInstance && effect.on) {
        if (lastNode) {
          lastNode.disconnect();
        }
        lastNode.connect(effectInstance);
        lastNode = effectInstance;
      }
    });

    if (lastNode && volumeRef.current) {
      lastNode.disconnect();
      lastNode.connect(volumeRef.current);
      volumeRef.current.connect(outputRef.current);
    }

    effectBoxes.forEach(effect => {
      const effectInstance = effectInstances.current[effect.name];
      if (effectInstance) {
        Object.entries(effect.knobs).forEach(([knobName, knobValue]) => {
          effectInstance[knobName] = knobValue.current_value;
        });
      }
    });
  };

  useEffect(() => {
    updateAudioChain();
  }, [effectBoxes]);

  const handleVolumeSlider = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (powerButton) {
      volumeRef.current.level = newVolume;
    }
  };

  const handleOnOffButton = () => {
    if (powerButton) {
      volumeRef.current.mute = true;
      setPowerButton(false);
    } else {
      volumeRef.current.mute = false;
      handleUserInteraction();
      setPowerButton(true);
      updateAudioChain();
    }
  };

  const handleBoxSelectClick = (effectBox) => {
    if (effectBoxes.length < 4) {
      setEffectBoxes((prevEffectBoxes) => [
        ...prevEffectBoxes,
        { ...effectBox, on: true },
      ]);
      setEffectBoxesShelf((prevEffectBoxesShelf) =>
        prevEffectBoxesShelf.filter((box) => box !== effectBox)
      );

      if (powerButton) {
        updateAudioChain();
      }
    }
  };

  const handleEffectBoxDelete = (effectBox) => {
    setEffectBoxes((prevEffectBoxes) =>
      prevEffectBoxes.filter((box) => box.name !== effectBox.name)
    );
    setEffectBoxesShelf((prevEffectBoxesShelf) => [
      ...prevEffectBoxesShelf,
      effectBox,
    ]);
  };

  const toggleEffectBoxOnOff = (effectBox) => {
    setEffectBoxes((prevEffectBoxes) =>
      prevEffectBoxes.map((effect) =>
        effect.name === effectBox.name
          ? { ...effect, on: !effect.on }
          : effect
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = { email, password };

    try {
      const response = await fetch("http://127.0.0.1:1111", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.status === 200) {
        setLoginMessage(`Login successful! Token: ${result.idToken}`);
      } else {
        setLoginMessage(`Login failed: ${result.message}`);
      }
    } catch (error) {
      setLoginMessage(`Error: ${error.message}`);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-20 w-40/100 bg-white absolute bottom-0 left-0 border-3 items-center">
        <form className="flex-col" onSubmit={handleSubmit}>
          <div></div>
          <span>Email: </span>
          <input
            className="border"
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Password:</span>
          <input
            className="border"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" />
        </form>
        {loginMessage && <p>{loginMessage}</p>}
      </div>
      <nav className="text-white font-bold text-2xl w-100/100 py-4 bg-gray-900 pl-3">
        VIRTUAL GUITAR AMP
      </nav>
      <div className="flex h-100/100">
        <div className="flex-1 border-2">
          <div className="bg-gray-700 h-100/100">
            <h1 className="py-3 text-white font-bold ml-3">Components</h1>
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
          <div className="grid bg-gray-700 border-2 grid-cols-1 grid-rows-5 h-full">
            <div className="bg-yellow-800 flex flex-col justify-center">
              <div className="flex ml-3 justify-center flex-col">
                <h2 className="font-bold text-lg">Amp</h2>
                <div className="flex items-center mt-6 gap-5">
                  <button
                    className="border rounded bg-gray-300 h-10 px-3"
                    onClick={handleOnOffButton}
                  >
                    {powerButton ? "On" : "Off"}
                  </button>

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
            </div>
            {effectBoxes.map((effectBox, index) => (
              <div
                key={`${effectBox.name}-${effectBox.color}-${index}`}
                className="relative"
              >
                <p
                  onClick={() => handleEffectBoxDelete(effectBox)}
                  className="absolute right-5 top-0 text-4xl cursor-pointer"
                >
                  X
                </p>
                <EffectBox
                  name={effectBox.name}
                  colour={effectBox.color}
                  style={{ backgroundColor: effectBox.color }}
                  handleKnobChange={handleKnobChange}
                  knobs={effectBox.knobs}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
