import { useState } from "react";
import axios from "axios";
import Character from "./Character";
import { SKILL_LIST, ATTRIBUTE_LIST, CLASS_LIST, API_URL } from '../consts';




export default function CharacterList() {


    const [characters, setCharacters] = useState([]);

    let charIndex = 0;

    // 🔹 Function to Add an Empty Character
    const addCharacter = () => {
        setCharacters([...characters, { id: charIndex, data: allData }]);
        charIndex++;
    };


    // Code declarations
    // Attribute list
    const attributelistimport = ATTRIBUTE_LIST.map((values) => ({
        name: values,
        attributevalue: 10,
        modifier: 0
    })
    )
    const attributeData = {
        totalValue: attributelistimport.reduce((sum, value) => sum + value.attributevalue, 0),
        attributeValues: attributelistimport
    }

    // Class List
    const classlistimport = Object.entries(CLASS_LIST);
    // const classlistkey = Object.keys(CLASS_LIST);
    // const classlistvalues = Object.values(CLASS_LIST);

    // classlistimport.map((key, index) => {
    //     console.log('key: ', key[0], ' values: ', key[1], 'values', values)
    // })

    const classBoolean = classlistimport.map((values) => ({
        className: values[0],
        classValue: false
    }))



    //Skills List
    const skillListValue =
    {
        skillListResult: SKILL_LIST.map((value) => {
            return {
                name: value.name,
                nameValue: 0,
                attributeModifier: value.attributeModifier,
                modifierValue: 0,
                totalValue: 0
            }
        }),
        totalSkillPoints: 0
    }


    //Character Values
    const charPlayers = {
        skill: '',
        rolledNumber: 0,
        dcValue: 0,
        result: ''
    }

    const allData = {
        attributeData: attributeData,
        classData: classBoolean,
        skillData: skillListValue,
        charPlayers: charPlayers
    }



    // Function implementation
    const updateCharacterState = (id, newState) => {

        // const pschar = characters.map((val, ind) => {
           
        //         if (ind===id){
        //             return {...val, id: id, data: newState}
        //         }
        //         else{
        //             return val
        //         }
            
        // })

        // setCharacters(pschar)


        setCharacters(prevCharacters =>
            prevCharacters.map((character, index) =>
                index === id ? { ...character, id: id, data: newState } : character
            )
        );

    };

    const saveAllCharacter = () => {
        saveCharactersToAPI(characters)
    }

    const loadCharacter = async () => {
        try{
            const response = await axios.get(API_URL);
            setCharacters([]); 
            setCharacters(response.data.body.characters); 
            console.log(response.data.body)
            console.log('Data fetched and loaded')
        }
        catch (error){
            console.error('Error fetching from API ', error)
        }
    }

    const saveCharactersToAPI = async (stateChar) => {
        try {
            const response = await axios.post(API_URL, {
                characters: stateChar
            });
            console.log("Save Successful:", response.data);
            alert("Characters saved successfully!");
        } catch (error) {
            console.error("Error saving characters:", error);
            alert("Failed to save characters.");
        }
    };

    return (
        <div className="container">
            <h1>Character List</h1>
            <button onClick={addCharacter}>Add Character</button>
            <button onClick={loadCharacter}>Load Character</button>
            <button onClick={saveAllCharacter}>Save All</button>

            <div className="characters">
                {characters.map((character, indx) => (

                    <Character key={indx} indx={indx} data={character.data} onStateChange={updateCharacterState} />

                ))}
            </div>
        </div>
    );
}