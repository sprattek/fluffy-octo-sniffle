import { useControl } from 'react-map-gl/maplibre';
import MaplibreGeocoder, {
	CarmenGeojsonFeature,
	MaplibreGeocoderApi,
	MaplibreGeocoderApiConfig,
	MaplibreGeocoderFeatureResults,
	MaplibreGeocoderOptions,
} from '@maplibre/maplibre-gl-geocoder';
import '@maplibre/maplibre-gl-geocoder/dist/maplibre-gl-geocoder.css';
import { ControlPosition } from 'maplibre-gl';

type GeocoderControlProps = Omit<
	MaplibreGeocoderOptions,
	'maplibregl' | 'marker'
> & {
	position: ControlPosition;
	predefinedAddress: string;
	onLoading?: (e: object) => void;
	onResults?: (e: object) => void;
	onResult?: (e: object) => void;
	onError?: (e: object) => void;
};

/* eslint-disable camelcase */
const geocoderApi: MaplibreGeocoderApi = {
	forwardGeocode: async (
		config: MaplibreGeocoderApiConfig
	): Promise<MaplibreGeocoderFeatureResults> => {
		const features: CarmenGeojsonFeature[] = [];
		try {
			const request = `https://nominatim.openstreetmap.org/search?q=${config.query}&format=geojson&polygon_geojson=1&addressdetails=1`;
			const response = await fetch(request);
			const geojson = await response.json();
			for (const feature of geojson.features) {
				const center = [
					feature.bbox[0] + (feature.bbox[2] - feature.bbox[0]) / 2,
					feature.bbox[1] + (feature.bbox[3] - feature.bbox[1]) / 2,
				];
				let point: CarmenGeojsonFeature & { center: number[] } = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: center,
					},
					place_name: feature.properties.display_name,
					properties: feature.properties,
					text: feature.properties.display_name,
					place_type: ['place'],
					id: feature.id,
					center,
				};
				features.push(point);
			}
		} catch (e) {
			console.error(`Failed to forwardGeocode with error: ${e}`); // eslint-disable-line
		}

		return {
			type: 'FeatureCollection',
			features: features,
		};
	},
};

/* eslint-disable complexity,max-statements */
export default function GeocoderControl(props: GeocoderControlProps) {
	const geocoder = useControl<MaplibreGeocoder>(
		({}) => {
			const ctrl = new MaplibreGeocoder(geocoderApi, {
				...props,
				marker: false,
			});
			if (props.onLoading) ctrl.on('loading', props.onLoading);
			if (props.onResults) ctrl.on('results', props.onResults);
			if (props.onResult) ctrl.on('result', props.onResult);
			if (props.onError) ctrl.on('error', props.onError);
			return ctrl;
		},
		{
			position: props.position,
		}
	);

	// @ts-ignore (TS2339) private member
	if (geocoder._map) {
		// @ts-ignore (TS2339) private member
		const inputEl = geocoder._inputEl;
		// @ts-ignore (TS2339) private member
		const containerEl = geocoder.container;
		if (inputEl) {
			inputEl.classList = `${inputEl.classList} p-3 px-8 border! border-gray-300! rounded-md! focus:ring-primary! focus:border-primary! sm:text-sm! focus:outline-0!`;
		}
		if (containerEl) {
			containerEl.classList = `${containerEl.classList} shadow-sm! rounded-md!`;
		}
		if (
			geocoder.getProximity() !== props.proximity &&
			props.proximity !== undefined
		) {
			geocoder.setProximity(props.proximity);
		}
		if (
			geocoder.getRenderFunction() !== props.render &&
			props.render !== undefined
		) {
			geocoder.setRenderFunction(props.render);
		}
		if (
			geocoder.getLanguage() !== props.language &&
			props.language !== undefined
		) {
			geocoder.setLanguage(props.language);
		}
		if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
			geocoder.setZoom(props.zoom);
		}
		if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
			geocoder.setFlyTo(props.flyTo);
		}
		if (
			geocoder.getPlaceholder() !== props.placeholder &&
			props.placeholder !== undefined
		) {
			geocoder.setPlaceholder(props.placeholder);
		}
		if (
			geocoder.getCountries() !== props.countries &&
			props.countries !== undefined
		) {
			geocoder.setCountries(props.countries);
		}
		if (geocoder.getTypes() !== props.types && props.types !== undefined) {
			geocoder.setTypes(props.types);
		}
		if (
			geocoder.getMinLength() !== props.minLength &&
			props.minLength !== undefined
		) {
			geocoder.setMinLength(props.minLength);
		}
		if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
			geocoder.setLimit(props.limit);
		}
		if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
			geocoder.setFilter(props.filter);
		}
		// if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
		//   geocoder.setOrigin(props.origin);
		// }
		// if (geocoder.getAutocomplete() !== props.autocomplete && props.autocomplete !== undefined) {
		//   geocoder.setAutocomplete(props.autocomplete);
		// }
		// if (geocoder.getFuzzyMatch() !== props.fuzzyMatch && props.fuzzyMatch !== undefined) {
		//   geocoder.setFuzzyMatch(props.fuzzyMatch);
		// }
		// if (geocoder.getRouting() !== props.routing && props.routing !== undefined) {
		//   geocoder.setRouting(props.routing);
		// }
		// if (geocoder.getWorldview() !== props.worldview && props.worldview !== undefined) {
		//   geocoder.setWorldview(props.worldview);
		// }
	}
	return <></>;
}

const noop = () => {};

GeocoderControl.defaultProps = {
	marker: true,
	onLoading: noop,
	onResults: noop,
	onResult: noop,
	onError: noop,
};
