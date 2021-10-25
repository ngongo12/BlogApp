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
    FlatList
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import firebase from '../utilities/firebase_database';
import ItemPost from '../components/ItemPost';
import NoPost from '../components/NoPost'

const HomeScreen = (props) => {
    const {navigation : {navigate}} = props;
    const [items, setItems] = useState(null)
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
    },[isFocused])


    useEffect(() => {
        firebase.firestore().collection('posts')
            //.where("isPublish", "==", true)
            //.where('publishedAt', '<>', null)
            .orderBy("publishedAt", "desc")
            //.get()
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
            // .catch(error=>{
            //     console.log(error.message)
            //     setItems([]);
            // })
    },[])
    
    console.log('home screen, ', user?.name)
    console.log(isFocused)
    const refreshData = () => {
        
    }
    if(!items)
    {
        return(<Loading />)
    }

    if(items.length==0)
    {
        return(<NoPost />)
    }
    return(
        <View>
            <StatusBar backgroundColor="white"/>
            <FlatList
                data= {items}
                renderItem={({item}) =>
                    <ItemPost item={item} navigate={navigate} user={user} />
                }
                keyExtractor = {item => item.key}  
                //onEndReached= {() => fetchMoreData()}
                onEndThreshold = {0}
                ListFooterComponent={Loading}
                refreshing={false}
             />
        </View>
    )
}

const Loading =() => {
    return (
        <View style={{alignItems: 'center'}}>
            <Image source={require('../images/loading3.gif')} style={{width: 50, height: 50, resizeMode: 'cover', margin: 20}}/>
        </View>
    )
}

export default HomeScreen;