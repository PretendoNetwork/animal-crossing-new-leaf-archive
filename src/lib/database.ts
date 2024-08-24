import path from 'node:path';
import Database from 'better-sqlite3';

const database = new Database(path.resolve(process.cwd(), 'data', 'datastore.sqlite'), {
	readonly: true
});

export default database;