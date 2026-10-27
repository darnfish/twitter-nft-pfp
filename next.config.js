/** @type {import('next').NextConfig} */
module.exports = {
	// Emit a self-contained server (.next/standalone) so the runtime image
	// carries only the files the server needs, not node_modules or the toolchain.
	output: 'standalone'
}
