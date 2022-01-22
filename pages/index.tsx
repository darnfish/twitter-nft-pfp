import { useEffect, useRef } from 'react'

const SVG_SIZE = 400
const NFT_HEIGHT = SVG_SIZE * 0.9399
const NFT_SPACING = (SVG_SIZE - NFT_HEIGHT) / 2

export default function() {
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
		<>
			<img ref={pfpImageRef} className='pfp-loader' />
			<img ref={frameImageRef} src='/mask.svg' className='frame-loader' />
			<a ref={saveImageRef} className='save-loader' />

			<h3>1. choose a file</h3>
			<input type='file' ref={pfpUploadRef} onChange={onProfileImageUploaded} />

			<h3>2. preview</h3>
			<canvas ref={canvasRef} width={SVG_SIZE} height={SVG_SIZE} />

			<h3>3. save that shit</h3>
			<button onClick={saveImage}>auto right click &gt; save</button>
		</>
	)
}
