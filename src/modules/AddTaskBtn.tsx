import { MotionButton } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { PlusIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'
import SaveTaskDrawer from './SaveTaskDrawer'

export default function AddTaskBtn() {
	const [isAddOpen, setIsAddOpen] = useState(false)

	return (
		<Popover open={isAddOpen} onOpenChange={setIsAddOpen} modal={false}>
			<PopoverTrigger asChild>
				<MotionButton
					whileTap={{ scale: 0.98 }}
					size="sm"
					className="rounded-full px-3 gap-1"
					onClick={() => {
						setIsAddOpen(true)
					}}
				>
					<motion.div
						initial={{ rotate: 0 }}
						animate={{ rotate: isAddOpen ? 90 : 0, transition: { duration: 0.3 } }}
					>
						<PlusIcon className="h-3 w-3" />
					</motion.div>
					<span>Add task</span>
				</MotionButton>
			</PopoverTrigger>

			<PopoverContent align="end" className="p-0 shadow-xl">
				<SaveTaskDrawer onClose={() => setIsAddOpen(false)} />
			</PopoverContent>
		</Popover>
	)
}
