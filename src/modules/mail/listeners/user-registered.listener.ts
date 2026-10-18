import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from '../../auth/events/user-registered.event.js';
import { MailService } from '../mail.service.js';

@Injectable()
export class UserRegisteredListener {
  private readonly logger = new Logger(UserRegisteredListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent('user.registered', { async: true })
  async handleUserRegisteredEvent(event: UserRegisteredEvent) {
    try {
      this.logger.log(`Send email at ${event.email}...`);
      
      await this.mailService.sendPasswordEmail(
        event.email,
        event.name,
        event.role,
        event.plainPassword,
      );

      this.logger.log(`Success to send email at ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send email at ${event.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
