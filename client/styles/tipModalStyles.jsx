import { StyleSheet } from 'react-native';

const tipModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },

  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },

  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
    marginTop: 20
  },

  categoryIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  categoryTag: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  tipSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    opacity: 0.4,
    marginBottom: 6,
    textTransform: 'uppercase',
  },

  modalBody: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.85,
  },

  reasonSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 14,
    padding: 16,
  },

  reasonLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.7,
  },

  reasonText: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.9,
  },

  showSection: {
    paddingHorizontal: 20,
  },

  showBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    borderWidth: 0.5,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 6,
  },

  showBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default tipModalStyles;