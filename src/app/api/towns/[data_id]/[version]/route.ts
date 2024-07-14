import { NextRequest, NextResponse } from 'next/server';
import database from '@/lib/database';

type objectResult = {
	data_id: number;
	version: number;
	owner_id: number;
	size: number;
	name: string;
	data_type: number;
	meta_binary: string;
	access_permission: number;
	update_permission: number;
	create_time_original: number;
	create_time_standard: string;
	update_time_original: number;
	update_time_standard: string;
	period: number;
	status: number;
	referred_count: number;
	refer_data_id: number;
	flag: number;
	referred_time_original: number;
	referred_time_standard: string;
	expire_time_original: number;
	expire_time_standard: string;
};

export async function GET(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const [ dataID, version ] = pathname.split('/').slice(-2);

	// * We're only getting the data of one object, so
	// * we don't have to do any fancy SQL tricks to get
	// * good performance. We can just handle it in code

	const object = database.prepare<unknown[], objectResult>('SELECT * FROM objects WHERE data_id = ? AND version = ?').get(dataID, version);

	if (!object) {
		return NextResponse.json({
			error: 'Invalid DataID or version'
		});
	}

	const tags = database.prepare<unknown[], { value: string; }>('SELECT tag as value FROM tags WHERE data_id = ? AND version = ?').all(dataID, version);
	const versions = database.prepare<unknown[], { version: number }>('SELECT version FROM objects WHERE data_id = ?').all(dataID).map(({ version }) => version);

	const country = tags.find(({ value }) => value.startsWith('UL_C') || value.startsWith('DL_C'))?.value.slice(4);
	const countryID = country ? parseInt(country) : 0;
	const villagers = tags.filter(({ value }) => value.startsWith('P')).map(({ value }) => value.slice(1));

	return NextResponse.json({
		data_id: object.data_id,
		version: object.version,
		name: object.name.split('@')[0],
		uploader: object.name.split('@').slice(1).join('@'),
		creation_time: object.create_time_standard,
		update_time: object.update_time_standard,
		last_visit_time: object.referred_time_standard,
		visits: object.referred_count,
		country_id: countryID,
		villagers,
		versions: versions
	});
}