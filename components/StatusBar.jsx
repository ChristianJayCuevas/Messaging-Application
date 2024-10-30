import Constants from 'expo-constants';
import { Platform, StatusBar, StyleSheet, Text, View, Animated } from 'react-native';
import React from 'react';
import NetInfo from '@react-native-community/netinfo';

export default class Status extends React.Component {
  state = {
    info: null,
    fadeAnim: new Animated.Value(0),
    statusBarColorAnim: new Animated.Value(0),
  };

  componentDidMount() {
    NetInfo.fetch().then(state => {
      this.setState({ info: state.isConnected ? 'connected' : 'none' }, this.animateAll);
    });
    this.unsubscribe = NetInfo.addEventListener(state => {
      this.setState({ info: state.isConnected ? 'connected' : 'none' }, this.animateAll);
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  animateAll = () => {
    const { info, fadeAnim, statusBarColorAnim } = this.state;
    const isConnected = info === 'connected';
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: isConnected ? 0 : 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(statusBarColorAnim, {
        toValue: isConnected ? 0 : 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();
  };

  render() {
    const { info, fadeAnim, statusBarColorAnim } = this.state;
    const isConnected = info === 'connected';
    
    const statusBarBackgroundColor = statusBarColorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgb(255, 255, 255)', 'rgb(255, 0, 0)'],
    });

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.statusBar, { backgroundColor: statusBarBackgroundColor }]}>
          <StatusBar
            backgroundColor="transparent"
            barStyle={isConnected ? 'dark-content' : 'light-content'}
            animated={true}
            translucent={true}
          />
        </Animated.View>
        {!isConnected && (
          <Animated.View
            style={[
              styles.messageContainer,
              {
                opacity: fadeAnim, 
                transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] 
              }
            ]}
          >
            <View style={styles.bubble}>
              <Text style={styles.text}>No network connection</Text>
            </View>
          </Animated.View>
        )}
      </View>
    );
  }
}

const statusHeight = Platform.OS === 'ios' ? Constants.statusBarHeight : StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    zIndex: 1,
  },
  statusBar: {
    height: statusHeight,
  },
  messageContainer: {
    zIndex: 1,
    position: 'absolute',
    top: statusHeight + 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});