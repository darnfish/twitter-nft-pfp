import { DragEventHandler, useEffect, useRef, useState } from 'react'

import useMobileDetect from 'use-mobile-detect-hook'

export default function App() {
	// Hooks
	const detectMobile = useMobileDetect()

	// State
	const [uploaded, setUploaded] = useState(false)

	// Refs
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const saveImageRef = useRef<HTMLAnchorElement>(null)
	const frameImageRef = useRef<HTMLImageElement>(null)

	const pfpImageRef = useRef<HTMLImageElement>(null)
	const pfpUploadRef = useRef<HTMLInputElement>(null)

	// Profile image stuff
	function showUploadPrompt() {
		pfpUploadRef.current.click()
	}

	function onProfileImageUploaded(event) {
		const file = (event.dataTransfer || event.target).files[0]
		if(!file)
			return

		const fileUrl = URL.createObjectURL(file)
		pfpImageRef.current.src = fileUrl

		if(!uploaded)
			setUploaded(true)
	}

	// Drag and drop
	function handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()

		onProfileImageUploaded(e)
  }

	// Canvas
	function draw() {
		// Get width + height of image
		const width = pfpImageRef.current.naturalWidth
		const height = pfpImageRef.current.naturalHeight

		// Update canvas
		canvasRef.current.width = width
		canvasRef.current.height = height

		// Get canvas 2d context
		const ctx = canvasRef.current.getContext('2d')

		// Clean previous canvas stuff
		ctx.clearRect(0, 0, width, height)

		// Get height padding (because the aspect ratio of the frame isn't 1:1)
		const adjustedHeight = height * 0.9399
		const spacing = (height - adjustedHeight) / 2

		// Add the frame
		ctx.drawImage(frameImageRef.current, 0, spacing, width, adjustedHeight)
		ctx.globalCompositeOperation = 'source-in'

		// Add the PFP
		ctx.drawImage(pfpImageRef.current, 0, 0, width, height)
		ctx.globalCompositeOperation = 'destination-atop'

		// Done
		ctx.restore()
	}

	// Save
	function saveImage() {
		const url = canvasRef.current.toDataURL('image/png')

		saveImageRef.current.href = url
		saveImageRef.current.download = `nft-pfp.png`
		saveImageRef.current.click()
	}

	// Canvas updater
	useEffect(() => {
		pfpImageRef.current.onload = draw

		return () => {}
	}, [])

	const dropHandlers = {
		onDrop: handleDrop,
		onDragOver: handleDragOver,
		onDragEnter: handleDragEnter,
		onDragLeave: handleDragLeave
	}

	return (
		<div className='bg-white flex flex-col place-content-center px-12 py-10 md:w-1/2 xl:w-1/3 container mx-auto'>
			<img ref={pfpImageRef} className='pfp-loader' />
			<img ref={frameImageRef} src='/nft/mask.svg' className='frame-loader' />
			<a ref={saveImageRef} className='save-loader' />

			<div className={`flex w-full flex-col place-content-center ${!uploaded && 'hidden'}`}>
				<canvas className='aspect-square cursor-pointer w-full' ref={canvasRef} width={400} height={400} onClick={showUploadPrompt} {...dropHandlers} />
				<button className='bg-sky-500 mt-4 px-4 py-2 text-lg text-white rounded-full' onClick={saveImage}>Auto Right Click &gt; Save As...</button>
			</div>

			{/* Actual UI */}
			{!uploaded && (
				<div className='cursor-pointer' onClick={showUploadPrompt} {...dropHandlers}>
					<img className='w-full' src='/nft/frame.svg' />
					<div className='fixed center-fixed-x center-fixed-y w-full flex flex-col place-content-center top-10'>
						{detectMobile.isMobile() ? (
							<p className='text-center font-bold text-lg'>Tap here to upload</p>
						) : (
							<>
								<p className='text-center font-bold text-lg'>Drag and drop your profile picture here</p>
								<p className='text-center font-semibold opacity-75'>(or tap for mobile users)</p>
							</>
						)}
					</div>
				</div>
			)}

			<input
				ref={pfpUploadRef}

				type='file'
				onChange={onProfileImageUploaded}

				className='fixed hidden center-fixed-y cursor-pointer top-0 left-0 w-full'
			/>
		</div>
	)
}
