import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    View,
    TextInput,
    Image,
    Text,
    TouchableOpacity,
    FlatList,
    ImageBackground,
    Dimensions,
    ToastAndroid
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firebase from '../utilities/firebase_database';
import { Modal } from 'react-native';
import ChooseImageMenu from '../components/ChooseImageMenu'

const windowW=Dimensions.get('window').width;
const Profile = props =>{
    const {navigation : {navigate}} = props;

    const [name, setName] = useState('')
    const [user, setUser] = useState(null);
    const isFocused = useIsFocused();
    const [canChange, setCanChange] = useState(false)
    const [imagePicked, setImagePicked] = useState(null)
    const [visibleChooseImage, setVisibleChooseImage] = useState(false)

    useEffect(() => {
        const { currentUser } = firebase.auth()
        firebase.firestore().collection('users')
            .doc(currentUser.uid)
            .get()
            .then(user=>{
                setUser(user.data());
                setName(user?.data()?.name);
            })
    },[isFocused])

    const openLibrary = () =>{
        launchImageLibrary(
            {
                mediaType: 'photo',
                width: 200,
                height: 200
            },
            (res) =>{
                if(res.assets)
                {
                    setImagePicked(res.assets[0]);
                    setCanChange(true)
                    setVisibleChooseImage(false);
                }
            }
        )
    }

    const openCamera = () =>{
        launchCamera(
            {
                mediaType: 'photo',
                saveToPhotos: false,
                width: 200,
                height: 200
            },
            (res) =>{
                if(res.assets)
                {
                    
                    setImagePicked(res.assets[0]);
                    setCanChange(true)
                    setVisibleChooseImage(false);
                }
            }
        )
    }
    console.log(imagePicked)

    const uploadPost = async () => {
        try{
            const imgUrl = await upLoadImage(user.id);
            let obj = {
                name: name
            }
            if(imgUrl != null)
            {
                obj = {...obj, ...{avatar: imgUrl}}
            }
            console.log(obj)
            firebase.firestore().collection('users').doc(user.id).update({...obj})
                .then(res=> {
                    ToastAndroid.show("Thay đổi thành công", ToastAndroid.SHORT)
                })
                .catch(error => {
                    console.log(error.message)
                    setImagePicked(null)
                    ToastAndroid.show("Thay đổi thất bại " +error.message, ToastAndroid.SHORT)
                })
        }
        catch(err)
        {
            ToastAndroid.show("Lỗi khi try catch > "+ err, ToastAndroid.SHORT)
            console.log(err)
        }
    }

    const upLoadImage = async (name) =>{
        if(!imagePicked) return null
        const {uri, fileName} = imagePicked
        const tail = fileName.split('.');
        const ref = firebase
            .storage()
            .ref('Avatar')
            .child(name+"."+tail[1])
        
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        var mimeString = uri.split(":")[1]
        const snapshot = await ref.put(blob, { contentType: mimeString })

        let urlHinhAnh = await snapshot.ref.getDownloadURL();
        console.log('>>>>', urlHinhAnh)
        return urlHinhAnh
        
    }

    const checkEdit=(_name)=>{
        if(_name != user?.name)
        {
            setCanChange(true)
        }
        else
        {
            (!imagePicked)
            {
                setCanChange(false)
            }

        }
    }
    return(
        <View style={styles.container}>
            <ImageBackground source={require('../images/wallpaper.jpg')} style={styles.wall}>
                <TouchableOpacity style={{flex:1}} onPress={()=>setVisibleChooseImage(true)}>
                    <Image source={(!user?.avatar) ? (!imagePicked ? require('../images/avatar.jpg') : {uri: imagePicked.uri}) : {uri: user?.avatar}} style={styles.avatar} />
                </TouchableOpacity>
            </ImageBackground>
            <View style={styles.content}>
                <View style={[styles.row,{marginTop: 20}]}>
                    <Text style={styles.label}>Name:</Text>
                    <TextInput style={[styles.value, {padding: 0}]}
                        value={name}
                        onChangeText={(name)=>{setName(name), checkEdit()}}
                        />
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email:</Text>
                    <Text style={styles.value}>{user?.email}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Role:</Text>
                    <Text style={styles.value}>{user?.type}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Created At:</Text>
                    <Text style={styles.value}>{
                        (!user?.id) ? 'unknow' : (new Date(user?.createdAt.toDate())).toDateString()
                    }
                    </Text>
                </View>
                {canChange&&(<TouchableOpacity style={styles.button} onPress={uploadPost} >
                    <Text style={styles.textBtn}>Edit</Text>
                </TouchableOpacity>)}
            </View>
            <Modal
                visible={visibleChooseImage}
                transparent={true}
                animationType='slide'
            >
                <ChooseImageMenu 
                    close={()=> setVisibleChooseImage(false)}
                    openLibrary={openLibrary}
                    openCamera={openCamera}
                />
            </Modal>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 0,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        flex: 1
    },
    wall:{
        width: '100%',
        height: windowW*3/5,
        resizeMode: 'cover'
    },
    avatar:{
        width: 120,
        height: 120,
        resizeMode: 'cover',
        borderRadius: 150,
        borderWidth: 4,
        borderColor: 'silver',
        position: 'absolute',
        bottom: -50,
        left: windowW/2-60
    },
    content:{
        backgroundColor: 'white',
        flex: 1,
        marginTop: 50
    },
    row:{
        flexDirection: 'row',
        padding: 10
    },
    label: {
        width: '30%',
        paddingLeft: 20,
        fontSize: 16,
        color: 'blue',
        textAlign: 'right'
    },
    value:{
        fontSize: 16,
        fontStyle: 'italic',
        color:'blue',
        paddingLeft: 30
    },
    button:{
        width: 150,
        height: 70,
        borderRadius: 10,
        backgroundColor: '#1878f3',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 30
    },
    textBtn:{
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold'
    }
})