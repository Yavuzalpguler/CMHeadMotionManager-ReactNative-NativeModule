/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';

import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Motion from './Motion';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';
import {Share} from 'react-native';
import AirPlayButton from 'react-native-airplay-button';
import useState from 'react-usestateref';

const domain = Platform.OS === 'ios' ? 'localhost' : '10.0.2.2';

let ws;
const emptyMessage = {
  user: 'me',
  timestamp: new Date().getTime(),
  text: 'selam',
};
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [commonData, setCommonData] = useState([]);
  const [numberOfSessions, setNumberOfSessions] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode, modeRef] = useState('Collecting');

  const [isWSOpen, setIsWSOpen] = useState(false);
  const intervalRef = React.useRef();

  useEffect(() => {
    startWebSocket();
  }, []);
  const startWebSocket = () => {
    console.log('Websocket started.');
    ws = new WebSocket(`wss://stark-shore-79011.herokuapp.com/:8080`);
    ws.onopen = function () {
      setIsWSOpen(true);
    };

    ws.onclose = e => {
      console.log('Reconnecting: ', e.message);
      setIsWSOpen(false);

      setTimeout(startWebSocket, 5000);
    };

    ws.onerror = e => {
      setIsWSOpen(false);

      console.log(`Error: ${e.message}`);
    };
  };

  const handleSend = resObj => {
    if (isWSOpen) {
      ws.send(JSON.stringify(resObj));
    }
  };

  const listenerStart = () => {
    Motion.startUpdates();
    var count = 0;
    setIsLoading(true);

    intervalRef.current = setInterval(() => {
      Motion.getData(res => {
        count++;
        if (count > 4) {
          setIsSaving(true);

          setIsLoading(false);
          const resObj = {
            acceleration: {
              x: Number(res.acceleration.x).toFixed(5),
              y: Number(res.acceleration.y).toFixed(5),
              z: Number(res.acceleration.z).toFixed(5),
            },
            attitude: {
              pitch: Number(res.attitude.pitch).toFixed(5),
              roll: Number(res.attitude.roll).toFixed(5),
              yaw: Number(res.attitude.yaw).toFixed(5),
            },
            gravitationalAcc: {
              x: Number(res.gravitationalAcc.x).toFixed(5),
              y: Number(res.gravitationalAcc.y).toFixed(5),
              z: Number(res.gravitationalAcc.z).toFixed(5),
            },
            heading: Number(res.heading).toFixed(5),
            quaternion: {
              w: Number(res.quaternion.w).toFixed(5),
              x: Number(res.quaternion.x).toFixed(5),
              y: Number(res.quaternion.y).toFixed(5),
              z: Number(res.quaternion.z).toFixed(5),
            },
            rotationRate: {
              x: Number(res.rotationRate.x).toFixed(5),
              y: Number(res.rotationRate.y).toFixed(5),
              z: Number(res.rotationRate.z).toFixed(5),
            },
          };

          setCommonData(prev => [...prev, {time: count - 4, resObj}]);
          handleSend(resObj);

          if (count === 14 && modeRef.current === 'Collecting') {
            Motion.stopUpdates();
            clearInterval(intervalRef.current);
            setIsSaving(false);
            setNumberOfSessions(prev => prev + 1);
          }
        }
      });
    }, 200);
  };

  const listenerStop = () => {
    Motion.stopUpdates();
    setIsLoading(false);
    setIsSaving(false);
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    checkAvailable();
  }, []);

  const checkAvailable = () => {
    Motion.isAvailable(res => {
      if (res == true) {
        setIsAvailable(true);
      } else {
        setIsAvailable(false);
      }
    });
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: JSON.stringify(commonData),
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const renderButton = (onPress, text, index) => {
    return (
      <TouchableOpacity
        style={{
          width: 150,
          height: 45,
          borderRadius: 15,
          backgroundColor:
            index === 1
              ? '#D3EBCD'
              : index === 2
              ? '#AEDBCE'
              : index === 3
              ? '#839AA8'
              : index === 4
              ? '#2B4865'
              : '#002B5B',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,

          elevation: 3,
        }}
        onPress={() => onPress()}>
        {isLoading ? (
          <ActivityIndicator color={'white'} />
        ) : (
          <Text style={{fontSize: 16, fontWeight: '600', color: 'white'}}>
            {text} {index === 5 && mode}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      <View style={{flexDirection: 'row', marginTop: 50}}>
        <Text style={{fontSize: 24, marginBottom: 20, fontWeight: '700'}}>
          Airpods:
        </Text>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 20,
            fontWeight: '700',
            color: '#AEDBCE',
          }}>
          {isAvailable ? ' available' : ' unavailable'}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{fontSize: 24, marginBottom: 20, fontWeight: '700'}}>
          WebSocket:
        </Text>
        <Text
          style={{
            fontSize: 24,
            marginBottom: 10,
            fontWeight: '700',
            color: '#AEDBCE',
          }}>
          {isWSOpen ? ' connected' : ' no connection'}
        </Text>
      </View>

      <AirPlayButton
        activeTintColor="#839AA8"
        tintColor="#839AA8"
        prioritizesVideoDevices={false}
        style={{width: 40, height: 40, marginBottom: 20}}
      />

      {renderButton(listenerStart, 'Start listener', 1)}
      {renderButton(listenerStop, 'Stop listener', 2)}
      {renderButton(
        () => {
          setCommonData([]);
          setNumberOfSessions(0);
          setIsSaving(false);
        },
        'Reset states',
        3,
      )}
      {renderButton(onShare, 'Share Data', 4)}
      {renderButton(
        () => {
          if (mode === 'Collecting') {
            setMode('Monitoring');
          } else {
            setMode('Collecting');
          }
        },
        'Mode:',
        5,
      )}
      {mode === 'Collecting' && (
        <Text
          style={{
            marginTop: 30,
            fontSize: 22,
            color: '#839AA8',
            fontWeight: '700',
          }}>
          Number of saved sessions: {numberOfSessions}
        </Text>
      )}
      {isSaving && (
        <View
          style={{
            backgroundColor: '#AEDBCE',
            width: 100,
            height: 100,
            borderRadius: 100,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 40,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,

            elevation: 3,
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'white',
              fontWeight: '700',
            }}>
            Recording
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default App;
