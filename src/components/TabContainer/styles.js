import {StyleSheet} from 'react-native';
import {COLORS, TYPO} from '../../utils/constants';

export default StyleSheet.create({
  mainLists: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  loader: {
    marginTop: 40,
  },
  hiddenItemContainer: {
    height: '100%',
    width: 140,
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: COLORS.accentColor,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    overflow: 'hidden',
  },
  hiddenIcon: {
    width: 60,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 5,
    overflow: 'hidden',
    height: 40,
    backgroundColor: COLORS.lightColor,
  },
  singleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  active: {
    backgroundColor: COLORS.accentColor,
    width: '50%',
    height: '100%',
    position: 'absolute',
    borderRadius: 5,
  },
  tabText: {
    textAlign: 'center',
    flex: 1,
    ...TYPO.medium,
    textTransform: 'capitalize',
    zIndex: 1,
  },
});
