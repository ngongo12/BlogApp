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
    Pressable
} from 'react-native';
import { useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import firebase from '../utilities/firebase_database';
import ItemPost from '../components/ItemPost';
import NoPost from '../components/NoPost'

const MyPosts = (props) => {
    const { navigation: { navigate } } = props;
    const [hide, setHide] = useState(false);
    var i = 0;
    const [items, setItems] = useState([])
    const [user, setUser] = useState(null);
    const isFocused = useIsFocused();

    useEffect(() => {
        const { currentUser } = firebase.auth()
        firebase.firestore().collection('users')
            .doc(currentUser.uid)
            .get()
            .then(user=>{
                setUser(user.data());
            })
    }, [isFocused])


    useEffect(() => {
        if(!user)
        {

        }
        else
        {
            firebase.firestore().collection('posts')
                .where('createdBy', '==', user.id)
                .orderBy('createdAt', 'desc')
                .onSnapshot(res=>{
                    if(res != null)
                    {
                        let temp = [];
                        res.forEach(each=>{
                            temp.push({key: each.id})
                        })
                        setItems(temp)
                    }
                })
            }
    },[user])
    const Header = () => {
        return (
            <View style={[styles.header, hide && styles.hide]}>
                <Image source={(!user?.avatar) ? require('../images/avatar.jpg') : {uri: user?.avatar}} style={styles.avatar} />
                <View style={styles.textView}>
                    <TouchableOpacity onPress={()=>navigate('CreatePost', {navigate, user})} style={{flex: 1}}>
                    <Text style={styles.write}>Write new post...
                            <MaterialCommunityIcons name='grease-pencil' color='#1878f3' size={15} />
                    </Text>
                    </TouchableOpacity>
    
                </View>
            </View>
        )
    }

    if(!items)
    {
        return(<Loading />)
    }
    if(items.length ==0)
    {
        let s = "No post to show" + '\n' + "Click to create new post";
        return(
            <Pressable style={{flex: 1}} onPress={()=>navigate('CreatePost', {navigate, user})}>
                <NoPost title={s} />
            </Pressable>
        )
    }
    return (
        <View style={{flex: 1}}>

            <FlatList
                data={items}
                renderItem={({ item }) =>
                    <ItemPost item={item} navigate={navigate} user={user} />
                }
                keyExtractor={item => item.key}
                //onEndReached= {() => fetchMoreData()}
                onEndThreshold={0}
                ListFooterComponent={(items.length==0) ? NoPost : Loading}
                refreshing={false}
                ListHeaderComponent={Header}
            />
        </View>
    )
}

const Loading = () => {
    return (
        <View style={{ alignItems: 'center' }}>
            <Image source={require('../images/loading3.gif')} style={{ width: 50, height: 50, resizeMode: 'cover', margin: 20 }} />
        </View>
    )
}

export default MyPosts;

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
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 10,
    },
    hide: {
        height: 0,
        overflow: 'hidden',
        padding: 0,
        marginBottom: 0
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
    textView: {
        flex: 1,
        flexDirection: 'row',
    },
    write: {
        flex: 1,
        padding: 10,
        paddingLeft: 20,
        borderRadius: 20,
        borderWidth: 0.5,
        marginLeft: 10,
        marginRight: 10
    }

})