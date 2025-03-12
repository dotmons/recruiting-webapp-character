import { useState } from "react";
import Character from "./Character";
import { APIURL } from "../consts";
import axios from "axios";

export default function CharacterList() {
    const [characters, setCharacters] = useState([]);

    // 🔹 Function to Add an Empty Character

    const addCharacter = () => {
        setCharacters([...characters, {}]);
    };


    const loadCharacter = () => {
        fetch(APIURL)
            .then(response => response.json())
            .then(data => {
                console.log("Full API Response:", data);
                if (!data || Object.keys(data).length === 0) {
                    console.error("Error: API returned an empty object.");
                    return;
                }
                console.log("Retrieved Character:", data.body[0]);
                let res = [];
                for (let i=0; i<data.body.length; i++){
                    res[i] = data.body[i][0];

                }
                setCharacters(res); 
            })
            .catch(error => console.error("Error retrieving character:", error));
    };

    const saveCharacter = async () => {

        try{
            const result = await axios.post(APIURL, characters);
            console.log(result)
            alert('Character Saved')

        }
        catch (error){
            console.log('Error saving character')
        }
    }

    const updateStates = (ind, state) => {

        // console.log('ind ', ind, ' state ', state);

        // const newChar = characters.map((value, index) =>{
        //     if (index===ind){
        //         return {...value, ...state }
        //     }
        //     else{
        //         return value
        //     }
        // })

        setCharacters(prev =>
            prev.map((value, index) => (
                index===ind? {...value, ...state} : value
            ))
        )

        //setCharacters(newChar);

    }

    return (
        <div className="container">
            <h1>Character List</h1>
            <button onClick={addCharacter}>Add Character</button>
            <button onClick={loadCharacter}>Load Character</button>
            <button onClick={saveCharacter}>Save All Characters</button>

            <div className="characters">
                {characters.map((character, index) => (
                    <Character key={index} data={character} index={index} onStateChange={updateStates} />
                ))}
            </div>
        </div>
    );
}