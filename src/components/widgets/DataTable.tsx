import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { selectedRowsAtom } from '@/lib/atoms'
import { ITask } from '@/types/tasks'
import {
	ColumnDef,
	Row,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { useAtom } from 'jotai'
import { Loader } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'

interface DataTableProps {
	columns: ColumnDef<ITask>[]
	data: ITask[]
	isLoading?: boolean
	onRowClick?: (row: Row<ITask>) => void
}

export default function DataTable({ data, columns, onRowClick, isLoading }: DataTableProps) {
	const [rowSelection, setRowSelection] = useAtom(selectedRowsAtom)
	const [pagination, setPagination] = useState({
		pageIndex: 0,
		pageSize: 10,
	})

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		// getPaginationRowModel: getPaginationRowModel(),
		// onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id,
		// columnResizeMode: 'onChange',
		// columnResizeDirection: 'ltr',
		state: {
			// pagination,
			rowSelection,
		},
	})

	return (
		<div className="w-full overflow-auto flex-1">
			<Table
				className=""
				{...{
					style: {
						// width: table.getCenterTotalSize(),
					},
				}}
			>
				<TableHeader className="">
					{table.getHeaderGroups().map((headerGroup) => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<TableHead
									key={header.id}
									className="text-xs h-8 relative"
									style={{
										width: header.getSize(),
									}}
								>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}

									{/* {header.column.getCanResize() && (
										<div
											{...{
												onDoubleClick: () => header.column.resetSize(),
												onMouseDown: header.getResizeHandler(),
												onTouchStart: header.getResizeHandler(),
												className: `resizer ${
													header.column.getIsResizing()
														? 'isResizing'
														: ''
												}`,
											}}
										/>
									)} */}
								</TableHead>
							))}
						</TableRow>
					))}
				</TableHeader>

				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell colSpan={columns.length} className="">
								<div className="grid place-content-center h-40">
									<Loader className="h-5 w-5 animate-spin" />
								</div>
							</TableCell>
						</TableRow>
					) : table.getRowModel().rows.length ? (
						table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() && 'selected'}
								onClick={() => onRowClick?.(row)}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={columns.length} className="h-24 text-center">
								No results.
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* <div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredRowModel().rows.length} task(s) present
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div> */}
		</div>
	)
}
