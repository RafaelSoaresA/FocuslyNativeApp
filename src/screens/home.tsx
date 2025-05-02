import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

export default function HomeScreen() {
  const screenTimeApps = ['Facebook', 'Instagram', 'TikTok', 'EA FC Companion'];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          style={styles.image}
          source={require('../assets/informacao-financeira.png')}
          resizeMode="cover"
        />
        <View style={styles.textContainer}>
          <Text style={styles.mainTitle}>Tempo de tela dos apps:</Text>
          {screenTimeApps.map((app, index) => (
            <Text key={index} style={styles.appItem}>
              {app}
            </Text>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1EAFE',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 32,
  },
  image: {
    width: 284,
    height: 284,
    resizeMode: 'cover',
  },
  textContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 322,
  },
  mainTitle: {
    fontSize: 24,
    marginBottom: 32,
    color: '#0F3D5E',
  },
  appItem: {
    fontSize: 20,
    marginBottom: 8,
    color: '#0F3D5E',
  },
});
