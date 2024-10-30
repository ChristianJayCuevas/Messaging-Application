import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import { MessageShape } from './MessageUtils';

const keyExtractor = item => item.id.toString();

export default class MessageList extends React.Component {
  static propTypes = {
    messages: PropTypes.arrayOf(MessageShape).isRequired,
    onPressMessage: PropTypes.func,
    onDeleteMessage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onPressMessage: () => {},
  };

  handlePressMessage = (message) => {
    if (message.type === 'image') {
      this.props.onPressMessage(message);
    } else {
      Alert.alert(
        "Delete Message",
        "Are you sure you want to delete this message?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: () => this.props.onDeleteMessage(message.id) }
        ],
        { cancelable: true }
      );
    }
  };

  renderMessageItem = ({ item }) => (
    <View key={item.id} style={styles.messageRow}>
      <TouchableOpacity onPress={() => this.handlePressMessage(item)}>
        {this.renderMessageBody(item)}
      </TouchableOpacity>
    </View>
  );

  renderMessageBody = ({ type, text, uri, coordinate }) => {
    switch (type) {
      case 'text':
        return (
          <View style={styles.messageBubble}>
            <Text style={{ color: 'white' }}>{text}</Text>
          </View>
        );
      case 'image':
        const imageSource = typeof uri === 'string' ? { uri } : uri;
        return ( 
          <View style={styles.messageBubble}>
            <Image style={styles.image} source={imageSource} />
          </View>
        );
      case 'location':
        return (
          <View style={styles.messageBubble}>
            <MapView
              style={styles.map}
              initialRegion={{
                ...coordinate,
                latitudeDelta: 0.08,
                longitudeDelta: 0.04,
              }}
            >
              <Marker coordinate={coordinate} />
            </MapView>
          </View>
        );
      default:
        return null;
    }
  };

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps="handled"
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'visible',
    maxHeight: '100%',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginLeft: 60,
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: 'skyblue',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  map: {
    width: 250,
    height: 150,
    borderRadius: 10,
  },
});
