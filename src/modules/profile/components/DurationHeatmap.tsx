// src/modules/profile/components/DurationHeatmap.tsx
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { heatmapData } from '../mock/heatmapData';

// 映射分钟数到颜色等级（模仿 GitHub 热图）
const getColor = (minutes: number) => {
  if (minutes === 0) return '#ebedf0';
  if (minutes <= 30) return '#c6e48b';
  if (minutes <= 60) return '#7bc96f';
  return '#239a3b';
};

// 获取 weekday（0=Sun ~ 6=Sat）
const getWeekday = (dateStr: string) => new Date(dateStr).getDay();

// 获取周序号（从数据起始日开始）
const getWeekIndex = (dateStr: string, startDate: Date) => {
  const d = new Date(dateStr);
  const diff = Math.floor((+d - +startDate) / (1000 * 3600 * 24));
  return Math.floor((diff + startDate.getDay()) / 7);
};

export default function DurationHeatmap() {
  const data = heatmapData;

  if (!data || data.length === 0) return null;

  const startDate = new Date(data[0].date);
  const matrix: { [key: number]: { [key: number]: number } } = {}; // week -> weekday -> minutes

  data.forEach((item) => {
    const weekday = getWeekday(item.date);
    const weekIndex = getWeekIndex(item.date, startDate);
    if (!matrix[weekIndex]) matrix[weekIndex] = {};
    matrix[weekIndex][weekday] = item.minutes;
  });

  const numWeeks = Math.max(...Object.keys(matrix).map(Number)) + 1;
  const boxSize = 16;
  const boxMargin = 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>打球活跃热图</Text>
      <View style={{ flexDirection: 'row' }}>
        {[...Array(numWeeks)].map((_, weekIdx) => (
          <View key={weekIdx} style={{ flexDirection: 'column' }}>
            {[0, 1, 2, 3, 4, 5, 6].map((day) => {
              const minutes = matrix[weekIdx]?.[day] || 0;
              return (
                <View
                  key={day}
                  style={{
                    width: boxSize,
                    height: boxSize,
                    margin: boxMargin,
                    backgroundColor: getColor(minutes),
                    borderRadius: 2,
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B333E',
    marginBottom: 12,
  },
});
