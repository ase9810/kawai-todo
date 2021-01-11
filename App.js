import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, Dimensions, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AppLoading from 'expo-app-loading'
import 'react-native-get-random-values'
import { v4 as uuid } from 'uuid'
import ToDo from './ToDo'
import { object } from 'prop-types';

const { height, width } = Dimensions.get("window");

export default function App() {
  const [newToDo, setNewToDo] = useState("")
  const [loadedToDos, setLoadedToDos] = useState(false)
  const [toDos, setToDos] = useState({})

  useEffect(() => {
    const loadToDos = async () => {
      try {
        const value = await AsyncStorage.getItem("toDos");
        const parseValue = JSON.parse(value)
        setToDos(parseValue)
      } catch (err) {

      }
      setLoadedToDos(true)
    }
    loadToDos()
  }, [])

  if (!loadedToDos) {
    return (
      <AppLoading />
    );
  }



  const addToDo = () => {
    if (newToDo !== "") {
      setToDos(prevToDos => {
        const ID = uuid();
        const newToDoObject = {
          //state값을 database처럼 다루기 위한 설정
          [ID]: {
            id: ID,
            isCompleted: false,
            text: newToDo,
            createdAt: Date.now()
          }
        };
        const newToDos = Object.assign({}, prevToDos, newToDoObject)
        saveToDos(newToDos)
        return newToDos
      })
      setNewToDo("")
    }
  }

  const deleteToDo = (id) => {
    const newToDos = Object.assign({}, toDos);
    delete newToDos[id];
    saveToDos(newToDos)
    setToDos(newToDos);
  }

  const updateToDo = (id, text) => {
    setToDos(prevToDos => {
      const newToDos = {
        ...prevToDos,
        [id]: {
          ...prevToDos[id],
          text: text
        }
      }
      saveToDos(newToDos)
      return newToDos
    })
  }

  const toggleIsComplete = (id) => {
    setToDos(prevToDos => {
      const newToDos = {
        ...prevToDos,
        [id]: {
          ...prevToDos[id],
          isCompleted: !prevToDos[id].isCompleted
        }
      }
      saveToDos(newToDos)
      return newToDos
    })
  }

  const saveToDos = (newToDos) => {
    AsyncStorage.setItem("toDos", JSON.stringify(newToDos))
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.title}>Kawai To Do</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={"New To Do"}
          value={newToDo}
          onChangeText={setNewToDo}
          placeholderTextColor={"#999"}
          returnKeyType={"done"}
          autoCorrect={false}
          onSubmitEditing={addToDo}
        />
        <ScrollView contentContainerStyle={styles.toDos}>
          {Object.values(toDos)
            .reverse()
            .map(toDo =>
              <ToDo key={toDo.id}
                delete={deleteToDo}
                update={updateToDo}
                toggle={toggleIsComplete}
                {...toDo} />
            )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F23657',
    alignItems: 'center'
  },
  title: {
    color: "white",
    fontSize: 30,
    marginTop: 50,
    fontWeight: "200",
    marginBottom: 30
  },
  card: {
    backgroundColor: "white",
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "rgba(50,50,50)",
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0
        }
      },
      android: {
        elevation: 3
      }
    })
  },
  input: {
    padding: 20,
    borderBottomColor: "#bbb",
    borderBottomWidth: 1,
    fontSize: 25
  },
  toDos: {
    alignItems: "center"
  }
});
