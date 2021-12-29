import { Header } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity} from 'react-native'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { TextInput, Button } from 'react-native-paper';
require("firebase/firestore")
require("firebase/firebase-storage")

export default function Save(props, {navigation}) {
    const [plantName, setPlantName] = useState('');
    const [plantSpecies, setPlantSpecies] = useState('');
    const img = props.route.params.img;
    console.log(img)
    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString()}`;

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase 
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        const savePostData = (downloadURL) => {
            firebase.firestore()
                .collection('plants')
                .doc(firebase.auth().currentUser.uid)
                .collection("userPlants")
                .add({
                    downloadURL,
                    plantName,
                    plantSpecies,
                    creation: firebase.firestore.FieldValue.serverTimestamp()
                }).then((function () {
                    props.navigation.popToTop()
                }))
        }
    }
    
    return (
        <View style={{flex: 1}}>
           <Image source={{uri: img}} style={{flex: 1}}/>
            <TextInput
                mode="outlined"
                label="Name Your Plant"
                onChangeText={plantName => setPlantName(plantName)}
            />
            <TextInput
                mode="outlined"
                label="Plant Species"
                onChangeText={text => setPlantSpecies(text)}
            />
            <Button
                style={{
                    marginTop: 2,
                    marginBottom: 2,
                    padding: 5,
                }}
                mode="contained"
                onPress={() => {
                  savePostData()
                }}>
                    Save
            </Button>
        </View>
    )
}
