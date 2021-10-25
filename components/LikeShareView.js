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
    Modal,
    Share,
    ToastAndroid
} from 'react-native';

import firebase from '../utilities/firebase_database'
import CommentView from '../components/CommentView'
import CommentItem from './CommentItem';

const LikeShareView = props => {
    const {id, user} = props
    const [isLiked, setIsLiked] = useState(false);
    const [arrLike, setArrLike] = useState([]);
    const [followed, setFollowed] = useState([])
    const [disable, setDisable] = useState(false);
    const [post, setPost] = useState(null)
    const [numOfComment, setNumOfComment] = useState(0)
    const [visibleComment, setVisibleComment] = useState(false)

    //console.log('likeshare view, ',user?.name);
    //
    useEffect(()=>{
        firebase.firestore().collection('posts').doc(id)
            //.get()
            .onSnapshot(res=> {
                setPost(res.data())
                if(res.data()?.liked)
                {
                    setArrLike([].concat(res.data()?.liked))
                    if(res.data().liked.includes(user?.id))
                    {
                        setIsLiked(true)
                    }
                    else
                    {
                        setIsLiked(false)
                    }
                }
                if(res.data()?.followed)
                {
                    setFollowed([].concat(res.data()?.followed))
                }
            })
            //.catch(error=>console.log(error.message))
    },[user])

    useEffect(()=>{
        firebase.firestore().collection('comments')
            .where('post', '==', id)
            .orderBy('createdAt', 'desc')
            .onSnapshot(res => {
                setNumOfComment(res.size)
            })
    },[user])

    const onShare = async () => {
        if(!post)
        {
            ToastAndroid.show('Err: Không tìm được nội dung share', ToastAndroid.SHORT)
            return
        }
        let _url=null;
        !post.image ? _url= null : _url=post.image
        !post.video ? _url= _url : _url=post.video
        try {
          const result = await Share.share({
            message: !post.content ? "Can post": post.content,
            url: _url
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
              ToastAndroid.show('Open share' + result.activityType, ToastAndroid.SHORT)
            } else {
              // shared
              //ToastAndroid.show('Shared' + result.activityType, ToastAndroid.SHORT)
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
            ToastAndroid.show('Không share', ToastAndroid.SHORT)
          }
        } catch (error) {
            ToastAndroid.show(error.message, ToastAndroid.SHORT)
        }
      };

    const onLike = () => {
        setDisable(true)
        console.log('>>>>>>>', isLiked)
        if(isLiked)
        {
            setArrLike(arrLike.splice(arrLike.indexOf(user.id),1));
        }
        else
        {
            setArrLike(arrLike.push(user.id));
            console.log(arrLike);
        }
        //Tiến hành update lên firebase
        firebase.firestore().collection('posts').doc(id)
            .update({
                liked : arrLike
            })
            .then(()=>{
                console.log('update thanh cong')
                setDisable(false)
            })
            .catch(error=>setDisable(false))
    }

    return(
        <View>
            <LikedView liked={arrLike?.length} comments={numOfComment} follows = {followed?.length} />
            <View style={styles.lsbArea}>
                    <TouchableOpacity style={styles.wrapLSB} onPress={onLike} disabled={disable}>
                        <Icon 
                            name={
                                isLiked ? 'like1' : 'like2'
                            }
                            size={26} 
                            color={
                                isLiked ? '#1878f3' : 'grey'
                            }
                        />
                        <Text style={[styles.textLSB, isLiked && {color: '#1878f3'}]}>Like</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wrapLSB} onPress={()=>setVisibleComment(true)}>
                        <MaterialCommunityIcons name="comment-outline" size={26} color="grey" />
                        <Text style={styles.textLSB}>Comment</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.wrapLSB} onPress={onShare}>
                        <MaterialCommunityIcons name="share-outline" size={26} color="grey" />
                        <Text style={styles.textLSB}>Share</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={visibleComment}
                    onRequestClose={() => {
                        setVisibleComment(!visibleComment)
                    }}
                >
                    <CommentView 
                        close={()=> setVisibleComment(false)}
                        id={id}
                        user={user}
                        post={post}
                    />
                </Modal>
        </View>
    )
}

const LikedView = (props) => {
    const {liked, comments, follows} = props;
    return(
        <View style={{flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'center', paddingBottom: 10}}>
            <View style={{flexDirection: 'row', flex: 1,justifyContent: 'flex-start', alignItems: 'center' }}>
                {(liked > 0) &&(<View style={{
                        backgroundColor: '#1878f3',
                        justifyContent: 'center', 
                        alignItems: 'center',
                        width: 22,
                        height: 22,
                        borderRadius: 26,
                        marginLeft: 20,
                        marginRight: 6
                    }}>
                    <Icon name='like1' size={12} color='white'/>
                </View>)}
                <Text 
                    style={{color: 'grey',fontSize: 13}}>
                        {liked> 0 ? liked : ''}
                </Text>
            </View>
            <Text style={{
                justifyContent: 'flex-end',
                marginRight: 20,
                color: 'grey',
                fontSize: 13
            }}>
                {comments} {(comments<=1)?'Comment - ':'Comments - '}
                {follows} {(follows<=1)? 'Follow' : 'Follows'}
            </Text>
        </View>
    )
}

export default LikeShareView

const styles = StyleSheet.create({

    //Like share button
    lsbArea: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 16,
        marginBottom: 0,
        marginTop: 0,
        paddingTop: 2,
        paddingBottom: 2,
        borderTopWidth: 0.5,
        borderTopColor: 'grey',
    },
    wrapLSB: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textLSB: {
        fontSize: 14,
        fontWeight: '100',
        color: 'grey',
        padding: 10
    }
})