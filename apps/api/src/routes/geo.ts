import express, { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import {
	geoAutocompleteHandler,
	geoReverseHandler,
	geoSearchHandler,
} from '../controllers/geo';

const router: express.Router = Router();

// GET /geo/autocomplete
router.get('/autocomplete', requireAuth, requireAuth, geoAutocompleteHandler);
// GET /geo/search
router.get('/search', requireAuth, requireAuth, geoSearchHandler);
// GET /geo/reverse
router.get('/reverse', requireAuth, requireAuth, geoReverseHandler);

export default router;
