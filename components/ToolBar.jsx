import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ToolBar({ onCameraPress }) {
  return (
    <View style={styles.toolBarContainer}>
      <TouchableOpacity style={styles.tabButton} onPress={onCameraPress}>
        <Ionicons name="camera" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tabButton}>
        <Ionicons name="pin" size={24} color="black" style={styles.icon} />
      </TouchableOpacity>
      <TextInput placeholder="Type a message" style={styles.textInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  toolBarContainer: {
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    borderTopColor: 'rgba(0,0,0,0.04)',
    borderColor: 'rgba(0,0,0,0.04)',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
});
