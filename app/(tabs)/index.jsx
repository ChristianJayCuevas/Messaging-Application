// index.js
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, BackHandler, Image, Dimensions, TouchableOpacity } from 'react-native';
import Status from '@/components/StatusBar.jsx';
import MessageList from '@/components/MessageList.jsx';
import { createImageMessage, createLocationMessage, createTextMessage } from '@/components/MessageUtils.jsx';
import ToolBar from '@/components/ToolBar.jsx';
import ImageGrid from '@/components/ImageGrid.jsx';

export default function HomeScreen() {
  const [fullScreenImageId, setFullScreenImageId] = useState(null);
  const [messages, setMessages] = useState([
    createImageMessage(Image.resolveAssetSource(require('@/assets/images/Goal.png')).uri),
    createTextMessage('Hello!'),
    createTextMessage('How are you?'),
    createTextMessage('What are you up to?'),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324,
    }),
  ]);

  const [isImageGridVisible, setIsImageGridVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    { id: '1', uri: require('@/assets/images/Goal.png') },
    { id: '2', uri: require('@/assets/images/Goal1.png') },
    { id: '3', uri: require('@/assets/images/GoalTrackerPic.png') },
  ];

  const handleBackPress = useCallback(() => {
    if (fullScreenImageId) {
      setFullScreenImageId(null);
      return true;
    }
    if (isImageGridVisible) {
      setIsImageGridVisible(false);
      return true;
    }
    return false;
  }, [fullScreenImageId, isImageGridVisible]);

  useEffect(() => {
    let subscription;
    
    const setupBackHandler = () => {
      subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );
    };

    setupBackHandler();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [handleBackPress]);

  const handleDeleteMessage = (messageId) => {
    setMessages((prevMessages) => prevMessages.filter(message => message.id !== messageId));
  };

  const handlePressMessage = (message) => {
    if (message.type === 'image') {
      setFullScreenImageId(message.id);
    }
  };

  const dismissFullScreenImage = () => {
    setFullScreenImageId(null);
  };

  const toggleImageGrid = () => {
    setIsImageGridVisible(!isImageGridVisible);
  };

  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setIsImageGridVisible(false);
  };

  const renderFullScreenImage = () => {
    if (!fullScreenImageId) return null;

    const message = messages.find(message => message.id === fullScreenImageId);
    if (!message) return null;

    return (
      <View style={styles.fullScreenContainer}>
        <TouchableOpacity
          style={styles.fullScreenOverlay}
          onPress={dismissFullScreenImage}
          activeOpacity={1}
        >
          <Image
            source={typeof message.uri === 'string' ? { uri: message.uri } : message.uri}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.appContainer}>
      <Status />
      <View style={styles.messageContainer}>
        <MessageList 
          messages={messages} 
          onDeleteMessage={handleDeleteMessage}
          onPressMessage={handlePressMessage}
        />
      </View>
      <ToolBar onCameraPress={toggleImageGrid} />
      {isImageGridVisible && <ImageGrid images={images} onSelectImage={handleSelectImage} />}
      {renderFullScreenImage()}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    flexDirection: 'column',
  },
  messageContainer: {
    flex: 1,
    height: '100%',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    zIndex: 999,
  },
  fullScreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});