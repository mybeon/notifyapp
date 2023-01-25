import {StyleSheet, Dimensions} from 'react-native';
import {COLORS, FONTS, TYPO} from '../../utils/constants';

const {width, height} = Dimensions.get('window');

const style = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightColor,
    width,
    height,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 35,
    padding: 20,
    flex: 1,
  },
  closeIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  formContainer: {
    marginTop: 78 - 20,
  },
  goMapText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.accentColor,
  },
  goMapBtn: {
    borderColor: COLORS.accentColor,
    borderRadius: 5,
    borderWidth: 2,
    padding: 13,
  },
  createBtn: {
    backgroundColor: COLORS.accentColor,
    borderRadius: 5,
    paddingHorizontal: 18,
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    right: 0,
  },
  createText: {
    color: COLORS.lightColor,
    fontFamily: FONTS.bold,
    fontSize: 18,
  },
  searchContainer: {
    maxHeight: 150,
    width: '100%',
    backgroundColor: COLORS.lightColor,
    borderColor: '#DBDBDB',
    borderWidth: 2,
    padding: 10,
    borderTopWidth: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  emptySearch: {
    position: 'absolute',
    bottom: 10,
    right: 0,
    transform: [{scale: 0.6}],
    opacity: 0.6,
  },
  dateContainer: {
    borderColor: '#DBDBDB',
    borderWidth: 1,
    padding: 20,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
  },
  sharedContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  sharedText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.mainText,
    textTransform: 'capitalize',
    marginRight: 10,
  },
});

export default style;
