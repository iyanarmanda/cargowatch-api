import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
	constructor(private schema: ZodSchema) {}

	transform(value: unknown, _metadata: ArgumentMetadata) {
		const result = this.schema.safeParse(value);

		if (!result.success) {
			const formattedErrors = result.error.issues.map((issue) => ({
				path: issue.path.join('.'),
				message: issue.message,
			}));

			throw new BadRequestException({
				message: 'Validation failed',
				errors: formattedErrors,
			});
		}

		return result.data;
	}
}
