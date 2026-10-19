import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly fcmProjectId: string;
  private readonly fcmClientEmail: string;
  private readonly fcmPrivateKey: string;

  constructor(
    private readonly configService: ConfigService,
  ) {
		this.fcmProjectId = this.configService.getOrThrow<string>('FCM_PROJECT_ID');
		this.fcmClientEmail = this.configService.getOrThrow<string>('FCM_CLIENT_EMAIL');
		this.fcmPrivateKey = this.configService.getOrThrow<string>('FCM_PRIVATE_KEY');
  }

  onModuleInit() {
    if (!getApps.length) {
      initializeApp({
        credential: cert({
          projectId: this.fcmProjectId,
          clientEmail: this.fcmClientEmail,
          privateKey: this.fcmPrivateKey.replace(/\\n/g, '\n'),
        }),
      });

      this.logger.log('Firebase Admin SDK successfully iniated');
    }
  }

  async sendPushNotification(
    targetToken: string,
    title: string,
    body: string,
    dataPayload?: Record<string, string>,
  ) {
    if (!targetToken) {
      this.logger.warn('Failed to send FCM: mobile token null');
      return false;
    }

    try {
      const response = await getMessaging().send({
        token: targetToken,
        notification: {
          title,
          body,
        },
        data: dataPayload,
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'telemetry_alerts',
          },
        },
      });

      this.logger.log(`FCM SUCCESS. Message ID: ${response}`);
      return true;
    } catch (error) {
      this.logger.error(`FCM ERROR. Failed to send notification with token ${targetToken}:`, error);
      return false;
    }
  }
}
