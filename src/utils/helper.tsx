import { Platform } from 'react-native';
import { EventDetail } from '../Model/EventList/EventDetailData';

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

export function getStatusEvent(item: EventDetail): string {
  const today = new Date();

  const todayDate =
    `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const eventDate = item.event_date;

  console.log('Event Date:', eventDate);
  console.log('Today Date:', todayDate);


  if (eventDate === todayDate) {
    return 'Ongoing';
  } else if (eventDate > todayDate) {
    return 'UpComing';
  } else {
    return 'Past';
  }
}

export const formatHeaderTitle = (
  dateString: string,
) => {

  // Example: "09 May 2026"

  const parts =
    dateString.split(' ');

  if (parts.length !== 3) {
    return dateString;
  }

  const day = parseInt(parts[0]);

  const monthMap: any = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const month =
    monthMap[parts[1]];

  const year = parseInt(
    parts[2],
  );

  const itemDate = new Date(
    year,
    month,
    day,
  );

  // ✅ Check invalid date
  if (
    isNaN(itemDate.getTime())
  ) {
    return dateString;
  }

  const today = new Date();

  const yesterday =
    new Date();

  yesterday.setDate(
    today.getDate() - 1,
  );

  if (
    itemDate.toDateString() ===
    today.toDateString()
  ) {
    return 'Today';
  }

  if (
    itemDate.toDateString() ===
    yesterday.toDateString()
  ) {
    return 'Yesterday';
  }
  return dateString;
};