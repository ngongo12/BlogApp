import React, {useEffect, useState} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/AntDesign';
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
    Pressable,
    Modal
} from 'react-native';
import firebase from '../utilities/firebase_database'
import LikeShareView from './LikeShareView'
import MenuModal from './MenuModal'
import DateTime from './DateTime'
import ScaleImage from './ScaleImage'
import MyVideo from './MyVideo'



const windowWidth=Dimensions.get('window').width;
const ItemPost = (props) => {
    const {item: {key}, navigate, user} = props;
    const [modalVisible, setModalVisible] = useState(false);
    const [post, setPost] = useState(null)
    const [userCreate, setUserCreate] = useState(null)

    useEffect(()=>{
        firebase.firestore().collection('posts')
            .doc(key)
            //.get()
            .onSnapshot(res => {
                setPost(res.data())
                
            })
            //.catch(err => {})
    },[])
    useEffect(()=>{
        if(post!=null)
        {
            firebase.firestore().collection('users')
                .doc(post?.createdBy)
                .get()
                .then(res => {
                    setUserCreate(res.data())
                    
                })
                .catch(err => {})
        }
    },[post])
    
    if(!post)
        return(
            <View />
        )
    return(
        <>
            <View style={styles.container}>
                
                <View style={styles.header}>
                    <TouchableOpacity style={styles.coverAvatar}>
                        <Image source={(!user?.avatar) ? require('../images/avatar.jpg') : {uri: user?.avatar}} style={[styles.avatar, !post.isPublish && styles.privatePost]} />
                    </TouchableOpacity>
                    <View style={styles.title}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.name}>{userCreate?.name}</Text>
                            <TouchableOpacity onPress={()=> setModalVisible(true)}>
                                <MaterialCommunityIcons name="dots-horizontal" size={26} color="#66676b" />
                            </TouchableOpacity>
                        </View>
                        <DateTime time={post.createdAt} />
                    </View>
                </View>
                <Pressable style={styles.content} onPress={()=>navigate("PostDetails", {key, navigate: navigate, user})}>
                    <Text numberOfLines={3} 
                        ellipsizeMode='tail'
                        style={styles.textContent}>
                            {post.content}
                    </Text>
                    {(post?.image)&&<ScaleImage uri={post.image} />}
                    {(post?.video)&&<MyVideo uri={post.video} />}
                    
                </Pressable>
                <LikeShareView user={user} id={key} />
                <Modal
                    style={{margin: 0}}
                    animationType = 'slide'
                    visible={modalVisible}
                    transparent={true}
                    onBackdropPress={() => setModalVisible(false)}>
                    <MenuModal 
                        //user={user} 
                        isPublish={post.isPublish} 
                        id={key}
                        post={post}
                        {...props}
                        onChosen={()=>setModalVisible(false)}/>
                </Modal>
            </View>
        </>
    )
}

export default ItemPost;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 0,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        elevation: 5,
        marginBottom: 12
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        alignItems: 'center'
    },
    coverAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    privatePost:{
        borderWidth: 1,
        borderColor: 'red'
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
    optionMenu: {
        padding: 10,
    },
    content: {
        flexDirection: 'column'
    },
    textContent: {
        padding: 16,
        fontSize: 15,
        paddingTop: 0
    },
    imageItem: {
    },
})