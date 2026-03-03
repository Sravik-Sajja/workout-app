import { StyleSheet } from 'react-native';

const statsStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
    gap: 16,
  },
  cardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.6,
  },
  chartSection: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    opacity: 0.5,
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 12,
    opacity: 0.6,
  },
  centerLabelValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  legend: {
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  legendValue: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.6,
  },
  emptyState: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    opacity: 0.6,
  },
  dateRange: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 4,
  },
});

export default statsStyles;