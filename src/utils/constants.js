export const FONTS = {
  regular: 'Ubuntu-Regular',
  medium: 'Ubuntu-Medium',
  bold: 'Ubuntu-Bold',
};

export const COLORS = {
  mainText: '#4E4E4E',
  mainColor: '#ABBFF5',
  lightColor: '#FAFAFA',
  lightText: 'rgba(0, 0, 0, 0.43)',
  accentColor: '#102661',
  danger: '#FF5555',
};

export const TYPO = {
  medium: {
    fontFamily: 'Ubuntu-Medium',
    fontSize: 18,
    lineHeight: 21,
    color: COLORS.mainText,
  },
  smallLight: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.lightText,
  },
};

export const URLS = {
  dev: 'http://10.0.2.2:5001/notify-grocery-list/us-central1',
  prod: 'https://us-central1-notify-grocery-list.cloudfunctions.net',
};
