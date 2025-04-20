import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { heatmapData } from '../mock/heatmapData';

const boxSize = 16;
const boxMargin = 2;
const columnWidth = boxSize + boxMargin + 6; // ✅ 为月份缩写多留 6px 空间
const yLabelWidth = 28;

const getColor = (minutes: number) => {
  if (minutes === 0) return '#ebedf0';
  if (minutes <= 30) return '#ffecb3';
  if (minutes <= 60) return '#ffb74d';
  return '#e53935';
};

// 构建每周一列的结构
const buildWeeks = (data: typeof heatmapData) => {
  const startDate = new Date(data[0].date);
  const matrix: { [weekIndex: number]: { [weekday: number]: { date: string; minutes: number } } } = {};

  data.forEach((item) => {
    const date = new Date(item.date);
    const weekday = date.getDay(); // 0 = Sun
    const diff = Math.floor((+date - +startDate) / (1000 * 3600 * 24));
    const weekIndex = Math.floor((diff + startDate.getDay()) / 7);

    if (!matrix[weekIndex]) matrix[weekIndex] = {};
    matrix[weekIndex][weekday] = {
      date: item.date,
      minutes: item.minutes,
    };
  });

  const weeks = Object.keys(matrix).map((weekIndex) => {
    const week = matrix[+weekIndex];
    const days = Array.from({ length: 7 }, (_, weekday) => ({
      weekday,
      date: week[weekday]?.date ?? '',
      minutes: week[weekday]?.minutes ?? 0,
    }));
    return { weekIndex: +weekIndex, days };
  });

  return weeks;
};

// 找出每月1日所在列
const getMonthLabelMap = (weeks: ReturnType<typeof buildWeeks>) => {
  const labelMap: { [weekIdx: number]: string } = {};
  const seen = new Set<string>();

  weeks.forEach((week, idx) => {
    for (const day of week.days) {
      if (day.date && new Date(day.date).getDate() === 1) {
        const month = new Date(day.date).toLocaleString('en-US', { month: 'short' }); // ✅ 英文缩写
        if (!seen.has(month)) {
          seen.add(month);
          labelMap[idx] = month;
        }
        break;
      }
    }
  });

  return labelMap;
};

export default function DurationHeatmap() {
  const data = heatmapData;
  if (!data || data.length === 0) return null;

  const weeks = buildWeeks(data);
  const monthLabelMap = getMonthLabelMap(weeks);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>打球活跃热图</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* 顶部月份标签 */}
          <View style={styles.monthLabelsRow}>
            <View style={{ width: yLabelWidth }} />
            {weeks.map((_, idx) => (
              <View
                key={`month-${idx}`}
                style={{
                  width: columnWidth,
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={styles.monthLabel}
                  numberOfLines={1}
                  ellipsizeMode="clip"
                >
                  {monthLabelMap[idx] || ' '}
                </Text>
              </View>
            ))}
          </View>

          {/* 热图主体 */}
          <View style={{ flexDirection: 'row' }}>
            {/* Y轴：星期标签 */}
            <View style={styles.yLabelColumn}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label) => (
                <Text key={label} style={styles.yLabel}>
                  {label}
                </Text>
              ))}
            </View>

            {/* 热图格子列 */}
            {weeks.map((week, weekIdx) => (
              <View
                key={`week-${weekIdx}`}
                style={{
                  width: columnWidth,
                  alignItems: 'center',
                }}
              >
                {week.days.map((day) => (
                  <View
                    key={day.weekday}
                    style={{
                      width: boxSize,
                      height: boxSize,
                      marginVertical: boxMargin,
                      backgroundColor: getColor(day.minutes),
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
  monthLabelsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  monthLabel: {
    fontSize: 12,
    color: '#999',
    width: columnWidth,
    overflow: 'hidden',
  },
  yLabelColumn: {
    width: yLabelWidth,
    paddingRight: 3,
    justifyContent: 'space-between',
  },
  yLabel: {
    fontSize: 12,
    color: '#555',
    textAlign: 'right',
    marginVertical: 2,
  },
});
