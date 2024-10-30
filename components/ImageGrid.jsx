import React from 'react';
import { StyleSheet, View, FlatList, Image, TouchableOpacity, Text } from 'react-native';

export default function ImageGrid({ images, onSelectImage }) {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => onSelectImage(item)}>
      <Image source={item.uri} style={styles.imageThumbnail} />
      <Text style={styles.imageId}>{item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.imageGridContainer}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageGridContainer: {
    maxHeight: '40%',
    backgroundColor: 'white',
    padding: 10,
  },
  flatListContent: {
    justifyContent: 'space-between',
  },
  imageContainer: {
    margin: 5,
    alignItems: 'center',
  },
  imageThumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  imageId: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
});