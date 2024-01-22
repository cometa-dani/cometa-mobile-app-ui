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

  avatarFigure: {
    alignItems: 'center',
  },

  cardWrapper: {
    gap: 12
  },

  container: {
    flex: 1,
    gap: 24,
    padding: 20,
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
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'capitalize'
  }
});
