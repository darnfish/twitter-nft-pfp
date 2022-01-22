import { useEffect, useRef, useState } from 'react'

const SVG_SIZE = 400
const NFT_HEIGHT = SVG_SIZE * 0.9399
const NFT_SPACING = (SVG_SIZE - NFT_HEIGHT) / 2

const DEFAULT_STYLE = { width: SVG_SIZE, height: SVG_SIZE }
const NFT_STYLE = {...DEFAULT_STYLE }

export default function App() {
	// State
	const [uploaded, setUploaded] = useState(false)

	// Refs
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const saveImageRef = useRef<HTMLAnchorElement>(null)
	const frameImageRef = useRef<HTMLImageElement>(null)

	const pfpImageRef = useRef<HTMLImageElement>(null)
	const pfpUploadRef = useRef<HTMLInputElement>(null)

	// Profile image stuff
	function onProfileImageUploaded(event) {
		const file = event.target.files[0]
		const fileUrl = URL.createObjectURL(file)

		pfpImageRef.current.src = fileUrl

		if(!uploaded)
			setUploaded(true)
	}

	// Canvas
	function drawProfilePicture(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(pfpImageRef.current, 0, 0, SVG_SIZE, SVG_SIZE)
	}

	function drawNFTFrame(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(frameImageRef.current, 0, NFT_SPACING, SVG_SIZE, NFT_HEIGHT)
	}

	function draw() {
		const ctx = canvasRef.current.getContext('2d')

		ctx.clearRect(0, 0, SVG_SIZE, SVG_SIZE)
		drawNFTFrame(ctx)
		ctx.globalCompositeOperation = 'source-in'

		drawProfilePicture(ctx)
		ctx.globalCompositeOperation = 'destination-atop'

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

	return (
		<div className='bg-white drop-shadow-lg flex flex-col place-content-center px-12 py-10 md:w-1/2 xl:w-1/3 container mx-auto'>
			<img ref={pfpImageRef} className='pfp-loader' />
			<img ref={frameImageRef} src='/mask.svg' className='frame-loader' />
			<a ref={saveImageRef} className='save-loader' />

			<div className={`flex w-full flex-col place-content-center ${!uploaded && 'hidden'}`}>
				<canvas ref={canvasRef} width={SVG_SIZE} height={SVG_SIZE} />
				<button className='bg-sky-500 mt-4 px-4 py-2 text-lg text-white rounded-full' onClick={saveImage}>Auto Right Click &gt; Save As...</button>
			</div>

			{/* Actual UI */}
			{!uploaded && (
				<div>
					<img className='' style={{ width: '100%', marginTop: NFT_SPACING, marginBottom: NFT_SPACING }} src='/frame.svg' />
					<div className='fixed center-fixed-x center-fixed-y w-full flex flex-col place-content-center top-10'>
						<p className='text-center font-bold text-lg'>Drag and drop your profile picture here</p>
						<p className='text-center font-semibold opacity-75'>(or tap for mobile users)</p>
					</div>
				</div>
			)}

			<input type='file' className='fixed center-fixed-y cursor-pointer opacity-0 top-0 left-0 w-full' style={{ height: SVG_SIZE, marginTop: uploaded ? -30 : 0 }} ref={pfpUploadRef} onChange={onProfileImageUploaded} />
		</div>
	)
}
