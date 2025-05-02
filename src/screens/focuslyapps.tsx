import React, { useEffect, useState } from 'react';
import {
  Text,
  NativeModules,
  StyleSheet,
  ScrollView,
  Button,
  Platform,
  Alert,
  Image,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

const { ScreenTimeModule } = NativeModules;

interface ScreenTimeEntry {
  appName: string;
  icon: string;
  totalTimeInForeground: number;
  packageName: string;
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
        .filter((entry) => entry.totalTimeInForeground > 0)
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
      <Text style={styles.title}>Tempo de Tela (últimas 24h):</Text>

      {!permissionGranted ? (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Precisamos da sua permissão para acessar o uso de seus aplicativos.
          </Text>
          <Button
            title="Ativar permissão de uso"
            onPress={requestPermission}
            color="#0F3D5E"
          />
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
          <View key={index} style={styles.entryContainer}>
            {entry.icon ? (
              <Image source={{ uri: entry.icon }} style={styles.icon} />
            ) : null}
            <Text style={styles.entryText}>
              {entry.appName}: {Math.round(entry.totalTimeInForeground / 60)} min
            </Text>
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
    fontSize: 24,
    marginBottom: 20,
    color: '#0F3D5E',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  entryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    width: 32,
    height: 32,
    marginRight: 10,
    borderRadius: 6,
  },
  entryText: {
    fontSize: 16,
    color: '#0F3D5E',
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
  },
  permissionText: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#0F3D5E',
  },
  noDataText: {
    fontSize: 16,
    color: '#0F3D5E',
    marginTop: 20,
    textAlign: 'center',
  },
});