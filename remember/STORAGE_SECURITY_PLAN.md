# Remember private storage

Status: proposal only. No storage changes deployed.

Use a private bucket in the dedicated Remember Supabase project. Access to images requires server verification of an active guest token or webmaster role. No public URLs or client-side service keys.

Candidate limits: 10 MiB per image; JPEG, PNG, WebP. Validate actual file signatures and contents server-side.

Do not enable uploads until reservation migration, lifecycle handling and security tests are complete.
