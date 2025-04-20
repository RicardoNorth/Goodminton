import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useProfileStore } from '../store';

export default function DurationChart() {
  const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month'>('day');

  const playTimeMap = {
    day: '30分钟',
    week: '2小时20分钟',
    month: '8小时40分钟',
  };

  const winRateMap = {
    day: { win: 2, lose: 1 },
    week: { win: 4, lose: 2 },
    month: { win: 8, lose: 5 },
  };

  const pieData = [
    {
      name: '胜利',
      population: winRateMap[activeTab].win,
      color: '#0f59a4',
      legendFontColor: '#0f59a4',
      legendFontSize: 14,
    },
    {
      name: '失败',
      population: winRateMap[activeTab].lose,
      color: '#ccc',
      legendFontColor: '#2B333E',
      legendFontSize: 14,
    },
  ];

  return (
    <View style={styles.durationSection}>
      <View style={styles.tabRow}>
        {['day', 'week', 'month'].map((key) => (
          <TouchableOpacity key={key} onPress={() => setActiveTab(key as any)}>
            <Text style={[styles.tabText, activeTab === key && styles.activeTab]}>
              {key === 'day' ? '本日' : key === 'week' ? '本周' : '本月'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.durationText}>已打球：{playTimeMap[activeTab]}</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          width={Dimensions.get('window').width * 0.9}
          height={180}
          chartConfig={{ color: () => `#2B333E` }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  durationSection: { width: '95%', maxWidth: 480, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  tabRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  tabText: { fontSize: 14, color: '#888' },
  activeTab: { fontWeight: 'bold', color: '#2B333E' },
  durationText: { fontSize: 18, fontWeight: '600', color: '#2B333E', textAlign: 'center' },
  chartContainer: { marginTop: 20, marginBottom: 20, alignItems: 'center' },
});
