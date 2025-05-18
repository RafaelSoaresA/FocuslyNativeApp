// TelaConnections.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export const ConnectionsScreen = () => {
  const userProfile = {
    name: 'Rafael Soares',
    level: 4,
    xp: 43,
    image: require('../assets/cara.png'),
  };

  const friends = [
    {
      id: 1,
      name: 'Matheus Campos',
      level: 2,
      xp: 25,
      image: require('../assets/cara3.png'),
    },
    {
      id: 2,
      name: 'Gabriel Henrique',
      level: 6,
      xp: 67,
      image: require('../assets/cara2.png'),
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Seu perfil</Text>

        <View style={styles.card}>
          <Image source={userProfile.image} style={styles.profileImage} />
          <Text style={styles.name}>{userProfile.name}</Text>
          <Text style={styles.level}>Nível {userProfile.level} - XP {userProfile.xp}</Text>
        </View>

        <Text style={styles.subTitle}>Suas amizades</Text>

        {friends.map((friend) => (
          <View key={friend.id} style={styles.friendCard}>
            <View style={styles.friendContent}>
              <Image source={friend.image} style={styles.friendImage} />
              <Text style={styles.friendName}>{friend.name}</Text>
            </View>
            <Text style={styles.friendLevel}>Nível {friend.level} - XP {friend.xp}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c1eafe',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 100,
  },
  title: {
    fontSize: 30,
    color: '#0f3d5e',
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#9dbdcc',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: 350,
    marginBottom: 40,
  },
  profileImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    color: '#0f3d5e',
    textAlign: 'center',
  },
  level: {
    fontSize: 18,
    color: '#0f3d5e',
    marginTop: 4,
  },
  subTitle: {
    fontSize: 26,
    color: '#0f3d5e',
    fontWeight: '600',
    marginBottom: 10,
  },
  friendCard: {
    backgroundColor: '#9cbccc',
    borderRadius: 12,
    padding: 15,
    width: 350,
    marginBottom: 20,
  },
  friendContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendImage: {
    width: 114,
    height: 114,
    borderRadius: 57,
    marginRight: 15,
  },
  friendName: {
    fontSize: 20,
    color: '#0f3d5e',
    flex: 1,
  },
  friendLevel: {
    fontSize: 16,
    color: '#0f3d5e',
    marginTop: 10,
  },
});
