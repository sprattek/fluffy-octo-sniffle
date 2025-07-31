import Map, {
	GeolocateControl,
	Marker,
	MarkerDragEvent,
	NavigationControl,
	Popup,
} from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { cn } from '@workspace/ui/lib/utils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { useCallback, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { FaMapMarkerAlt } from 'react-icons/fa';
import type maplibregl from 'maplibre-gl';
import GeocoderControl from './geocoderControl';
import { CarmenGeojsonFeature } from '@maplibre/maplibre-gl-geocoder';

function MapComponent({
	className,
	...props
}: {
	className?: string;
	props?: React.ComponentProps<'div'>;
}) {
	const [marker, setMarker] = useState({ latitude: 0, longitude: 0 });
	const [showPopup, setShowPopup] = useState(false);
	const [address, setAddress] = useState('');
	const [basemapEnum, setBasemapEnum] = useState('streets-v2');
	const apiKey = process.env.NEXT_PUBLIC_MAPTILER_API_KEY;

	const geolocateControlRef = useCallback(
		(ref: maplibregl.GeolocateControl) => {
			if (ref) {
				setTimeout(() => {
					ref.trigger();
				}, 1000);
			}
		},
		[]
	);

	const onGeolocateHandler = useCallback(async (e: GeolocationPosition) => {
		setShowPopup(true);
		onLocationChange({
			lat: e.coords.latitude,
			lng: e.coords.longitude,
		});
	}, []);

	const onMarkerDragStart = useCallback((e: MarkerDragEvent) => {
		setShowPopup(false);
	}, []);

	const onMarkerDrag = useCallback((e: MarkerDragEvent) => {
		setMarker({
			longitude: e.lngLat.lng,
			latitude: e.lngLat.lat,
		});
	}, []);

	const onMarkerDragEnd = useCallback(async (e: MarkerDragEvent) => {
		onLocationChange({
			lat: e.lngLat.lat,
			lng: e.lngLat.lng,
		});
	}, []);

	const onGeocoderResultHandler = useCallback(
		({ result }: { result: CarmenGeojsonFeature & { center: number[] } }) => {
			onLocationChange({
				lat: result.center[1]!,
				lng: result.center[0]!,
			});
		},
		[]
	);

	const onLocationChange = async ({
		lat,
		lng,
	}: {
		lat: number;
		lng: number;
	}) => {
		setMarker({
			latitude: lat,
			longitude: lng,
		});
		/*const location = await geoService.locationToAddress({
			lat,
			lng,
		});
		setAddress(location.address);*/
	};

	const filterGeocoderResult = (item: CarmenGeojsonFeature) => {
		return item.properties?.address?.country === 'Slovakia';
	};

	return (
		<div className={cn('relative', className)} {...props}>
			<Map
				initialViewState={{
					longitude: 19.6891647,
					latitude: 48.6430983,
					zoom: 7,
				}}
				mapStyle={`https://api.maptiler.com/maps/${basemapEnum}/style.json?key=${apiKey}`}
				style={{ width: '100%', height: 600 }}
			>
				{marker.latitude && marker.longitude && (
					<Marker
						longitude={marker.longitude}
						latitude={marker.latitude}
						draggable={true}
						onDragStart={onMarkerDragStart}
						onDrag={onMarkerDrag}
						onDragEnd={onMarkerDragEnd}
						anchor='bottom'
					>
						<FaMapMarkerAlt className='text-primary text-3xl' />
					</Marker>
				)}
				{showPopup && (
					<Popup
						longitude={marker.longitude}
						latitude={marker.latitude}
						anchor='top'
						closeButton={false}
						className='text-background'
					>
						Drag me to firepit location
					</Popup>
				)}
				<GeocoderControl
					onResult={(e) => {
						const result = (
							e as { result: CarmenGeojsonFeature & { center: number[] } }
						).result as CarmenGeojsonFeature & { center: number[] };
						onGeocoderResultHandler({ result });
					}}
					predefinedAddress={address}
					position='top-right'
					placeholder='Search...'
					countries='sk'
					language='sk-SK'
					showResultsWhileTyping={true}
					debounceSearch={500}
					limit={5}
					bbox={[16.8799829444, 47.7584288601, 22.5581376482, 49.5715740017]}
					filter={filterGeocoderResult}
				/>
				<GeolocateControl
					ref={geolocateControlRef}
					showAccuracyCircle={false}
					showUserLocation={false}
					onGeolocate={onGeolocateHandler}
				/>
				<NavigationControl />
			</Map>
			<Popover>
				<PopoverTrigger asChild className='absolute top-2 left-2'>
					<Button variant='default'>Map Type</Button>
				</PopoverTrigger>

				<PopoverContent className='w-auto' align='start'>
					<div className='flex flex-row gap-2'>
						<Button
							variant='outline'
							onClick={() => setBasemapEnum('streets-v2')}
						>
							Default
						</Button>
						<Button
							variant='outline'
							onClick={() => setBasemapEnum('satellite')}
						>
							Satellite
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

export { MapComponent };
