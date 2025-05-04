import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';

export default function EditProfileScreen({ goBack }: { goBack: () => void }) {
  const [name, setName] = useState('Rafael Soares');
  const [userId, setUserId] = useState('@19SA0000NL');

  const handleSave = () => {
    Alert.alert('Perfil Atualizado', `Nome: ${name}\nID: ${userId}`);
    // Você pode salvar os dados localmente ou em uma API aqui
    goBack(); // volta para a tela de perfil após salvar
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Digite seu nome"
        />

        <Text style={styles.label}>ID de Usuário</Text>
        <TextInput
          style={styles.input}
          value={userId}
          onChangeText={setUserId}
          placeholder="Digite seu ID"
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C1EAFE',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F3D5E',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#0F3D5E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
    color: '#0F3D5E',
  },
  button: {
    backgroundColor: '#0F3D5E',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  backButtonText: {
    color: '#0F3D5E',
    fontSize: 16,
  },
});
