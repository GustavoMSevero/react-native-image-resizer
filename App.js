
import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ImageResizer from 'react-native-image-resizer';

//let compressFormat = 'JPEG' // or 'PNG'
//let quality = 80 // out of 100
let imageUri = '/storage/emulated/0/DCIM/Camera/IMG_20190508_184036.jpg';

ImageResizer.createResizedImage(imageUri, 640, 480, 'JPEG', 80).then((resizedImageUri) => {
  let i = new Izzati("http://192.168.1.17:5020/")
  i.send({text: {hello: 'me'}, file: {uri: resizedImageUri, filename: 'photo.jpg'}, response: {base64: false}}, (out) => {
      this.setState(previous => {
          return {uri: i.prefixPath(out.path)}
    })
  })
}).catch((err) => {
  console.log(err)
})


type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
