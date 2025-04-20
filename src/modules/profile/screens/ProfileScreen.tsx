import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import BackgroundBanner from '../components/BackgroundBanner';
import AvatarCard from '../components/AvatarCard';
import DurationChart from '../components/DurationChart';
import RecommendedUserList from '../components/RecommendedUserList';
import EditAndSearchButtons from '../components/EditAndSearchButtons';
import DurationHeatmap from '../components/DurationHeatmap';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackgroundBanner />
      <AvatarCard />
      <EditAndSearchButtons />
      <DurationChart />
      <DurationHeatmap />
      <RecommendedUserList />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
});
