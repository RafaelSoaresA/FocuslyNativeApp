import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';

export default function InfoScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sobre o Focusly</Text>

      <Image
        source={require('../assets/focusly.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.description}>
        O Focusly é um aplicativo projetado para combater o brainrot — o vício em conteúdos
        digitais que prejudicam seu foco e bem-estar mental.
      </Text>

      <Text style={styles.description}>
        Com o monitoramento do tempo de uso de aplicativos, ajudamos você a entender seus hábitos,
        reduzir distrações e reconquistar sua atenção.
      </Text>

      <Text style={styles.sectionTitle}>Funcionalidades principais:</Text>
      <View style={styles.featureList}>
        <Text style={styles.featureItem}>• Monitoramento de tempo de tela</Text>
        <Text style={styles.featureItem}>• Detecção de apps mais usados</Text>
        <Text style={styles.featureItem}>• Alertas e insights sobre seu uso</Text>
        <Text style={styles.featureItem}>• Gamificação e metas de uso</Text>
      </View>

      <Text style={styles.footer}>Versão 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#C1EAFE',
      alignItems: 'center',
    },
    title: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#0F3D5E',
      marginBottom: 16,
      textAlign: 'center',
      marginTop: 100,
    },
    logo: {
      width: 120,
      height: 120,
      marginBottom: 20,
      borderRadius: 20,
    },
    description: {
      fontSize: 16,
      color: '#0F3D5E',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#0F3D5E',
      marginTop: 12,
      marginBottom: 8,
      textAlign: 'center',
    },
    featureList: {
      alignItems: 'flex-start',
      width: '100%',
      paddingHorizontal: 20,
    },
    featureItem: {
      fontSize: 16,
      color: '#4E6E81',
      marginBottom: 6,
    },
    footer: {
      marginTop: 30,
      fontSize: 14,
      color: '#4E6E81',
      textAlign: 'center',
    },
});