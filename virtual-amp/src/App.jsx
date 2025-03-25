import { useState } from "react";
import "./App.css";
import EffectBox from "./components/EffectBox.jsx";
import StoredEffectBox from "./components/StoredEffectBox.jsx";
function App() {
  const [effectBoxes, setEffectBoxes] = useState([]);
  const [effectBoxesShelf, setEffectBoxesShelf] = useState([
    { name: 'Reverb', colour: '#72A0C1' },
    { name: 'Delay', colour: '#8C8C8C' },
    { name: 'Distortion', colour: '#FF6347' },
    { name: 'Chorus', colour: '#8A2BE2' }, 
    { name: 'Overdrive', colour: '#FFD700' }, 
  ]);

  const handleBoxSelectClick = (effectBox) => {
    if(effectBoxes.length<4){
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
            <div>Amp</div>
            {effectBoxes.map((effectBox) => (
              <div key={effectBox.name} className="relative">
                <p
                  onClick={() => handleEffectBoxDelete(effectBox)}
                  className="absolute right-5 top-0 text-4xl"
                >
                  X
                </p>
                <EffectBox name={effectBox.name} colour={effectBox.colour} style={{ backgroundColor: effectBox.colour }}>
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
