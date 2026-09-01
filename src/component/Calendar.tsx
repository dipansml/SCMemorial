import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import { AttendanceItem, StatusType } from '../Model/StudentAttendance/AttendanceItem';

const { width } = Dimensions.get('window');
const ITEM_SIZE = width / 8.2;

const daysHeader: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];


interface CalendarProps {
  attendanceData: AttendanceItem[];
  onMonthChange?: (date: Date) => void;
}

const getMonthDays = (year: number, month: number): (Date | null)[] => {
  const date = new Date(year, month, 1);
  const days: (Date | null)[] = [];

  let startDay = date.getDay();
  startDay = startDay === 0 ? 6 : startDay - 1;

  // Empty spaces
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Actual days
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return days;
};

const getStatusColor = (status: StatusType): string => {
  switch (status) {
    case 'Present':
      return Colors.present;
    case 'Absent':
      return Colors.absent;
    case 'Holiday':
      return Colors.holiday;
    case 'Half Day':
      return Colors.halfday;  
    default:
      return Colors.light_gray;
  }
};

// ✅ FIXED DATE FORMAT (NO TIMEZONE ISSUE)
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const Calendar: React.FC<CalendarProps> = ({ attendanceData, onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = getMonthDays(year, month);
  console.log(attendanceData);

  const changeMonth = (type: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(month + (type === 'next' ? 1 : -1));
    setCurrentDate(newDate);
     // send date to parent
    onMonthChange?.(newDate);
  };

  const getStatus = (day: Date | null): StatusType => {
    if (!day) return 'Default';

    const formatted = formatDate(day);
    const found = attendanceData.find((d) => d.date === formatted);

    return found ? found.status : 'Default';
  };

  const monthName = currentDate.toLocaleString('default', {
    month: 'long',
  });

  return (
    <View style={styles.container}>
      
      {/* Header */}
      <View style={styles.headerMain}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => changeMonth('prev')}
          >
          <Text style={styles.arrow}>{'‹'}</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.month}>{monthName}</Text>
          <Text style={styles.year}> {getAcademicYear(currentDate)}</Text>
        </View>

        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => changeMonth('next')}
        >
          <Text style={styles.arrow}>{'›'}</Text>
        </TouchableOpacity>
      </View>
      </View>

      <View style={styles.calendarMain}>

      {/* Days Header */}
      <View style={styles.row}>
        {daysHeader.map((d, i) => (
          <Text key={i} style={styles.dayHeader}>
            {d}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <FlatList
        data={days}
        numColumns={7}
        keyExtractor={(_, i) => i.toString()}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const status = getStatus(item);
          const bgColor = item ? getStatusColor(status) : 'transparent';

          return (
            <View style={styles.cell}>
              {item && (
                <View style={[styles.circle, { backgroundColor: bgColor }]}>
                  <Text style={styles.dateText}>
                    {item.getDate()}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
      />
      </View>
    </View>
  );
};

export default Calendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background_list_item,
    borderRadius: 12,
    elevation: 2,
    
  },

  headerMain: {
    backgroundColor:Colors.light_gray,
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    
  },
  calendarMain: {
    padding: 12,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor:Colors.light_gray,
    
  },
  arrowBtn: {
    padding: 8,
  },
  arrow: {
    fontSize: 22,
    color: Colors.text,
  },
  month: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.medium,
    textAlign: 'center',
  },
  year: {
    fontSize: FontSize.small,
    color: Colors.inactive_text,
    fontFamily: FontFamily.regular,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginTop: 14,
    marginBottom: 8,
  },
  dayHeader: {
    width: ITEM_SIZE,
    textAlign: 'center',
    color: Colors.text,
    fontFamily: FontFamily.semiBold,
  },
  cell: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: ITEM_SIZE * 0.7,
    height: ITEM_SIZE * 0.7,
    borderRadius: ITEM_SIZE * 0.35, // perfect circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: {
    fontSize: FontSize.small,
    color: Colors.text,
    fontFamily: FontFamily.semiBold,
  },
});

const getAcademicYear = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0 = Jan, 1 = Feb, 2 = Mar

  let startYear: number;
  let endYear: number;

  if (month >= 2) {
    // March to December
    startYear = year;
    endYear = year + 1;
  } else {
    // January & February
    startYear = year - 1;
    endYear = year;
  }

  return `Academic Year ${startYear}-${String(endYear).slice(-2)}`;
};