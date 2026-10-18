import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TestDispatchEvent } from '../events/test-dispatch.event.js';
import { MailService } from '../mail.service.js';

@Injectable()
export class TestDispatchListener {
  private readonly logger = new Logger(TestDispatchListener.name);

  constructor(private readonly mailService: MailService) {}

  @OnEvent('test.dispatch', { async: true })
  async handleTestDispatchEvent(event: TestDispatchEvent) {
    try {
      this.logger.log(`Send test email ke ${event.email}...`);
      await this.mailService.sendTestEmail(event.email, event.name);
      this.logger.log(`Test email sended at ${event.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send test email at ${event.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
