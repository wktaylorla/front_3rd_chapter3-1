import { act, renderHook } from '@testing-library/react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';

const mockEvents: Event[] = [
  {
    id: '1',
    title: '이벤트 1',
    date: '2024-07-01',
    startTime: '09:00',
    endTime: '10:00',
    description: '테스트 이벤트 1 설명(점심)',
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
    description: '회의실?',
    location: '어딘가',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '3',
    title: '팀 회의실',
    date: '2024-07-20',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '집',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
  {
    id: '4',
    title: 'English Study',
    date: '2024-07-27',
    startTime: '10:00',
    endTime: '11:00',
    description: '주간 팀 미팅',
    location: '회의실 A',
    category: '업무',
    repeat: { type: 'none', interval: 0 },
    notificationTime: 1,
  },
];

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch([], new Date('2024-10-01'), 'month'));

  expect(result.current.filteredEvents).toEqual([]);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, new Date('2024-07-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('이벤트 1');
  });

  expect(result.current.filteredEvents).toEqual([mockEvents[0]]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, new Date('2024-07-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의실');
  });

  expect(result.current.filteredEvents).toEqual([mockEvents[1], mockEvents[2], mockEvents[3]]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const { result } = renderHook(() => useSearch(mockEvents, new Date('2024-07-01'), 'week'));

  expect(result.current.filteredEvents).toEqual([mockEvents[0], mockEvents[1]]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const { result } = renderHook(() => useSearch(mockEvents, new Date('2024-07-01'), 'month'));

  act(() => {
    result.current.setSearchTerm('회의');
  });

  expect(result.current.filteredEvents).toEqual([mockEvents[1], mockEvents[2], mockEvents[3]]);

  act(() => {
    result.current.setSearchTerm('점심');
  });

  expect(result.current.filteredEvents).toEqual([mockEvents[0]]);
});
