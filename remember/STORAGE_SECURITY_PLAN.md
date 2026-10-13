# Remember private storage

Status: proposal only. No storage changes deployed.

Use a private bucket in the dedicated Remember Supabase project. Access to images requires server verification of an active guest token or webmaster role. No public URLs or client-side service keys.

Agreed mobile-first policy (2026-10-13): adaptively compress to the smallest visually acceptable image. Start with 1920 px maximum long edge and WebP preferred, JPEG fallback. Aim for approximately 200-600 KB where visual quality permits; do not impose a hard target that causes visible artifacts. Preserve orientation and aspect ratio. Validate actual file signatures and contents server-side. The 10 MiB bucket setting is an incoming-file safety ceiling, not the desired stored image size. Retain the source until conversion and verification succeed. Downloads provide the saved optimized image, not the camera original; disclose this clearly. Final quality settings must be tested on representative mobile photos.

Do not enable uploads until reservation migration, lifecycle handling and security tests are complete.
