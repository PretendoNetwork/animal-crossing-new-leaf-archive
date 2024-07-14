import { NextResponse } from 'next/server';
import database from '@/lib/database';

export async function GET() {
	// * This kinda sucks ass.  Mostly a hack and I don't fully understand
	// * what it does or why it works. But it works, so. Here it is for now
	// TODO - Make this not suck ass, I suck at SQL
	const query = `
	/*
		Towns have many tags, some of which represent the players country/area.
		Some towns have a tag prefixed with "UL_C" followed by a 4 digit number.
		Some towns have a tag prefixed with "DL_C" followed by a 4 digit number.
		Some towns seem to have both "UL_C" and "DL_C" tags.
		The 4 digit numbers are the players decimal country ID, padded with "0".
		This query gets all the object tags in a way that makes it possible to
		link either a "UL_C" or "DL_C" tag to an object to get it's country ID.
	*/
	WITH ObjectTags AS (
		SELECT
			data_id,
			version,
			tag,
			ROW_NUMBER() OVER (PARTITION BY data_id, version ORDER BY tag) AS rn
		FROM
			tags
		WHERE
			tag LIKE 'UL_C%' OR tag LIKE 'DL_C%'
	)
	SELECT
		objects.data_id,
		objects.version,
		SUBSTR(objects.name, 1, INSTR(objects.name, '@') - 1) AS name, -- "name" is in the format "TownName@PlayerName". This gets "TownName"
		SUBSTR(objects.name, INSTR(objects.name, '@') + 1) AS uploader, -- This gets "PlayerName" and accounts for names with the "@" symbol
		objects.create_time_standard AS creation_time,
		objects.update_time_standard AS update_time,
		objects.referred_time_standard AS last_visit_time,
		objects.referred_count AS visits,
		CAST(SUBSTR(ObjectTags.tag, INSTR(ObjectTags.tag, '_') + 2) AS INTEGER) AS country_id -- Converts the players country tag to an integer ID
	FROM
		objects
	LEFT JOIN ObjectTags -- Filter duplicate rows from the tags querying
		ON objects.data_id = ObjectTags.data_id
		AND objects.version = ObjectTags.version
		AND ObjectTags.rn = 1
	`;

	const data = database.prepare(query).all();

	return NextResponse.json(data);
}