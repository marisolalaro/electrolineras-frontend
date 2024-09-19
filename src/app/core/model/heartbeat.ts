export class Heartbeat {
  sessionIndex: string;
  heartbeatRequest: HeartbeatRequest;
  heartbeatConfirmation: HeartbeatConfirmation;
}

interface HeartbeatConfirmation {
  currentTime: null;
}

interface HeartbeatRequest {
}