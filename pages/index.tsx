import { useEffect, useRef, useState } from 'react'

type FrameType = 'light' | 'night' | 'dark'

type Frames = {
	[key in FrameType]: string
}

interface FrameTypeEntry {
	type: FrameType
	name: string
}

const FRAME_TYPES: FrameTypeEntry[] = [{
	type: 'light',
	name: 'Light'
}, {
	type: 'night',
	name: 'Night'
}, {
	type: 'dark',
	name: 'Dark'
}]

const SVG_SIZE = 400
const SVG_HEADER = 'data:image/svg+xml;base64,'

async function fetchFrame(type: FrameType) {
	const response = await fetch(`/frames/nft-${type}.svg`)
	const rawSvg = await response.text()

	return rawSvg
}

export default function() {
	// State
	const [frameType, setFrameType] = useState<FrameType>('dark')

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

	// Frame stuff
	const frames = useRef<Frames>(null)

	async function loadFrames() {
		frames.current = {
			light: await fetchFrame('light'),
			night: await fetchFrame('night'),
			dark: await fetchFrame('dark')
		}
	}

	async function displayFrame(type: FrameType) {
		const svgText = frames.current[type]
		if(!svgText)
			return

		const base64 = Buffer.from(svgText).toString('base64')
		const image64 = [SVG_HEADER, base64].join('')

		frameImageRef.current.src = image64
	}

	// Canvas
	function drawProfilePicture(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(pfpImageRef.current, 0, 0, SVG_SIZE, SVG_SIZE)
	}

	function drawNFTFrame(ctx: CanvasRenderingContext2D) {
		ctx.drawImage(frameImageRef.current, 0, 0, SVG_SIZE, SVG_SIZE)
	}

	function draw() {
		const context = canvasRef.current.getContext('2d')

		context.clearRect(0, 0, SVG_SIZE, SVG_SIZE)
		drawProfilePicture(context)
		drawNFTFrame(context)
	}

	// Save
	function saveImage() {
		const url = canvasRef.current.toDataURL('image/png')

		saveImageRef.current.href = url
		saveImageRef.current.download = `nft-${frameType}.png`
		saveImageRef.current.click()
	}

	// Canvas updater
	useEffect(() => {
		pfpImageRef.current.onload = draw
		frameImageRef.current.onload = draw

		return () => {}
	}, [])

	// Frame dispalyer
	useEffect(() => {
		loadFrames().then(() => {
			displayFrame(frameType)
		})

		return () => {}
	}, [frameType])

	return (
		<>
			<img ref={pfpImageRef} className='pfp-loader' />
			<img ref={frameImageRef} className='frame-loader' />
			<a ref={saveImageRef} className='save-loader' />

			<h3>1. choose a file</h3>
			<input type='file' ref={pfpUploadRef} onChange={onProfileImageUploaded} />

			<h3>2. choose a theme</h3>
			{FRAME_TYPES.map(({ type, name }) => (
				<div key={type}>
					<input type='radio' name={type} checked={frameType === type} onChange={() => setFrameType(type)} />
					<label htmlFor={type}>{name}</label>
				</div>
			))}

			<h3>3. preview</h3>
			<canvas ref={canvasRef} width={SVG_SIZE} height={SVG_SIZE} />

			<h3>4. save that shit</h3>
			<button onClick={saveImage}>auto right click &gt; save</button>
		</>
	)
}
