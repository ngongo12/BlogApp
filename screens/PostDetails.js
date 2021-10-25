import React, {useState, useEffect} from 'react';
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
    Modal
} from 'react-native';
import firebase from '../utilities/firebase_database'
import MenuModal from '../components/MenuModal'
import LikeShareView from '../components/LikeShareView'
import IsLoading from '../components/IsLoading'
import DateTime from '../components/DateTime'
import ScaleImage from '../components/ScaleImage'
import MyVideo from '../components/MyVideo'


const navbarHeight = Dimensions.get('screen').height - Dimensions.get('window').height - StatusBar.currentHeight;
const PostDetails = (props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const {route: {params: {user, navigate, key, name}}} = props;
    const [post, setPost] = useState(null)
    const [content, setContent] = useState('')

    useEffect(()=>{
        firebase.firestore().collection('posts')
            .doc(key)
            //.get()
            .onSnapshot(res => {
                setPost(res.data())
                const str = res.data().content
                if(str)
                {
                    let arr = str.split('\n');
                    setContent("\n\t" + arr.join("\n\t"))
                }
            })
            //.catch(err => {})
    },[])
    if(!post)
    {
        return (
            <IsLoading />
        )
    }
    
    return(
        <>
            <StatusBar backgroundColor='white' hidden={false} barStyle="dark-content" />
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={()=> navigate("MainScreen")}>
                        <MaterialCommunityIcons name="keyboard-backspace" size={26} style={{marginLeft: 10, marginRight: 10}} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.coverAvatar}>
                        <Image source={require('../images/avatar.jpg')} style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={styles.title}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.name}>{user?.name}</Text>
                            <TouchableOpacity onPress={()=> setModalVisible(true)} style={styles.optionMenu}>
                                <MaterialCommunityIcons name="dots-horizontal" size={26} color="#66676b" />
                            </TouchableOpacity>
                        </View>
                        <DateTime time={post?.createdAt} />
                    </View>
                </View>
                <ScrollView style={{marginBottom: navbarHeight}}>
                    <View style={styles.content}>
                        <Text style={styles.textContent}>{content}</Text>
                        {(post?.image)&&<ScaleImage uri={post.image} />}
                        {(post?.video)&&<MyVideo uri={post.video} />}
                    </View>
                    <LikeShareView user={user} id={key} />
                </ScrollView>
                <Modal
                    style={{margin: 0}}
                    animationType = 'slide'
                    visible={modalVisible}
                    transparent={true}
                    onBackdropPress={() => setModalVisible(false)}>
                    <MenuModal 
                        user={user}
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


export default PostDetails;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 0,
        justifyContent:'center',
        alignContent: 'center',
        flexDirection: 'column',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 6,
        alignItems: 'center',
        elevation: 50,
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
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
    time: {
        fontSize: 13,
        fontWeight: "100",
        color: 'grey'
    },
    optionMenu: {
        marginRight: 10
    },
    content: {
        flexDirection: 'column'
    },
    textContent: {
        padding: 16,
        fontSize: 15,
        paddingTop: 0,
        textAlign: 'justify'
    },
    imageContent:{
        textAlign: 'justify'
    },
    imageItem: {
        flex: 1,
        resizeMode: 'cover',
    },
})