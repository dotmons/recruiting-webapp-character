import { useState } from "react";
import Character from "./Character";
import { APIURL } from "../consts";

export default function CharacterList() {
    const [characters, setCharacters] = useState([]);
    const [allAttributes, setAllAttributes] = useState([]);

    // 🔹 Function to Add an Empty Character
    const addCharacter = () => {
        setCharacters([...characters, {}]);
    };

    const characterTest = [{
        Strength: 9,
        Dexterity: 12,
        Constitution: 13,
        Intelligence: 11,
        Wisdom: 10,
        Charisma: 10
      },
      {
        Strength: 14,
        Dexterity: 9,
        Constitution: 9,
        Intelligence: 14,
        Wisdom: 9,
        Charisma: 9
      }
    
    ];

    const loadCharacter = () => {
        fetch(APIURL)
            .then(response => response.json())
            .then(data => {
                console.log("Full API Response:", data);
                if (!data || Object.keys(data).length === 0) {
                    console.error("Error: API returned an empty object.");
                    return;
                }
                //console.log("Retrieved Character:", data.body[0]);
                setCharacters([data.body[0]]); 
            })
            .catch(error => console.error("Error retrieving character:", error));
    };

    return (
        <div className="container">
            <h1>Character List</h1>
            <button onClick={addCharacter}>Add Character</button>
            <button onClick={loadCharacter}>Load Character</button>

            <div className="characters">
                {characters.map((character, index) => (
                    <Character key={index} data={character} />
                ))}
            </div>
        </div>
    );
}