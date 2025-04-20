// 用于批量从 AsyncStorage 读取当月的记录
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

export async function loadMonthlyMoodMap(): Promise<Record<string, string>> {
  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);
  const days = eachDayOfInterval({ start, end });

  const keys = days.map((d) => `mood-${format(d, 'yyyy-MM-dd')}`);
  const records = await AsyncStorage.multiGet(keys);

  const moodMap: Record<string, string> = {};

  records.forEach(([key, value]) => {
    if (value) {
      try {
        const parsed = JSON.parse(value);
        if (parsed.mood) {
          const date = key.replace('mood-', '');
          moodMap[date] = parsed.mood;
        }
      } catch (err) {
        console.warn('Error parsing mood record:', key, err);
      }
    }
  });

  return moodMap;
}
