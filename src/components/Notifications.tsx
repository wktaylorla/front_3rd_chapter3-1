import { Alert, AlertIcon, AlertTitle, Box, CloseButton, VStack } from '@chakra-ui/react';

import { Notification } from '../types';

interface Props {
  notifications: Notification[];
  closeNotification: (index: number) => void;
}

interface NotificationProps {
  notification: Notification;
  index: number;
  closeNotification: (index: number) => void;
}

const Notifications = ({ notifications, closeNotification }: Props) => {
  if (notifications.length < 1) return null;

  return (
    <VStack position="fixed" top={4} right={4} spacing={2} align="flex-end">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          index={index}
          closeNotification={closeNotification}
        />
      ))}
    </VStack>
  );
};

export default Notifications;

const NotificationItem = ({ notification, index, closeNotification }: NotificationProps) => {
  return (
    <Alert key={index} status="info" variant="solid" width="auto">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle fontSize="sm">{notification.message}</AlertTitle>
      </Box>
      <CloseButton onClick={() => closeNotification(index)} />
    </Alert>
  );
};
