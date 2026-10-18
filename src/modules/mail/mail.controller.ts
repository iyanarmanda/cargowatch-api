import { Body, Controller, Post } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TestDispatchEvent } from './events/test-dispatch.event.js';

export class SendTestEmailDto {
  email: string;
  name: string;
}

@Controller({
  path: 'mail',
  version: '1'
})
export class MailController {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  @Post('test')
  async triggerTestEmail(@Body() dto: SendTestEmailDto) {
    this.eventEmitter.emit(
      'test.dispatch',
      new TestDispatchEvent(dto.email, dto.name),
    );

    return {
      message: 'Email sended successfully',
      target: dto.email,
    };
  }
}
