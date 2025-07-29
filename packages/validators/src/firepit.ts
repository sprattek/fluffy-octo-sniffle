import { z } from 'zod';

export const firepitSchema = z.object({
	name: z
		.string({ required_error: 'Name is required' })
		.min(2, 'Name must be at least 2 characters'),
	description: z.optional(z.string()),
	latitude: z.coerce
		.number({ required_error: 'Latitude is required' })
		.min(-90, 'Latitude must be between -90 and 90')
		.max(90, 'Latitude must be between -90 and 90'),
	longitude: z.coerce
		.number({ required_error: 'Longitude is required' })
		.min(-180, 'Longitude must be between -180 and 180')
		.max(180, 'Longitude must be between -180 and 180'),
	city: z
		.string({ required_error: 'City is required' })
		.min(2, 'City is required'),
	pricePerDay: z.optional(z.coerce.number()),
	optimalNumberOfVisitors: z.optional(z.coerce.number()),
});

export type FirepitSchemaModel = z.infer<typeof firepitSchema>;
