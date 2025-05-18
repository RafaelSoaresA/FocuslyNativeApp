import React, { useEffect, useState } from 'react';
import {
  Text,
  NativeModules,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  View,
  ActivityIndicator,
  RefreshControl,
  TextInput,
} from 'react-native';


const { ScreenTimeModule } = NativeModules;

interface ScreenTimeEntry {
  appName: string;
  icon: string;
  totalTimeInForeground: number;
  packageName: string;
  usageLimit: number;
}

export default function FocuslyAppsScreen() {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  const checkPermission = async () => {
    try {
      const hasPermission = await ScreenTimeModule.checkUsageStatsPermission();
      setPermissionGranted(hasPermission);
      return hasPermission;
    } catch (err: any) {
      setError(err.message || 'Erro ao verificar permissão');
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const hasPermission = await checkPermission();
      if (hasPermission) {
        await fetchScreenTime();
      } else {
        Alert.alert(
          'Permissão necessária',
          'Não foi possível acessar os dados de uso. Por favor, ative a permissão nas configurações.',
          [{ text: 'OK' }]
        );
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const fetchScreenTime = async () => {
    try {
      const data: ScreenTimeEntry[] = await ScreenTimeModule.getUsageStats();

      const sorted = data
        .filter((entry) => entry.totalTimeInForeground > -1)
        .sort((a, b) => b.totalTimeInForeground - a.totalTimeInForeground);

      setScreenTimeData(sorted);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Erro ao obter tempo de tela');
    }
  };

  const handlePermission = () => {
    if (Platform.OS === 'android') {
      ScreenTimeModule.openUsageAccessSettings();
    } else {
      Alert.alert('Permissão não disponível para seu sistema');
    }
  };

  const requestPermission = () => {
    Alert.alert(
      'Permissão necessária',
      'Para monitorar seu tempo de tela, precisamos que você ative a permissão de uso. Deseja abrir as configurações agora?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Abrir Configurações',
          onPress: handlePermission,
        },
      ]
    );
  };

  const refreshData = async () => {
    setLoading(true);
    const hasPermission = await checkPermission();
    if (hasPermission) {
      await fetchScreenTime();
    }
    setLoading(false);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshData}
          tintColor="#0F3D5E"
          colors={['#0F3D5E']}
        />
      }
    >
      <Text style={styles.title}>Tempo de Tela (últimas 24h)</Text>

      {!permissionGranted ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Precisamos da sua permissão para acessar o uso de seus aplicativos.
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Ativar permissão de uso</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {loading && permissionGranted ? (
        <ActivityIndicator size="large" color="#0F3D5E" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : screenTimeData.length === 0 ? (
        <Text style={styles.noDataText}>Nenhum dado disponível para exibir.</Text>
      ) : (
        screenTimeData.map((entry, index) => (
                      <View key={index} style={styles.card}>
            <Image source={{ uri: entry.icon }} style={styles.icon} resizeMode="contain" />
            <View style={styles.cardTextContainer}>
                <Text style={styles.appName}>{entry.appName}</Text>
                <Text style={styles.time}>
                Tempo de uso hoje: {Math.floor(entry.totalTimeInForeground / 60)} min
                </Text>
                <Text style={styles.time}>
                Tempo limite: {entry.usageLimit} min
                </Text>
                <TextInput
                style={styles.input}
                keyboardType="numeric"
                defaultValue={entry.usageLimit.toString()}
                onChangeText={(text) => {
                    const limit = Number(text);
                    if (!isNaN(limit)) {
                    // Integre aqui com um método nativo, se necessário:
                    // NativeModules.ScreenTimeModule.setUsageLimit(entry.packageName, limit);
                    }
                }}
                />
            </View>
            </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#C1EAFE',
    flexGrow: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 24,
    color: '#0F3D5E',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 6,
    borderRadius: 6,
    width: 60,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    width: 48,
    height: 48,
    marginRight: 16,
    borderRadius: 8,
    backgroundColor: '#e6f7ff',
  },
  cardTextContainer: {
    flex: 1,
  },
  appName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F3D5E',
  },
  time: {
    fontSize: 14,
    color: '#4E6E81',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  permissionContainer: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  permissionText: {
    marginBottom: 12,
    textAlign: 'center',
    color: '#0F3D5E',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0F3D5E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#0F3D5E',
    marginTop: 20,
    textAlign: 'center',
  },
});
