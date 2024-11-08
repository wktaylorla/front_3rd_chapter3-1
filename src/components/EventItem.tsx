import { BellIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, HStack, VStack, Text, IconButton } from '@chakra-ui/react';

import { notificationOptions } from '../constants';
import { Event } from '../types';

interface Props {
  event: Event;
  notifiedEvents: string[];
  editEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
}

const EventItem = ({ event, notifiedEvents, editEvent, deleteEvent }: Props) => {
  const { id, title, date, startTime, endTime, description, location, category, repeat } = event;
  const isNotified = notifiedEvents.includes(id);

  return (
    <Box key={id} borderWidth={1} borderRadius="lg" p={3} width="100%">
      <HStack justifyContent="space-between">
        <VStack align="start">
          <HStack>
            {isNotified && <BellIcon color="red.500" />}
            <Text
              fontWeight={isNotified ? 'bold' : 'normal'}
              color={isNotified ? 'red.500' : 'inherit'}
            >
              {title}
            </Text>
          </HStack>
          <Text>{date}</Text>
          <Text>
            {startTime} - {endTime}
          </Text>
          <Text>{description}</Text>
          <Text>{location}</Text>
          <Text>카테고리: {category}</Text>
          {repeat.type !== 'none' && (
            <Text>
              반복: {repeat.interval}
              {repeat.type === 'daily' && '일'}
              {repeat.type === 'weekly' && '주'}
              {repeat.type === 'monthly' && '월'}
              {repeat.type === 'yearly' && '년'}
              마다
              {repeat.endDate && ` (종료: ${repeat.endDate})`}
            </Text>
          )}
          <Text>
            알림:{' '}
            {notificationOptions.find((option) => option.value === event.notificationTime)?.label}
          </Text>
        </VStack>
        <HStack>
          <IconButton
            aria-label="Edit event"
            icon={<EditIcon />}
            onClick={() => editEvent(event)}
          />
          <IconButton
            aria-label="Delete event"
            icon={<DeleteIcon />}
            onClick={() => deleteEvent(event.id)}
          />
        </HStack>
      </HStack>
    </Box>
  );
};

export default EventItem;
