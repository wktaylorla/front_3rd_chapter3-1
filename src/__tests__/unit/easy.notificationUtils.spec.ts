import { Event } from '../../types';
import { createNotificationMessage, getUpcomingEvents } from '../../utils/notificationUtils';

const mockEvent: Event = {
  id: '1',
  title: '이벤트 1',
  date: '2024-07-01',
  startTime: '09:00',
  endTime: '10:00',
  description: '테스트 이벤트 1 설명',
  location: '온라인',
  category: '일정',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

describe('getUpcomingEvents', () => {
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const now = new Date('2024-07-01T08:50');
    const event: Event = { ...mockEvent };
    const upcomingEvents = getUpcomingEvents([event], now, []);

    expect(upcomingEvents).toHaveLength(1);
    expect(upcomingEvents[0].title).toBe('이벤트 1');
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const now = new Date('2024-07-01T08:50');
    const event: Event = { ...mockEvent };
    const upcomingEvents = getUpcomingEvents([event], now, ['1']);

    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T08:49');
    const event: Event = { ...mockEvent };
    const upcomingEvents = getUpcomingEvents([event], now, []);

    expect(upcomingEvents).toHaveLength(0);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const now = new Date('2024-07-01T09:11');
    const event: Event = { ...mockEvent };
    const upcomingEvents = getUpcomingEvents([event], now, []);

    expect(upcomingEvents).toHaveLength(0);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {
    const message = createNotificationMessage(mockEvent);

    expect(message).toBe('10분 후 이벤트 1 일정이 시작됩니다.');
  });
});
