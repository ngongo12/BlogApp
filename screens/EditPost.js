import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
import DropDownPicker from 'react-native-dropdown-picker';
import firebase from '../utilities/firebase_database';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
    Keyboard,
    Pressable,
    Modal,
    ToastAndroid
} from 'react-native';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import AddedImageView from '../components/AddedImageView'
import ChooseImageMenu from '../components/ChooseImageMenu'
import IsLoading from '../components/IsLoading'
import MyVideo from '../components/MyVideo'

const EditPost = (props) => {
    const {route, navigation} = props;
    const {params: {id}} = route;
    const [post, setPost] = useState(null)
    const [visibleChooseVideoMenu, setVisibleChooseVideoMenu] = useState(false)
    const [videoPicked, setVideoPicked] = useState(null)
    const [showMenu, setShowMenu] = useState(false);
    const [loading, setLoading] = useState(false)
    const [canPost, setCanPost] = useState(true);
    const [visibleChooseImage, setVisibleChooseImage] = useState(false)
    const [text, setText] = useState("");
    const [imagePicked, setImagePicked] = useState([])
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([]);
    const isFocused = useIsFocused();
    const [user, setUser] = useState(null)
    const isCanPost = (text) => {
        let temp = false
        if (text.length > 0) {
            temp = true;
        }
        else {
            temp = false
        }
        setCanPost(temp || (imagePicked.length > 0))
    }

    useEffect(() => {
        const { currentUser } = firebase.auth()
        firebase.firestore().collection('users')
            .doc(currentUser.uid)
            .get()
            .then(user=>{
                setUser(user.data());
            })
    },[isFocused])


    useEffect(() => {
        firebase.firestore().collection('categories').orderBy('name')
            .onSnapshot(res => {
                let data = [];
                res.forEach(element => {
                    const {name} = element.data();
                    data.push({label :name, value: element.id, key: element.id});
                });
                setItems(data);
            })
        return;
    }, [])

    useEffect(() => {
        firebase.firestore().collection('posts').doc(id).get()
            .then(res => {
                setPost(res.data())
                setText(res.data().content)
                setValue(res.data().categories)
                console.log(res)
            })
            .catch(err=>{
                setText('')
            })
        return;
    }, [])

    console.log(id)

    const openLibrary = () =>{
        launchImageLibrary(
            {
                mediaType: 'photo',
            },
            (res) =>{
                if(res.assets)
                {
                    console.log(res.assets)
                    setImagePicked(res.assets);
                    setCanPost(true)
                    setVisibleChooseImage(false);
                }
            }
        )
    }

    const openLibraryVideo = () =>{
        launchImageLibrary(
            {
                mediaType: 'video',
            },
            (res) =>{
                if(res.assets)
                {
                    console.log(res.assets)
                    setVideoPicked(res.assets[0]);
                    setCanPost(true)
                    setVisibleChooseVideoMenu(false);
                }
            }
        )
    }

    const openCamera = () =>{
        launchCamera(
            {
                mediaType: 'photo',
                saveToPhotos: false
            },
            (res) =>{
                if(res.assets)
                {
                    console.log(res.assets)
                    setImagePicked(res.assets);
                    setCanPost(true)
                    setVisibleChooseImage(false);
                }
            }
        )
    }

    useEffect(() => {
        Keyboard.addListener("keyboardDidShow", _keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", _keyboardDidHide);

        // cleanup function
        return () => {
            Keyboard.removeListener("keyboardDidShow", _keyboardDidShow);
            Keyboard.removeListener("keyboardDidHide", _keyboardDidHide);
        };
    }, []);

    const _keyboardDidShow = () => setShowMenu(true);
    const _keyboardDidHide = () => setShowMenu(false);

    const uploadPost = async () => {
        setLoading(true)
        try{
            const doc = await firebase.firestore().collection('posts').doc(id);
            const imgUrl = await upLoadImage(doc.id);
            const videoUrl = await upLoadVideo(doc.id);
            let obj = {
                content: text,
                categories: value,
            }
            if(imgUrl != null)
            {
                obj = {...obj, ...{image: imgUrl}}
            }
            if(videoUrl != null)
            {
                obj = {...obj, ...{video: videoUrl}}
            }
            console.log(obj)
            doc.update({...obj})
                .then(res=> {
                    ToastAndroid.show("Thay đổi thành công", ToastAndroid.SHORT)
                    navigation.goBack();
                    setLoading(false)
                })
                .catch(error => {
                    console.log(error.message)
                    ToastAndroid.show("Thay đổi thất bại " +error.message, ToastAndroid.SHORT)
                    setLoading(false)
                })
        }
        catch(err)
        {
            ToastAndroid.show("Lỗi khi try catch > "+ err, ToastAndroid.SHORT)
            console.log(err)
        }
        setLoading(false)
    }

    const upLoadVideo = async (name) =>{
        if(!videoPicked) return null
        const {uri, fileName} = videoPicked
        const ref = firebase
            .storage()
            .ref('Video')
            .child(name)
        
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

        let urlVideo = await snapshot.ref.getDownloadURL();
        console.log('>>>>', urlVideo)
        return urlVideo
        
    }

    const upLoadImage = async (name) =>{
        if(imagePicked.length==0) return null
        const {uri, fileName} = imagePicked[0]
        const tail = fileName.split('.');
        const ref = firebase
            .storage()
            .ref('Images')
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

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="keyboard-backspace" size={26} style={{ marginLeft: 10, marginRight: 10 }} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>EDIT POST</Text>
                <Pressable  onPress={uploadPost} disabled={!canPost}>
                    <Text style={[styles.postPress, canPost && { color: 'blue', fontWeight: '500' }]}>EDIT</Text>
                </Pressable>
            </View>
            <View style={styles.header}>
                <TouchableOpacity style={styles.coverAvatar}>
                    <Image source={(!user?.avatar) ? require('../images/avatar.jpg') : {uri: user?.avatar}} style={styles.avatar} />
                </TouchableOpacity>
                <View style={styles.title}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.name}>{user?.name}</Text>
                    </View>
                    <DropDownPicker
                        multiple={true}
                        min={0}
                        max={3}
                        open={open}
                        value={value}
                        items={items}
                        setOpen={setOpen}
                        setValue={setValue}
                        setItems={setItems}
                        style={styles.dropdownBox}
                        placeholder="Hãy chọn mục đăng"
                        //Badge
                        mode="BADGE"
                        badgeDotColors={["#7fff00", "#ff7f50", "#6495ed", "#dc143c", "#00ffff", "#9932cc"]}
                        badgeColors={'#DFDFDF'}
                        badgeDotStyle={{
                            borderRadius: 10
                        }}
                        badgeTextStyle={{
                            fontStyle: "italic"
                        }}
                        badgeStyle={{
                            alignContent: 'center',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                        //dropdown
                        dropDownContainerStyle={{
                            borderWidth: 0.5,
                            borderColor: 'grey'
                        }}

                    />
                </View>
            </View>
            <ScrollView>
                <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => { setText(text), isCanPost(text) }}
                    value={text}
                    multiline={true}
                    numberOfLines={4}
                    placeholder={'Hãy nhập nội dung bài viết'}
                />
                <MyVideo uri={videoPicked?.uri} url={post?.video} />
                <AddedImageView data={imagePicked} url={post?.image} style={{alignSelf: 'flex-end'}} />
            </ScrollView>
            <View style={[styles.menu, showMenu && { flexDirection: 'row', alignSelf: 'stretch' }]}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setVisibleChooseImage(true)}>
                    <Image style={styles.menuIcon} source={require('../images/photo.png')} />
                    <Text style={styles.menuText}>Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}  onPress={()=> setVisibleChooseVideoMenu(true)}>
                    <Image style={styles.menuIcon} source={require('../images/video.png')} />
                    <Text style={styles.menuText}>Video</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Image style={styles.menuIcon} source={require('../images/gif.png')} />
                    <Text style={styles.menuText}>GIF</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Image style={styles.menuIcon} source={require('../images/bg_icon.png')} />
                    <Text style={styles.menuText}>Background color</Text>
                </TouchableOpacity>
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
            <Modal
                visible={visibleChooseVideoMenu}
                transparent={true}
                animationType='slide'
            >
                <ChooseImageMenu 
                    close={()=> setVisibleChooseVideoMenu(false)}
                    openLibrary={openLibraryVideo}
                />
            </Modal>
            <Modal
                visible={loading}
                transparent={true}
                animationType='fade'
            >
                <IsLoading />
            </Modal>
        </View>
    )
}
export default EditPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 0,
        //justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    topBarTitle: {
        fontSize: 15,
        flex: 1,
        margin: 16,
        marginLeft: 0
    },
    postPress: {
        fontSize: 15,
        margin: 16,
        color: 'grey'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        alignItems: 'center',
        paddingTop: 0
    },
    coverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderWidth: 0.5,
        borderColor: 'grey'
    },
    title: {
        flex: 1,
        padding: 5,
        paddingLeft: 10
    },
    name: {
        fontSize: 15,
        flex: 1,
        fontWeight: 'bold',
    },
    dropdownBox: {
        borderWidth: 0.5,
        alignSelf: 'auto',
        borderColor: 'grey',
        height: 40
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        textAlignVertical: "top",
        padding: 16
    },
    menu: {
        flexDirection: 'column',
        borderTopWidth: 0.5,
        borderColor: 'silver'
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderColor: 'silver'
    },
    menuIcon: {
        width: 30,
        height: 30,
        resizeMode: 'cover',
        margin: 10
    },
    menuText: {
        flex: 1,
        fontSize: 16,
    }
})