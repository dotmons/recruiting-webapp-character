import { useState } from "react";
import Character from "./Character";
import { APIURL, ATTRIBUTE_LIST } from "../consts";
import axios from "axios";


export default function CharacterList() {
    const [characters, setCharacters] = useState([]);

    // 🔹 Function to Add an Empty Character
    const addCharacter = () => {
        setCharacters([...characters, {}]);
    };

    const loadCharacter = async () => {
        // fetch(APIURL)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Full API Response:", data);
        //         if (!data || Object.keys(data).length === 0) {
        //             console.error("Error: API returned an empty object.");
        //             return;
        //         }
        //         console.log("Retrieved Character:", data.body[0]);
        //         setCharacters([data.body[0]]); 
        //     })
        //     .catch(error => console.error("Error retrieving character:", error));

        try {
            const response = await axios.get(APIURL)
            let respChar = [];
            for (let i = 0; i < response.data.body.length; i++) {
                respChar[i] = response.data.body[i];
            }
            setCharacters(respChar);
        }
        catch (error) {
            console.log(error)
        }
    };



    const saveAllCharacters = async () => {
        try {
            const result = await axios.post(APIURL, characters)
            console.log('Success saving Character');
            alert('Success saving Character');
        }
        catch (error) {
            console.log('Error saving Characters ', error)
        }
    }

    const saveAllStates = (state, index) => {

        console.log('State', state, ' index ', index)

        setCharacters(prev =>
            prev.map((value, ind) => (
                index === ind ? { ...value, ...state } : value
            ))
        )

        console.log('Character > ', characters)


    }


    const allData = {

        reducerAttributes: ATTRIBUTE_LIST.map((value) => (
            {
                redAttrListName: value,
                redAttrListValue: 10,
                redModifierValue: 0
            }
        ))
    }

    


    return (
        <div className="container">
            <h1>Character List</h1>
            <button onClick={addCharacter}>Add Character</button>
            <button onClick={loadCharacter}>Load Character</button>
            <button onClick={saveAllCharacters}> Save all Characters</button>

            <div className="characters">
                {characters.map((character, index) => (
                    <Character key={index} data={character} onStateSave={saveAllStates} ind={index} reducers={allData} />
                ))}
            </div>
        </div>
    );
}