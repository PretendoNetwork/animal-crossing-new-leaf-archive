import Database from 'better-sqlite3';
import path from 'path';

const database = new Database(path.resolve(process.cwd(), 'data', 'datastore.sqlite'), {
	readonly: true
});

export default database;