import { Module } from '@nestjs/common';
import { MailerModule } from './core/mailer.module.js';
import { MailService } from './mail.service.js';
import { MailController } from './mail.controller.js';
import { UserRegisteredListener } from './listeners/user-registered.listener.js';
import { TestDispatchListener } from './listeners/test-dispatch.listener.js';

@Module({
  imports: [MailerModule],
  providers: [MailService, UserRegisteredListener, TestDispatchListener],
  controllers: [MailController],
})
export class MailModule {}
