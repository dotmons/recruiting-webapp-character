import React, { useState, useRef, useEffect, useReducer } from 'react';
import { SKILL_LIST, ATTRIBUTE_LIST, CLASS_LIST, APIURL } from '../consts';



function Character({ data, onStateSave, ind }) {

  
    // UseRef Declarations:
    const dcValueRef = useRef(null);

    // State Declarations
    const [result, setResult] = useState({
        Skill: '',
        'Rolled Number': 0,
        'DC Value': 0,
        Result: '',
    });

    const [selectedSkill, setSelectedSkill] = useState(SKILL_LIST[0].name);
    const [skillSet, setSkillSet] = useState({
        'Barbarian': false,
        'Wizard': false,
        'Bard': false,
    });
    const [attributes, setAttributes] = useState(
        ATTRIBUTE_LIST.reduce((acc, attr) => ({ ...acc, [attr]: 10 }), {})
    );
    const [skills, setSkills] = useState<{ [key: string]: number }>(
        SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
    );

    const [skillsCheck, setSkillsCheck] = useState(
        SKILL_LIST.reduce((acc, skill) => ({ ...acc, [skill.name]: 0 }), {})
    );
    const [modifiers, setModifiers] = useState<any>({
        Strength: 0,
        Dexterity: 0,
        Constitution: 0,
        Intelligence: 0,
        Wisdom: 0,
        Charisma: 0,
    });
    const [total, setTotal] = useState(0);
    const [totalSkill, setTotalSkill] = useState(0);
    const [totalSkillPoint, setTotalSkillPoint] = useState(10);





    // Helper Functions
    const calculateModifier = (value: number): number => Math.floor((value - 10) / 2);

    const updateModifiers = (newAttributes: { [key: string]: number }) => {
        const newModifiers = Object.keys(newAttributes).reduce((acc, attr) => {
            acc[attr] = calculateModifier(newAttributes[attr]);
            return acc;
        }, {});
        return newModifiers;
    };

    const updateSkillsCheck = () => {
        const newSkillsCheck = SKILL_LIST.reduce((acc, skill) => {
            acc[skill.name] = modifiers[skill.attributeModifier] + skills[skill.name];
            return acc;
        }, {});
        setSkillsCheck(newSkillsCheck);
    };

    const updateTotalState = (newAttributes: { [key: string]: number }) => {
        const newTotal = Object.values(newAttributes).reduce((acc, value) => acc + value, 0);
        setTotal(newTotal);
        setModifiers(updateModifiers(newAttributes));
        setTotalSkillPoint(10 + 4 * modifiers.Intelligence);
    };

    const updateSkillSet = () => {
        const updatedSkill = { ...skillSet };
        for (const className in CLASS_LIST) {
            const classAttributes = CLASS_LIST[className];
            let isClassTrue = true;
            for (const attribute in classAttributes) {
                if (attributes[attribute] < classAttributes[attribute]) {
                    isClassTrue = false;
                    break;
                }
            }
            updatedSkill[className] = isClassTrue;
        }
        setSkillSet(updatedSkill);
    };

    const saveCharacter = () => {
        console.log('attributes: ', attributes);

        const jsonResult = [{
            'attributes': attributes,
            'skills': skills
        }]

        fetch(APIURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(jsonResult)
        })
            .then(response => response.json())
            .then(data => console.log("Character saved:", data))
            .catch(error => console.error("Error saving character:", error));
    }

    // Event Handlers
    const handleSkillChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedSkill(event.target.value);
    };

    const increaseSkill = (attr: string) => {
        if (total >= 70) {
            alert('A character cannot have more than 70 assigned attributes');
        }

        
        setAttributes((prev) => {
            const newAttributes = { ...prev, [attr]: total < 70 ? prev[attr] + 1 : prev[attr] };
            updateTotalState(newAttributes);
            return newAttributes;
        });
    };

    const decreaseSkill = (attr: string) => {
        setAttributes((prev) => {
            const newAttributes = { ...prev, [attr]: prev[attr] > 0 ? prev[attr] - 1 : 0 };
            updateTotalState(newAttributes);
            return newAttributes;
        });
    };

    const increaseSkillsAttribute = (skill: string) => {
        setSkills((prev) => ({
            ...prev,
            [skill]: totalSkill < totalSkillPoint ? prev[skill] + 1 : prev[skill],
        }));
    };

    const decreaseSkillsAttribute = (skill: string) => {
        setSkills((prev) => ({
            ...prev,
            [skill]: prev[skill] > 0 ? prev[skill] - 1 : 0,
        }));
    };

    const runCharacter = () => {
        const allFalse = Object.values(skillSet).every((value) => value === false);

        if (allFalse) {
            alert('One skill is required to be satisfied to play the game');
            return;
        }

        const dcValue = Number(dcValueRef.current.value) || 0;
        const randomValue = Math.floor(Math.random() * 20) + 1;
        const selectedSkillValueCheck = skillsCheck[selectedSkill];

        setResult({
            Skill: `${selectedSkill} : ${selectedSkillValueCheck}`,
            'Rolled Number': randomValue,
            'DC Value': dcValue,
            Result: selectedSkillValueCheck + randomValue >= dcValue ? 'Success' : 'Failure',
        });
    };

    const isEmptyObject = (obj: Record<string, any>): boolean => {
        return Object.keys(obj).length === 0;
    };

    // useEffect 
    useEffect(() => {

        updateSkillSet();
        updateSkillsCheck();
    }, [attributes]);

    useEffect(() => {
        const newTotal: number = Object.values(skills).reduce((acc: number, value: number) => acc + value, 0);

        setTotalSkill(newTotal);

        if (totalSkill >= totalSkillPoint) {
            alert(`Total points cannot exceed ${totalSkillPoint}`);
        }

        updateSkillsCheck();
    }, [skills]);

    useEffect(() => {
        if (typeof data !== "object" || data === null) {
            console.log("Invalid data: Not an object.");
            return;
        }

        if (isEmptyObject(data)) {
            console.log("Data is an empty object.");
        } else {
            setAttributes(data.attributes);
            setSkills(data.skills)
            updateTotalState(data.attributes);
        }

    }, [])

    useEffect(() => {

        let stateResult = {
            attributes: attributes,
            skills: skills
        }
        onStateSave(stateResult, ind)


    }, [attributes, skills])

    // JSX
    return (

        <section className="App-section">
            <div className="container">
                <h2 className="title">Character {ind+1}</h2>
                <p>Skill: {result.Skill}</p>
                <p>Rolled Number: {result['Rolled Number']}</p>
                <p>DC Value: {result['DC Value']}</p>
                <p>Result: {result.Result}</p>

                <div className="containerskill">
                    <h3>Skill Check: </h3>
                    <select id="skills" value={selectedSkill} onChange={handleSkillChange}>
                        {SKILL_LIST.map((skill) => (
                            <option key={skill.name} value={skill.name}>
                                {skill.name}
                            </option>
                        ))}
                    </select>
                    <label>DC:</label>
                    <input type="number" ref={dcValueRef} defaultValue={10} />
                    <button onClick={runCharacter}>Roll</button>
                </div>

                <div className="itemsWrapper">
                    <div className="itemAttributes">
                        <h3>Attributes</h3>
                        {ATTRIBUTE_LIST.map((attr) => (
                            <div key={attr}>
                                {attr}: {attributes[attr]} (Modifier: {modifiers[attr]})
                                <button onClick={() => increaseSkill(attr)}>+</button>
                                <button onClick={() => decreaseSkill(attr)}>-</button>
                            </div>
                        ))}
                    </div>

                    <div className="itemClasses">
                        <h3>Classes</h3>
                        {Object.entries(CLASS_LIST).map(([name]) => (
                            <div key={name} style={{ color: skillSet[name] ? 'red' : 'white' }}>
                                {name}
                            </div>
                        ))}
                    </div>

                    <div className="item">
                        <h3>Skills</h3>
                        <div>Total skill points available: {totalSkillPoint}</div>
                        {SKILL_LIST.map((skill) => (
                            <div key={skill.name}>
                                {skill.name}: {skills[skill.name]} (Modifier: {skill.attributeModifier}):{' '}
                                {modifiers[skill.attributeModifier]}
                                <button onClick={() => increaseSkillsAttribute(skill.name)}>+</button>
                                <button onClick={() => decreaseSkillsAttribute(skill.name)}>-</button>
                                <label>Total: {skillsCheck[skill.name]}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={saveCharacter}>Save</button>
            </div>
        </section>

    );
}

export default Character;