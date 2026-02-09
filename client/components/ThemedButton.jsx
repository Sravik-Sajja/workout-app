import { StyleSheet, Pressable } from 'react-native'
import {Colors} from '../constants/Colors'

function ThemedButton({style,...props}) {
  return (
   <Pressable
      style={({pressed})=> [styles.btn, pressed && styles.pressed,style]}
      {...props}
    />      
  )
}

export default ThemedButton

const styles = StyleSheet.create({
    btn:{
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 6,
        marginVertical: 5,
    },
    pressed:{
        opacity: 0.5,
    }
})