import { Event } from '../../types';
import { getFilteredEvents } from '../../utils/eventUtils';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '이벤트 1',
    date: '2024-07-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '테스트 이벤트 1 설명',
    location: '온라인',
    category: '일정',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '2',
    title: '이벤트 2',
    date: '2024-07-03',
    startTime: '11:00',
    endTime: '12:00',
    description: '테스트 이벤트 2 설명',
    location: '회의실 B',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '3',
    title: '팀 회의',
    date: '2024-07-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '4',
    title: 'English Study',
    date: '2024-08-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

describe('getFilteredEvents', () => {
  it("검색어 '이벤트 2'에 맞는 이벤트만 반환한다", () => {
    const filteredEvents = getFilteredEvents(
      mockEvents,
      '이벤트 2',
      new Date('2024-07-01'),
      'month'
    );
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].title).toBe('이벤트 2');
  });

  it('주간 뷰에서 2024-07-01 주의 이벤트만 반환한다', () => {
    const filteredEvents = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toHaveLength(2);
    expect(filteredEvents.map((e) => e.date)).toEqual(['2024-07-01', '2024-07-03']);
  });

  it('월간 뷰에서 2024년 7월의 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(3);
  });

  it("검색어 '이벤트'와 주간 뷰 필터링을 동시에 적용한다", () => {
    const filteredEvents = getFilteredEvents(mockEvents, '이벤트', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toHaveLength(2);
    expect(filteredEvents.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2']);
  });

  it('검색어가 없을 때 모든 이벤트를 반환한다', () => {
    const filteredEvents = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toHaveLength(2);
    expect(filteredEvents.map((e) => e.title)).toEqual(['이벤트 1', '이벤트 2']);
  });

  it('검색어가 대소문자를 구분하지 않고 작동한다', () => {
    const filteredEvents = getFilteredEvents(mockEvents, 'english', new Date('2024-08-20'), 'week');
    expect(filteredEvents).toHaveLength(1);
    expect(filteredEvents[0].title).toBe('English Study');
  });

  it('월의 경계에 있는 이벤트를 올바르게 필터링한다', () => {
    const filteredEvents = getFilteredEvents(mockEvents, '', new Date('2024-07-01'), 'month');
    expect(filteredEvents).toHaveLength(3);
  });

  it('빈 이벤트 리스트에 대해 빈 배열을 반환한다', () => {
    const filteredEvents = getFilteredEvents([], '', new Date('2024-07-01'), 'week');
    expect(filteredEvents).toEqual([]);
  });
});
