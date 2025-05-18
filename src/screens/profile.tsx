import {
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  NativeModules,
  Dimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import EditProfileScreen from './EditProfile';
import { BarChart } from 'react-native-chart-kit';

const { ScreenTimeModule } = NativeModules;

export default function ProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [usageData, setUsageData] = useState<any[]>([]);

  const handlePermissions = () => {
    setModalVisible(false);
    try {
      ScreenTimeModule.openUsageAccessSettings();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível abrir as configurações.');
    }
  };

  const handleEditProfile = () => {
    setModalVisible(false);
    setShowEditProfile(true);
  };

  const handleLogout = () => {
    setModalVisible(false);
    Alert.alert('Logout', 'Você saiu do Focusly.');
  };

  useEffect(() => {
    ScreenTimeModule.getUsageStats()
      .then((result: any[]) => {
        setUsageData(result);
      })
      .catch((error: any[]) => {
        console.error('Erro ao obter dados de uso:', error);
      });
  }, []);

  if (showEditProfile) {
    return <EditProfileScreen goBack={() => setShowEditProfile(false)} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Image
            source={require('../assets/cara.png')}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.settingsButton} onPress={() => setModalVisible(true)}>
            <Image
              source={require('../assets/engrenagem.png')}
              style={styles.settingsIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>Rafael Soares</Text>
          <Text style={styles.userId}>id:@19SA0000NL</Text>
        </View>

        {usageData.length > 0 && (
  <View style={styles.chartContainer}>
    <Text style={styles.chartTitle}>Tempo de uso hoje:</Text>
    <BarChart
      data={{
        labels: usageData.map((app: any) => app.appName),
        datasets: [
          {
            data: usageData.map((app: any) =>
              Math.round((app.totalTimeInForeground || 0) / 60) // minutos
            ),
          },
        ],
      }}
      width={Dimensions.get('window').width - 48}
      height={300}
      fromZero
      yAxisLabel=""
      yAxisSuffix="min"
      showValuesOnTopOfBars={true}
      withInnerLines={false}
      chartConfig={{
        backgroundColor: '#e1f5fe',
        backgroundGradientFrom: '#c1eafe',
        backgroundGradientTo: '#81d4fa',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(15, 61, 94, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(15, 61, 94, ${opacity})`,
        barPercentage: 0.6,
        propsForLabels: {
          fontSize: 10,
        },
      }}
      verticalLabelRotation={45}
      style={{
        borderRadius: 16,
        marginTop: 8,
      }}
    />
  </View>
)}

      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.modalOption} onPress={handlePermissions}>
              <Text style={styles.modalOptionText}>Permissões</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleEditProfile}>
              <Text style={styles.modalOptionText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleLogout}>
              <Text style={[styles.modalOptionText, { color: 'red' }]}>Sair</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F9FB',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#C1EAFE',
  },
  header: {
    height: 350,
    backgroundColor: '#9DBDCC',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileImage: {
    width: 256,
    height: 256,
    borderRadius: 128,
  },
  settingsButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    marginTop: 30,
  },
  settingsIcon: {
    width: 40,
    height: 40,
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 24,
  },
  userName: {
    fontSize: 32,
    color: '#0F3D5E',
    textAlign: 'center',
  },
  userId: {
    fontSize: 14,
    color: '#0F3D5E',
    marginTop: 4,
  },
  monitoredApps: {
    marginTop: 48,
    paddingHorizontal: 24,
  },
  monitoredAppsTitle: {
    fontSize: 24,
    color: '#0F3D5E',
    marginBottom: 16,
  },
  monitoredApp: {
    fontSize: 20,
    color: '#0F3D5E',
    marginBottom: 8,
  },
  chartContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  chartTitle: {
    fontSize: 24,
    color: '#0F3D5E',
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#0F3D5E',
    fontWeight: '600',
  },
});
