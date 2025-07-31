import { Request, Response } from 'express';
import { z } from 'zod';

const geoAutocompleteHandler = async (req: Request, res: Response) => {
	const parsed = z.object({ address: z.string().min(3) }).safeParse(req.query);

	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}

	const { address } = parsed.data;

	try {
		const url = `https://api.locationiq.com/v1/autocomplete?key=${process.env.LOCATIONIQ_KEY}&q=${address}&limit=5&dedupe=1&countrycodes=SK`;
		const geocoded = await fetch(url);
		const data = await geocoded.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to geolocate' });
	}
};

const geoSearchHandler = async (req: Request, res: Response) => {
	const parsed = z.object({ address: z.string().min(3) }).safeParse(req.query);

	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}

	const { address } = parsed.data;

	try {
		const url = `https://eu1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_KEY}&q=${address}&format=json&countrycodes=SK`;
		const geocoded = await fetch(url);
		const data = await geocoded.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to geolocate' });
	}
};

const geoReverseHandler = async (req: Request, res: Response) => {
	const parsed = z
		.object({
			latitude: z.coerce
				.number({ required_error: 'Latitude is required' })
				.min(-90, 'Latitude must be between -90 and 90')
				.max(90, 'Latitude must be between -90 and 90'),
			longitude: z.coerce
				.number({ required_error: 'Longitude is required' })
				.min(-180, 'Longitude must be between -180 and 180')
				.max(180, 'Longitude must be between -180 and 180'),
		})
		.safeParse(req.query);

	if (!parsed.success) {
		return res.status(400).json({ error: parsed.error.flatten() });
	}

	const { latitude, longitude } = parsed.data;

	try {
		const url = `https://eu1.locationiq.com/v1/reverse?key=${process.env.LOCATIONIQ_KEY}&lat=${latitude}&lon=${longitude}&format=json`;
		const geocoded = await fetch(url);
		const data = await geocoded.json();
		res.status(200).json(data);
	} catch (error) {
		res.status(500).json({ error: 'Failed to geolocate' });
	}
};

export { geoAutocompleteHandler, geoSearchHandler, geoReverseHandler };
