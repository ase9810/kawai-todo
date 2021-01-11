import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, TextInput } from 'react-native'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get("window");

export default function ToDo(props) {
    const [isEditing, setIsEditing] = useState(false)
    const [toDoValue, setToDoValue] = useState("")

    const changeValue = () => {
        setIsEditing(true)
        setToDoValue(props.text)
    }

    const updateValue = () => {
        if(toDoValue !== props.text) 
            props.update(props.id, toDoValue)
        setIsEditing(false)
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <TouchableOpacity onPress={(e) => {
                    e.stopPropagation();
                    props.toggle(props.id);
                }}>
                    <View style={[
                        styles.circle,
                        props.isCompleted ? styles.completedCircle : styles.umcompletedCircle
                    ]} />
                </TouchableOpacity>
                {isEditing ? (
                    <TextInput
                        style={[
                            styles.input,
                            styles.text,
                            props.isCompleted ? styles.completedCircle : styles.umcompletedCircle
                        ]}
                        value={toDoValue}
                        multiline={true}
                        onChangeText={setToDoValue}
                        returnKeyType={"done"}
                        autoFocus
                        onBlur={(e) => {
                            e.stopPropagation();
                            updateValue();
                        }}
                    />
                ) : (
                        <Text style={[
                            styles.text,
                            props.isCompleted ? styles.completedText : styles.uncompletedText
                        ]}>
                            {props.text}
                        </Text>
                    )}
            </View>
            {isEditing ? (
                <View style={styles.actions}>
                    <TouchableOpacity onPressOut={(e) => {
                        e.stopPropagation();
                        updateValue();
                    }}>
                        <View style={styles.actionContainer}>
                            <Text style={styles.actionText}>✅</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : (
                    <View style={styles.actions}>
                        <TouchableOpacity onPressOut={(e) => {
                            e.stopPropagation();
                            changeValue();
                        }}>
                            <View style={[styles.actionContainer, styles.actionContainerEdit]}>
                                <Text style={styles.actionText}>🖊</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPressOut={(e) => {
                            e.stopPropagation();
                            props.delete(props.id);
                        }}>
                            <View style={styles.actionContainer}>
                                <Text style={styles.actionText}>❌</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
        </View>
    )
}

ToDo.prototype = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    delete: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired
}

const styles = StyleSheet.create({
    container: {
        width: width - 50,
        borderBottomColor: "#bbb",
        borderBottomWidth: StyleSheet.hairlineWidth,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 25,
        borderColor: "red",
        borderWidth: 3,
        marginRight: 20
    },
    completedCircle: {
        borderColor: "#bbb"
    },
    uncompletedCircle: {
        borderColor: "#F23657"
    },
    completedText: {
        color: "#bbb",
        textDecorationLine: "line-through"
    },
    uncompletedText: {
        color: "#353839"
    },
    text: {
        fontWeight: "600",
        fontSize: 20,
        marginVertical: 20
    },
    column: {
        flexDirection: "row",
        alignItems: "center",
        width: width / 2,
    },
    actions: {
        flexDirection: "row"
    },
    actionContainer: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    actionContainerEdit: {
        marginRight: 25
    },
    input: {}
});
