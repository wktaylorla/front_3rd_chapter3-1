import { act, renderHook } from '@testing-library/react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { Event } from '../../types.ts';
import { formatDate } from '../../utils/dateUtils.ts';
import { parseHM } from '../utils.ts';

const mockEvent: Event = {
  id: '1',
  title: '기존 회의',
  date: '2024-10-15',
  startTime: '09:00',
  endTime: '10:00',
  description: '기존 팀 미팅',
  location: '회의실 B',
  category: '업무',
  repeat: { type: 'none', interval: 0 },
  notificationTime: 10,
};

// useInterval mock 설정
const mockIntervalCallback = vi.fn();
vi.mock('@chakra-ui/react', () => ({
  useInterval: (callback: () => void) => {
    mockIntervalCallback.mockImplementation(callback);
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = renderHook(() => useNotifications([]));

  expect(result.current.notifications).toEqual([]);
  expect(result.current.notifiedEvents).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
  // 현재 시간으로부터 10분 후의 이벤트 생성
  const now = new Date();
  const eventTime = new Date(now.getTime() + 10 * 60 * 1000);

  const testEvent: Event = {
    ...mockEvent,
    id: '1',
    date: formatDate(eventTime),
    startTime: parseHM(eventTime.getTime()),
    endTime: parseHM(eventTime.getTime() + 60 * 60 * 1000),
  };

  const { result } = renderHook(() => useNotifications([testEvent]));

  act(() => {
    mockIntervalCallback();
  });

  expect(result.current.notifications).toEqual([
    {
      id: '1',
      message: expect.stringContaining(
        `${mockEvent.notificationTime}분 후 ${mockEvent.title} 일정이 시작됩니다.`
      ),
    },
  ]);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const now = new Date();
  const eventTime = new Date(now.getTime() + 10 * 60 * 1000);

  const testEvents: Event[] = [
    {
      ...mockEvent,
      id: '1',
      date: formatDate(eventTime),
      startTime: parseHM(eventTime.getTime()),
      endTime: parseHM(eventTime.getTime() + 60 * 60 * 1000),
    },
    {
      ...mockEvent,
      id: '2',
      date: formatDate(eventTime),
      startTime: parseHM(eventTime.getTime()),
      endTime: parseHM(eventTime.getTime() + 60 * 60 * 1000),
    },
  ];

  const { result } = renderHook(() => useNotifications(testEvents));

  act(() => {
    mockIntervalCallback();
  });

  expect(result.current.notifications).toHaveLength(2);

  act(() => {
    result.current.removeNotification(0);
  });

  expect(result.current.notifications).toHaveLength(1);
  expect(result.current.notifications[0].id).toBe('2');
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const now = new Date();
  const eventTime = new Date(now.getTime() + 10 * 60 * 1000);

  const testEvent: Event = {
    ...mockEvent,
    id: '1',
    date: formatDate(eventTime),
    startTime: parseHM(eventTime.getTime()),
    endTime: parseHM(eventTime.getTime() + 60 * 60 * 1000),
  };

  const { result } = renderHook(() => useNotifications([testEvent]));

  // 첫 번째 알림 발생
  act(() => {
    mockIntervalCallback();
  });

  expect(result.current.notifications).toHaveLength(1);
  const firstNotificationCount = result.current.notifications.length;

  // 두 번째 interval 실행
  act(() => {
    mockIntervalCallback();
  });

  // 알림 개수가 증가하지 않아야 함
  expect(result.current.notifications).toHaveLength(firstNotificationCount);
  expect(result.current.notifiedEvents).toContain('1');
});
