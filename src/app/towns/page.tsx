'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { countryIDToClassName } from '@/lib/utils';
import './page.css';
import '/node_modules/flag-icons/css/flag-icons.min.css';

type TownBasic = {
	data_id: number;
	version: number;
	name: string;
	uploader: string;
	creation_time: string;
	update_time: string;
	last_visit_time: string;
	visits: number;
	country_id: number;
}

const columns: ColumnDef<TownBasic>[] = [
	{
		accessorKey: 'data_id',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Data ID
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		}
	},
	{
		accessorKey: 'version',
		header: 'Version'
	},
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'uploader',
		header: 'Uploader'
	},
	{
		accessorKey: 'creation_time',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Created
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		}
	},
	{
		accessorKey: 'update_time',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Updated
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		}
	},
	{
		accessorKey: 'last_visit_time',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Last Visit
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		}
	},
	{
		accessorKey: 'visits',
		header: ({ column }) => {
			return (
				<Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Visits
					<ArrowUpDown className='ml-2 h-4 w-4' />
				</Button>
			)
		}
	},
	{
		accessorKey: 'country_id',
		header: 'Country',
		cell: ({ row }) => {
			const countryID = parseInt(row.getValue('country_id'));

			return <span className={countryIDToClassName(countryID)}></span>
		}
	},
	{
		accessorKey: 'details_link',
		header: '',
		cell: ({ row }) => {
			const dataID = row.getValue('data_id');
			const version = row.getValue('version');
			const href = `/town/${dataID}/${version}`;

			return (
				<Button asChild>
					<Link href={href}>Details</Link>
				</Button>
			)
		}
	}
];

function SkeletonLoader() {
	const skeletonRows = Array.from({ length: 10 });

	return (
		<div className='container mx-auto py-10'>
			<div className='rounded-md border'>
				<div className='skeleton-loader p-4'>
					<div className='skeleton skeleton-header'></div>
						{skeletonRows.map((_, index) => (
							<div key={index} className='flex gap-4 mb-2'>
								<div className='skeleton skeleton-cell'></div>
								<div className='skeleton skeleton-cell'></div>
								<div className='skeleton skeleton-cell'></div>
								<div className='skeleton skeleton-cell'></div>
								<div className='skeleton skeleton-cell'></div>
							</div>
						))}
				</div>
			</div>
		</div>
	);
};

export default function TownsPage() {
	const [data, setData] = useState<TownBasic[] | null>(null);
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		fetch('/api/towns')
			.then((res) => res.json())
			.then((data) => {
				setData(data);
				setLoading(false);
			});
	}, []);

	if (isLoading) {
		return <SkeletonLoader />
	}

	if (!data || data.length === 0) {
		// TODO - Better error
		return <p>No towns to display</p>
	}

	// TODO - Style this page better

	return (
		<div className='container mx-auto py-10'>
			<DataTable columns={columns} data={data} />
		</div>
	);
}
