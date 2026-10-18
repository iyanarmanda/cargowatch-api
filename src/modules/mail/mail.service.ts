import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import Handlebars from 'handlebars';
import mjml2html from 'mjml';
import fs from 'node:fs/promises';
import path from 'node:path';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly mailDomain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {
		this.mailDomain = this.configService.getOrThrow<string>('MAIL_DOMAIN');
  }

  private async renderMjmlTemplate(
    templateName: string,
    context: Record<string, unknown>,
  ): Promise<string> {
    try {
      const templatePath = path.join(
        process.cwd(),
        'src',
        'modules',
        'mail',
        'templates',
        `${templateName}.mjml`,
      );

      const mjmlRaw = await fs.readFile(templatePath, 'utf8');

      const compiledTemplate = Handlebars.compile(mjmlRaw);
      const mjmlWithData = compiledTemplate(context);

      const { html, errors } = await mjml2html(mjmlWithData);

      if (errors.length > 0) {
        this.logger.warn('MJML Compilation Warnings:', errors);
      }

      return html;
    } catch (error) {
      throw new InternalServerErrorException(
        `Fail to compile email template: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  async sendPasswordEmail(
    email: string,
    name: string,
    role: string,
    plainPassword: string,
  ) {
    const htmlContent = await this.renderMjmlTemplate('user-registered', {
      email,
      name,
      role,
      plainPassword,
      currentYear: new Date().getFullYear(),
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'Account Access & Your Temporary Password',
      html: htmlContent,
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@${this.mailDomain}>, <https://${this.mailDomain}/unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
  }

  async sendTestEmail(email: string, name: string) {
    const htmlContent = await this.renderMjmlTemplate('test-dispatch', {
      name,
      currentYear: new Date().getFullYear(),
    });

    await this.mailerService.sendMail({
      to: email,
      subject: 'CargoWatch Fleet Telemetry Status Update',
      html: htmlContent,
      text: `Hello ${name}, this is a routine operational report from CargoWatch Surabaya Hub. Telemetry systems are fully operational.`,
      headers: {
        'List-Unsubscribe': `<mailto:unsubscribe@${this.mailDomain}>, <https://${this.mailDomain}/unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      },
    });
  }
}
