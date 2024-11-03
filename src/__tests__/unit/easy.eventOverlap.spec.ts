import { Event } from '../../types';
import {
  convertEventToDateRange,
  findOverlappingEvents,
  isOverlapping,
  parseDateTime,
} from '../../utils/eventOverlap';

const mockEvent: Event = {
  id: '2b7545a6-ebee-426c-b906-2329bc8d62bd',
  title: '팀 회의',
  date: '2024-11-01',
  startTime: '10:00',
  endTime: '11:00',
  description: '주간 팀 미팅',
  location: '회의실 A',
  category: '업무',
  repeat: {
    type: 'none',
    interval: 0,
  },
  notificationTime: 1,
};

describe('parseDateTime', () => {
  it('2024-07-01 14:30을 정확한 Date 객체로 변환한다', () => {
    const targetDate = new Date('2024-07-01T14:30');

    expect(parseDateTime('2024-07-01', '14:30')).toEqual(targetDate);
  });

  it('잘못된 날짜 형식에 대해 Invalid Date를 반환한다', () => {
    const parsedDate = parseDateTime('2024-0701', '14:30');

    expect(parsedDate).toBeInstanceOf(Date);
    expect(isNaN(parsedDate.getTime())).toBe(true);
  });

  it('잘못된 시간 형식에 대해 Invalid Date를 반환한다', () => {
    const parsedDate = parseDateTime('2024-07-01', '1430');

    expect(parsedDate).toBeInstanceOf(Date);
    expect(isNaN(parsedDate.getTime())).toBe(true);
  });

  it('날짜 문자열이 비어있을 때 Invalid Date를 반환한다', () => {
    const parsedDate = parseDateTime('', '14:30');

    expect(parsedDate).toBeInstanceOf(Date);
    expect(isNaN(parsedDate.getTime())).toBe(true);
  });
});

describe('convertEventToDateRange', () => {
  it('일반적인 이벤트를 올바른 시작 및 종료 시간을 가진 객체로 변환한다', () => {
    const convertedEvent = convertEventToDateRange(mockEvent);

    expect(convertedEvent).toEqual({
      start: parseDateTime('2024-11-01', '10:00'),
      end: parseDateTime('2024-11-01', '11:00'),
    });
  });

  it('잘못된 날짜 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = { ...mockEvent, date: '2024-1101' };
    const convertedEvent = convertEventToDateRange(event);

    expect(convertedEvent.start).toBeInstanceOf(Date);
    expect(isNaN(convertedEvent.start.getTime())).toBe(true);
  });

  it('잘못된 시간 형식의 이벤트에 대해 Invalid Date를 반환한다', () => {
    const event = { ...mockEvent, startTime: '1430', endTime: '1530' };
    const convertedEvent = convertEventToDateRange(event);

    expect(convertedEvent.start).toBeInstanceOf(Date);
    expect(isNaN(convertedEvent.start.getTime())).toBe(true);
  });
});

describe('isOverlapping', () => {
  it('두 이벤트가 겹치는 경우 true를 반환한다', () => {
    const event1 = {
      ...mockEvent,
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      id: '1',
    };
    const event2 = {
      ...mockEvent,
      date: '2024-11-01',
      startTime: '10:30',
      endTime: '11:30',
      id: '2',
    };

    expect(isOverlapping(event1, event2)).toBe(true);
  });

  it('두 이벤트가 겹치지 않는 경우 false를 반환한다', () => {
    const event1 = {
      ...mockEvent,
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      id: '1',
    };
    const event2 = {
      ...mockEvent,
      date: '2024-11-01',
      startTime: '11:30',
      endTime: '12:30',
      id: '2',
    };

    expect(isOverlapping(event1, event2)).toBe(false);
  });
});

describe('findOverlappingEvents', () => {
  it('새 이벤트와 겹치는 모든 이벤트를 반환한다', () => {
    const events = [
      { ...mockEvent, date: '2024-11-01', startTime: '10:00', endTime: '11:00', id: '1' },
      { ...mockEvent, date: '2024-11-01', startTime: '10:30', endTime: '11:30', id: '2' },
      { ...mockEvent, date: '2024-11-01', startTime: '11:00', endTime: '12:00', id: '3' },
    ];
    const newEvent = { ...mockEvent, date: '2024-11-01', startTime: '10:30', endTime: '10:59' };

    expect(findOverlappingEvents(newEvent, events)).toEqual([events[0], events[1]]);
  });

  it('겹치는 이벤트가 없으면 빈 배열을 반환한다', () => {
    const events = [
      { ...mockEvent, date: '2024-11-01', startTime: '10:00', endTime: '11:00', id: '1' },
      { ...mockEvent, date: '2024-11-01', startTime: '11:30', endTime: '12:30', id: '2' },
    ];
    const newEvent = { ...mockEvent, date: '2024-11-01', startTime: '12:30', endTime: '13:30' };

    expect(findOverlappingEvents(newEvent, events)).toEqual([]);
  });
});
