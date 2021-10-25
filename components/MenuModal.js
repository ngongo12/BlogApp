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
    Pressable,
    ToastAndroid,
    Alert
} from 'react-native';

import firebase from '../utilities/firebase_database'

const MenuModal = (props) => {
    const {onChosen, user, isPublish, id, post, navigate} = props;
    // console.log(post)
    const [canEdit, setCanEdit] = useState(false)
    const [followed, setFollowed] = useState([])
    useEffect(() => {
        setCanEdit(user?.type=='admin' && user?.id==post?.createdBy);
        (!post.followed) ? setFollowed([]) : setFollowed(post.followed)
    }, [])

    const onPublish = async () => {
        firebase.firestore().collection('posts')
            .doc(id)
            .update({
                isPublish: true,
                publishedAt: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(async ()=>{
                await sendNotification(id)
                ToastAndroid.show("Publish thành công", ToastAndroid.SHORT)
                
            })
            .catch(e =>{
                console.log(e.message)
            })
    }
    const sendNotification = async (id) => {
        let messContent = '';
        messContent = (!post?.image) ? messContent : ' ảnh mới'
        messContent = (!post?.video) ? messContent : ' video mới'
        messContent = (messContent=='') ? ' bài viết' : messContent
        //lấy danh sách tất cả người dùng
        let arrUser= []
        let name = '';
        
        firebase.firestore().collection('users')
            .get()
            .then(res=>{
                res.forEach(each=>{
                    arrUser.push(each.data().id)
                    if(user.id == each.data().id)
                    {
                        name = each.data().name;
                    }
                })
            })
            .then(()=>{
                firebase.firestore().collection('notifications')
                    .add({
                        title: 'Có một' + messContent,
                        message: name + ' đã đăng một'+ messContent +' ....',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        noread: arrUser,
                        sendTo: arrUser,
                        post: id,
                    })
                    .then(res=>{
                        console.log(res)
                    })
            })
            .catch(err=>{
                console.log('>>>notifi add erro', err.message)
            })
    }

    const onFollow = () => {
        setFollowed(followed.push(user.id))
        firebase.firestore().collection('posts')
            .doc(id)
            .update({
                followed,
            })
            .then(()=>{
                ToastAndroid.show("Followed", ToastAndroid.SHORT)
            })
            .catch(e =>{
                console.log(e.message)
            })
    }

    const onUnfollow = () => {
        try{
            setFollowed(followed.splice(followed.indexOf(user.id),1))
        }
        catch(err)
        {

        }
        firebase.firestore().collection('posts')
            .doc(id)
            .update({
                followed,
            })
            .then(()=>{
                ToastAndroid.show("Unfollowed", ToastAndroid.SHORT)
            })
            .catch(e =>{
                console.log(e.message)
            })
    }

    const askForDelete = ()  => {
        Alert.alert(
            "Delete",
            "Bạn muốn xóa bài đăng này",
            [
              {
                text: "Không",
                
                style: "cancel"
              },
              { text: "Xóa", onPress: () => onDelete() }
            ]
          );
    }

    const onDelete= () =>{
        firebase.firestore().collection('posts')
            .doc(id)
            .delete()
            .then(()=>{
                ToastAndroid.show("Đã xóa", ToastAndroid.SHORT)
            })
            .catch(err=>{
                ToastAndroid.show(err.message, ToastAndroid.SHORT)
            })
    }

    return(
        <View style={styles.modal}
        >
            <Pressable style={styles.pressView} onPress={onChosen}>
            </Pressable>
            <View style={styles.content}>
                {canEdit&&(<TouchableOpacity style={styles.box} onPress={()=>{onChosen(), askForDelete()}}>
                    <MaterialCommunityIcons name ="delete-alert-outline" size={30} style={styles.icon}/>
                    <View style={styles.textView}>
                        <Text style={styles.title}>Delete post</Text>
                        <Text>Xóa bài viết</Text>
                    </View>
                </TouchableOpacity>)}
                {canEdit&&(<TouchableOpacity style={styles.box} onPress={()=>{onChosen(), navigate('EditPost', {id: id, navigate: navigate})}}>
                    <MaterialCommunityIcons name ="comment-edit-outline" size={30} style={styles.icon}/>
                    <View style={styles.textView}>
                        <Text style={styles.title}>Edit post</Text>
                        <Text>Sửa bài viết</Text>
                    </View>
                </TouchableOpacity>)}
                {(!followed.includes(user?.id))&&(<TouchableOpacity style={styles.box} onPress={()=>{onChosen(), onFollow()}}>
                    <MaterialCommunityIcons name ="bookmark-outline" size={30} style={styles.icon}/>
                    <View style={styles.textView}>
                        <Text style={styles.title}>Follow post</Text>
                        <Text>Theo dõi bài viết</Text>
                    </View>
                </TouchableOpacity>)}
                {(followed.includes(user?.id))&&(<TouchableOpacity style={styles.box} onPress={()=>{onChosen(), onUnfollow()}}>
                    <MaterialCommunityIcons name ="bookmark-off-outline" size={30} style={styles.icon}/>
                    <View style={styles.textView}>
                        <Text style={styles.title}>Unfollow post</Text>
                        <Text>Hủy theo dõi bài viết</Text>
                    </View>
                </TouchableOpacity>)}
                {!isPublish && (
                    <TouchableOpacity style={styles.box} onPress={()=>{onChosen(), onPublish()}}>
                        <MaterialCommunityIcons name ="publish" size={30} style={styles.icon}/>
                        <View style={styles.textView}>
                            <Text style={styles.title}>Publish</Text>
                            <Text>Publish post</Text>
                        </View>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.box} onPress={onChosen}>
                    <MaterialCommunityIcons name ="chat-alert-outline" size={30} style={styles.icon}/>
                    <View style={styles.textView}>
                        <Text style={styles.title}>Report post</Text>
                        <Text>Báo cáo bài viết</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )   
}

export default MenuModal

const styles = StyleSheet.create({
    modal:{
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: 'white',
        paddingTop: 10,
        elevation: 10,
    },
    box: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 10
    },
    icon: {
        padding: 10,
        marginLeft: 4,
        marginRight: 4
    },
    textView: {
        flex:1 , 
        flexDirection: 'column', 
    },
    title: {
        fontSize: 18,
    },
    pressView: {
        flex: 1,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    }
})