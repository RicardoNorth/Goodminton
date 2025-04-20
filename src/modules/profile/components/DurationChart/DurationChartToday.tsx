import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Animated,
  ToastAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { weeklyHeatmapData } from '../../mock/weeklyHeatmapData';

const moods = ['😊', '😐', '😢', '😡', '🎉'];
const MAX_LENGTH = 50;

export default function DurationChartToday() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const todayData = weeklyHeatmapData.find((d) => d.date === today);
  const minutes = todayData?.minutes ?? 0;

  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [timestamp, setTimestamp] = useState<string | null>(null);

  const moodScales = useRef<{ [key: string]: Animated.Value }>({}).current;
  moods.forEach((mood) => {
    if (!moodScales[mood]) {
      moodScales[mood] = new Animated.Value(1);
    }
  });

  const handleMoodPress = (mood: string) => {
    setSelectedMood(mood);
    Animated.sequence([
      Animated.timing(moodScales[mood], {
        toValue: 1.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(moodScales[mood], {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();
  };

  const load = async () => {
    const saved = await AsyncStorage.getItem(`mood-${today}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setSelectedMood(parsed.mood);
      setNote(parsed.note);
      setTimestamp(parsed.timestamp);
    }
  };

  const save = async () => {
    const fullTimestamp = format(new Date(), 'yyyy年M月d日 HH:mm');
    const data = { mood: selectedMood, note, timestamp: fullTimestamp };
    await AsyncStorage.setItem(`mood-${today}`, JSON.stringify(data));
    setTimestamp(fullTimestamp);
    ToastAndroid.show('保存成功！', ToastAndroid.SHORT);
  };

  const clear = async () => {
    await AsyncStorage.removeItem(`mood-${today}`);
    setSelectedMood(null);
    setNote('');
    setTimestamp(null);
    ToastAndroid.show('记录已清空', ToastAndroid.SHORT);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* 表情 */}
        <View style={styles.emojiRow}>
          {moods.map((mood) => (
            <TouchableOpacity key={mood} onPress={() => handleMoodPress(mood)}>
              <Animated.View
                style={[
                  styles.moodButton,
                  selectedMood === mood && styles.moodSelected,
                  { transform: [{ scale: moodScales[mood] }] },
                ]}
              >
                <Text style={styles.moodText}>{mood}</Text>
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 信息 */}
        <View style={styles.infoColumn}>
          <Text style={styles.durationText}>今日运动 {minutes} 分钟</Text>
          {timestamp && <Text style={styles.timestamp}>记录时间：{timestamp}</Text>}

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="一句话记录今天的运动心情..."
              multiline
              value={note}
              maxLength={MAX_LENGTH}
              onChangeText={setNote}
              scrollEnabled
              textAlignVertical="top"
            />
            <Text style={styles.counterText}>{note.length}/{MAX_LENGTH}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={save}>
              <Text style={styles.buttonText}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clear}>
              <Text style={styles.buttonText}>清空</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 12,
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 4,
  },
  moodButton: {
    padding: 6,
    borderRadius: 20,
  },
  moodSelected: {
    backgroundColor: '#f0f0f0',
  },
  moodText: {
    fontSize: 28,
  },
  infoColumn: {
    paddingTop: 4,
  },
  durationText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2B333E',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  input: {
    fontSize: 14,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    maxHeight: 100, // 限制高度不无限增高
  },
  counterText: {
    position: 'absolute',
    right: 8,
    bottom: 6,
    fontSize: 12,
    color: '#999',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    gap: 12,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#2B333E',
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
