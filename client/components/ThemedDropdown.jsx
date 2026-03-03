import { TouchableOpacity, FlatList, Modal, View, StyleSheet } from "react-native"
import { useState } from "react"
import ThemedText from "./ThemedText"

export const ThemedDropdown = ({ options, selectedValue, onValueChange, theme }) => {
    const [open, setOpen] = useState(false)

    return (
        <View>
            <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.cardBackground, borderColor: theme.iconColor }]}
                onPress={() => setOpen(true)}
            >
                <ThemedText>{selectedValue || 'Select...'}</ThemedText>
            </TouchableOpacity>

            <Modal visible={open} transparent animationType="fade">
                <TouchableOpacity style={styles.overlay} onPress={() => setOpen(false)}>
                    <View style={[styles.dropdown, { backgroundColor: theme.navBackground }]}>
                        {options.map((opt, i) => (
                            <TouchableOpacity
                                key={i}
                                style={styles.option}
                                onPress={() => { onValueChange(opt); setOpen(false) }}
                            >
                                <ThemedText style={{ fontWeight: selectedValue === opt ? '700' : '400' }}>{opt}</ThemedText>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        margin: 16,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        padding: 32,
    },
    dropdown: {
        borderRadius: 12,
        padding: 8,
    },
    option: {
        padding: 14,
    }
})