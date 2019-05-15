
import React, {Component} from 'react';
import {Platform,PermissionsAndroid,Image,ActivityIndicator,CameraRoll, StyleSheet, Text, View,TouchableOpacity,Alert} from 'react-native';
import ImageResizer from 'react-native-image-resizer';

// var RNFS = require('react-native-fs');

//let compressFormat = 'JPEG' // or 'PNG'
//let quality = 80 // out of 100
/*
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
});
*/


export default class App extends Component<Props> {

  constructor(props){
    super(props);
    this.state = {
      resizedImageUri: '',
      loading: true,
    };
  }

  async componentDidMount() {

      try {
          const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
              {
                  'title': 'Access Storage',
                  'message': 'Access Storage for the pictures'
              }
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log("You can use read from the storage")
          } else {
              console.log("Storage permission denied")
          }
      } catch (err) {
          console.warn(err)
      }



    CameraRoll.getPhotos({ first: 1 })
        .then(photos => {
          if (!photos.edges || photos.edges.length === 0) {
            return Alert.alert(
                'Unable to load camera roll 1',
                'Check that you authorized the access to the camera roll photos and that there is at least one photo in it'
            );
          }

          this.setState({
            image: photos.edges[0].node.image,
          },()=>{

          });
        })
        .catch((err) => {
            alert(err)
          return Alert.alert(
              'Unable to load camera roll 2',
              'Check that you authorized the access to the camera roll photos'
          );
        });
  }

    humanFileSize(bytes) {
        var thresh = 1000;//si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        var units = ['kB','MB','GB','TB','PB','EB','ZB','YB']
        //    : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];

        var u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }

  resize() {

    ImageResizer.createResizedImage(this.state.image.uri, 800, 600, 'PNG', 80)
        .then((response) => {

          this.setState({
            resizedImageUri: response.uri,
            resizedImageSize: this.humanFileSize(parseInt(response.size)),
          });
        })
        .catch(err => {
          alert(err);
          return Alert.alert('Unable to resize the photo', 'Check the console for full the error message');
        });
  }

  render() {
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>Image Resizer example</Text>
          <Text style={styles.instructions}>This is the original image:</Text>
          {this.state.image ? <Image style={styles.image} source={{ uri: this.state.image.uri }} /> : <ActivityIndicator />}
          <Text style={styles.instructions}>Resized image:</Text>
          <TouchableOpacity onPress={() => this.resize()}>
            <Text style={styles.resizeButton}>Click me to resize the image</Text>
          </TouchableOpacity>
          {this.state.resizedImageUri ? (
              <View>
                  <Image style={styles.image} source={{ uri: this.state.resizedImageUri }} />

                  <Text>Size: {this.state.resizedImageSize}</Text>
              </View>

          ) : null}
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
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    image: {
        width: 250,
        height: 250,
    },
    resizeButton: {
        color: '#333333',
        fontWeight: 'bold',
        marginBottom: 5,
    },
});
