import { Platform } from 'react-native';

export const getBottomSpacing = (insets: any) => {
  return Platform.OS === 'android' ? insets.bottom : 0;
};

export const changeDateFormat = (dateString: string): string => {
  const date = new Date(dateString);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export function getStatus(item: any): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(item.exam_date);
  examDate.setHours(0, 0, 0, 0);

  if (examDate.getTime() === today.getTime()) {
    return 'Ongoing';
  } else if (examDate > today) {
    return 'Upcoming';
  } else {
    return 'Past';
  }
}