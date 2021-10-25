import React, {useState, useEffect} from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
    ActivityIndicator,
    FlatList,
    TouchableHighlight
} from 'react-native';
import firebase from '../utilities/firebase_database'
import CommentItem from './CommentItem'
import NoPost from './NoPost'
import IsLoading from './IsLoading'

const CommentView = props => {
    const {id, close, user, post} = props
    const [text, setText] = useState('')
    const [data, setData] = useState([])

    useEffect(()=>{
        firebase.firestore().collection('comments')
            .where('post', '==', id)
            .orderBy('createdAt', 'desc')
            .onSnapshot(res => {
                console.log(res)
                const temps = [];
                    res.forEach(each => {
                        const {createdBy, content} = each.data()
                        temps.push({key: each.id, createdBy, content});
                    })
                    console.log(temps)
                    setData(temps);
            })
    },[user])

    const onComment = () => {
        firebase.firestore().collection('comments')
            .add({
                content: text,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: user.id,
                post: id
            })
            .then((res)=>{
                console.log(res)
                sendNotification()
                setText('')
            })
            .catch(error=>{
                console.log(error.message)
            })
    }
    console.log(id)
    console.log(user.name)
    const sendNotification = async () => {
        //send cho những người đã follow bài viết
        const name = !user?.name ? 'Undifine' : user?.name
        firebase.firestore().collection('notifications')
            .add({
                title: 'Có một bình luận mới',
                message: user?.name + ' đã bình luận trong một bài đăng mà bạn theo dõi',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                noread: post.followed,
                sendTo: post.followed,
                post: id,
            })
            .then(res=>{
                console.log(res)
            })
            .catch(error=>{
                console.log('lỗi notif ', error.message )
            })
    }
    return(
        <View style={styles.container}>
            <TouchableOpacity style={styles.header} onPress={close}>
                <Text style={styles.textHeader}>Close</Text>
            </TouchableOpacity>
            <View style={{flex: 1}}>
                {!data && <IsLoading/>}
                {(data.length==0) && <NoPost title='No Comment to show' />}
                {(data.length>0) && (
                    <FlatList
                        data={data}
                        renderItem={({ item }) =>
                            <CommentItem item={item} user={user} />
                        }
                        keyExtractor={data.key}
                        
                    />
                )}
            </View>
            <View style={styles.textInputCover}>
                <TextInput
                    style={styles.textInput}
                    placeholder='Comment here'
                    value={text}
                    onChangeText={setText}
                />
                {(text.length>0)&&(<TouchableOpacity style={styles.button} onPress={onComment} >
                    <MaterialCommunityIcons name="send" color="#1878f3" size={30} />
                </TouchableOpacity>)}
            </View>
        </View>
    )
}

export default CommentView;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 0,
        justifyContent: 'center',
        alignContent: 'center',
        flexDirection: 'column',
        elevation: 5,
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#1878f3'
    },
    textHeader:{
        fontSize: 20,
        color:'white'
    },
    textInput: {
        backgroundColor: '#ccc',
        borderRadius: 30,
        margin: 10,
        paddingLeft: 20,
        flex: 1
    },
    textInputCover:{
        borderTopWidth: 0.5,
        borderColor: 'black',
        elevation: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        padding: 10,
        borderRadius: 20,
        paddingLeft: 0
    }
})