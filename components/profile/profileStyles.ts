/* eslint-disable react-native/sort-styles */
import { StyleSheet } from 'react-native';


export const profileStyles = StyleSheet.create({

  avatar: {
    aspectRatio: 1,
    borderRadius: 100,
    height: 100,
    margin: 'auto',
  },

  avatarContainer: {
    gap: 20
  },

  porfileContent: {
    gap: 20
  },

  cardWrapper: {
    gap: 12
  },

  container: {
    flex: 1,
    gap: 20,
    padding: 20,
    paddingBottom: 40
  },

  stats: {
    flexDirection: 'row',
    gap: 50,
    justifyContent: 'center'
  },

  statsNumber: {
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'center'
  },

  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize'
  },

  wrapper: {
    gap: 10,
    flexDirection: 'row',
    elevation: 3,
    borderRadius: 50,
    shadowColor: '#171717', // add shadow for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
  }
});
