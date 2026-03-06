import { StyleSheet } from 'react-native';

const weightStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    scroll: {
        padding: 24,
        paddingBottom: 40,
        gap: 20,
    },
    header: {
        paddingVertical: 16,
        gap: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '800',
        letterSpacing: -1,
    },
    selectionCard: {
        borderRadius: 20,
        padding: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    sectionLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
        opacity: 0.4,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 14,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        padding: 20,
        gap: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    statLabel: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        opacity: 0.4,
    },
    statValueRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
    },
    statValue: {
        fontSize: 38,
        fontWeight: '700',
        letterSpacing: -1,
    },
    statUnit: {
        fontSize: 16,
        fontWeight: '600',
        opacity: 0.5,
    },
    chartCard: {
        borderRadius: 20,
        padding: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 4,
    },
    chartSubtitle: {
        fontSize: 13,
        opacity: 0.6,
    },
    chartContainer: {
        paddingVertical: 5,
    },
    emptyState: {
        borderRadius: 20,
        padding: 40,
        alignItems: 'center',
        marginTop: 40,
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
        opacity: 0.6,
        lineHeight: 22,
    },
});
export default weightStyles