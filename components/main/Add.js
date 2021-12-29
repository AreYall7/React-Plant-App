import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FlashMode } from 'expo-camera/build/Camera.types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { mdiCameraFlip } from '@mdi/js'
import { Icon } from '@mdi/react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { render } from 'react-dom';



export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
  }, []);

  
  const navToSave = () => {
    // takePicture();
    navigation.navigate('Save', {image});
    console.log(image);
  }

  const takePicture = async () => {
    if(camera){
        const data = await camera.takePictureAsync();
        console.log(data);
        setImage(data.uri); 
        console.log(data.uri);
        let img = data.uri
        console.log(image);
        navigation.navigate('Save', {img});

    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  }
  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  if (!image===null){
    return navToSave();
  }
  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}
      ref={ref => setCamera(ref)}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
        style={{
            alignSelf: 'flex-end',
            alignItems: 'center',
            backgroundColor: 'transparent'
        }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <MaterialCommunityIcons 
                name="camera-switch"
                style={{ color: 'white', fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
        style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            alignSelf: 'flex-end'
            
            
        }}
            onPress={() => {
              takePicture()
              // navToSave()
              
             
            }}>
            <FontAwesome
                name="camera"
                style = {{ color: 'white', fontSize: 40 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
        style={{
            alignItems: 'center',
            backgroundColor: 'transparent',
            alignSelf: 'flex-end'
            
            
        }}
            onPress={() => {
              pickImage()
            }}>
            <Ionicons
                name="images"
                style = {{ color: 'white', fontSize: 40 }}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
            
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        //justifyContent: 'space-between',
        

      },
      camera: {
          flex: 1,
          //width: '100%',
          //FlashMode: {flashMode}
          //aspectRatio: 1
      },
      buttonContainer: {
          flex: 1,
          backgroundColor: 'transparent',
          flexDirection: 'row',
          justifyContent: 'space-between',
          margin: 20
      },
      button: {
          flex: 1,
          flexWrap: 'wrap',
          alignSelf: 'flex-end',
          alignItems: 'center',
          padding: 10
      },
    
      
    
});