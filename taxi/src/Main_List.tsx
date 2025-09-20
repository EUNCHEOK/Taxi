import React, { use } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api.tsx';
import messaging from '@react-native-firebase/messaging';

function Main_List() {
  console.log('-- Main_List()');

  const [callList, setCallList] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      requestCallList();
    }, []),
  );

  const requestCallList = async () => {
    setLoading(true);
    let userId = (await AsyncStorage.getItem('userId')) || '';

    api
      .list(userId)
      .then(response => {
        // 서버 응답이 배열 형태인지 먼저 확인
        if (Array.isArray(response.data)) {
          // 배열의 길이가 0보다 크면, 데이터가 실제로 있는 것
          if (response.data.length > 0) {
            let { code, message, data } = response.data[0];
            if (code === 0) {
              setCallList(data);
            } else {
              Alert.alert('오류', message || '알 수 없는 오류');
            }
          } else {
            // 호출 목록이 비어있는 경우, 정상적으로 빈 목록으로 상태를 업데이트
            setCallList([]);
          }
        } else {
          // 서버 응답이 배열이 아닌 경우
          Alert.alert(
            '오류',
            '서버로부터 받은 데이터 형식이 올바르지 않습니다.',
          );
        }
        setLoading(false);
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        Alert.alert('오류', '데이터를 불러오는 중 에러가 발생했습니다.');
        setLoading(false);
      });
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        <Text style={[styles.headerText, { width: wp(80) }]}>
          출발지 / 도착지
        </Text>
        <Text style={[styles.headerText, { width: wp(20) }]}>상태</Text>
      </View>
    );
  };

  const ListItem = (row: any) => {
    console.log('row = ' + JSON.stringify(row));

    return (
      <View style={{ flexDirection: 'row', marginBottom: 5, width: wp(100) }}>
        <View style={{ width: wp(80) }}>
          <Text style={styles.textForm}>{row.item.start_addr}</Text>
          <Text style={[styles.textForm, { borderTopWidth: 0 }]}>
            {row.item.end_addr}
          </Text>
          <Text style={styles.textForm}>{row.item.formatted_time}</Text>
        </View>
        <View
          style={{
            width: wp(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {row.item.call_state === 'RES' ? (
            <Text style={{ color: 'blue' }}>{row.item.call_state}</Text>
          ) : (
            <Text style={{ color: 'gray' }}>{row.item.call_state}</Text>
          )}
        </View>
      </View>
    );
  };

  useEffect(() => {
    const message = messaging().onMessage(remoteMessage => {
      console.log('[Remote Message]', JSON.stringify(remoteMessage));
      requestCallList();
    });

    return message;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={callList}
        ListHeaderComponent={Header}
        renderItem={ListItem}
        keyExtractor={(item: any) => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={requestCallList} />
        }
      />
      <Modal transparent={true} visible={loading}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="spinner" size={50} color={'#3498db'} />
          <Text>Loading...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    height: 50,
    marginBottom: 5,
    backgroundColor: '#3498db',
    color: 'white',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
  textForm: {
    borderWidth: 1,
    borderColor: '#3498db',
    height: hp(5),
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default Main_List;
