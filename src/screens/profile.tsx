import { View, Text, Image, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  const monitoredApps = ["Facebook", "Instagram", "TikTok", "EA FC Companion"];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../assets/cara.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.settingsButton}>
            <Image
              source={require('../assets/engrenagem.png')}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Informações do usuário */}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>Rafael Soares</Text>
          <Text style={styles.userId}>id:@19SA0000NL</Text>
        </View>

        {/* Apps monitorados */}
        <View style={styles.monitoredApps}>
          <Text style={styles.monitoredAppsTitle}>Aplicativos monitorados:</Text>
          {monitoredApps.map((app, index) => (
            <Text key={index} style={styles.monitoredApp}>
              {app}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F9FB', // Equivalente ao bg-primary (ou você pode personalizar com a cor desejada)
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#C1EAFE',
  },
  header: {
    height: 288, // Equivalente a h-72
    backgroundColor: '#9DBDCC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 256, // Equivalente a w-64
    height: 256, // Equivalente a h-64
    borderRadius: 128, // Para torná-la redonda
  },
  settingsButton: {
    position: 'absolute',
    top: 16, // Equivalente a top-4
    right: 16, // Equivalente a right-4
  },
  settingsIcon: {
    width: 40, // Equivalente a w-10
    height: 40, // Equivalente a h-10
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 24, // Equivalente a mt-6
  },
  userName: {
    fontSize: 32, // Equivalente a text-4xl
    color: '#0F3D5E',
    textAlign: 'center',
  },
  userId: {
    fontSize: 14, // Equivalente a text-base
    color: '#0F3D5E',
    marginTop: 4, // Equivalente a mt-1
  },
  monitoredApps: {
    marginTop: 48, // Equivalente a mt-12
    paddingHorizontal: 24, // Equivalente a px-6
  },
  monitoredAppsTitle: {
    fontSize: 24, // Equivalente a text-2xl
    color: '#0F3D5E',
    marginBottom: 16, // Equivalente a mb-4
  },
  monitoredApp: {
    fontSize: 20, // Equivalente a text-xl
    color: '#0F3D5E',
    marginBottom: 8, // Equivalente a mb-2
  },
});
