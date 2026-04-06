import { StyleSheet } from 'react-native';

const tipsStyles = StyleSheet.create({
    header: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 8
    },
    
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        alignSelf: 'flex-start',
        borderWidth: 0.5,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 8
    },
    
    aiText: {
        fontSize: 12
    },
    
    pageTitle: {
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 4
    },
    
    pageSub: {
        fontSize: 14,
        opacity: 0.6
    },
    
    sectionLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        opacity: 0.5,
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 8
    },
    
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 0.5
    },
    
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    
    tipContent: {
        flex: 1
    },
    
    tipTag: {
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 2
    },
    
    tipTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 3,
        lineHeight: 20
    },
    
    tipBody: {
        fontSize: 13,
        lineHeight: 19,
        opacity: 0.7
    },
    
    arrow: {
        fontSize: 18,
        alignSelf: 'center',
        opacity: 0.4
    },
  });

export default tipsStyles;