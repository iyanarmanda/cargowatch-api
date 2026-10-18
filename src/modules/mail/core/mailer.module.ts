import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerModule as NodeMailer } from '@nestjs-modules/mailer';

@Module({
  imports: [
    NodeMailer.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>('SMTP_HOST'),
          port: configService.getOrThrow<number>('SMTP_PORT'),
          secure: configService.get<boolean>('SMTP_SECURE', false),
          auth: {
            user: configService.getOrThrow<string>('SMTP_USER'),
            pass: configService.getOrThrow<string>('SMTP_PASS'),
          },
        },
        defaults: {
          from: configService.get<string>(
            'MAIL_FROM',
            '"No Reply" <noreply@example.com>',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MailerModule {}
