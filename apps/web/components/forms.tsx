import { cn } from '@workspace/ui/lib/utils';

function FormBlock({
	title,
	description,
	children,
	className,
	...props
}: {
	title: string;
	description?: string;
	children?: React.ReactNode;
	className?: string;
	props?: React.ComponentProps<'div'>;
}) {
	return (
		<div
			className={cn(
				'grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 dark:border-gray-400/10 pb-12 md:grid-cols-3',
				className
			)}
			{...props}
		>
			<div>
				<h2 className='text-base/7 font-semibold text-gray-900 dark:text-gray-400'>
					{title}
				</h2>
				{description && (
					<p className='mt-1 text-sm/6 text-gray-600'>{description}</p>
				)}
			</div>

			<div className='grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2'>
				{children}
			</div>
		</div>
	);
}

export { FormBlock };
