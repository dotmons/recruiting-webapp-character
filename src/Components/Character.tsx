import { useEffect, useReducer, useRef } from 'react';
import {CLASS_LIST } from '../consts';






function Character({ indx, data, onStateChange }) {



    // Reducer function
    const reducer = (state, action) => {
        switch (action.type) {
            case 'INCREASEATTRIBUTES':

                if (state.attributeData.totalValue >= 70) {
                    alert('Total sum cannot be greater than 70')
                    return state;
                }

                const attValue = state.attributeData.attributeValues.map((value, index) => {
                    if (action.payload === index) {
                        const attval = { ...value, attributevalue: value.attributevalue + 1 }
                        attval.modifier = Math.floor((attval.attributevalue - 10) / 2)
                        return attval
                    }
                    return value
                })

                let sum = 0;


                attValue.map((value) => {
                    sum += value.attributevalue
                })


                let attributeDataresulta = {
                    totalValue: sum,
                    attributeValues: attValue
                }

                return {
                    ...state,
                    attributeData: attributeDataresulta

                }

            case 'DECREASEATTRIBUTES':
                const attres = state.attributeData.attributeValues.map((value, index) => {
                    if (action.payload === index) {
                        if (value.attributevalue <= 0) {
                            alert('Attribute value cannot be less than 0')
                            return value
                        }
                        const attval = { ...value, attributevalue: value.attributevalue - 1 }
                        attval.modifier = Math.floor((attval.attributevalue - 10) / 2)
                        return attval
                    }
                    return value
                })

                let totalvaless = attres.reduce((sum, value) =>
                    sum + value.attributevalue, 0
                )

                let attributeDataresult = {
                    totalValue: totalvaless,
                    attributeValues: attres
                }

                return {
                    ...state,
                    attributeData: attributeDataresult

                }

            case 'CLASSSETTINGS':

                const getAttributeByName = (name) => state.attributeData.attributeValues.find(attr => attr.name === name);
                const getClassUpdateName = (ind) => {
                    for (const attr in Object.values(CLASS_LIST)) {

                        if (ind == attr) {

                            let isTrue = true;
                            for (const key in Object.values(CLASS_LIST)[attr]) {
                                if (getAttributeByName(key).attributevalue < Object.values(CLASS_LIST)[attr][key]) {
                                    isTrue = false;
                                    break;
                                }
                            }
                            return isTrue;
                        }
                    }
                }

                // const getClassUpdateName = (ind) => {

                //     return state.classData.some((value, index) => {

                //         if (ind == index) {

                //             let attrSkills = value[1];
                //             let inx = 0;
                //             let isTrue = true;
                //             for (const key in attrSkills) {

                //                 if (state.attributeData.attributeValues[inx].attributevalue < attrSkills[key]) {
                //                     isTrue = false;
                //                     break;
                //                 }
                //                 inx++;
                //             }
                //             return isTrue;
                //         }

                //     })
                // }

                //classlistimport
                //const isGreater = Object.keys(arr1).every(key => arr1[key] > arr2[key]);



                const updatedClassData = state.classData.map((value, index) => {
                    const isTrue = getClassUpdateName(index);
                    return { ...value, classValue: isTrue };
                });

                return { ...state, classData: updatedClassData };


            case 'TOTALSKILLPOINTS':
                const totalSkillPoints = 10 + state.attributeData.attributeValues.find((att) => att.name === 'Intelligence').modifier * 4;
                return { ...state, skillData: { ...state.skillData, totalSkillPoints: totalSkillPoints } };


            case 'SKILLSATTRIBUTESADDITION':
                const skillResult = state.skillData.skillListResult.map((value, index) => {
                    if (action.payload === index) {
                        const addskill = {
                            ...value, nameValue: value.nameValue + 1
                        }
                        addskill.totalValue = addskill.nameValue + addskill.modifierValue
                        return addskill
                    }
                    else {
                        return value
                    }
                })

                return {
                    ...state,
                    skillData: {
                        ...state.skillData, skillListResult: skillResult
                    }
                }

            case 'SKILLSATTRIBUTESSUBTRACTION':

                const skillDecrease = state.skillData.skillListResult.map((value, index) => {

                    if (action.payload === index) {
                        const subSkill = { ...value, nameValue: value.nameValue - 1 }
                        subSkill.totalValue = subSkill.nameValue + subSkill.modifierValue
                        return subSkill
                    }
                    else {
                        return value
                    }
                })


                return {
                    ...state, skillData: {
                        ...state.skillData, skillListResult: skillDecrease
                    }
                }

            // To sum up the total skills in the SKILLS section
            case 'SKILLSUMS':

                const totalSkills = state.skillData.skillListResult.map((value, index) => {
                    return { ...value, totalValue: value.nameValue + value.modifierValue }
                })

                return {
                    ...state, skillData: {
                        ...state.skillData, skillListResult: totalSkills
                    }
                }


            // To update skill modifier based on the attributes

            case 'ATTRIBUTESKILLS':


                const skillmod = state.skillData.skillListResult.map((value, index) => {

                    const result = state.attributeData.attributeValues.find((attr) => attr.name === value.attributeModifier);

                    return { ...value, modifierValue: result.modifier }

                })

                return {
                    ...state, skillData: {
                        ...state.skillData, skillListResult: skillmod
                    }
                }

            case 'GENERATERESULT':
                const rolledNumber = Math.floor(Math.random() * 20) + 1;
                const dcValue = dcval.current.value
                const skillValue = skillsval.current.value
                const skillVal = state.skillData.skillListResult.find((attr) => attr.name === skillValue)

                const result = {

                    skill: skillValue + ' : ' + skillVal.totalValue,
                    rolledNumber: rolledNumber,
                    dcValue: dcValue,
                    result: (rolledNumber + skillVal.totalValue) > dcValue ? 'PASS' : 'FAILURE'
                }

                return {
                    ...state, charPlayers: result
                }

            default:
                return state

        }
    }




    // function implementation
    const increaseAttributes = (value) => {
        //console.log('target: ', value)
        dispatch({ type: "INCREASEATTRIBUTES", payload: value })
        dispatch({ type: "CLASSSETTINGS" })
        dispatch({ type: "TOTALSKILLPOINTS", payload: value })
        dispatch({ type: "ATTRIBUTESKILLS", payload: value })
        dispatch({ type: "SKILLSUMS" })
    }

    const decreaseAttributes = (value) => {
        //console.log("decrease: ", value)
        dispatch({ type: "DECREASEATTRIBUTES", payload: value })
        dispatch({ type: "CLASSSETTINGS" })
        dispatch({ type: "TOTALSKILLPOINTS", payload: value })
        dispatch({ type: "ATTRIBUTESKILLS", payload: value })
        dispatch({ type: "SKILLSUMS" })
    }


    const incrementSkill = (value) => {
        dispatch({ type: "SKILLSATTRIBUTESADDITION", payload: value })
    }

    const decreaseSkill = (value) => {
        dispatch({ type: "SKILLSATTRIBUTESSUBTRACTION", payload: value })
    }

    function roll() {

        dispatch({ type: 'GENERATERESULT' })

    }


    const dcval = useRef(null)
    const skillsval = useRef(null)
    const [state, dispatch] = useReducer(reducer, data);

    useEffect(() => {
        onStateChange(indx, state);
        //console.log('id before', indx, 'new state> ', state)
    }, [state]);




    return (

            <section className="App-section">
                <div className="container">
                    <h2 className="title">Character {indx + 1}</h2>
                    <p>Skill: {state.charPlayers.skill} </p>
                    <p>Rolled Number: {state.charPlayers.rolledNumber}</p>
                    <p>DC Value: {state.charPlayers.dcValue}</p>
                    <p>Result: {state.charPlayers.result}</p>

                    <div className="containerskill">
                        <h3>Skill Check: </h3>
                        <select id={indx + 'skills'} name={indx + 'skills'} ref={skillsval}>

                            {
                                Array.isArray(state.skillData.skillListResult) && state.skillData.skillListResult.map((value, index) => (
                                    <option key={index} value={value.name}> {value.name} </option>
                                ))

                            }

                        </select>
                        <div>DC:</div>
                        <input type="number" ref={dcval} id={indx + 'dcvalue'} name={indx + 'dcvalue'}></input>
                        <button onClick={roll}>Roll</button>
                    </div>

                    <div className="itemsWrapper">
                        <div className="itemAttributes">
                            <h3>Attributes</h3>

                            {Array.isArray(state.attributeData.attributeValues) && state.attributeData.attributeValues.map((value, index) => (

                                <div key={index}>
                                    <div>{value.name}: {value.attributevalue} (Modifier: {value.modifier})
                                        <button onClick={() => increaseAttributes(index)}>+</button>
                                        <button onClick={() => decreaseAttributes(index)}>-</button>
                                    </div>
                                </div>


                            ))}

                        </div>

                        <div className="itemClasses">
                            <h3>Classes</h3>
                            {Array.isArray(state.classData) && state.classData.map((value, index) => {
                                //console.log(value.className, ' ', value.classValue)
                                return (
                                    <div key={index} style={{ color: value.classValue === true ? 'red' : 'white' }}>{value.className}</div>
                                )
                            })}

                        </div>

                        <div className="item">
                            <h3>Skills</h3>
                            <div>Total skill points available: {state.skillData.totalSkillPoints}</div>
                            <br />
                            {Array.isArray(state.skillData.skillListResult) && state.skillData.skillListResult.map((value, index) => {
                                return (
                                    <div key={index}> {value.name} : {value.nameValue} (Modifier: {value.attributeModifier}): {value.modifierValue}
                                        <button onClick={() => incrementSkill(index)}>+</button>
                                        <button onClick={() => decreaseSkill(index)}>-</button>
                                        total: {value.totalValue}
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                    
                </div>
            </section>
    )
}

export default Character;